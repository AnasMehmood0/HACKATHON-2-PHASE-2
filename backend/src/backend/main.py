# T014: FastAPI application with CORS middleware

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlmodel import Session

from .config import settings
from .db import init_db, health_check, engine
from .models import User
from .routes import tasks, auth, chat, oauth, users

# Check if running in serverless environment (Vercel/Lambda)
IS_SERVERLESS = os.getenv("AWS_LAMBDA_FUNCTION_VERSION") or os.getenv("VERCEL")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Initializes database on startup.
    Skips initialization in serverless environments.
    """
    # Startup - only run if NOT in serverless
    if not IS_SERVERLESS:
        print("Initializing database...")
        init_db()
        print("Database initialized successfully")

        # Seed dev user for testing
        from .auth import DEV_MODE
        if DEV_MODE:
            print("Seeding dev user...")
            with Session(engine) as session:
                dev_user = session.get(User, "dev-user-123")
                if not dev_user:
                    dev_user = User(
                        id="dev-user-123",
                        email="dev@example.com",
                        name="Dev User"
                    )
                    session.add(dev_user)
                    session.commit()
                    print("Dev user created: dev-user-123")
                else:
                    print("Dev user already exists")

    yield

    # Shutdown
    if not IS_SERVERLESS:
        print("Shutting down application...")


# Create FastAPI application
# In serverless, don't use lifespan (it's handled per-request)
app = FastAPI(
    title="Todo App API",
    description="REST API for the Evolution of Todo - Phase II",
    version="2.0.0",
    lifespan=None if IS_SERVERLESS else lifespan,
)

# Configure CORS middleware
# Allow all origins in production, specific origins in dev
cors_origins = settings.cors_origins
if IS_SERVERLESS:
    # In production, allow your frontend domain
    cors_origins = ["*"]  # You can restrict this later

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/api/health")
async def health():
    """
    Health check endpoint to verify API and database connectivity.
    """
    db_healthy = health_check()

    return {
        "status": "ok" if db_healthy else "degraded",
        "database": "connected" if db_healthy else "disconnected",
    }


# Include routers
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(oauth.router, prefix="/api/auth", tags=["oauth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])


# Root endpoint
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Todo App API",
        "version": "2.0.0",
        "docs": "/docs",
        "health": "/api/health",
    }


def main():
    """Entry point for running the server directly."""
    import uvicorn

    uvicorn.run(
        "backend.main:app",
        host=settings.backend_host,
        port=settings.backend_port,
        reload=True,
    )


if __name__ == "__main__":
    main()
