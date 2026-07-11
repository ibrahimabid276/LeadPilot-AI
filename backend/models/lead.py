import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class Lead(Base):
    __tablename__ = "leads"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False, index=True
    )
    # Business info
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    industry: Mapped[str] = mapped_column(String(255), nullable=True)
    website: Mapped[str] = mapped_column(String(500), nullable=True)
    phone: Mapped[str] = mapped_column(String(50), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=True)
    # Location
    address: Mapped[str] = mapped_column(String(500), nullable=True)
    city: Mapped[str] = mapped_column(String(255), nullable=True)
    state: Mapped[str] = mapped_column(String(255), nullable=True)
    country: Mapped[str] = mapped_column(String(255), nullable=True)
    postal_code: Mapped[str] = mapped_column(String(50), nullable=True)
    # Place data (from OpenStreetMap or other sources)
    place_id: Mapped[str] = mapped_column(String(255), nullable=True, index=True)
    google_rating: Mapped[float] = mapped_column(Float, nullable=True)
    review_count: Mapped[int] = mapped_column(Integer, nullable=True)
    # Enrichment
    enriched_data: Mapped[str] = mapped_column(Text, nullable=True)  # JSON blob
    ai_score: Mapped[int] = mapped_column(Integer, nullable=True)  # 0-100
    ai_analysis: Mapped[str] = mapped_column(Text, nullable=True)
    # Status
    status: Mapped[str] = mapped_column(String(50), default="new")
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    user = relationship("User", back_populates="leads")
    crm_entry = relationship("CrmLead", back_populates="lead", uselist=False, cascade="all, delete-orphan")
    emails = relationship("EmailMessage", back_populates="lead", cascade="all, delete-orphan")
