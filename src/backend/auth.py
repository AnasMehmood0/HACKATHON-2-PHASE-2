# T013: JWT verification middleware for authentication

from typing import Optional
from datetime import datetime, timedelta
from fastapi import HTTPException, Request, status
from fastapi.security.utils import get_authorization_scheme_param
from jose import JWTError, jwt

from .config import settings


# Development mode: Set to True to bypass authentication for testing
DEV_MODE = True


class JWTPayload:
    """JWT token payload structure."""

    def __init__(self, user_id: str, email: str):
        self.user_id = user_id
        self.email = email


def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=24)) -> str:
    """
    Create a JWT access token.

    Args:
        data: Payload data to encode in the token (e.g., {"sub": user_id, "email": email})
        expires_delta: Token expiration time (default 24 hours)

    Returns:
        str: Encoded JWT token
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire.timestamp()})

    return jwt.encode(
        to_encode,
        settings.better_auth_secret,
        algorithm=settings.jwt_algorithm,
    )


def verify_jwt_token(token: str) -> JWTPayload:
    """
    Verify and decode JWT token.

    Args:
        token: JWT token string

    Returns:
        JWTPayload: Decoded token payload with user_id and email

    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        # Decode and verify the JWT token
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=[settings.jwt_algorithm],
        )

        # Extract user ID from payload
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID",
            )

        # Extract email from payload (optional, fallback to empty string)
        email = payload.get("email", "")

        return JWTPayload(user_id=str(user_id), email=str(email))

    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {str(e)}",
        )


async def get_current_user(request: Request) -> JWTPayload:
    """
    Dependency to get the current authenticated user from JWT token.
    Uses Request directly to avoid FastAPI's auto security scheme generation.

    Args:
        request: FastAPI Request object

    Returns:
        JWTPayload: Current user's JWT payload
    """
    # DEV_MODE: Allow testing without authentication
    if DEV_MODE:
        authorization = request.headers.get("Authorization")
        if not authorization:
            # Return a default dev user for testing
            return JWTPayload(
                user_id="dev-user-123",
                email="dev@example.com"
            )

    # Extract Authorization header
    authorization = request.headers.get("Authorization")
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    # Parse Bearer token
    scheme, token = get_authorization_scheme_param(authorization)
    if scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication scheme",
        )

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided",
        )

    return verify_jwt_token(token)


async def get_optional_user(request: Request) -> Optional[JWTPayload]:
    """
    Optional authentication - returns user if token provided, None otherwise.

    Args:
        request: FastAPI Request object

    Returns:
        Optional[JWTPayload]: User payload if token valid, None if no token
    """
    authorization = request.headers.get("Authorization")
    if not authorization:
        return None

    scheme, token = get_authorization_scheme_param(authorization)
    if scheme.lower() != "bearer" or not token:
        return None

    try:
        return verify_jwt_token(token)
    except HTTPException:
        return None
