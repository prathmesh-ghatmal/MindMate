from pydantic import BaseModel, EmailStr, validator
import re

PASSWORD_REGEX = (
    r"^(?=.*[A-Z])"          
    r"(?=.*[a-z])"           
    r"(?=.*\d)"              
    r"(?=.*[!@#$%^&*()_+=\[{\]};:<>|./?,-])"  
    r".{8,}$"    
)
class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    @validator("new_password")
    def validate_password_strength(cls, value):
        """Ensure new password is strong"""
        if not re.match(PASSWORD_REGEX, value):
            raise ValueError(
                "Password must be at least 8 characters long, "
                "contain an uppercase letter, a lowercase letter, "
                "a number, and a special character."
            )
        return value

class ForgotPasswordRequest(BaseModel):
    email: EmailStr