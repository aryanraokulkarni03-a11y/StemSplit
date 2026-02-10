"""
Database configuration and session management for Singscape
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from database.schema import Base

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")

# Use SQLite for development, PostgreSQL for production
if DATABASE_URL and DATABASE_URL.startswith("postgresql"):
    # Production database
    engine = create_engine(DATABASE_URL)
else:
    # Development database (SQLite)
    engine = create_engine(
        "sqlite:///./singscape.db",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)


def get_db() -> Session:
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_database():
    """Initialize database with required tables and basic data"""
    create_tables()
    print("[Database] Database initialized successfully")


# Database session dependency for FastAPI
def get_db_session():
    """FastAPI dependency for database session"""
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()