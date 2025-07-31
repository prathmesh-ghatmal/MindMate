from pydantic import BaseModel, EmailStr, validator
import re
from typing import Optional

# ✅ Common Password Strength Regex
PASSWORD_REGEX = (
    r"^(?=.*[A-Z])"          # at least 1 uppercase
    r"(?=.*[a-z])"           # at least 1 lowercase
    r"(?=.*\d)"              # at least 1 digit
    r"(?=.*[!@#$%^&*()_+=\[{\]};:<>|./?,-])"  # at least 1 special char
    r".{8,}$"                # minimum 8 characters
)

class UserCreate(BaseModel):
    email: EmailStr
    password: Optional[str]  # optional, so it can be omitted for OAuth
    first_name: Optional[str]
    last_name: Optional[str]

    @validator("email")
    def normalize_email(cls, value):
        """Lowercase & strip spaces for consistency"""
        return value.strip().lower()

    @validator("password")
    def validate_password_strength(cls, value):
        """Strong password enforcement for registration"""
        if not re.match(PASSWORD_REGEX, value):
            raise ValueError(
                "Password must be at least 8 characters long, "
                "contain an uppercase letter, a lowercase letter, "
                "a number, and a special character."
            )
        return value


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    @validator("email")
    def normalize_email(cls, value):
        """Ensure case-insensitive login"""
        return value.strip().lower()

    @validator("password")
    def validate_non_empty(cls, value):
        """
        Only check non-empty for login,
        since existing users may already have weaker passwords.
        """
        if len(value.strip()) == 0:
            raise ValueError("Password cannot be empty")
        return value


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    
class RefreshRequest(BaseModel):
    refresh_token: str