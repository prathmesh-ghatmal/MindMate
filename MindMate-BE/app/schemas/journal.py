from pydantic import BaseModel, UUID4, Field
from typing import List, Optional
from datetime import datetime

class JournalEntryBase(BaseModel):
    title: str
    description: str
    mood: Optional[int] = Field(None, ge=1, le=5)
    tags: Optional[List[str]] = []

class JournalEntryCreate(JournalEntryBase):
    pass

class JournalEntryUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    mood: Optional[int] = Field(None, ge=1, le=5)
    tags: Optional[List[str]]

class JournalEntryResponse(JournalEntryBase):
    id: UUID4
    created_at: datetime

    class Config:
        orm_mode = True
