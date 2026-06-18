"""
Response filter/shaper: transforms raw Ticketmaster JSON → clean Event models.
No internal IDs, raw API keys, or _embedded/_links fields leak through.
"""
from typing import Any, Dict, List, Optional

from app.models.event import Event, EventImage, EventVenue, PriceRange, EventsResponse, PaginationMeta


def _best_image(images: List[Dict]) -> List[EventImage]:
    """
    Pick and normalize images from Ticketmaster response.
    Prefer 16:9 ratio images, fall back to any available.
    """
    result: List[EventImage] = []
    ratios_preferred = ["16_9", "3_2", "4_3"]

    # Group by ratio
    by_ratio: Dict[str, List[Dict]] = {}
    for img in images:
        ratio = img.get("ratio", "unknown")
        by_ratio.setdefault(ratio, []).append(img)

    for ratio in ratios_preferred:
        for img in by_ratio.get(ratio, []):
            try:
                result.append(EventImage(
                    url=img["url"],
                    width=img.get("width"),
                    height=img.get("height"),
                    ratio=ratio,
                ))
            except Exception:
                pass

    # Include others not yet added
    added_urls = {i.url for i in result}
    for img in images:
        url = img.get("url", "")
        if url and url not in added_urls:
            try:
                result.append(EventImage(
                    url=url,
                    width=img.get("width"),
                    height=img.get("height"),
                    ratio=img.get("ratio"),
                ))
                added_urls.add(url)
            except Exception:
                pass

    return result


def _parse_venue(embedded: Dict) -> Optional[EventVenue]:
    venues = embedded.get("venues", [])
    if not venues:
        return None
    v = venues[0]
    city = v.get("city", {}).get("name")
    state_obj = v.get("state", {})
    country_obj = v.get("country", {})
    location = v.get("location", {})
    address = v.get("address", {}).get("line1")

    return EventVenue(
        id=v.get("id"),
        name=v.get("name", "Unknown Venue"),
        city=city,
        state=state_obj.get("name") if isinstance(state_obj, dict) else None,
        country=country_obj.get("name") if isinstance(country_obj, dict) else None,
        address=address,
        latitude=float(location["latitude"]) if location.get("latitude") else None,
        longitude=float(location["longitude"]) if location.get("longitude") else None,
    )


def _parse_price_ranges(raw: List[Dict]) -> List[PriceRange]:
    result = []
    for pr in raw:
        try:
            result.append(PriceRange(
                type=pr.get("type"),
                currency=pr.get("currency", "USD"),
                min=pr.get("min"),
                max=pr.get("max"),
            ))
        except Exception:
            pass
    return result


def _clean_name(name: Optional[str]) -> Optional[str]:
    """Return None for blank, 'Undefined', or 'undefined' Ticketmaster placeholder values."""
    if not name:
        return None
    if name.strip().lower() in ("undefined", "n/a", "unknown", ""):
        return None
    return name.strip()


def _parse_category(classifications: List[Dict]) -> tuple[Optional[str], Optional[str]]:
    if not classifications:
        return None, None
    cls = classifications[0]
    segment = cls.get("segment", {})
    genre = cls.get("genre", {})
    return _clean_name(segment.get("name")), _clean_name(genre.get("name"))


def parse_event(raw: Dict) -> Optional[Event]:
    """Parse a single raw Ticketmaster event dict → clean Event model."""
    try:
        event_id = raw.get("id")
        if not event_id:
            return None

        name = raw.get("name", "Unnamed Event")
        url = raw.get("url")
        info = raw.get("info")
        please_note = raw.get("pleaseNote")

        # Dates
        dates = raw.get("dates", {})
        start = dates.get("start", {})
        start_date = start.get("localDate")
        start_time = start.get("localTime")
        timezone = dates.get("timezone")
        status = dates.get("status", {}).get("code")

        # Images
        images = _best_image(raw.get("images", []))

        # Embedded (venue)
        embedded = raw.get("_embedded", {})
        venue = _parse_venue(embedded)

        # Classifications
        classifications = raw.get("classifications", [])
        category, sub_category = _parse_category(classifications)

        # Price ranges
        price_ranges = _parse_price_ranges(raw.get("priceRanges", []))

        return Event(
            id=event_id,
            name=name,
            url=url,
            start_date=start_date,
            start_time=start_time,
            timezone=timezone,
            status=status,
            category=category,
            sub_category=sub_category,
            images=images,
            venue=venue,
            price_ranges=price_ranges,
            info=info,
            please_note=please_note,
        )
    except Exception:
        return None


def parse_events_response(raw_response: Dict) -> EventsResponse:
    """
    Parse full Ticketmaster /events response → EventsResponse model.
    Strips all _links, _embedded at top level, internal API fields.
    """
    embedded = raw_response.get("_embedded", {})
    raw_events = embedded.get("events", [])

    page_info = raw_response.get("page", {})
    total_elements = page_info.get("totalElements", 0)
    total_pages = page_info.get("totalPages", 0)
    current_page = page_info.get("number", 0)
    page_size = page_info.get("size", 12)

    events = []
    for raw_event in raw_events:
        parsed = parse_event(raw_event)
        if parsed:
            events.append(parsed)

    return EventsResponse(
        events=events,
        pagination=PaginationMeta(
            total_elements=total_elements,
            total_pages=total_pages,
            current_page=current_page,
            page_size=page_size,
            has_next=current_page < total_pages - 1,
            has_previous=current_page > 0,
        ),
    )
