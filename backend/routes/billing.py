import json
import logging
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models.user import User
from services.billing import (
    create_checkout_session,
    verify_webhook_signature,
    map_subscription_status,
    extract_plan_from_variant,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/billing", tags=["billing"])


class CheckoutRequest(BaseModel):
    plan: str  # "starter", "professional", or "enterprise"


@router.post("/checkout/create")
async def create_checkout(
    request: CheckoutRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a Lemon Squeezy checkout session for the specified plan."""
    plan = request.plan.lower()
    if plan not in ("starter", "professional", "enterprise"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid plan. Must be starter, professional, or enterprise.",
        )

    try:
        checkout_url = await create_checkout_session(
            plan=plan,
            user_email=user.email,
            user_id=user.id,
        )
        return {"checkout_url": checkout_url}
    except RuntimeError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )


@router.get("/subscription")
async def get_subscription(
    user: User = Depends(get_current_user),
):
    """Get the current user's subscription status."""
    return {
        "plan": user.plan,
        "subscription_status": user.subscription_status,
        "trial_ends_at": user.trial_ends_at.isoformat() if user.trial_ends_at else None,
    }


@router.post("/webhooks/lemonsqueezy")
async def lemonsqueezy_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Handle Lemon Squeezy webhooks.
    Verifies signature and processes subscription events.
    """
    body = await request.body()
    signature = request.headers.get("X-Signature", "")

    if not verify_webhook_signature(body, signature):
        logger.warning("Invalid webhook signature received")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid signature",
        )

    try:
        payload = json.loads(body)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid JSON payload",
        )

    event_name = payload.get("meta", {}).get("event_name", "")
    logger.info(f"Received Lemon Squeezy webhook event: {event_name}")

    if event_name == "subscription_created":
        await _handle_subscription_created(payload, db)
    elif event_name == "subscription_updated":
        await _handle_subscription_updated(payload, db)
    elif event_name == "subscription_cancelled":
        await _handle_subscription_cancelled(payload, db)
    elif event_name == "subscription_payment_success":
        await _handle_payment_success(payload, db)
    elif event_name == "subscription_payment_failed":
        await _handle_payment_failed(payload, db)
    else:
        logger.info(f"Unhandled webhook event: {event_name}")

    return {"status": "ok"}


async def _get_user_from_webhook(payload: dict, db: Session) -> User | None:
    """Extract user from webhook payload using custom data or subscription ID."""
    custom_data = payload.get("meta", {}).get("custom_data", {})
    user_id = custom_data.get("user_id")

    if user_id:
        user = db.query(User).filter(User.id == user_id).first()
        if user:
            return user

    # Fallback: find by email
    user_email = payload.get("data", {}).get("attributes", {}).get("user_email", "")
    if user_email:
        user = db.query(User).filter(User.email == user_email).first()
        return user

    return None


async def _handle_subscription_created(payload: dict, db: Session):
    """Handle subscription_created event."""
    user = await _get_user_from_webhook(payload, db)
    if not user:
        logger.warning("User not found for subscription_created event")
        return

    attributes = payload.get("data", {}).get("attributes", {})
    subscription_id = str(payload.get("data", {}).get("id", ""))
    ls_status = attributes.get("status", "")
    variant_id = str(attributes.get("variant_id", ""))

    user.lemonsqueezy_subscription_id = subscription_id
    user.subscription_status = map_subscription_status(ls_status)
    user.plan = extract_plan_from_variant(variant_id) or user.plan

    # Set trial end date if applicable
    trial_ends_at = attributes.get("trial_ends_at")
    if trial_ends_at:
        try:
            user.trial_ends_at = datetime.fromisoformat(trial_ends_at.replace("Z", "+00:00"))
        except ValueError:
            logger.warning(f"Could not parse trial_ends_at: {trial_ends_at}")

    db.commit()
    logger.info(f"Subscription created for user {user.id}: plan={user.plan}, status={user.subscription_status}")


async def _handle_subscription_updated(payload: dict, db: Session):
    """Handle subscription_updated event."""
    user = await _get_user_from_webhook(payload, db)
    if not user:
        logger.warning("User not found for subscription_updated event")
        return

    attributes = payload.get("data", {}).get("attributes", {})
    ls_status = attributes.get("status", "")
    variant_id = str(attributes.get("variant_id", ""))

    user.subscription_status = map_subscription_status(ls_status)
    new_plan = extract_plan_from_variant(variant_id)
    if new_plan:
        user.plan = new_plan

    db.commit()
    logger.info(f"Subscription updated for user {user.id}: plan={user.plan}, status={user.subscription_status}")


async def _handle_subscription_cancelled(payload: dict, db: Session):
    """Handle subscription_cancelled event."""
    user = await _get_user_from_webhook(payload, db)
    if not user:
        logger.warning("User not found for subscription_cancelled event")
        return

    user.subscription_status = "cancelled"
    db.commit()
    logger.info(f"Subscription cancelled for user {user.id}")


async def _handle_payment_success(payload: dict, db: Session):
    """Handle successful payment event."""
    user = await _get_user_from_webhook(payload, db)
    if not user:
        logger.warning("User not found for subscription_payment_success event")
        return

    # If payment succeeds but status was past_due, reactivate
    if user.subscription_status == "past_due":
        user.subscription_status = "active"
        db.commit()
        logger.info(f"Payment success - reactivated subscription for user {user.id}")


async def _handle_payment_failed(payload: dict, db: Session):
    """Handle failed payment event."""
    user = await _get_user_from_webhook(payload, db)
    if not user:
        logger.warning("User not found for subscription_payment_failed event")
        return

    user.subscription_status = "past_due"
    db.commit()
    logger.info(f"Payment failed - marked user {user.id} as past_due")
