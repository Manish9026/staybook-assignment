"""
Ticketmaster Discovery API async client.
All external calls happen here — never in route handlers.
"""
import logging
from typing import Any, Dict, List, Optional

import httpx

from app.config import get_settings
from app.models.event import CategoryItem, EventsResponse
from app.services.cache import get_cache
from app.utils.response_filter import parse_events_response

logger = logging.getLogger(__name__)

# Hardcoded Ticketmaster segment IDs — avoids extra API call for categories
TICKETMASTER_SEGMENTS: List[CategoryItem] = [
    CategoryItem(id="KZFzniwnSyZfZ7v7nJ", name="Music"),
    CategoryItem(id="KZFzniwnSyZfZ7v7nE", name="Sports"),
    CategoryItem(id="KZFzniwnSyZfZ7v7na", name="Arts & Theatre"),
    CategoryItem(id="KZFzniwnSyZfZ7v7nn", name="Film"),
    CategoryItem(id="KZFzniwnSyZfZ7v7n1", name="Miscellaneous"),
    CategoryItem(id="KZFzniwnSyZfZ7v7nJ", name="Family"),
    CategoryItem(id="KZFzniwnSyZfZ7v7ni", name="Comedy"),
]

# Segment name → Ticketmaster segment ID mapping
SEGMENT_NAME_TO_ID = {
    "Music": "KZFzniwnSyZfZ7v7nJ",
    "Sports": "KZFzniwnSyZfZ7v7nE",
    "Arts & Theatre": "KZFzniwnSyZfZ7v7na",
    "Film": "KZFzniwnSyZfZ7v7nn",
    "Miscellaneous": "KZFzniwnSyZfZ7v7n1",
    "Family": "KZFzniwnSyZfZ7v7n1",
    "Comedy": "KZFzniwnSyZfZ7v7ni",
}


class TicketmasterClient:
    """
    Async HTTP client for Ticketmaster Discovery API v2.
    Includes:
      - Automatic response caching (TTL-based)
      - Clean error handling with typed exceptions
      - Response normalization (no raw fields exposed)
    """

    def __init__(self) -> None:
        self._settings = get_settings()
        self._cache = get_cache()
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=self._settings.ticketmaster_base_url,
                timeout=httpx.Timeout(30.0, connect=15.0),
                headers={"Accept": "application/json"},
                follow_redirects=True,
            )
        return self._client

    async def close(self) -> None:
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    def _build_params(
        self,
        city: Optional[str],
        keyword: Optional[str],
        category: Optional[str],
        page: int,
        size: int,
        sort: str,
        start_date_time: Optional[str],
        end_date_time: Optional[str],
    ) -> Dict[str, Any]:
        """Build Ticketmaster query params dict."""
        params: Dict[str, Any] = {
            "apikey": self._settings.ticketmaster_api_key,
            "page": page,
            "size": size,
            "sort": sort,
            "locale": "*",
        }

        if city:
            params["city"] = city.strip()
        if keyword:
            params["keyword"] = keyword.strip()
        if category and category in SEGMENT_NAME_TO_ID:
            params["segmentId"] = SEGMENT_NAME_TO_ID[category]
        if start_date_time:
            params["startDateTime"] = start_date_time
        if end_date_time:
            params["endDateTime"] = end_date_time

        return params

    async def search_events(
        self,
        city: Optional[str] = None,
        keyword: Optional[str] = None,
        category: Optional[str] = None,
        page: int = 0,
        size: int = 12,
        sort: str = "date,asc",
        start_date_time: Optional[str] = None,
        end_date_time: Optional[str] = None,
    ) -> EventsResponse:
        """
        Search events via Ticketmaster Discovery API.
        Results are cached by query params.
        """
        # Build cache key params (exclude API key for security)
        cache_params = {
            "city": city,
            "keyword": keyword,
            "category": category,
            "page": page,
            "size": size,
            "sort": sort,
            "start_date_time": start_date_time,
            "end_date_time": end_date_time,
        }

        # Check cache first
        cached = self._cache.get(cache_params)
        if cached is not None:
            return cached

        # Build full request params (includes API key)
        request_params = self._build_params(
            city=city,
            keyword=keyword,
            category=category,
            page=page,
            size=size,
            sort=sort,
            start_date_time=start_date_time,
            end_date_time=end_date_time,
        )

        client = await self._get_client()

        try:
            logger.info(
                "Fetching events from Ticketmaster: city=%s, category=%s, page=%d",
                city,
                category,
                page,
            )
            response = await client.get("/events.json", params=request_params)
            response.raise_for_status()
        except httpx.TimeoutException as exc:
            logger.error("Ticketmaster API timeout: %s", exc)
            raise TicketmasterTimeoutError("Ticketmaster API timed out") from exc
        except httpx.HTTPStatusError as exc:
            status = exc.response.status_code
            logger.error("Ticketmaster HTTP error %d", status)
            if status == 401:
                raise TicketmasterAuthError("Invalid Ticketmaster API key") from exc
            elif status == 429:
                raise TicketmasterRateLimitError("Ticketmaster rate limit exceeded") from exc
            else:
                raise TicketmasterAPIError(f"Ticketmaster API error: HTTP {status}") from exc
        except httpx.RequestError as exc:
            logger.error("Ticketmaster network error: %s", exc)
            raise TicketmasterAPIError("Network error reaching Ticketmaster API") from exc

        raw_data = response.json()
        result = parse_events_response(raw_data)

        # Store in cache
        self._cache.set(cache_params, result)

        return result

    async def get_categories(self) -> List[CategoryItem]:
        """Return available event categories/segments."""
        return TICKETMASTER_SEGMENTS


# Custom Exceptions


class TicketmasterAPIError(Exception):
    """Base exception for Ticketmaster API errors."""


class TicketmasterAuthError(TicketmasterAPIError):
    """Raised when the API key is invalid or missing."""


class TicketmasterRateLimitError(TicketmasterAPIError):
    """Raised when Ticketmaster rate limit is hit."""


class TicketmasterTimeoutError(TicketmasterAPIError):
    """Raised when request times out."""


# Module-level singleton

_client_instance: Optional[TicketmasterClient] = None


def get_ticketmaster_client() -> TicketmasterClient:
    global _client_instance
    if _client_instance is None:
        _client_instance = TicketmasterClient()
    return _client_instance
