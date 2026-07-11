import os
import html
import logging
from datetime import datetime
import resend

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "noreply@leadpilot.ai")

# Initialize Resend
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY


def send_email(
    to_email: str,
    to_name: str,
    subject: str,
    body: str,
    from_name: str = "LeadPilot AI"
) -> dict:
    """
    Send an email using Resend.

    Returns:
        dict with status and message_id
    """
    if not RESEND_API_KEY:
        # Mock mode - return success without sending
        return {
            "status": "mock_sent",
            "message_id": "mock_message_id",
            "to": to_email,
            "subject": subject,
        }

    try:
        html_body = _convert_to_html(body, to_name)

        params: resend.Emails.SendParams = {
            "from": f"{from_name} <{EMAIL_FROM}>",
            "to": [to_email],
            "subject": subject,
            "text": body,
            "html": html_body,
        }

        response = resend.Emails.send(params)

        return {
            "status": "sent",
            "message_id": response.get("id", ""),
            "to": to_email,
            "subject": subject,
        }

    except Exception as e:
        return {
            "status": "failed",
            "error": str(e),
            "to": to_email,
            "subject": subject,
        }


def _convert_to_html(plain_text: str, recipient_name: str) -> str:
    """Convert plain text email to a styled HTML version with proper escaping."""
    # Escape HTML entities to prevent XSS
    safe_text = html.escape(plain_text, quote=True)
    # Convert line breaks to HTML
    html_body = safe_text.replace("\n", "<br>")

    # Wrap in a simple HTML template
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }}
            .footer {{ margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999; }}
        </style>
    </head>
    <body>
        {html_body}
        <div class="footer">
            <p>Sent via LeadPilot AI</p>
            <p>If you no longer wish to receive emails, <a href="{{unsubscribe_url}}">click here to unsubscribe</a>.</p>
        </div>
    </body>
    </html>
    """


def check_rate_limit(user_id: str, daily_limit: int = 50) -> dict:
    """
    Check if user has exceeded their daily email limit using Redis.
    Falls back to allowing if Redis is unavailable.
    """
    redis_url = os.getenv("REDIS_URL")
    if not redis_url:
        return {"allowed": True, "sent_today": 0, "limit": daily_limit, "remaining": daily_limit}

    try:
        import redis
        r = redis.from_url(redis_url, decode_responses=True)
        today = datetime.now().strftime("%Y-%m-%d")
        key = f"email_limit:{user_id}:{today}"
        sent_today = int(r.get(key) or 0)
        remaining = max(0, daily_limit - sent_today)

        return {
            "allowed": sent_today < daily_limit,
            "sent_today": sent_today,
            "limit": daily_limit,
            "remaining": remaining,
        }
    except Exception as e:
        logger.warning(f"Redis rate limit check failed: {e}")
        return {"allowed": True, "sent_today": 0, "limit": daily_limit, "remaining": daily_limit}


def validate_email(email: str) -> bool:
    """Basic email validation."""
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))
