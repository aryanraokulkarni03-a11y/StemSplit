from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Request, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import jwt
import httpx
import os
import uuid
import time
import json
import threading
from pathlib import Path
from processor import AudioProcessor
import shutil
import base64
import jwt
from datetime import datetime
from dotenv import load_dotenv

# Database imports
from database.config import init_database, get_db_session
from database.repositories import JobRepository, JobMetricRepository, UserQuotaRepository

# Load environment variables
load_dotenv()

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Environment & configuration
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

# Directory for persistent job metadata
JOB_STORE_DIR = Path(os.getenv("JOB_STORE_DIR", "./job_state")).resolve()
JOB_STORE_DIR.mkdir(parents=True, exist_ok=True)

# Directory for audio uploads
UPLOAD_DIR = Path(os.getenv("UPLOAD_DIR", "./uploads")).resolve()
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Maximum file size configuration
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "25"))
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

app = FastAPI(title="Singscape AI Engine", version="1.0.0")

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database and perform startup tasks"""
    try:
        init_database()
        print("[Backend] Database initialized successfully")
    except Exception as e:
        print(f"[Backend] Database initialization failed: {e}")
        raise

# Enable CORS for Next.js frontend
cors_origins = ALLOWED_ORIGINS or (["*"] if DEBUG else [])
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global lock for GPU protection (RTX 3050 safe)
gpu_lock = threading.Lock()

# NextAuth Configuration
NEXTAUTH_SECRET = os.getenv("NEXTAUTH_SECRET")
NEXTAUTH_URL = os.getenv("NEXTAUTH_URL", "http://localhost:3000")

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verifies the NextAuth token."""
    token = credentials.credentials

    # Dev mode bypass - accept dev token from frontend (development only)
    if DEBUG and (token == "dev_token_no_auth" or token == "dev_token"):
        print("[Auth] Dev mode token accepted")
        return {"sub": "dev_user", "email": "dev@example.com"}

    try:
        # Handle simple base64 encoded token (from our /api/auth/token endpoint)
        if token.startswith('eyJ'):
            # This is a JWT
            if NEXTAUTH_SECRET:
                payload = jwt.decode(
                    token,
                    NEXTAUTH_SECRET,
                    algorithms=["HS256"]
                )
                if not payload.get("sub"):
                    raise HTTPException(status_code=401, detail="Invalid token: missing user ID")
                return payload
            else:
                raise HTTPException(status_code=401, detail="NEXTAUTH_SECRET not configured")
        else:
            # This is our base64 encoded token
            try:
                decoded_bytes = base64.b64decode(token)
                payload = json.loads(decoded_bytes.decode('utf-8'))
                if not payload.get("sub"):
                    raise HTTPException(status_code=401, detail="Invalid token: missing user ID")
                return payload
            except Exception as e:
                raise HTTPException(status_code=401, detail=f"Invalid token format: {str(e)}")
                
    except Exception as e:
        # Fallback for development if no secret is provided yet
        if DEBUG and not NEXTAUTH_SECRET:
            print(f"[Auth] No NEXTAUTH_SECRET provided, allowing dev mode")
            return {"sub": "dev_user", "email": "dev@example.com"}
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


# In-memory job repository (for demo purposes) + simple persistent store
jobs = {}


def _job_path(job_id: str) -> Path:
    """Return the filesystem path for a job's persisted metadata."""
    return JOB_STORE_DIR / f"{job_id}.json"


def save_job(job_id: str) -> None:
    """Persist a job's metadata to disk."""
    try:
        path = _job_path(job_id)
        with path.open("w", encoding="utf-8") as f:
            json.dump(jobs[job_id], f)
    except Exception as e:
        # Persistence failures should not crash the API, but should be visible in logs.
        print(f"[Jobs] Failed to persist job {job_id}: {e}")


def load_job(job_id: str):
    """Load a job from memory or disk, or return None if not found."""
    if job_id in jobs:
        return jobs[job_id]

    path = _job_path(job_id)
    if path.exists():
        try:
            with path.open("r", encoding="utf-8") as f:
                job_data = json.load(f)
            jobs[job_id] = job_data
            return job_data
        except Exception as e:
            print(f"[Jobs] Failed to load job {job_id}: {e}")
            return None

    return None


def cleanup_old_jobs(max_age_seconds: int = 7 * 24 * 60 * 60) -> None:
    """
    Remove old job metadata files from disk to prevent unbounded growth.

    This does not delete audio files; it only cleans JSON state in JOB_STORE_DIR.
    """
    now = time.time()
    cutoff = now - max_age_seconds

    try:
        for path in JOB_STORE_DIR.glob("*.json"):
            try:
                stat = path.stat()
                if stat.st_mtime < cutoff:
                    path.unlink(missing_ok=True)
            except Exception as e:
                print(f"[Jobs] Failed to inspect or delete {path}: {e}")
    except Exception as e:
        print(f"[Jobs] Cleanup sweep failed: {e}")

def get_queue_info():
    """Return queue position and estimated wait time."""
    db = get_db_session()
    
    try:
        job_repo = JobRepository(db)
        return job_repo.get_queue_info()
    finally:
        db.close()

class SeparationRequest(BaseModel):
    input_path: str
    output_dir: str
    stems: int = 2


@app.get("/upload/constraints")
async def get_upload_constraints():
    """
    Returns upload constraints for the frontend UI.
    """
    return {
        "maxFileSize": MAX_FILE_SIZE_BYTES,
        "maxFileSizeMB": MAX_FILE_SIZE_MB,
        "acceptedTypes": ["audio/mpeg", "audio/wav", "audio/mp3"],
        "acceptedExtensions": [".mp3", ".wav"],
    }

@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    auth: dict = Depends(verify_token),
):
    """
    Accept an audio file upload and save it on the backend.

    Returns a fileName and inputPath that can be used by /separate.
    """
    try:
        # Validate file size
        if file.size and file.size > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=413, 
                detail=f"File size {file.size / 1024 / 1024:.1f}MB exceeds maximum allowed size of {MAX_FILE_SIZE_MB}MB"
            )
        
        raw_name = file.filename or "audio"
        safe_name = raw_name.replace(" ", "_")
        dest_path = UPLOAD_DIR / safe_name

        # Write file with size tracking
        bytes_written = 0
        with dest_path.open("wb") as buffer:
            while chunk := file.file.read(8192):
                bytes_written += len(chunk)
                if bytes_written > MAX_FILE_SIZE_BYTES:
                    dest_path.unlink(missing_ok=True)  # Clean up oversized file
                    raise HTTPException(
                        status_code=413,
                        detail=f"File size {bytes_written / 1024 / 1024:.1f}MB exceeds maximum allowed size of {MAX_FILE_SIZE_MB}MB"
                    )
                buffer.write(chunk)

        return {
            "fileName": safe_name,
            "inputPath": str(dest_path),
        }
    except HTTPException:
        raise  # Re-raise HTTP exceptions as-is
    except Exception as e:
        print(f"[Upload] Error saving file: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload file")

def run_separation_task(job_id: str, input_path: str, output_dir: str, stems: int):
    """Background task to run Demucs with concurrency protection."""
    try:
        jobs[job_id]["status"] = "waiting"
        jobs[job_id]["message"] = "Waiting for GPU access..."
        jobs[job_id]["updatedAt"] = time.time()
        save_job(job_id)
        
        with gpu_lock:
            jobs[job_id]["status"] = "processing"
            jobs[job_id]["message"] = "Separating stems with CUDA..."
            jobs[job_id]["updatedAt"] = time.time()
            save_job(job_id)
            
            processor = AudioProcessor(
                output_dir=output_dir,
                stems=stems
            )
            
            def progress_callback(progress_data):
                jobs[job_id]["progress"] = progress_data.get("progress", 0)
                jobs[job_id]["message"] = progress_data.get("raw", "Processing...")
                jobs[job_id]["updatedAt"] = time.time()
                save_job(job_id)
            
            result = processor.process(input_path, callback=progress_callback)
            
            if result.get("status") == "complete":
                jobs[job_id]["status"] = "completed"
                jobs[job_id]["progress"] = 100
                jobs[job_id]["message"] = "Separation successful."
                jobs[job_id]["stems"] = result.get("stems")
                jobs[job_id]["updatedAt"] = time.time()
                save_job(job_id)
            else:
                jobs[job_id]["status"] = "error"
                jobs[job_id]["error"] = result.get("message", "Unknown error")
                jobs[job_id]["updatedAt"] = time.time()
                save_job(job_id)
                
    except Exception as e:
        jobs[job_id]["status"] = "error"
        jobs[job_id]["error"] = str(e)
        jobs[job_id]["updatedAt"] = time.time()
        save_job(job_id)

@app.post("/separate")
async def start_separation(
    request: SeparationRequest, 
    background_tasks: BackgroundTasks,
    auth: dict = Depends(verify_token)
):
    job_id = str(uuid.uuid4())
    db = get_db_session()
    
    try:
        # Get repositories
        job_repo = JobRepository(db)
        quota_repo = UserQuotaRepository(db)
        
        # Extract file info for quota check
        user_id = auth.get("sub") or "anonymous"
        
        # Check user quota
        quota_check = quota_repo.check_quota(user_id)
        if not quota_check["allowed"]:
            if quota_check["reason"] == "HOURLY_LIMIT":
                raise HTTPException(
                    status_code=429,
                    detail=f"Hourly limit exceeded. Maximum {quota_check['limit']} jobs per hour."
                )
            elif quota_check["reason"] == "DAILY_LIMIT":
                raise HTTPException(
                    status_code=429,
                    detail=f"Daily limit exceeded. Maximum {quota_check['limit']} jobs per day."
                )
            elif quota_check["reason"] == "FILE_TOO_LARGE":
                raise HTTPException(
                    status_code=413,
                    detail=f"File too large. Maximum size is {quota_check['limit']}MB."
                )
        
        # Get queue info
        queue_info = job_repo.get_queue_info()
        
        # Create job in database
        job = job_repo.create_job(
            job_id=job_id,
            user_id=user_id,
            input_path=request.input_path,
            output_dir=request.output_dir,
            stems=request.stems
        )
        
        # Update initial status with queue info
        job_repo.update_job(
            job_id=job_id,
            status="queued",
            message=f"Job added to queue • {queue_info['jobsAhead']} jobs ahead"
        )
        
        # Increment quota usage
        quota_repo.increment_usage(user_id)
        
        # Keep backward compatibility - also store in memory
        jobs[job_id] = {
            "id": job_id,
            "status": "queued",
            "progress": 0,
            "message": f"Job added to queue • {queue_info['jobsAhead']} jobs ahead",
            "user_id": user_id,
            "createdAt": time.time(),
            "updatedAt": time.time(),
            "queue": queue_info
        }
        
        background_tasks.add_task(
            run_separation_task, 
            job_id, 
            request.input_path, 
            request.output_dir, 
            request.stems
        )
        
        return {"job_id": job_id}
        
    finally:
        db.close()

@app.get("/status/{job_id}")
async def get_status(job_id: str, auth: dict = Depends(verify_token)):
    db = get_db_session()
    
    try:
        job_repo = JobRepository(db)
        
        # Try to get from database first
        job = job_repo.get_job(job_id)
        
        if not job:
            # Fallback to in-memory store for backward compatibility
            job_memory = load_job(job_id)
            if not job_memory:
                raise HTTPException(status_code=404, detail="Job not found")
            
            # Include current queue info for queued jobs
            if job_memory.get("status") == "queued":
                job_memory["queue"] = job_repo.get_queue_info()
            
            return job_memory
        
        # Convert database job to dict format
        job_dict = {
            "id": job.id,
            "status": job.status,
            "progress": job.progress,
            "message": job.message,
            "error": job.error,
            "user_id": job.user_id,
            "createdAt": job.created_at.timestamp(),
            "updatedAt": job.updated_at.timestamp(),
        }
        
        # Add queue info for queued jobs
        if job.status == "queued":
            job_dict["queue"] = job_repo.get_queue_info()
        
        # Add stem files if completed
        if job.status == "completed" and job.stem_files:
            job_dict["stems"] = job.stem_files
        
        return job_dict
        
    finally:
        db.close()

@app.get("/health")
async def health_check():
    """Health check endpoint for frontend monitoring."""
    try:
        # Lightweight device detection via AudioProcessor
        processor = AudioProcessor(output_dir=str(JOB_STORE_DIR), stems=2)
        device = processor.device
        return {
            "status": "healthy",
            "device": device,
            "version": "1.0.0"
        }
    except Exception as e:
        # Surface any engine/torch issues clearly
        return {
            "status": "error",
            "device": None,
            "version": "1.0.0",
            "error": str(e)
        }


@app.on_event("startup")
async def startup_warmup():
    """Warm up the audio engine on startup for faster first requests."""
    try:
        print("[Startup] Warming up audio engine...")
        processor = AudioProcessor(output_dir=str(JOB_STORE_DIR), stems=2)
        print(f"[Startup] Audio engine ready. Device: {processor.device}")
    except Exception as e:
        # Do not block startup, but log for debugging
        print(f"[Startup] Audio engine warmup failed: {e}")

    # Schedule periodic cleanup of old job metadata (once per day)
    def _schedule_cleanup():
        while True:
            print("[Jobs] Running periodic cleanup sweep...")
            cleanup_old_jobs()
            # Sleep for 24 hours between sweeps
            time.sleep(24 * 60 * 60)

    cleanup_thread = threading.Thread(target=_schedule_cleanup, daemon=True)
    cleanup_thread.start()

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    print(f"[Backend] Starting server on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
