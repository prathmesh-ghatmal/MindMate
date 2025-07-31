# app/routes/user.py

from fastapi import APIRouter, Depends
from app.dependencies.auth import get_current_user
from app.db.models import User 

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),  # UUID needs to be converted to string
        "email": current_user.email,
        "is_verified": current_user.is_verified,
        "first_name": current_user.first_name
    }