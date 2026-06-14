"""Tests for security utilities."""

import pytest
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from jose import JWTError


class TestPasswordHashing:
    def test_hash_and_verify(self):
        password = "my_secure_password"
        hashed = hash_password(password)
        assert hashed != password
        assert verify_password(password, hashed) is True

    def test_wrong_password_fails(self):
        hashed = hash_password("correct_password")
        assert verify_password("wrong_password", hashed) is False


class TestJWTTokens:
    def test_create_access_token(self):
        token = create_access_token(subject=1)
        assert isinstance(token, str)
        assert len(token) > 0

    def test_create_refresh_token(self):
        token = create_refresh_token(subject=1)
        assert isinstance(token, str)
        assert len(token) > 0

    def test_decode_valid_access_token(self):
        token = create_access_token(subject=42, extra_claims={"role": "admin"})
        payload = decode_token(token)
        assert payload["sub"] == "42"
        assert payload["type"] == "access"
        assert payload["role"] == "admin"

    def test_decode_valid_refresh_token(self):
        token = create_refresh_token(subject=7)
        payload = decode_token(token)
        assert payload["sub"] == "7"
        assert payload["type"] == "refresh"

    def test_decode_invalid_token_raises(self):
        with pytest.raises(JWTError):
            decode_token("invalid.token.here")