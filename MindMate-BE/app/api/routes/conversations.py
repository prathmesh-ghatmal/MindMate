from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from uuid import UUID
from app.db import models
from app.schemas import chat as schemas
from app.db.database import get_db

router = APIRouter(prefix="/conversations", tags=["conversations"])

@router.get("/", response_model=list[schemas.ConversationOut])
def list_conversations(user_id: UUID, db: Session = Depends(get_db)):
    return db.query(models.Conversation).filter_by(user_id=user_id).all()

@router.post("/", response_model=schemas.ConversationOut)
def create_conversation(user_id: UUID, db: Session = Depends(get_db)):
    convo = models.Conversation(user_id=user_id)
    db.add(convo)
    db.commit()
    db.refresh(convo)
    return convo

@router.patch("/{conversation_id}")
def rename_conversation(conversation_id: UUID, title: str, db: Session = Depends(get_db)):
    convo = db.query(models.Conversation).get(conversation_id)
    convo.title = title
    db.commit()
    return {"message": "Renamed"}

@router.delete("/{conversation_id}")
def delete_conversation(conversation_id: UUID, db: Session = Depends(get_db)):
    db.query(models.Conversation).filter_by(id=conversation_id).delete()
    db.commit()
    return {"message": "Deleted"}
