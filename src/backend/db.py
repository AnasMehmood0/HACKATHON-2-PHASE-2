# T012: Database connection and session management

from sqlmodel import SQLModel, create_engine, Session, text
from typing import Generator

from .config import settings


# Create database engine
engine = create_engine(
    settings.database_url,
    echo=False,
    pool_pre_ping=True,
)


def init_db() -> None:
    """
    Initialize database tables.
    This creates all tables defined in SQLModel classes.
    Call this on application startup.
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Get a database session for dependency injection.
    Use this with FastAPI's Depends() for route handlers.

    Yields:
        Session: A new database session
    """
    with Session(engine) as session:
        yield session


def health_check() -> bool:
    """
    Check if database connection is healthy.

    Returns:
        bool: True if connection is successful, False otherwise
    """
    try:
        with Session(engine) as session:
            session.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
