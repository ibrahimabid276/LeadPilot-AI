import os
import re
import json
import logging
from urllib.parse import quote

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional

from database import get_db
from auth import get_current_user, get_optional_user
from models.user import User
from models.lead import Lead
from services.places import search_businesses
from services.ai_service import analyze_website, score_lead
from services.enrichment import enrich_lead

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/leads", tags=["leads"])


class LeadScoreRequest(BaseModel):
    business_name: str = Field(..., min_length=1, max_length=255)
    industry: str = Field(..., min_length=1, max_length=100)
    google_rating: Optional[float] = Field(None, ge=0, le=5)
    review_count: Optional[int] = Field(None, ge=0)
    has_website: bool = True


class WebsiteAuditRequest(BaseModel):
    url: str = Field(..., min_length=1, max_length=2000)
    business_name: str = Field(..., min_length=1, max_length=255)
    industry: str = Field(..., min_length=1, max_length=100)


class DiscoverQuery(BaseModel):
    country: Optional[str] = Field(None, max_length=100)
    city: Optional[str] = Field(None, max_length=100)
    industry: Optional[str] = Field(None, max_length=100)


def _sanitize_osm_input(value: str) -> str:
    """Sanitize input for Overpass API to prevent injection."""
    # Remove any characters that aren't safe for OSM queries
    return re.sub(r'[^a-zA-Z0-9\s,._-]', '', value).strip()


def _save_discovered_leads(db: Session, user_id: str, businesses: list[dict]) -> list[dict]:
    """Persist discovered leads to database and return with DB IDs."""
    saved_leads = []
    for biz in businesses:
        osm_id = biz.get("osm_id") or biz.get("id", "")
        # Check if lead already exists for this user by place_id
        existing = db.query(Lead).filter(
            Lead.user_id == user_id,
            Lead.place_id == str(osm_id)
        ).first()
        if existing:
            saved_leads.append({**biz, "id": existing.id})
            continue
        # Only persist if we have a user context
        if user_id:
            lead = Lead(
                user_id=user_id,
                name=biz.get("name", "Unknown"),
                industry=biz.get("industry", ""),
                website=biz.get("website", ""),
                phone=biz.get("phone", ""),
                address=biz.get("address", ""),
                city=biz.get("city", ""),
                country=biz.get("country", ""),
                place_id=str(osm_id),
                google_rating=biz.get("google_rating"),
                review_count=biz.get("review_count"),
            )
            db.add(lead)
            db.flush()  # Get the ID without committing yet
            saved_leads.append({**biz, "id": lead.id})
        else:
            saved_leads.append(biz)
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        logger.warning(f"Failed to persist discovered leads: {e}")
    return saved_leads


@router.get("/discover")
def discover_leads(
    country: Optional[str] = None,
    city: Optional[str] = None,
    industry: Optional[str] = None,
    user: Optional[User] = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    """Discover businesses using OpenStreetMap Overpass API."""
    # Sanitize inputs
    safe_country = _sanitize_osm_input(country) if country else None
    safe_city = _sanitize_osm_input(city) if city else None
    safe_industry = _sanitize_osm_input(industry) if industry else None

    query = safe_industry or "business"
    businesses = search_businesses(
        query=query,
        country=safe_country,
        city=safe_city,
        industry=safe_industry
    )
    # Persist leads to DB so they can be added to CRM later
    user_id = user.id if user else None
    if user_id:
        businesses = _save_discovered_leads(db, user_id, businesses)
    return {"leads": businesses}


@router.post("/audit")
def audit_website(
    request: WebsiteAuditRequest,
    user: User = Depends(get_current_user),
):
    """Analyze a website and provide AI-powered insights."""
    # Validate URL format
    url = request.url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    # Block dangerous schemes
    if re.match(r'^(javascript|data|vbscript|file):', url, re.IGNORECASE):
        raise HTTPException(status_code=400, detail="Invalid URL scheme")
    request.url = url
    result = analyze_website(
        url=url,
        business_name=request.business_name,
        industry=request.industry
    )
    return result


@router.post("/score")
def score_a_lead(
    request: LeadScoreRequest,
    user: User = Depends(get_current_user),
):
    """Score a lead for outreach potential."""
    result = score_lead(
        business_name=request.business_name,
        industry=request.industry,
        google_rating=request.google_rating,
        review_count=request.review_count,
        has_website=request.has_website
    )
    return result


@router.post("/{lead_id}/enrich")
def enrich_a_lead(
    lead_id: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Enrich a lead with website data."""
    lead = db.query(Lead).filter(
        Lead.id == lead_id,
        Lead.user_id == user.id
    ).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    if not lead.website:
        raise HTTPException(status_code=400, detail="Lead has no website")

    enriched_data = enrich_lead(lead.website, lead.name)
    lead.enriched_data = json.dumps(enriched_data)
    db.commit()

    return {"lead_id": lead_id, "enriched_data": enriched_data}


@router.get("/saved")
def get_saved_leads(
    skip: int = 0,
    limit: int = 50,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all saved leads for the current user with pagination."""
    leads = (
        db.query(Lead)
        .filter(Lead.user_id == user.id)
        .order_by(Lead.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    total = db.query(Lead).filter(Lead.user_id == user.id).count()
    return {
        "leads": [
            {
                "id": lead.id,
                "name": lead.name,
                "website": lead.website or "",
                "city": lead.city or "",
                "country": lead.country or "",
                "industry": lead.industry or "",
                "phone": lead.phone or "",
                "address": lead.address or "",
                "google_rating": lead.google_rating,
                "review_count": lead.review_count,
                "status": lead.status,
                "created_at": lead.created_at.isoformat() if lead.created_at else None,
            }
            for lead in leads
        ],
        "total": total,
        "skip": skip,
        "limit": limit,
    }
