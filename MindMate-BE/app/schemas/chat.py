from pydantic import BaseModel
from typing import List
from uuid import UUID

class ConversationCreate(BaseModel):
    title: str = "New Chat"

class ConversationOut(BaseModel):
    id: UUID
    title: str
    class Config:
        orm_mode = True

class MessageOut(BaseModel):
    sender: str
    text: str

class ChatRequest(BaseModel):
    conversation_id: UUID
    message: str

class ChatResponse(BaseModel):
    reply: str
