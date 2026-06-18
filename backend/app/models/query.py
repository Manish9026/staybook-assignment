"""
Query parameter models for Events API.
"""
from typing import Optional
from pydantic import BaseModel, Field, field_validator


VALID_SORT_OPTIONS = {
    "date,asc",
    "date,desc",
    "name,asc",
    "name,desc",
    "relevance,desc",
    "relevance,asc",
}

VALID_CATEGORIES = {
    "Music",
    "Sports",
    "Arts & Theatre",
    "Film",
    "Miscellaneous",
    "Family",
    "Comedy",
}


class EventSearchQuery(BaseModel):
    city: Optional[str] = Field(default=None, max_length=100, description="City name to search events in")
    keyword: Optional[str] = Field(default=None, max_length=200, description="Keyword to search events")
    category: Optional[str] = Field(default=None, description="Event category/segment")
    page: int = Field(default=0, ge=0, le=100, description="Page number (0-indexed)")
    size: int = Field(default=12, ge=1, le=50, description="Number of events per page")
    sort: str = Field(default="date,asc", description="Sort order")
    start_date_time: Optional[str] = Field(default=None, description="Start datetime filter (ISO 8601)")
    end_date_time: Optional[str] = Field(default=None, description="End datetime filter (ISO 8601)")

    @field_validator("sort")
    @classmethod
    def validate_sort(cls, v: str) -> str:
        if v not in VALID_SORT_OPTIONS:
            return "date,asc"
        return v

    @field_validator("category")
    @classmethod
    def validate_category(cls, v: Optional[str]) -> Optional[str]:
        if v and v not in VALID_CATEGORIES:
            return None
        return v
