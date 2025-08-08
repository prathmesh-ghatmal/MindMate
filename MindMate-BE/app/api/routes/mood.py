from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.models import MoodLog
from app.schemas.mood import MoodLogCreate, MoodLogUpdate, MoodLogResponse
from app.dependencies.auth import get_current_user
from app.db.database import get_db
from uuid import UUID
from typing import List

router = APIRouter(prefix="/mood", tags=["Mood Logs"])

@router.post("/", response_model=MoodLogResponse)
def create_mood_log(payload: MoodLogCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    mood_log = MoodLog(mood=payload.mood, user_id=user.id)
    db.add(mood_log)
    db.commit()
    db.refresh(mood_log)
    return mood_log

@router.get("/", response_model=List[MoodLogResponse])
def get_mood_logs(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(MoodLog).filter(MoodLog.user_id == user.id).order_by(MoodLog.created_at.desc()).all()

@router.get("/latest", response_model=MoodLogResponse)
def get_latest_mood_log(db: Session = Depends(get_db), user=Depends(get_current_user)):
    latest_log = (
        db.query(MoodLog)
        .filter(MoodLog.user_id == user.id)
        .order_by(MoodLog.created_at.desc())
        .first()
    )
    if not latest_log:
        raise HTTPException(status_code=404, detail="No mood logs found")
    return latest_log

@router.get("/{mood_id}", response_model=MoodLogResponse)
def get_single_mood_log(mood_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    log = db.query(MoodLog).filter(MoodLog.id == mood_id, MoodLog.user_id == user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Mood log not found")
    return log

@router.put("/{mood_id}", response_model=MoodLogResponse)
def update_mood_log(mood_id: UUID, payload: MoodLogUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    log = db.query(MoodLog).filter(MoodLog.id == mood_id, MoodLog.user_id == user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Mood log not found")
    if payload.mood is not None:
        log.mood = payload.mood
    db.commit()
    db.refresh(log)
    return log

@router.delete("/{mood_id}")
def delete_mood_log(mood_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    log = db.query(MoodLog).filter(MoodLog.id == mood_id, MoodLog.user_id == user.id).first()
    if not log:
        raise HTTPException(status_code=404, detail="Mood log not found")
    db.delete(log)
    db.commit()
    return {"message": "Mood log deleted successfully"}


