import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    auth_id: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Billing fields
    plan: Mapped[str] = mapped_column(
        String(20), default="none", nullable=False
    )
    subscription_status: Mapped[str] = mapped_column(
        String(20), default="inactive", nullable=False
    )
    trial_ends_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    lemonsqueezy_subscription_id: Mapped[str | None] = mapped_column(
        String(255), nullable=True, index=True
    )

    # Relationships
    leads = relationship("Lead", back_populates="user", cascade="all, delete-orphan")
    campaigns = relationship("Campaign", back_populates="user", cascade="all, delete-orphan")
    emails = relationship("EmailMessage", back_populates="user", cascade="all, delete-orphan")
    crm_leads = relationship("CrmLead", back_populates="user", cascade="all, delete-orphan")
