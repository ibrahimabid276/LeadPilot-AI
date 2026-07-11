import re
import httpx
from typing import Optional

# OpenStreetMap APIs (free, no API key required)
NOMINATIM_URL = "https://nominatim.openstreetmap.org"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# Industry mapping for OSM tags
OSM_TAG_TO_INDUSTRY = {
    "dentist": "Dentistry",
    "doctors": "Healthcare",
    "hospital": "Healthcare",
    "clinic": "Healthcare",
    "restaurant": "Food & Beverage",
    "cafe": "Food & Beverage",
    "fast_food": "Food & Beverage",
    "bar": "Food & Beverage",
    "pub": "Food & Beverage",
    "gym": "Fitness",
    "fitness_centre": "Fitness",
    "spa": "Wellness",
    "beauty_salon": "Beauty",
    "hairdresser": "Beauty",
    "lawyer": "Legal",
    "bank": "Finance",
    "insurance": "Insurance",
    "estate_agent": "Real Estate",
    "plumber": "Home Services",
    "electrician": "Home Services",
    "supermarket": "Retail",
    "mall": "Retail",
    "school": "Education",
    "university": "Education",
    "pharmacy": "Healthcare",
    "optician": "Healthcare",
    "veterinary": "Pet Services",
    "hotel": "Hospitality",
    "guest_house": "Hospitality",
}

# Mapping from user-friendly industry names to OSM tags
INDUSTRY_TO_OSM_TAGS = {
    "Dentistry": ["amenity=dentist"],
    "Healthcare": ["amenity=doctors", "amenity=clinic", "amenity=hospital", "amenity=pharmacy"],
    "Food & Beverage": ["amenity=restaurant", "amenity=cafe", "amenity=fast_food"],
    "Fitness": ["leisure=fitness_centre"],
    "Wellness": ["amenity=spa"],
    "Beauty": ["shop=beauty", "shop=hairdresser"],
    "Legal": ["office=lawyer"],
    "Finance": ["amenity=bank"],
    "Insurance": ["office=insurance"],
    "Real Estate": ["office=estate_agent"],
    "Home Services": ["craft=plumber", "craft=electrician"],
    "Retail": ["shop=supermarket", "shop=mall"],
    "Education": ["amenity=school", "amenity=university"],
    "Pet Services": ["amenity=veterinary"],
    "Hospitality": ["tourism=hotel", "tourism=guest_house"],
}


def _sanitize_input(value: str) -> str:
    """Sanitize user input to prevent Overpass API injection."""
    # Remove all characters except alphanumeric, spaces, hyphens, and basic punctuation
    return re.sub(r'[^a-zA-Z0-9\s,._-]', '', value).strip()


def _geocode_location(location_str: str) -> tuple[float, float] | None:
    """Convert a location string to lat/lon using Nominatim."""
    try:
        headers = {"User-Agent": "LeadPilotAI/1.0 (leadpilot@example.com)"}
        response = httpx.get(
            f"{NOMINATIM_URL}/search",
            params={"q": location_str, "format": "json", "limit": 1},
            headers=headers,
            timeout=10.0,
        )
        response.raise_for_status()
        results = response.json()
        if results:
            return float(results[0]["lat"]), float(results[0]["lon"])
    except Exception as e:
        print(f"Nominatim geocoding error: {e}")
    return None


def _infer_industry(osm_tags: dict) -> str:
    """Infer industry category from OSM tags."""
    for key, value in osm_tags.items():
        combined = f"{key}={value}"
        if value in OSM_TAG_TO_INDUSTRY:
            return OSM_TAG_TO_INDUSTRY[value]
        if combined in OSM_TAG_TO_INDUSTRY:
            return OSM_TAG_TO_INDUSTRY[combined]
    return "Other"


def search_businesses(
    query: str,
    location: Optional[str] = None,
    country: Optional[str] = None,
    city: Optional[str] = None,
    industry: Optional[str] = None,
    radius: int = 5000,
) -> list[dict]:
    """
    Search for businesses using OpenStreetMap Overpass API.

    Args:
        query: Search query (e.g., "dentists", "restaurants")
        location: Location string (e.g., "New York, NY")
        country: Country filter
        city: City filter
        industry: Industry filter (maps to OSM tags)
        radius: Search radius in meters (default 5km)

    Returns:
        List of business dictionaries
    """
    try:
        # Determine coordinates from location
        lat, lon = None, None
        location_str = city or location or country
        if location_str:
            coords = _geocode_location(location_str)
            if coords:
                lat, lon = coords

        # Build Overpass query
        osm_tags = []
        if industry and industry in INDUSTRY_TO_OSM_TAGS:
            osm_tags = INDUSTRY_TO_OSM_TAGS[industry]
        else:
            # Try to match query to known tags
            query_lower = query.lower()
            for ind, tags in INDUSTRY_TO_OSM_TAGS.items():
                if ind.lower() in query_lower or query_lower in ind.lower():
                    osm_tags = tags
                    break

        if not osm_tags:
            # Fallback: use generic amenity search
            osm_tags = [f"amenity={query_lower}" if query_lower else "amenity=restaurant"]

        # Build the tag filter part
        tag_filters = " || ".join(
            f'"{k}"="{v}"' for tag in osm_tags for k, v in [tag.split("=")]
        )

        if lat is not None and lon is not None:
            # Search around coordinates
            overpass_query = f"""
            [out:json][timeout:25];
            (
              node[{tag_filters}](around:{radius},{lat},{lon});
              way[{tag_filters}](around:{radius},{lat},{lon});
              relation[{tag_filters}](around:{radius},{lat},{lon});
            );
            out center 50;
            """
        else:
            # Search by country/city name - sanitize to prevent injection
            area_filter = ""
            if city:
                safe_city = _sanitize_input(city)
                area_filter = f'{{geocodeArea:"{safe_city}"}}->.searchArea;'
            elif country:
                safe_country = _sanitize_input(country)
                area_filter = f'{{geocodeArea:"{safe_country}"}}->.searchArea;'

            if area_filter:
                overpass_query = f"""
                [out:json][timeout:25];
                {area_filter}
                (
                  node[{tag_filters}](area.searchArea);
                  way[{tag_filters}](area.searchArea);
                  relation[{tag_filters}](area.searchArea);
                );
                out center 50;
                """
            else:
                # No location - return mock data
                return _get_mock_businesses(country, city, industry)

        headers = {"User-Agent": "LeadPilotAI/1.0 (leadpilot@example.com)"}
        response = httpx.post(
            OVERPASS_URL,
            data={"data": overpass_query},
            headers=headers,
            timeout=30.0,
        )
        response.raise_for_status()
        data = response.json()

        businesses = []
        for element in data.get("elements", []):
            business = _parse_osm_element(element)
            if business:
                businesses.append(business)

        if not businesses:
            return _get_mock_businesses(country, city, industry)

        return businesses

    except Exception as e:
        print(f"Overpass API error: {e}")
        return _get_mock_businesses(country, city, industry)


def _parse_osm_element(element: dict) -> dict | None:
    """Parse an OSM element into our business format."""
    tags = element.get("tags", {})
    name = tags.get("name")
    if not name:
        return None

    # Get coordinates
    lat = element.get("lat") or element.get("center", {}).get("lat", 0)
    lon = element.get("lon") or element.get("center", {}).get("lon", 0)

    # Build address
    address_parts = [
        tags.get("addr:housenumber", ""),
        tags.get("addr:street", ""),
        tags.get("addr:city", ""),
    ]
    address = " ".join(p for p in address_parts if p).strip()

    return {
        "id": str(element.get("id", "")),
        "name": name,
        "osm_id": str(element.get("id", "")),
        "address": address or f"Lat: {lat:.4f}, Lon: {lon:.4f}",
        "city": tags.get("addr:city", ""),
        "country": tags.get("addr:country", ""),
        "google_rating": None,  # OSM doesn't have ratings
        "review_count": None,
        "website": tags.get("website", tags.get("contact:website", "")),
        "phone": tags.get("phone", tags.get("contact:phone", "")),
        "types": [k for k in tags.keys() if k not in ("name", "addr:housenumber", "addr:street", "addr:city")],
        "industry": _infer_industry(tags),
        "lat": lat,
        "lon": lon,
    }


def _get_mock_businesses(
    country: Optional[str] = None,
    city: Optional[str] = None,
    industry: Optional[str] = None,
) -> list[dict]:
    """Return mock business data when API is unavailable."""
    mock_businesses = [
        {
            "id": "mock_1",
            "name": "Smile Dental Clinic",
            "osm_id": "mock_osm_1",
            "address": "123 Main Street",
            "city": city or "Lahore",
            "country": country or "Pakistan",
            "google_rating": 4.5,
            "review_count": 128,
            "website": "https://smiledental.example.com",
            "phone": "+92 300 1234567",
            "types": ["amenity=dentist"],
            "industry": "Dentistry",
        },
        {
            "id": "mock_2",
            "name": "TechSolutions Ltd",
            "osm_id": "mock_osm_2",
            "address": "456 Tech Park",
            "city": city or "Karachi",
            "country": country or "Pakistan",
            "google_rating": 4.2,
            "review_count": 56,
            "website": "https://techsolutions.example.com",
            "phone": "+92 321 7654321",
            "types": ["office=technology"],
            "industry": industry or "Technology",
        },
        {
            "id": "mock_3",
            "name": "Green Landscaping Services",
            "osm_id": "mock_osm_3",
            "address": "789 Garden Road",
            "city": city or "Islamabad",
            "country": country or "Pakistan",
            "google_rating": 4.8,
            "review_count": 89,
            "website": "https://greenland.example.com",
            "phone": "+92 333 9876543",
            "types": ["craft=landscaping"],
            "industry": "Landscaping",
        },
        {
            "id": "mock_4",
            "name": "City Bakery & Cafe",
            "osm_id": "mock_osm_4",
            "address": "321 Baker Street",
            "city": city or "Lahore",
            "country": country or "Pakistan",
            "google_rating": 4.6,
            "review_count": 234,
            "website": "https://citybakery.example.com",
            "phone": "+92 345 1122334",
            "types": ["amenity=restaurant", "amenity=cafe"],
            "industry": "Food & Beverage",
        },
        {
            "id": "mock_5",
            "name": "FitZone Gym",
            "osm_id": "mock_osm_5",
            "address": "555 Fitness Ave",
            "city": city or "Rawalpindi",
            "country": country or "Pakistan",
            "google_rating": 4.3,
            "review_count": 167,
            "website": "https://fitzone.example.com",
            "phone": "+92 312 5566778",
            "types": ["leisure=fitness_centre"],
            "industry": "Fitness",
        },
    ]

    if industry:
        mock_businesses = [
            b for b in mock_businesses
            if industry.lower() in b["industry"].lower()
        ]

    return mock_businesses


def get_place_details(place_id: str) -> dict:
    """Get detailed information about a specific OSM place."""
    try:
        headers = {"User-Agent": "LeadPilotAI/1.0 (leadpilot@example.com)"}
        # Try to fetch details from Nominatim by OSM ID
        response = httpx.get(
            f"{NOMINATIM_URL}/lookup",
            params={"osm_ids": f"n{place_id}", "format": "json"},
            headers=headers,
            timeout=10.0,
        )
        response.raise_for_status()
        results = response.json()
        if results:
            return results[0]
        return {"error": "Place not found"}
    except Exception as e:
        return {"error": str(e)}
