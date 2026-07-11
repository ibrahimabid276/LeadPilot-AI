from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from typing import Optional

from database import get_db
from auth import get_current_user
from models.user import User
from models.lead import Lead
from models.crm import CrmLead

router = APIRouter(prefix="/api/v1/crm", tags=["crm"])


class CrmLeadCreate(BaseModel):
    lead_id: str
    status: str = "new"
    notes: Optional[str] = ""


class CrmLeadUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    position: Optional[int] = None


@router.get("/leads")
def get_crm_leads(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all CRM leads for the current user."""
    crm_leads = (
        db.query(CrmLead)
        .options(joinedload(CrmLead.lead))
        .filter(CrmLead.user_id == user.id)
        .all()
    )

    result = []
    for crm_lead in crm_leads:
        lead = crm_lead.lead
        if lead:
            result.append({
                "id": crm_lead.id,
                "lead_id": crm_lead.lead_id,
                "status": crm_lead.status,
                "position": crm_lead.position,
                "notes": crm_lead.notes,
                "lead": {
                    "id": lead.id,
                    "name": lead.name,
                    "industry": lead.industry,
                    "email": lead.email,
                    "phone": lead.phone,
                    "website": lead.website,
                    "city": lead.city,
                    "country": lead.country,
                    "google_rating": lead.google_rating,
                    "review_count": lead.review_count,
                },
                "created_at": crm_lead.created_at.isoformat() if crm_lead.created_at else None,
                "updated_at": crm_lead.updated_at.isoformat() if crm_lead.updated_at else None,
            })

    return {"leads": result}


@router.post("/leads")
def add_lead_to_crm(
    request: CrmLeadCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a lead to the CRM pipeline."""
    # Check if lead exists
    lead = db.query(Lead).filter(Lead.id == request.lead_id).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    # Check if already in CRM
    existing = db.query(CrmLead).filter(
        CrmLead.lead_id == request.lead_id,
        CrmLead.user_id == user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Lead already in CRM")

    # Get max position for the status
    max_position = db.query(CrmLead).filter(
        CrmLead.user_id == user.id,
        CrmLead.status == request.status
    ).count()

    # Create CRM entry
    crm_lead = CrmLead(
        user_id=user.id,
        lead_id=request.lead_id,
        status=request.status,
        position=max_position,
        notes=request.notes
    )
    db.add(crm_lead)

    # Update lead status
    lead.status = request.status
    db.commit()
    db.refresh(crm_lead)

    return {
        "id": crm_lead.id,
        "lead_id": crm_lead.lead_id,
        "status": crm_lead.status,
        "position": crm_lead.position,
        "message": "Lead added to CRM"
    }


@router.patch("/leads/{crm_lead_id}")
def update_crm_lead(
    crm_lead_id: str,
    request: CrmLeadUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a CRM lead (e.g., move to different status)."""
    crm_lead = db.query(CrmLead).filter(
        CrmLead.id == crm_lead_id,
        CrmLead.user_id == user.id
    ).first()

    if not crm_lead:
        raise HTTPException(status_code=404, detail="CRM lead not found")

    if request.status is not None:
        crm_lead.status = request.status
        # Update the underlying lead status too
        lead = db.query(Lead).filter(Lead.id == crm_lead.lead_id).first()
        if lead:
            lead.status = request.status

    if request.notes is not None:
        crm_lead.notes = request.notes

    if request.position is not None:
        crm_lead.position = request.position

    db.commit()
    db.refresh(crm_lead)

    return {
        "id": crm_lead.id,
        "lead_id": crm_lead.lead_id,
        "status": crm_lead.status,
        "position": crm_lead.position,
        "notes": crm_lead.notes,
        "message": "CRM lead updated"
    }


@router.delete("/leads/{crm_lead_id}")
def remove_lead_from_crm(
    crm_lead_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Remove a lead from the CRM pipeline."""
    crm_lead = db.query(CrmLead).filter(
        CrmLead.id == crm_lead_id,
        CrmLead.user_id == user.id
    ).first()

    if not crm_lead:
        raise HTTPException(status_code=404, detail="CRM lead not found")

    db.delete(crm_lead)
    db.commit()

    return {"message": "Lead removed from CRM"}


@router.get("/stats")
def get_crm_stats(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get CRM pipeline statistics."""
    crm_leads = db.query(CrmLead).filter(CrmLead.user_id == user.id).all()

    stats = {
        "total": len(crm_leads),
        "by_status": {
            "new": 0,
            "contacted": 0,
            "replied": 0,
            "meeting": 0,
            "client": 0,
            "closed": 0,
        }
    }

    for crm_lead in crm_leads:
        if crm_lead.status in stats["by_status"]:
            stats["by_status"][crm_lead.status] += 1

    return stats
