"""
Token-bucket rate limiter middleware.
Limits requests per IP per minute — configurable via RATE_LIMIT_PER_MINUTE env var.
"""
import time
import logging
from collections import defaultdict
from threading import Lock
from typing import Dict, Tuple

from fastapi import Request, Response
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from app.config import get_settings

logger = logging.getLogger(__name__)


class TokenBucket:
    """Single token bucket for one IP address."""

    def __init__(self, rate: float, capacity: float) -> None:
        self.rate = rate          # tokens added per second
        self.capacity = capacity  # max tokens
        self.tokens = capacity
        self.last_refill = time.monotonic()
        self.lock = Lock()

    def consume(self, tokens: float = 1.0) -> Tuple[bool, float]:
        """
        Try to consume `tokens` from the bucket.
        Returns (allowed: bool, retry_after_seconds: float).
        """
        with self.lock:
            now = time.monotonic()
            elapsed = now - self.last_refill
            self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)
            self.last_refill = now

            if self.tokens >= tokens:
                self.tokens -= tokens
                return True, 0.0
            else:
                retry_after = (tokens - self.tokens) / self.rate
                return False, retry_after


class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Per-IP token bucket rate limiting middleware.
    Skips health-check and non-API routes.
    """

    def __init__(self, app, rate_limit_per_minute: int) -> None:
        super().__init__(app)
        self._rate = rate_limit_per_minute / 60.0  # tokens per second
        self._capacity = float(rate_limit_per_minute)
        self._buckets: Dict[str, TokenBucket] = defaultdict(
            lambda: TokenBucket(self._rate, self._capacity)
        )
        self._lock = Lock()

    def _get_client_ip(self, request: Request) -> str:
        # Respect X-Forwarded-For when behind a proxy
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        # Skip non-API paths
        if not request.url.path.startswith("/api"):
            return await call_next(request)

        # Skip health endpoint from rate limiting
        if request.url.path == "/api/health":
            return await call_next(request)

        ip = self._get_client_ip(request)

        with self._lock:
            bucket = self._buckets[ip]

        allowed, retry_after = bucket.consume()

        if not allowed:
            logger.warning("Rate limit exceeded for IP=%s", ip)
            return JSONResponse(
                status_code=429,
                content={
                    "error": "rate_limit_exceeded",
                    "message": "Too many requests. Please slow down.",
                    "retry_after_seconds": round(retry_after, 2),
                },
                headers={"Retry-After": str(int(retry_after) + 1)},
            )

        response = await call_next(request)
        settings = get_settings()
        response.headers["X-RateLimit-Limit"] = str(settings.rate_limit_per_minute)
        response.headers["X-RateLimit-Remaining"] = str(int(bucket.tokens))
        return response
