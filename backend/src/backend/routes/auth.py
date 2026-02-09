# Authentication routes for signup/signin

from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends, Request, Body
from sqlmodel import Session, select
from jose import jwt
from pydantic import BaseModel

from ..db import get_session
from ..models import User
from ..config import settings
from ..auth import JWTPayload

router = APIRouter()


# Request/Response models
class SignupRequest(BaseModel):
    email: str
    password: str
    name: str | None = None


class SigninRequest(BaseModel):
    email: str
    password: str


def create_jwt_token(user_id: str, email: str) -> str:
    """Create a JWT token for a user."""
    payload = {
        "sub": user_id,
        "email": email,
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.better_auth_secret, algorithm=settings.jwt_algorithm)


@router.post("/auth/signup")
async def signup(request_data: SignupRequest, session: Session = Depends(get_session)):
    """Register a new user."""
    # Check if user already exists
    existing_user = session.exec(
        select(User).where(User.email == request_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user
    import uuid
    new_user = User(
        id=str(uuid.uuid4()),
        email=request_data.email,
        name=request_data.name,
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    # Generate JWT token
    token = create_jwt_token(new_user.id, new_user.email)

    return {
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "name": new_user.name,
        },
        "token": token,
    }


@router.post("/auth/signin")
async def signin(request_data: SigninRequest, session: Session = Depends(get_session)):
    """Sign in an existing user."""
    # Find user by email
    user = session.exec(
        select(User).where(User.email == request_data.email)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # Note: In production, verify password hash
    # For now, we're using dev mode without password verification
    # TODO: Add password verification with pwd_context.verify(password, user.password_hash)

    # Generate JWT token
    token = create_jwt_token(user.id, user.email)

    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
        },
        "token": token,
    }


@router.get("/auth/session")
async def get_session(request: Request, session: Session = Depends(get_session)):
    """Get current session from JWT token."""
    from ..auth import get_current_user

    try:
        current_user = await get_current_user(request)

        # Get full user data
        user = session.get(User, current_user.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
            },
            "session": {
                "token": request.headers.get("Authorization", "").replace("Bearer ", ""),
            }
        }
    except HTTPException:
        return {"user": None}
