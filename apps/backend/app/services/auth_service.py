"""Authentication service — handles login, registration, token management."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth.schemas import Token
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.user import User


class AuthService:
    """Service layer for authentication operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def authenticate(self, email: str, password: str) -> Token | None:
        """Validate credentials and return tokens."""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        user = result.scalar_one_or_none()

        if user is None or not verify_password(password, user.hashed_password):
            return None

        access_token = create_access_token(subject=user.id)
        refresh_token = create_refresh_token(subject=user.id)
        return Token(access_token=access_token, refresh_token=refresh_token)

    async def register(self, username: str, email: str, password: str) -> User:
        """Create a new user."""
        hashed = hash_password(password)
        user = User(
            username=username,
            email=email,
            hashed_password=hashed,
        )
        self.db.add(user)
        await self.db.flush()
        return user

    async def refresh_token(self, refresh_token: str) -> Token | None:
        """Validate a refresh token and issue a new access token."""
        try:
            payload = decode_token(refresh_token)
            if payload.get("type") != "refresh":
                return None

            user_id = payload.get("sub")
            result = await self.db.execute(
                select(User).where(User.id == int(user_id))
            )
            user = result.scalar_one_or_none()
            if user is None:
                return None

            new_access = create_access_token(subject=user.id)
            new_refresh = create_refresh_token(subject=user.id)
            return Token(access_token=new_access, refresh_token=new_refresh)
        except Exception:
            return None