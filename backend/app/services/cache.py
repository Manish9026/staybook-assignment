"""
In-memory TTL cache using cachetools.
Thread-safe wrapper with hash-based keys from query params.
"""
import hashlib
import json
import logging
from typing import Any, Optional

from cachetools import TTLCache
from threading import Lock

from app.config import get_settings

logger = logging.getLogger(__name__)


class EventCache:
    """Thread-safe TTL cache for event API responses."""

    def __init__(self) -> None:
        settings = get_settings()
        self._cache: TTLCache = TTLCache(
            maxsize=settings.cache_max_size,
            ttl=settings.cache_ttl_seconds,
        )
        self._lock = Lock()

    def _make_key(self, params: dict) -> str:
        """Generate a deterministic cache key from query params."""
        serialized = json.dumps(params, sort_keys=True, default=str)
        return hashlib.sha256(serialized.encode()).hexdigest()

    def get(self, params: dict) -> Optional[Any]:
        key = self._make_key(params)
        with self._lock:
            value = self._cache.get(key)
            if value is not None:
                logger.debug("Cache HIT for key=%s", key[:12])
            return value

    def set(self, params: dict, value: Any) -> None:
        key = self._make_key(params)
        with self._lock:
            self._cache[key] = value
            logger.debug("Cache SET for key=%s", key[:12])

    def invalidate(self, params: dict) -> None:
        key = self._make_key(params)
        with self._lock:
            self._cache.pop(key, None)

    def clear(self) -> None:
        with self._lock:
            self._cache.clear()

    @property
    def size(self) -> int:
        return len(self._cache)

    @property
    def stats(self) -> dict:
        return {
            "size": len(self._cache),
            "maxsize": self._cache.maxsize,
            "ttl": self._cache.ttl,
        }


# Module-level singleton
_cache_instance: Optional[EventCache] = None


def get_cache() -> EventCache:
    global _cache_instance
    if _cache_instance is None:
        _cache_instance = EventCache()
    return _cache_instance
