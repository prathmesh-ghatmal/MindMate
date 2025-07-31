from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from app.core.config import settings
from typing import Optional
import secrets
from sqlalchemy.orm import Session
from app.db import models
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_password_reset_token(email: str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=15)  # expires in 15 min
    to_encode = {"sub": email, "exp": expire}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def verify_password_reset_token(token: str) -> str | None:
    """Returns email if valid, None if expired/invalid"""
    from jose import JWTError
    try:
        decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return decoded.get("sub")
    except JWTError:
        return None


def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_password_reset_token_for_db(db: Session, user, expiry_minutes=15):
    # ✅ Generate secure random token
    raw_token = secrets.token_urlsafe(32)

    # ✅ Expiry timestamp
    expiry_time = datetime.utcnow() + timedelta(minutes=expiry_minutes)

    # ✅ Save in DB
    reset_token = models.PasswordResetToken(
        user_id=user.id,
        token=raw_token,
        expires_at=expiry_time,
        used=False
    )
    db.add(reset_token)
    db.commit()
    db.refresh(reset_token)

    return raw_token  # Send this in email