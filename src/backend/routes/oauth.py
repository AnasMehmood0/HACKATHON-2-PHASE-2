# T025+ OAuth: Google OAuth callback handler
# Handles OAuth code exchange with Google and user session creation

from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import httpx
import os
from datetime import datetime, timedelta

from ..auth import create_access_token
from ..db import Session, engine
from ..models import User


router = APIRouter()


class OAuthCallbackRequest(BaseModel):
    code: str
    state: str
    provider: str = "google"


class GoogleTokenResponse(BaseModel):
    access_token: str
    refresh_token: str | None = None
    expires_in: int
    id_token: str


class GoogleUserInfo(BaseModel):
    id: str
    email: str
    verified_email: bool
    name: str
    given_name: str
    family_name: str
    picture: str
    locale: str


@router.post("/oauth/google")
async def google_oauth_callback(
    request: OAuthCallbackRequest,
    http_response: Response,
):
    """
    Handle OAuth callback from Google.
    Exchange authorization code for user info and create/update user session.
    """
    try:
        # Exchange code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "code": request.code,
                    "client_id": os.getenv("GOOGLE_CLIENT_ID"),
                    "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
                    "redirect_uri": "http://localhost:3000/api/auth/callback/google",
                    "grant_type": "authorization_code",
                },
                headers={
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            )

            if token_response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail="Failed to exchange OAuth code"
                )

            token_data = GoogleTokenResponse(**token_response.json())

            # Get user info from Google
            user_response = await client.get(
                "https://www.googleapis.com/oauth2/v2/userinfo",
                headers={
                    "Authorization": f"Bearer {token_data.access_token}",
                },
            )

            if user_response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail="Failed to fetch user info"
                )

            user_info = GoogleUserInfo(**user_response.json())

        # Create or get user from database
        with Session(engine) as session:
            # Check if user exists by email
            user = session.exec(
                User.select().where(User.email == user_info.email)
            ).first()

            if not user:
                # Create new user from OAuth
                user = User(
                    id=f"google-{user_info.id}",
                    email=user_info.email,
                    name=user_info.name,
                    password_hash="",  # OAuth users don't have passwords
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow(),
                )
                session.add(user)
                session.commit()
                session.refresh(user)
            else:
                # Update existing user
                user.name = user_info.name
                user.updated_at = datetime.utcnow()
                session.commit()
                session.refresh(user)

            # Create JWT token for user
        access_token = create_access_token(
            data={"sub": user.id, "email": user.email},
            expires_delta=timedelta(days=7),
        )

        # Return token to frontend for session cookie
        return JSONResponse({
            "sessionToken": access_token,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
            }
        })

    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=503,
            detail="Failed to communicate with Google servers"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"OAuth processing failed: {str(e)}"
        )
