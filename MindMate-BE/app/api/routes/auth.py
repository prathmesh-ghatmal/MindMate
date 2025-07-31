from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.schemas.user import UserCreate, UserLogin, Token,RefreshRequest,PASSWORD_REGEX
from app.schemas.auth import ResetPasswordRequest, ForgotPasswordRequest
from app.services.auth_service import register_user, authenticate_user,generate_tokens,save_refresh_token,create_email_verification_token,hash_password
from app.core.security import create_access_token,create_refresh_token,create_password_reset_token,verify_password_reset_token,create_password_reset_token_for_db
from fastapi import Body
from jose import jwt, JWTError  
from app.core.config import settings  
from app.db import models
from datetime import datetime
from app.services.mail_service import send_verification_email,send_reset_password_email
import re
import requests
from urllib.parse import urlencode

router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



GOOGLE_AUTH_BASE_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v1/userinfo"

@router.get("/google-login")
def google_login():
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent"
    }
    auth_url = f"{GOOGLE_AUTH_BASE_URL}?{urlencode(params)}"
    return {"auth_url": auth_url}


@router.get("/google/callback")
def google_callback(code: str, db: Session = Depends(get_db)):
    # Step 1: Exchange code for token
    token_data = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "grant_type": "authorization_code"
    }

    token_response = requests.post(GOOGLE_TOKEN_URL, data=token_data)
    token_json = token_response.json()
    access_token = token_json.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to get access token from Google")

    # Step 2: Get user info from Google
    userinfo_response = requests.get(GOOGLE_USERINFO_URL, params={"access_token": access_token})
    userinfo = userinfo_response.json()

    email = userinfo.get("email")
    first_name = userinfo.get("given_name")
    last_name = userinfo.get("family_name")

    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email")

    user = db.query(models.User).filter(models.User.email == email).first()

    if user:
        if not user.is_google_linked:
            # The account exists but is not linked with Google
            return {
                "detail": "Account exists. Do you want to link your Google account?",
                "requires_linking": True,
                "email": email,
                "access_token": access_token  # send this back for `/link-google`
            }
        # Already linked — login
    else:
        # Create new user
        user = models.User(
            email=email,
            hashed_password=None,
            is_verified=True,
            is_active=True,
            auth_provider="google",
            is_google_linked=True,
            first_name=first_name,
            last_name=last_name
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    # Generate JWTs
    access_token_jwt, refresh_token = generate_tokens(user)
    save_refresh_token(db, user, refresh_token)

    return {
        "access_token": access_token_jwt,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "email": email,
        "first_name": user.first_name,
        "last_name": user.last_name
    }



@router.post("/register")
async def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = register_user(db, user)

    # ✅ create verification token
    token = create_email_verification_token(db_user.email)

    # ✅ send email
    await send_verification_email(db_user.email, token)

    return {"message": "User created! Please check your email for verification link."}


@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token, refresh_token = generate_tokens(db_user)
    save_refresh_token(db, db_user, refresh_token)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,  # Include if client is storing it manually
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=Token)
def refresh_token(payload: RefreshRequest, db: Session = Depends(get_db)):
    refresh_token = payload.refresh_token  # ✅ Extract from JSON
    
    try:
        decoded_payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = decoded_payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or user.refresh_token != refresh_token:
        raise HTTPException(status_code=401, detail="Invalid refresh token or user")

    new_access_token = create_access_token({"sub": user.email})
    new_refresh_token = create_refresh_token({"sub": user.email})
    save_refresh_token(db, user, new_refresh_token)

    return {
        "access_token": new_access_token,
        "refresh_token": new_refresh_token,
        "token_type": "bearer"
    }


@router.post("/logout")
def logout_user(
    req: RefreshRequest,
    db: Session = Depends(get_db)
):
    refresh_token = req.refresh_token
    if not refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token is required")

    # ✅ Decode token to find which user is logging out
    try:
        decoded_payload = jwt.decode(
            refresh_token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        email = decoded_payload.get("sub")

    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    # ✅ Find the user
    user = db.query(models.User).filter(models.User.email == email).first()

    if not user or user.refresh_token != refresh_token:
        raise HTTPException(status_code=401, detail="Invalid refresh token or user")

    # ✅ Invalidate refresh token
    user.refresh_token = None
    db.commit()

    return {"detail": "Logged out successfully"}


@router.get("/verify-email")
def verify_email(token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email = payload.get("sub")
    except:
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.is_verified = True
    db.commit()

    return {"message": "Email verified successfully! You can now log in."}

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = payload.email.lower()

    user = db.query(models.User).filter(models.User.email == email).first()
    
    # ✅ Security best practice: don't reveal if user exists
    if not user:
        return {"message": "If an account with this email exists, you will receive a reset link."}

    # ✅ Block reset if email is NOT verified
    if not user.is_verified:
        return {"message": "Please verify your email before requesting a password reset."}

    # ✅ Generate and send reset link
    token = create_password_reset_token_for_db(db, user)
    await send_reset_password_email(user.email, token)

    return {"message": "If an account exists and is verified, a password reset link was sent."}




@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    # ✅ Look up token in DB
    reset_token_entry = (
        db.query(models.PasswordResetToken)
        .filter(models.PasswordResetToken.token == req.token)
        .first()
    )

    if not reset_token_entry:
        raise HTTPException(status_code=400, detail="Invalid reset token")

    # ✅ Check expiry
    if reset_token_entry.expires_at < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token expired")

    # ✅ Check if already used
    if reset_token_entry.used:
        raise HTTPException(status_code=400, detail="Token already used")

    # ✅ Get the user
    user = db.query(models.User).filter(models.User.id == reset_token_entry.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # ✅ Validate new password strength
    if not re.match(PASSWORD_REGEX, req.new_password):
        raise HTTPException(status_code=400, detail="Weak password. Must include upper, lower, number, special char, min 8 chars.")

    # ✅ Hash & update
    user.hashed_password = hash_password(req.new_password)
    db.commit()

    # ✅ Mark token as used
    reset_token_entry.used = True
    db.commit()

    return {"message": "Password has been reset successfully!"}

@router.post("/link-google")
def link_google_account(
    email: str = Body(...),
    access_token: str = Body(...),
    db: Session = Depends(get_db)
):
    # Get user info from access token
    userinfo_response = requests.get(
        GOOGLE_USERINFO_URL,
        params={"access_token": access_token}
    )
    userinfo = userinfo_response.json()
    
    if userinfo.get("email") != email:
        raise HTTPException(status_code=400, detail="Email mismatch")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.is_google_linked:
        raise HTTPException(status_code=400, detail="Google already linked to this account")

    user.is_google_linked = True
    user.auth_provider = "google"
    user.first_name = userinfo.get("given_name") or user.first_name
    user.last_name = userinfo.get("family_name") or user.last_name
    user.is_verified = True
    db.commit()

    # Issue new tokens
    access_token_jwt, refresh_token = generate_tokens(user)
    save_refresh_token(db, user, refresh_token)

    return {
        "message": "Google account linked successfully",
        "access_token": access_token_jwt,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/set-password")
def set_password(
    email: str = Body(...),
    new_password: str = Body(...),
    db: Session = Depends(get_db)
):
    from app.schemas.user import PASSWORD_REGEX  # reuse existing regex

    if not re.match(PASSWORD_REGEX, new_password):
        raise HTTPException(status_code=400, detail="Weak password")

    user = db.query(models.User).filter(models.User.email == email).first()

    if not user or not user.is_verified:
        raise HTTPException(status_code=400, detail="Invalid or unverified user")

    if user.hashed_password:
        raise HTTPException(status_code=400, detail="Password already set")

    user.hashed_password = hash_password(new_password)
    db.commit()

    return {"message": "Password set successfully. You can now log in with email/password."}
