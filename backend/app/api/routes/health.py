"""
Health check route.
"""
from fastapi import APIRouter, Depends
from app.api.deps import settings_dep
from app.config import Settings
from app.services.cache import get_cache

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", summary="Health check")
async def health_check(settings: Settings = Depends(settings_dep)) -> dict:
    cache = get_cache()
    return {
        "status": "ok",
        "environment": settings.app_env,
        "cache": cache.stats,
        "api_configured": bool(settings.ticketmaster_api_key),
    }
