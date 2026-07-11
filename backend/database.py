import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    logger.error(
        "DATABASE_URL not set. Database features will be unavailable."
    )
    raise RuntimeError("DATABASE_URL environment variable is required")

# Handle SQLite limitations (dev only)
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    logger.warning("Using SQLite - not recommended for production")
    connect_args = {"check_same_thread": False}

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=not DATABASE_URL.startswith("sqlite"),
    pool_size=10 if not DATABASE_URL.startswith("sqlite") else 0,
    max_overflow=20 if not DATABASE_URL.startswith("sqlite") else 0,
    connect_args=connect_args,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """Dependency that provides a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables. Used for development."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Could not create database tables: {e}")
        logger.error("Running without database persistence")
