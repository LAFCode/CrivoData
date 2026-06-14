"""Authentication API routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth.dependencies import get_current_user
from app.core.auth.schemas import (
    CurrentUser,
    LoginRequest,
    RefreshTokenRequest,
    RegisterRequest,
    Token,
)
from app.core.database import get_db
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=Token)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Authenticate user and return JWT tokens."""
    service = AuthService(db)
    result = await service.authenticate(request.email, request.password)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return result


@router.post("/register", response_model=Token)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a new user and return JWT tokens."""
    from app.core.security import create_access_token as cat, create_refresh_token as crt

    service = AuthService(db)
    user = await service.register(
        username=request.username,
        email=request.email,
        password=request.password,
    )
    access_token = cat(subject=user.id)
    refresh_token = crt(subject=user.id)
    return Token(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=Token)
async def refresh(request: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    """Refresh an expired access token."""
    service = AuthService(db)
    result = await service.refresh_token(request.refresh_token)
    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
    return result


@router.get("/me", response_model=CurrentUser)
async def get_me(current_user: CurrentUser = Depends(get_current_user)):
    """Return the currently authenticated user."""
    return current_user