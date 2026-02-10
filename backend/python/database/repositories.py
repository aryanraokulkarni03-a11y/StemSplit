"""
Database repository layer for job management
"""

from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, or_
from database.schema import Job, JobMetric, UserQuota


class JobRepository:
    """Repository for job operations"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def create_job(
        self,
        job_id: str,
        user_id: str,
        input_path: str,
        output_dir: str,
        stems: int = 2,
        original_filename: str = None,
        file_size: int = None,
        ip_address: str = None
    ) -> Job:
        """Create a new job record"""
        job = Job(
            id=job_id,
            user_id=user_id,
            input_path=input_path,
            output_dir=output_dir,
            stems=stems,
            original_filename=original_filename,
            file_size=file_size,
            ip_address=ip_address,
            auto_cleanup_at=datetime.utcnow() + timedelta(days=7)
        )
        
        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)
        return job
    
    def get_job(self, job_id: str) -> Optional[Job]:
        """Get a job by ID"""
        return self.db.query(Job).filter(Job.id == job_id).first()
    
    def update_job(
        self,
        job_id: str,
        status: str = None,
        progress: int = None,
        message: str = None,
        error: str = None,
        stem_files: Dict[str, str] = None,
        metadata: Dict[str, Any] = None
    ) -> Optional[Job]:
        """Update job status and progress"""
        job = self.get_job(job_id)
        if not job:
            return None
        
        # Update fields if provided
        if status is not None:
            job.status = status
            if status == "processing" and not job.processing_started_at:
                job.processing_started_at = datetime.utcnow()
            elif status in ["completed", "error"] and job.processing_started_at:
                job.processing_completed_at = datetime.utcnow()
                job.processing_duration_seconds = (
                    job.processing_completed_at - job.processing_started_at
                ).total_seconds()
        
        if progress is not None:
            job.progress = progress
        
        if message is not None:
            job.message = message
        
        if error is not None:
            job.error = error
        
        if stem_files is not None:
            job.stem_files = stem_files
        
        if metadata is not None:
            job.metadata = metadata
        
        job.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(job)
        return job
    
    def get_user_jobs(self, user_id: str, limit: int = 50) -> List[Job]:
        """Get all jobs for a specific user"""
        return (
            self.db.query(Job)
            .filter(Job.user_id == user_id)
            .order_by(desc(Job.created_at))
            .limit(limit)
            .all()
        )
    
    def get_queue_info(self) -> Dict[str, Any]:
        """Get current queue information"""
        queued_jobs = self.db.query(Job).filter(Job.status == "queued").count()
        processing_jobs = self.db.query(Job).filter(Job.status == "processing").count()
        
        return {
            "jobsAhead": queued_jobs,
            "currentlyProcessing": processing_jobs,
            "position": queued_jobs,
            "estimatedWaitSeconds": queued_jobs * 240 + (60 if processing_jobs > 0 else 0)
        }
    
    def get_old_jobs(self, days: int = 7) -> List[Job]:
        """Get jobs older than specified days"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        return (
            self.db.query(Job)
            .filter(Job.created_at < cutoff_date, Job.files_deleted == False)
            .all()
        )
    
    def mark_files_deleted(self, job_id: str) -> bool:
        """Mark job files as deleted"""
        job = self.get_job(job_id)
        if job:
            job.files_deleted = True
            job.updated_at = datetime.utcnow()
            self.db.commit()
            return True
        return False
    
    def delete_old_jobs(self, days: int = 7) -> int:
        """Delete old job records from database"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        deleted = (
            self.db.query(Job)
            .filter(Job.created_at < cutoff_date, Job.files_deleted == True)
            .delete()
        )
        self.db.commit()
        return deleted


class JobMetricRepository:
    """Repository for job metrics"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def record_metric(
        self,
        job_id: str,
        file_size_mb: float,
        processing_time_seconds: float,
        success: bool,
        model_name: str = "htdemucs",
        stems_count: int = 2,
        error_type: str = None,
        gpu_used: bool = None,
        max_memory_mb: int = None
    ) -> JobMetric:
        """Record job performance metric"""
        metric = JobMetric(
            job_id=job_id,
            file_size_mb=file_size_mb,
            processing_time_seconds=processing_time_seconds,
            success=success,
            model_name=model_name,
            stems_count=stems_count,
            error_type=error_type,
            gpu_used=gpu_used,
            max_memory_mb=max_memory_mb
        )
        
        self.db.add(metric)
        self.db.commit()
        self.db.refresh(metric)
        return metric
    
    def get_metrics(self, days: int = 30) -> List[JobMetric]:
        """Get metrics for the last N days"""
        cutoff_date = datetime.utcnow() - timedelta(days=days)
        return (
            self.db.query(JobMetric)
            .filter(JobMetric.recorded_at >= cutoff_date)
            .order_by(desc(JobMetric.recorded_at))
            .all()
        )


class UserQuotaRepository:
    """Repository for user quota management"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_or_create_quota(self, user_id: str) -> UserQuota:
        """Get existing quota or create new one"""
        quota = self.db.query(UserQuota).filter(UserQuota.user_id == user_id).first()
        
        if not quota:
            quota = UserQuota(user_id=user_id)
            self.db.add(quota)
            self.db.commit()
            self.db.refresh(quota)
        
        return quota
    
    def check_quota(self, user_id: str, file_size_mb: float = 0) -> Dict[str, Any]:
        """Check if user can create a new job"""
        quota = self.get_or_create_quota(user_id)
        
        # Reset counters if needed (simplified - in production would use more sophisticated time tracking)
        now = datetime.utcnow()
        
        # Check file size limit
        if file_size_mb > quota.max_file_size_mb:
            return {
                "allowed": False,
                "reason": "FILE_TOO_LARGE",
                "limit": quota.max_file_size_mb,
                "requested": file_size_mb
            }
        
        # Check hourly limit
        if quota.jobs_last_hour >= quota.jobs_per_hour:
            return {
                "allowed": False,
                "reason": "HOURLY_LIMIT",
                "limit": quota.jobs_per_hour,
                "current": quota.jobs_last_hour
            }
        
        # Check daily limit
        if quota.jobs_last_day >= quota.jobs_per_day:
            return {
                "allowed": False,
                "reason": "DAILY_LIMIT",
                "limit": quota.jobs_per_day,
                "current": quota.jobs_last_day
            }
        
        return {"allowed": True}
    
    def increment_usage(self, user_id: str):
        """Increment job usage counters"""
        quota = self.get_or_create_quota(user_id)
        quota.jobs_last_hour += 1
        quota.jobs_last_day += 1
        quota.last_job_at = datetime.utcnow()
        quota.updated_at = datetime.utcnow()
        
        self.db.commit()
        self.db.refresh(quota)
        return quota