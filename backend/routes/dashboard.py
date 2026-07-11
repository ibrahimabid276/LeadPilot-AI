from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from auth import get_current_user
from models.user import User
from models.lead import Lead
from models.email import EmailMessage
from models.campaign import Campaign
from models.crm import CrmLead

router = APIRouter(prefix="/api/v1", tags=["dashboard"])


@router.get("/dashboard/stats")
def get_dashboard_stats(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get dashboard statistics for the current user."""
    # Total leads
    total_leads = db.query(func.count(Lead.id)).filter(
        Lead.user_id == user.id
    ).scalar() or 0

    # Total emails sent
    emails_sent = db.query(func.count(EmailMessage.id)).filter(
        EmailMessage.user_id == user.id,
        EmailMessage.status.in_(["sent", "delivered", "mock_sent"]),
    ).scalar() or 0

    # Total emails replied
    emails_replied = db.query(func.count(EmailMessage.id)).filter(
        EmailMessage.user_id == user.id,
        EmailMessage.status == "replied",
    ).scalar() or 0

    # Conversion rate
    conversion_rate = 0.0
    if total_leads > 0:
        contacted = db.query(func.count(CrmLead.id)).filter(
            CrmLead.user_id == user.id,
            CrmLead.status.in_(["client", "closed"]),
        ).scalar() or 0
        conversion_rate = round((contacted / total_leads) * 100, 1)

    # Active campaigns
    active_campaigns = db.query(func.count(Campaign.id)).filter(
        Campaign.user_id == user.id,
        Campaign.status == "active",
    ).scalar() or 0

    # Recent leads (last 5)
    recent_leads = (
        db.query(Lead)
        .filter(Lead.user_id == user.id)
        .order_by(Lead.created_at.desc())
        .limit(5)
        .all()
    )

    recent_leads_data = [
        {
            "id": lead.id,
            "name": lead.name,
            "website": lead.website or "",
            "city": lead.city or "",
            "country": lead.country or "",
            "industry": lead.industry or "",
            "google_rating": lead.google_rating,
            "review_count": lead.review_count,
        }
        for lead in recent_leads
    ]

    # Recent emails (last 5)
    recent_emails = (
        db.query(EmailMessage)
        .filter(EmailMessage.user_id == user.id)
        .order_by(EmailMessage.created_at.desc())
        .limit(5)
        .all()
    )

    recent_emails_data = [
        {
            "id": e.id,
            "to_email": e.to_email,
            "to_name": e.to_name or "",
            "subject": e.subject,
            "status": e.status,
            "sent_at": e.sent_at.isoformat() if e.sent_at else None,
            "created_at": e.created_at.isoformat() if e.created_at else None,
        }
        for e in recent_emails
    ]

    return {
        "total_leads": total_leads,
        "emails_sent": emails_sent,
        "conversion_rate": conversion_rate,
        "active_campaigns": active_campaigns,
        "recent_leads": recent_leads_data,
        "recent_emails": recent_emails_data,
    }


@router.get("/analytics/overview")
def get_analytics_overview(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get analytics overview for the current user."""
    # Total leads
    total_leads = db.query(func.count(Lead.id)).filter(
        Lead.user_id == user.id
    ).scalar() or 0

    # Email stats
    total_emails_sent = db.query(func.count(EmailMessage.id)).filter(
        EmailMessage.user_id == user.id,
        EmailMessage.status.in_(["sent", "delivered", "mock_sent"]),
    ).scalar() or 0

    total_emails_opened = db.query(func.count(EmailMessage.id)).filter(
        EmailMessage.user_id == user.id,
        EmailMessage.opened_at.isnot(None),
    ).scalar() or 0

    total_emails_replied = db.query(func.count(EmailMessage.id)).filter(
        EmailMessage.user_id == user.id,
        EmailMessage.status == "replied",
    ).scalar() or 0

    # Conversion rate
    conversion_rate = 0.0
    if total_leads > 0:
        converted = db.query(func.count(CrmLead.id)).filter(
            CrmLead.user_id == user.id,
            CrmLead.status.in_(["client", "closed"]),
        ).scalar() or 0
        conversion_rate = round((converted / total_leads) * 100, 1)

    # Leads by industry
    leads_by_industry_rows = (
        db.query(Lead.industry, func.count(Lead.id))
        .filter(Lead.user_id == user.id, Lead.industry.isnot(None))
        .group_by(Lead.industry)
        .all()
    )
    leads_by_industry = {row[0]: row[1] for row in leads_by_industry_rows}

    # Emails by status
    emails_by_status_rows = (
        db.query(EmailMessage.status, func.count(EmailMessage.id))
        .filter(EmailMessage.user_id == user.id)
        .group_by(EmailMessage.status)
        .all()
    )
    emails_by_status = {row[0]: row[1] for row in emails_by_status_rows}

    # Leads by status (CRM)
    leads_by_status_rows = (
        db.query(CrmLead.status, func.count(CrmLead.id))
        .filter(CrmLead.user_id == user.id)
        .group_by(CrmLead.status)
        .all()
    )
    leads_by_status = {row[0]: row[1] for row in leads_by_status_rows}

    return {
        "total_leads": total_leads,
        "total_emails_sent": total_emails_sent,
        "total_emails_opened": total_emails_opened,
        "total_emails_replied": total_emails_replied,
        "conversion_rate": conversion_rate,
        "leads_by_industry": leads_by_industry,
        "emails_by_status": emails_by_status,
        "leads_by_status": leads_by_status,
    }
