from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends, Request
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

# Environment & configuration
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

# Directory for persistent job metadata
JOB_STORE_DIR = Path(os.getenv("JOB_STORE_DIR", "./job_state")).resolve()
JOB_STORE_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="Singscape AI Engine", version="1.0.0")

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

# Clerk Configuration
CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL", "https://clerk.clerk.dev/.well-known/jwks.json")
CLERK_ISSUER = os.getenv("CLERK_ISSUER", "https://clerk.clerk.dev")

# In-memory cache for JWKS
jwks_cache = {"keys": None, "expiry": 0}
JWKS_CACHE_TTL = 3600 # 1 hour

security = HTTPBearer()

async def get_jwks():
    """Fetch and cache JWKS from Clerk."""
    now = time.time()
    if jwks_cache["keys"] and now < jwks_cache["expiry"]:
        return jwks_cache["keys"]
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(CLERK_JWKS_URL)
            jwks_cache["keys"] = response.json()
            jwks_cache["expiry"] = now + JWKS_CACHE_TTL
            return jwks_cache["keys"]
    except Exception as e:
        print(f"[Auth] JWKS fetch failed: {e}")
        return jwks_cache["keys"] # Return stale keys if fetch fails

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verifies the Clerk JWT token."""
    token = credentials.credentials

    # Dev mode bypass - accept dev token from frontend (development only)
    if DEBUG and token == "dev_token_no_auth":
        print("[Auth] Dev mode token accepted")
        return {"sub": "dev_user"}

    try:
        jwks = await get_jwks()

        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            issuer=CLERK_ISSUER,
            options={"verify_at_hash": False}
        )
        return payload
    except Exception as e:
        # Fallback for development if no keys are provided yet
        if DEBUG and not os.getenv("CLERK_JWKS_URL"):
            return {"sub": "dev_user"}
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

class SeparationRequest(BaseModel):
    input_path: str
    output_dir: str
    stems: int = 2

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
    
    jobs[job_id] = {
        "id": job_id,
        "status": "queued",
        "progress": 0,
        "message": "Job added to queue",
        "user_id": auth.get("sub"),
        "createdAt": time.time(),
        "updatedAt": time.time()
    }
    save_job(job_id)
    
    background_tasks.add_task(
        run_separation_task, 
        job_id, 
        request.input_path, 
        request.output_dir, 
        request.stems
    )
    
    return {"job_id": job_id}

@app.get("/status/{job_id}")
async def get_status(job_id: str, auth: dict = Depends(verify_token)):
    job = load_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

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

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host=host, port=port)
