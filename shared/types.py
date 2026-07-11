"""Shared type definitions for LeadPilot AI."""

from typing import Optional
from pydantic import BaseModel


class Lead(BaseModel):
    """Represents a lead/contact."""
    id: Optional[str] = None
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    status: str = "new"  # new, contacted, qualified, converted


class LeadCreate(BaseModel):
    """Data required to create a new lead."""
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None


class APIResponse(BaseModel):
    """Standard API response wrapper."""
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None
