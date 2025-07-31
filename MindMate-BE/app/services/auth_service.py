from sqlalchemy.orm import Session
from app.db import models
from app.schemas.user import UserCreate
from app.core.security import hash_password, verify_password, create_access_token
from datetime import timedelta,datetime
from app.core.config import settings
from app.core.security import create_refresh_token
from jose import jwt
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError

def register_user(db: Session, user: UserCreate):
    # ✅ Check if the user already exists
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # ✅ Hash password if provided
    hashed_pw = hash_password(user.password) if user.password else None

    # ✅ Create new user
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_pw,
        first_name=user.first_name,
        last_name=user.last_name,
        auth_provider="email",
        is_google_linked=False,
        is_verified=False
    )

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already registered")
def generate_tokens(user):
    access_token = create_access_token(
        {"sub": user.email},
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_refresh_token(
        {"sub": user.email}
    )
    return access_token, refresh_token

def save_refresh_token(db: Session, user, refresh_token):
    user.refresh_token = refresh_token
    db.commit()


def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None

    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email first")

    return user


def create_email_verification_token(email: str):
    expire = datetime.utcnow() + timedelta(hours=1)  # ✅ token valid for 1 hour
    to_encode = {"sub": email, "exp": expire}
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)



