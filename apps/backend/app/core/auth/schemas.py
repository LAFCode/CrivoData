"""Pydantic schemas for authentication."""

from pydantic import BaseModel, EmailStr


class CurrentUser(BaseModel):
    """Authenticated user information extracted from JWT token."""

    id: int
    email: str
    username: str
    is_superuser: bool = False


class Token(BaseModel):
    """JWT token response."""

    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    """Login request body."""

    email: str
    password: str


class RefreshTokenRequest(BaseModel):
    """Refresh token request body."""

    refresh_token: str


class RegisterRequest(BaseModel):
    """User registration request body."""

    username: str
    email: EmailStr
    password: str