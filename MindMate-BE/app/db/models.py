from app.db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean,TIMESTAMP,Text
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID,ARRAY


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    refresh_token = Column(String, nullable=True)
    is_verified = Column(Boolean, nullable=False, default=False)
    is_active = Column(Boolean, default=True)
    auth_provider = Column(String, default="email")  # "email" or "google"
    is_google_linked = Column(Boolean, default=False)

    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)

    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    conversations = relationship("Conversation", back_populates="user")


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)

    user = relationship("User", backref="reset_tokens")


class Conversation(Base):
    __tablename__ = "conversations"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"))
    title = Column(String, default="New Chat")
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    updated_at = Column(TIMESTAMP, default=datetime.utcnow)
    
    # ✅ NEW: Store short memory summary of conversation
    summary = Column(Text, nullable=True)

    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")


class Message(Base):
    __tablename__ = "messages"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id", ondelete="CASCADE"))
    sender = Column(String)  # 'user' or 'bot'
    encrypted_text = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")


class MoodLog(Base):
    __tablename__ = "mood_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mood = Column(Integer, nullable=False)  # 1 to 5
    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    user = relationship("User", backref="mood_logs")

class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    mood = Column(Integer, nullable=False)  # 1 to 5
    tags = Column(ARRAY(String), default=[])

    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    user = relationship("User", backref="journal_entries")