from app.db.database import Base
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean,TIMESTAMP
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
from sqlalchemy.dialects.postgresql import UUID

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



class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String, unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)

    user = relationship("User", backref="reset_tokens")


