"""
Pydantic models for Events API responses.
These are our clean, shaped models — never exposing raw Ticketmaster fields.
"""
from typing import List, Optional
from pydantic import BaseModel, HttpUrl


class EventImage(BaseModel):
    url: str
    width: Optional[int] = None
    height: Optional[int] = None
    ratio: Optional[str] = None  # e.g. "16_9", "3_2", "4_3"


class EventVenue(BaseModel):
    id: Optional[str] = None
    name: str
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class PriceRange(BaseModel):
    type: Optional[str] = None
    currency: Optional[str] = "USD"
    min: Optional[float] = None
    max: Optional[float] = None


class Event(BaseModel):
    id: str
    name: str
    url: Optional[str] = None
    start_date: Optional[str] = None      # ISO 8601 date string
    start_time: Optional[str] = None      # Local time string
    timezone: Optional[str] = None
    status: Optional[str] = None          # "onsale", "offsale", "cancelled" etc.
    category: Optional[str] = None        # Top-level segment name
    sub_category: Optional[str] = None    # Genre name
    images: List[EventImage] = []
    venue: Optional[EventVenue] = None
    price_ranges: List[PriceRange] = []
    info: Optional[str] = None
    please_note: Optional[str] = None


class PaginationMeta(BaseModel):
    total_elements: int
    total_pages: int
    current_page: int
    page_size: int
    has_next: bool
    has_previous: bool


class EventsResponse(BaseModel):
    events: List[Event]
    pagination: PaginationMeta


class CategoryItem(BaseModel):
    id: str
    name: str
