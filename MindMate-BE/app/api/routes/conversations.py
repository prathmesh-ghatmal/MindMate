from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from app.db import models
from app.schemas import chat as schemas
from app.db.database import get_db
from app.dependencies.auth import get_current_user
from app.db.models import User 
from fastapi import HTTPException, status

router = APIRouter(prefix="/conversations", tags=["conversations"])

@router.get("/", response_model=list[schemas.ConversationOut])
def list_conversations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Conversation).filter_by(user_id=current_user.id).all()

@router.post("/", response_model=schemas.ConversationOut)
def create_conversation(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    convo = models.Conversation(user_id=current_user.id)
    db.add(convo)
    db.commit()
    db.refresh(convo)
    return convo




@router.patch("/{conversation_id}")
def rename_conversation(
    conversation_id: UUID,
    title: str,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    convo = db.query(models.Conversation).filter_by(id=conversation_id).first()

    if convo is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    if convo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to rename this conversation"
        )

    convo.title = title
    db.commit()
    return {"message": "Renamed"}



@router.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    convo = db.query(models.Conversation).filter_by(id=conversation_id).first()

    if not convo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )

    if convo.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to delete this conversation"
        )

    db.delete(convo)
    db.commit()

    return {"message": "Deleted"}

