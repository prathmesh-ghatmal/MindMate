from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List

from app.db.database import get_db
from app.db.models import JournalEntry
from app.schemas.journal import (
    JournalEntryCreate,
    JournalEntryUpdate,
    JournalEntryResponse
)
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/journal", tags=["Journal"])

# 🔹 Create entry
@router.post("/", response_model=JournalEntryResponse)
def create_entry(entry: JournalEntryCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    new_entry = JournalEntry(**entry.dict(), user_id=user.id)
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

# 🔹 Read all entries (user-specific)
@router.get("/", response_model=List[JournalEntryResponse])
def get_entries(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(JournalEntry).filter(JournalEntry.user_id == user.id).order_by(JournalEntry.created_at.desc()).all()

# 🔹 Read single entry
@router.get("/{entry_id}", response_model=JournalEntryResponse)
def get_entry(entry_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id, JournalEntry.user_id == user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    return entry

# 🔹 Update
@router.put("/{entry_id}", response_model=JournalEntryResponse)
def update_entry(entry_id: UUID, updates: JournalEntryUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id, JournalEntry.user_id == user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")

    for key, value in updates.dict(exclude_unset=True).items():
        setattr(entry, key, value)
    
    db.commit()
    db.refresh(entry)
    return entry

# 🔹 Delete
@router.delete("/{entry_id}", status_code=204)
def delete_entry(entry_id: UUID, db: Session = Depends(get_db), user=Depends(get_current_user)):
    entry = db.query(JournalEntry).filter(JournalEntry.id == entry_id, JournalEntry.user_id == user.id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Journal entry not found")
    db.delete(entry)
    db.commit()
