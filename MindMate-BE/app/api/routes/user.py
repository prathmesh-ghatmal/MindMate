# app/routes/user.py

from fastapi import APIRouter, Depends
from app.dependencies.auth import get_current_user
from app.db.models import User 
from app.db.database import get_db
from app.schemas.user import UserUpdateRequest
from sqlalchemy.orm import Session
from uuid import UUID
router = APIRouter(prefix="/user", tags=["User"])

@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),  # UUID needs to be converted to string
        "email": current_user.email,
        "is_verified": current_user.is_verified,
        "first_name": current_user.first_name,
        "joinDate": current_user.created_at.isoformat()  # Convert datetime to ISO format
    }

@router.put("/me")
def update_my_profile(
    updates: UserUpdateRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    # Update only provided fields
    if updates.first_name is not None:
        user.first_name = updates.first_name
    if updates.last_name is not None:
        user.last_name = updates.last_name
    if updates.is_active is not None:
        user.is_active = updates.is_active

    # No need to call db.add(current_user)
    db.commit()
    db.refresh(user)

    return {
        "message": "Profile updated successfully",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "joinDate": user.created_at.isoformat()
        }
    }
