# User profile and account management endpoints

from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from typing import Optional
import os
from datetime import datetime

from ..auth import get_current_user
from ..db import Session, engine
from ..models import User


router = APIRouter()


class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None


class AccountUpdateRequest(BaseModel):
    username: Optional[str] = None
    timezone: Optional[str] = None
    language: Optional[str] = None


@router.get("/me")
async def get_current_user_profile(request: Request):
    """
    Get current user's profile information.
    """
    user = await get_current_user(request)

    with Session(engine) as session:
        db_user = session.get(User, user.user_id)

        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "id": db_user.id,
            "email": db_user.email,
            "name": db_user.name,
            "bio": db_user.bio,
            "created_at": db_user.created_at.isoformat() if db_user.created_at else None,
            "username": db_user.username,
            "timezone": db_user.timezone,
            "language": db_user.language,
        }


@router.put("/me/profile")
async def update_user_profile(
    request: ProfileUpdateRequest,
    http_response: Response,
):
    """
    Update current user's profile information.
    """
    user = await get_current_user(request)

    with Session(engine) as session:
        db_user = session.get(User, user.user_id)

        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        # Update fields if provided
        if request.name is not None:
            db_user.name = request.name
        if request.bio is not None:
            db_user.bio = request.bio
        if request.avatar is not None:
            db_user.avatar = request.avatar

        db_user.updated_at = datetime.utcnow()

        session.commit()
        session.refresh(db_user)

        return JSONResponse({
            "id": db_user.id,
            "email": db_user.email,
            "name": db_user.name,
            "bio": db_user.bio,
            "avatar": db_user.avatar,
            "updated_at": db_user.updated_at.isoformat(),
            "message": "Profile updated successfully"
        })


@router.put("/me/account")
async def update_user_account(
    request: AccountUpdateRequest,
    http_response: Response,
):
    """
    Update current user's account settings.
    """
    user = await get_current_user(request)

    with Session(engine) as session:
        db_user = session.get(User, user.user_id)

        if not db_user:
            raise HTTPException(status_code=404, detail="User not found")

        # Update fields if provided
        if request.username is not None:
            # Check if username is already taken by another user
            existing = session.exec(
                User.select().where(
                    (User.username == request.username) &
                    (User.id != user.user_id)
                )
            ).first()

            if existing:
                raise HTTPException(
                    status_code=400,
                    detail="Username is already taken"
                )

            db_user.username = request.username

        if request.timezone is not None:
            db_user.timezone = request.timezone

        if request.language is not None:
            db_user.language = request.language

        db_user.updated_at = datetime.utcnow()

        session.commit()
        session.refresh(db_user)

        return JSONResponse({
            "id": db_user.id,
            "email": db_user.email,
            "name": db_user.name,
            "username": db_user.username,
            "timezone": db_user.timezone,
            "language": db_user.language,
            "updated_at": db_user.updated_at.isoformat(),
            "message": "Account updated successfully"
        })


@router.post("/me/avatar")
async def upload_avatar(
    request: Request,
    file: bytes = None,
):
    """
    Upload and update user avatar.
    For now, this accepts base64 encoded image data.
    """
    user = await get_current_user(request)

    try:
        # Parse multipart form data
        form = await request.form()
        avatar_file = form.get("avatar")

        if not avatar_file:
            raise HTTPException(status_code=400, detail="No file provided")

        # For now, we'll just store the URL or base64 data
        # In production, you'd upload to a storage service
        avatar_url = avatar_file  # This would be the uploaded file URL

        with Session(engine) as session:
            db_user = session.get(User, user.user_id)

            if not db_user:
                raise HTTPException(status_code=404, detail="User not found")

            db_user.avatar = avatar_url
            db_user.updated_at = datetime.utcnow()

            session.commit()
            session.refresh(db_user)

        return JSONResponse({
            "avatar": db_user.avatar,
            "message": "Avatar updated successfully"
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload avatar: {str(e)}")
