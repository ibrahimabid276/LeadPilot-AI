import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base


class CrmLead(Base):
    __tablename__ = "crm_leads"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id"), nullable=False, index=True
    )
    lead_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("leads.id"), nullable=False, unique=True, index=True
    )
    status: Mapped[str] = mapped_column(
        String(50), nullable=False, default="new", index=True
    )  # new, contacted, replied, meeting, client, closed
    position: Mapped[int] = mapped_column(Integer, default=0)  # Order within column
    notes: Mapped[str] = mapped_column(Text, nullable=True)
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    user = relationship("User", back_populates="crm_leads")
    lead = relationship("Lead", back_populates="crm_entry")
