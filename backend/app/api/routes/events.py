"""
Events API routes.
All query params validated via Pydantic before any external call.
"""
import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response

from app.api.deps import ticketmaster_dep
from app.models.event import CategoryItem, EventsResponse
from app.services.ticketmaster import (
    TicketmasterAuthError,
    TicketmasterClient,
    TicketmasterRateLimitError,
    TicketmasterTimeoutError,
    TicketmasterAPIError,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/events", tags=["events"])

# Allowed sort options whitelist (server-side guard)
ALLOWED_SORTS = {"date,asc", "date,desc", "name,asc", "name,desc", "relevance,desc"}


@router.get(
    "",
    response_model=EventsResponse,
    summary="Search events",
    description="Search events by city, keyword, and/or category. Results are paginated and cached.",
)
async def search_events(
    response: Response,
    city: Optional[str] = Query(default=None, max_length=100, description="City name"),
    keyword: Optional[str] = Query(default=None, max_length=200, description="Search keyword"),
    category: Optional[str] = Query(default=None, description="Event category"),
    page: int = Query(default=0, ge=0, le=100, description="Page number (0-indexed)"),
    size: int = Query(default=12, ge=1, le=50, description="Results per page"),
    sort: str = Query(default="date,asc", description="Sort order"),
    start_date_time: Optional[str] = Query(default=None, alias="startDateTime"),
    end_date_time: Optional[str] = Query(default=None, alias="endDateTime"),
    client: TicketmasterClient = Depends(ticketmaster_dep),
) -> EventsResponse:

    # Server-side sort validation
    if sort not in ALLOWED_SORTS:
        sort = "date,asc"

    # Require at least city or keyword
    if not city and not keyword:
        raise HTTPException(
            status_code=422,
            detail="At least one of 'city' or 'keyword' must be provided.",
        )

    try:
        result = await client.search_events(
            city=city,
            keyword=keyword,
            category=category,
            page=page,
            size=size,
            sort=sort,
            start_date_time=start_date_time,
            end_date_time=end_date_time,
        )
    except TicketmasterAuthError:
        raise HTTPException(status_code=502, detail="Events API authentication failed. Check your API key.")
    except TicketmasterRateLimitError:
        raise HTTPException(status_code=429, detail="Events API rate limit exceeded. Please retry later.")
    except TicketmasterTimeoutError:
        raise HTTPException(status_code=504, detail="Events API request timed out.")
    except TicketmasterAPIError as exc:
        logger.error("Ticketmaster error: %s", exc)
        raise HTTPException(status_code=502, detail="Failed to fetch events from upstream API.")

    # Add cache-control headers
    response.headers["Cache-Control"] = "public, max-age=60, stale-while-revalidate=30"

    return result


@router.get(
    "/categories",
    response_model=List[CategoryItem],
    summary="Get event categories",
    description="Returns the list of available event categories for filtering.",
)
async def get_categories(
    client: TicketmasterClient = Depends(ticketmaster_dep),
) -> List[CategoryItem]:
    return await client.get_categories()
