import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
from auth import get_current_user, get_optional_user
from models.user import User
from models.email import EmailMessage
from models.lead import Lead
from services.ai_service import generate_email_draft
from services.email_service import send_email, validate_email, check_rate_limit

router = APIRouter(prefix="/api/v1/emails", tags=["emails"])


class GenerateDraftRequest(BaseModel):
    name: str
    industry: str
    tone: Optional[str] = "professional"
    additional_context: Optional[str] = ""


class SendEmailRequest(BaseModel):
    lead_id: Optional[str] = None
    to_email: str
    to_name: Optional[str] = ""
    subject: str
    body: str


@router.post("/generate-draft")
def generate_draft_email(
    request: GenerateDraftRequest,
    user: User = Depends(get_optional_user),
):
    """Generate an AI-powered email draft for a lead."""
    result = generate_email_draft(
        lead_name=request.name,
        industry=request.industry,
        tone=request.tone,
        additional_context=request.additional_context
    )
    return result


@router.post("/send")
def send_an_email(
    request: SendEmailRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send an email using Resend."""
    # Validate email
    if not validate_email(request.to_email):
        raise HTTPException(status_code=400, detail="Invalid email address")

    # Check rate limit
    rate_check = check_rate_limit(user.id)
    if not rate_check["allowed"]:
        raise HTTPException(
            status_code=429,
            detail=f"Daily email limit reached. Try again tomorrow."
        )

    # Send the email
    result = send_email(
        to_email=request.to_email,
        to_name=request.to_name,
        subject=request.subject,
        body=request.body
    )

    # Save to database
    email_record = EmailMessage(
        user_id=user.id,
        lead_id=request.lead_id,
        to_email=request.to_email,
        to_name=request.to_name,
        subject=request.subject,
        body=request.body,
        status=result.get("status", "unknown"),
        provider_message_id=result.get("message_id"),
    )
    db.add(email_record)

    # Update lead status if linked
    if request.lead_id:
        lead = db.query(Lead).filter(Lead.id == request.lead_id).first()
        if lead:
            lead.status = "contacted"

    # Increment rate limit counter
    try:
        import redis
        from datetime import datetime
        redis_url = os.getenv("REDIS_URL")
        if redis_url:
            r = redis.from_url(redis_url, decode_responses=True)
            today = datetime.now().strftime("%Y-%m-%d")
            r.incr(f"email_limit:{user.id}:{today}")
            r.expire(f"email_limit:{user.id}:{today}", 86400)
    except Exception:
        pass

    db.commit()

    return {
        "success": result.get("status") in ["sent", "mock_sent"],
        "status": result.get("status"),
        "message_id": result.get("message_id"),
        "to": request.to_email
    }


@router.get("/history")
def get_email_history(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's email sending history."""
    emails = db.query(EmailMessage).filter(
        EmailMessage.user_id == user.id
    ).order_by(EmailMessage.created_at.desc()).limit(50).all()

    return {
        "emails": [
            {
                "id": e.id,
                "to_email": e.to_email,
                "to_name": e.to_name,
                "subject": e.subject,
                "status": e.status,
                "sent_at": e.sent_at.isoformat() if e.sent_at else None,
                "created_at": e.created_at.isoformat() if e.created_at else None,
            }
            for e in emails
        ]
    }
