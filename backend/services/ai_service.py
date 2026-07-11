import os
import json
import httpx

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

# Default free model
DEFAULT_MODEL = "google/gemini-2.5-flash"

# Supported free models on OpenRouter:
# - google/gemini-2.5-flash
# - meta-llama/llama-4-maverick (free)
# - deepseek/deepseek-chat (free)
# - qwen/qwen-2.5-72b-instruct (free)


async def _call_openrouter(
    messages: list[dict],
    model: str = DEFAULT_MODEL,
    temperature: float = 0.7,
    max_tokens: int = 500,
) -> str:
    """Make a chat completion request to OpenRouter."""
    if not OPENROUTER_API_KEY:
        raise Exception("OPENROUTER_API_KEY not configured")

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "LeadPilot AI",
    }

    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.post(OPENROUTER_BASE_URL, json=payload, headers=headers)
        response.raise_for_status()
        data = response.json()

    content = data["choices"][0]["message"]["content"].strip()
    return content


def _call_openrouter_sync(
    messages: list[dict],
    model: str = DEFAULT_MODEL,
    temperature: float = 0.7,
    max_tokens: int = 500,
) -> str:
    """Synchronous wrapper for OpenRouter API call."""
    if not OPENROUTER_API_KEY:
        raise Exception("OPENROUTER_API_KEY not configured")

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "LeadPilot AI",
    }

    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    response = httpx.post(OPENROUTER_BASE_URL, json=payload, headers=headers, timeout=30.0)
    response.raise_for_status()
    data = response.json()

    content = data["choices"][0]["message"]["content"].strip()
    return content


def _parse_json_response(content: str) -> dict:
    """Parse JSON from model response, handling markdown code blocks."""
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
        content = content.strip()
    return json.loads(content)


def generate_email_draft(
    lead_name: str,
    industry: str,
    tone: str = "professional",
    additional_context: str = ""
) -> dict:
    """Generate a personalized email draft for a lead."""
    prompt = f"""You are an expert email copywriter for a lead generation agency called LeadPilot AI.

Generate a personalized outreach email for the following business:
- Business Name: {lead_name}
- Industry: {industry}
- Tone: {tone}
{f'- Additional Context: {additional_context}' if additional_context else ''}

The email should:
1. Have a compelling subject line
2. Be personalized to their industry and business
3. Highlight how our AI-powered lead generation service can help them
4. Include a clear call-to-action
5. Be concise (under 200 words)

Return your response in this exact JSON format:
{{"subject": "your subject line here", "body": "your email body here"}}"""

    try:
        content = _call_openrouter_sync(
            messages=[
                {"role": "system", "content": "You are a professional email copywriter. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=500
        )

        result = _parse_json_response(content)
        return {
            "subject": result.get("subject", ""),
            "body": result.get("body", ""),
            "model": DEFAULT_MODEL
        }
    except Exception:
        # Fallback to template if AI fails
        return {
            "subject": f"Growing {lead_name}'s business with AI-powered lead generation",
            "body": f"""Hi {lead_name} team,

I noticed {lead_name} in the {industry} space. At LeadPilot AI, we help businesses like yours discover and connect with potential customers using advanced AI technology.

Our platform can help you:
- Discover qualified leads in your area
- Generate personalized outreach emails
- Track and optimize your campaigns

Would you be open to a quick chat about how we might help {lead_name} grow?

Best regards,
The LeadPilot AI Team""",
            "model": "fallback-template"
        }


def analyze_website(url: str, business_name: str, industry: str) -> dict:
    """Analyze a website and provide insights for outreach."""
    prompt = f"""Analyze this business website and provide insights for sales outreach:
- Website: {url}
- Business Name: {business_name}
- Industry: {industry}

Provide:
1. Key observations about their business
2. Potential pain points we could address
3. Suggested talking points for outreach
4. A lead quality score (0-100)

Return JSON format:
{{"observations": [...], "pain_points": [...], "talking_points": [...], "score": 75}}"""

    try:
        content = _call_openrouter_sync(
            messages=[
                {"role": "system", "content": "You are a business analyst. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
            max_tokens=800
        )

        result = _parse_json_response(content)
        return {
            "observations": result.get("observations", []),
            "pain_points": result.get("pain_points", []),
            "talking_points": result.get("talking_points", []),
            "score": result.get("score", 50),
        }
    except Exception as e:
        return {
            "observations": [f"Analysis unavailable for {business_name}"],
            "pain_points": ["Could not analyze website"],
            "talking_points": [f"Reach out to {business_name} about their {industry} business"],
            "score": 50,
            "error": str(e)
        }


def score_lead(
    business_name: str,
    industry: str,
    google_rating: float = None,
    review_count: int = None,
    has_website: bool = True
) -> dict:
    """Score a lead based on various factors."""
    prompt = f"""Score this business lead for outreach potential (0-100):
- Business Name: {business_name}
- Industry: {industry}
- Google Rating: {google_rating or 'N/A'}
- Review Count: {review_count or 'N/A'}
- Has Website: {has_website}

Consider:
- Business legitimacy (reviews, rating)
- Online presence
- Industry fit for our services
- Likelihood to respond to outreach

Return JSON: {{"score": 75, "factors": ["factor1", "factor2"], "recommendation": "high/medium/low priority"}}"""

    try:
        content = _call_openrouter_sync(
            messages=[
                {"role": "system", "content": "You are a lead qualification expert. Always respond with valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=400
        )

        result = _parse_json_response(content)
        return result
    except Exception:
        # Simple scoring fallback
        score = 50
        if google_rating and google_rating >= 4.0:
            score += 15
        if review_count and review_count >= 10:
            score += 15
        if has_website:
            score += 10
        return {
            "score": min(score, 100),
            "factors": ["Basic scoring (AI unavailable)"],
            "recommendation": "medium priority" if score >= 60 else "low priority"
        }
