from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class MoodLogCreate(BaseModel):
    mood: int = Field(..., ge=1, le=5)

class MoodLogUpdate(BaseModel):
    mood: Optional[int] = Field(None, ge=1, le=5)

class MoodLogResponse(BaseModel):
    id: UUID
    mood: int
    created_at: datetime

    class Config:
        orm_mode = True
