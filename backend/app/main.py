"""
FastAPI application entrypoint.
Sets up CORS, GZip, rate limiting, and all API routes.
"""
import logging
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.config import get_settings
from app.api.routes import events, health
from app.utils.rate_limiter import RateLimitMiddleware
from app.services.ticketmaster import get_ticketmaster_client

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    logger.info("🚀 Events Explorer API starting up [%s]", settings.app_env)
    logger.info("   API configured: %s", bool(settings.ticketmaster_api_key))
    logger.info("   Cache TTL: %ds | Max size: %d", settings.cache_ttl_seconds, settings.cache_max_size)
    logger.info("   Rate limit: %d req/min", settings.rate_limit_per_minute)
    yield
    client = get_ticketmaster_client()
    await client.close()
    logger.info("👋 Events Explorer API shut down")


app = FastAPI(
    title="Events Explorer API",
    description="Proxy API for discovering live events via Ticketmaster Discovery API.",
    version="1.0.0",
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    lifespan=lifespan,
)

# Middleware (order matters: added last = runs first)

# GZip compression for all responses > 1KB
app.add_middleware(GZipMiddleware, minimum_size=1024)

# CORS — restrict to allowed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"],
    expose_headers=["X-RateLimit-Limit", "X-RateLimit-Remaining", "Cache-Control"],
)

# Token-bucket rate limiting per IP
app.add_middleware(RateLimitMiddleware, rate_limit_per_minute=settings.rate_limit_per_minute)

# Routers

app.include_router(health.router, prefix="/api")
app.include_router(events.router, prefix="/api")


@app.get("/", include_in_schema=False)
async def root():
    return {"message": "Events Explorer API", "docs": "/docs"}


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=settings.app_env == "development",
        log_level="info",
    )
