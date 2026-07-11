import os
import hmac
import hashlib
import logging
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

LEMONSQUEEZY_API_URL = "https://api.lemonsqueezy.com/v1"

# Plan name -> env var mapping for variant IDs
VARIANT_MAP = {
    "starter": "LEMONSQUEEZY_VARIANT_STARTER",
    "professional": "LEMONSQUEEZY_VARIANT_PROFESSIONAL",
    "enterprise": "LEMONSQUEEZY_VARIANT_ENTERPRISE",
}


def _get_env(key: str) -> str:
    value = os.getenv(key, "")
    if not value:
        raise RuntimeError(f"{key} is not set. Billing features are unavailable.")
    return value


def get_variant_id(plan: str) -> str:
    """Get the Lemon Squeezy variant ID for a given plan name."""
    env_key = VARIANT_MAP.get(plan.lower())
    if not env_key:
        raise ValueError(f"Unknown plan: {plan}. Must be one of: {list(VARIANT_MAP.keys())}")
    return _get_env(env_key)


async def create_checkout_session(
    plan: str,
    user_email: str,
    user_id: str,
) -> str:
    """
    Create a Lemon Squeezy checkout session and return the checkout URL.

    Args:
        plan: One of 'starter', 'professional', 'enterprise'.
        user_email: The customer's email address.
        user_id: Internal user ID stored as checkout metadata.

    Returns:
        The checkout URL the user should be redirected to.
    """
    api_key = _get_env("LEMONSQUEEZY_API_KEY")
    store_id = _get_env("LEMONSQUEEZY_STORE_ID")
    variant_id = get_variant_id(plan)

    payload = {
        "data": {
            "type": "checkouts",
            "attributes": {
                "checkout_data": {
                    "email": user_email,
                    "custom": {
                        "user_id": user_id,
                    },
                },
                "product_options": {
                    "enabled_variants": [int(variant_id)],
                    "redirect_url": os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")[0]
                    + "/dashboard?checkout=success",
                },
            },
            "relationships": {
                "store": {
                    "data": {"type": "stores", "id": store_id},
                },
                "variant": {
                    "data": {"type": "variants", "id": variant_id},
                },
            },
        }
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(
            f"{LEMONSQUEEZY_API_URL}/checkouts",
            json=payload,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Accept": "application/vnd.api+json",
                "Content-Type": "application/vnd.api+json",
            },
        )

        if response.status_code not in (200, 201):
            logger.error(f"Lemon Squeezy checkout creation failed: {response.status_code} {response.text}")
            raise RuntimeError("Failed to create checkout session. Please try again.")

        data = response.json()
        checkout_url = data.get("data", {}).get("attributes", {}).get("url", "")
        if not checkout_url:
            raise RuntimeError("Checkout URL not returned from Lemon Squeezy.")
        return checkout_url


def verify_webhook_signature(payload: bytes, signature: str) -> bool:
    """
    Verify the Lemon Squeezy webhook signature using HMAC SHA256.

    Args:
        payload: The raw request body bytes.
        signature: The X-Signature header value.

    Returns:
        True if the signature is valid, False otherwise.
    """
    webhook_secret = os.getenv("LEMONSQUEEZY_WEBHOOK_SECRET", "")
    if not webhook_secret:
        logger.error("LEMONSQUEEZY_WEBHOOK_SECRET is not set")
        return False

    mac = hmac.new(
        webhook_secret.encode("utf-8"),
        msg=payload,
        digestmod=hashlib.sha256,
    )
    return hmac.compare_digest(mac.hexdigest(), signature)


def map_subscription_status(ls_status: str) -> str:
    """Map a Lemon Squeezy subscription status string to our internal status."""
    status_map = {
        "on_trial": "trialing",
        "active": "active",
        "cancelled": "cancelled",
        "expired": "cancelled",
        "paused": "past_due",
        "past_due": "past_due",
        "unpaid": "past_due",
    }
    return status_map.get(ls_status, "inactive")


def extract_plan_from_variant(variant_id: str) -> Optional[str]:
    """Determine plan name from a Lemon Squeezy variant ID."""
    for plan_name, env_key in VARIANT_MAP.items():
        if os.getenv(env_key, "") == variant_id:
            return plan_name
    return None
