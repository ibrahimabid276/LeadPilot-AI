import requests
from bs4 import BeautifulSoup
from typing import Optional


def enrich_lead(website_url: str, business_name: str) -> dict:
    """
    Enrich a lead by scraping their website for additional information.
    
    Returns:
        dict with enriched data
    """
    if not website_url:
        return {"error": "No website URL provided"}

    try:
        # Fetch the website
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
        response = requests.get(website_url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")

        # Extract information
        enriched_data = {
            "title": soup.title.string if soup.title else "",
            "meta_description": _get_meta_description(soup),
            "emails": _extract_emails(response.text),
            "phones": _extract_phones(response.text),
            "social_links": _extract_social_links(soup),
            "has_contact_form": _has_contact_form(soup),
            "technologies": _detect_technologies(soup),
        }

        return enriched_data

    except requests.RequestException as e:
        return {"error": f"Failed to fetch website: {str(e)}"}
    except Exception as e:
        return {"error": f"Enrichment failed: {str(e)}"}


def _get_meta_description(soup: BeautifulSoup) -> str:
    """Extract meta description from page."""
    meta = soup.find("meta", attrs={"name": "description"})
    if meta and meta.get("content"):
        return meta["content"]
    return ""


def _extract_emails(text: str) -> list[str]:
    """Extract email addresses from text."""
    import re
    pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    emails = re.findall(pattern, text)
    # Remove duplicates and common non-business emails
    excluded = {"example.com", "email.com", "domain.com", "yourcompany.com"}
    return list(set(
        email for email in emails
        if not any(excl in email for excl in excluded)
    ))[:5]  # Limit to 5 emails


def _extract_phones(text: str) -> list[str]:
    """Extract phone numbers from text."""
    import re
    # Various phone patterns
    patterns = [
        r'\+?1?\s*\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}',  # US/Canada
        r'\+[0-9]{1,3}\s*[0-9]{2,4}\s*[0-9]{3,4}\s*[0-9]{3,4}',  # International
    ]
    phones = []
    for pattern in patterns:
        phones.extend(re.findall(pattern, text))
    return list(set(phones))[:3]  # Limit to 3 phones


def _extract_social_links(soup: BeautifulSoup) -> dict:
    """Extract social media links from page."""
    social_links = {
        "facebook": None,
        "twitter": None,
        "linkedin": None,
        "instagram": None,
        "youtube": None,
    }

    for link in soup.find_all("a", href=True):
        href = link["href"].lower()
        if "facebook.com" in href or "fb.com" in href:
            social_links["facebook"] = link["href"]
        elif "twitter.com" in href or "x.com" in href:
            social_links["twitter"] = link["href"]
        elif "linkedin.com" in href:
            social_links["linkedin"] = link["href"]
        elif "instagram.com" in href:
            social_links["instagram"] = link["href"]
        elif "youtube.com" in href:
            social_links["youtube"] = link["href"]

    return {k: v for k, v in social_links.items() if v}


def _has_contact_form(soup: BeautifulSoup) -> bool:
    """Check if page has a contact form."""
    # Look for forms with common contact-related attributes
    forms = soup.find_all("form")
    for form in forms:
        form_id = (form.get("id") or "").lower()
        form_class = (form.get("class") or [])
        form_class = " ".join(form_class).lower() if isinstance(form_class, list) else form_class.lower()

        contact_indicators = ["contact", "inquiry", "enquiry", "message", "subscribe"]
        if any(ind in form_id or ind in form_class for ind in contact_indicators):
            return True

        # Check for common contact form fields
        if form.find("input", attrs={"type": "email"}):
            return True

    return False


def _detect_technologies(soup: BeautifulSoup) -> list[str]:
    """Detect technologies used on the website."""
    technologies = []
    html = str(soup)

    tech_indicators = {
        "WordPress": ["wp-content", "wordpress"],
        "Shopify": ["shopify", "cdn.shopify"],
        "Wix": ["wix.com", "wixsite"],
        "Squarespace": ["squarespace", "static.squarespace"],
        "React": ["react", "_next/static"],
        "Next.js": ["_next/static", "next/data"],
        "Vue.js": ["vue", "nuxt"],
        "Bootstrap": ["bootstrap", "bootstrapcdn"],
        "Tailwind CSS": ["tailwindcss", "tailwind"],
        "Google Analytics": ["google-analytics", "gtag", "GA-"],
        "Facebook Pixel": ["facebook.net", "fbq"],
    }

    for tech, indicators in tech_indicators.items():
        if any(ind.lower() in html.lower() for ind in indicators):
            technologies.append(tech)

    return technologies
