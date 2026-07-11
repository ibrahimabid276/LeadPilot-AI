import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class Campaign(Base):
    __tablename__ = "campaigns"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False, index=True
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    # Email template
    subject_template: Mapped[str] = mapped_column(Text, nullable=True)
    body_template: Mapped[str] = mapped_column(Text, nullable=True)
    # Settings
    status: Mapped[str] = mapped_column(String(50), default="draft")  # draft, active, paused, completed
    daily_limit: Mapped[int] = mapped_column(Integer, default=50)
    # Stats
    total_leads: Mapped[int] = mapped_column(Integer, default=0)
    emails_sent: Mapped[int] = mapped_column(Integer, default=0)
    emails_opened: Mapped[int] = mapped_column(Integer, default=0)
    emails_replied: Mapped[int] = mapped_column(Integer, default=0)
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    user = relationship("User", back_populates="campaigns")
    emails = relationship("EmailMessage", back_populates="campaign", cascade="all, delete-orphan")
