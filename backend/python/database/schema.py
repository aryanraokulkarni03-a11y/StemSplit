"""
Database schema for Singscape job management
"""

from sqlalchemy import Column, String, Integer, Float, DateTime, Text, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()


class Job(Base):
    """Represents a stem separation job in the database"""
    __tablename__ = "jobs"

    id = Column(String, primary_key=True)
    
    # Job metadata
    status = Column(String(20), nullable=False, default="queued")  # queued, processing, completed, error
    progress = Column(Integer, default=0)  # 0-100
    message = Column(Text)
    error = Column(Text)
    
    # File information
    input_path = Column(String(500))
    output_dir = Column(String(500))
    stems = Column(Integer, default=2)
    original_filename = Column(String(255))
    file_size = Column(Integer)  # bytes
    
    # Processing metadata
    processing_started_at = Column(DateTime)
    processing_completed_at = Column(DateTime)
    processing_duration_seconds = Column(Float)
    
    # User tracking
    user_id = Column(String(255))  # Clerk user ID or "anonymous"
    ip_address = Column(String(45))  # Support for IPv6
    
    # Queue information (cached)
    queue_position = Column(Integer)
    estimated_wait_seconds = Column(Integer)
    
    # Additional data
    stem_files = Column(JSON)  # { "vocals": "path", "drums": "path", ... }
    metadata = Column(JSON)  # Additional processing metadata
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    # Cleanup tracking
    auto_cleanup_at = Column(DateTime)  # When to automatically delete files
    files_deleted = Column(Boolean, default=False)
    
    def __repr__(self):
        return f"<Job(id='{self.id}', status='{self.status}', progress={self.progress}%)>"


class JobMetric(Base):
    """Metrics for monitoring job performance"""
    __tablename__ = "job_metrics"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(String, nullable=False)
    
    # Performance metrics
    file_size_mb = Column(Float)
    processing_time_seconds = Column(Float)
    model_name = Column(String(50))  # htdemucs, etc.
    stems_count = Column(Integer)
    
    # Success/failure tracking
    success = Column(Boolean)
    error_type = Column(String(100))
    
    # Resource usage (if available)
    gpu_used = Column(Boolean)
    max_memory_mb = Column(Integer)
    
    # Timestamp
    recorded_at = Column(DateTime, default=func.now(), nullable=False)


class UserQuota(Base):
    """User-specific quotas for rate limiting"""
    __tablename__ = "user_quotas"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(255), unique=True, nullable=False)  # Clerk user ID or IP
    
    # Quota limits
    jobs_per_hour = Column(Integer, default=5)
    jobs_per_day = Column(Integer, default=20)
    max_file_size_mb = Column(Integer, default=25)
    
    # Current usage (resets periodically)
    jobs_last_hour = Column(Integer, default=0)
    jobs_last_day = Column(Integer, default=0)
    last_job_at = Column(DateTime)
    
    # Timestamps
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<UserQuota(user_id='{self.user_id}', jobs_today={self.jobs_last_day}/{self.jobs_per_day})>"