"""
Application configuration using pydantic-settings.
All values loaded from environment variables / .env file.
"""
from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Ticketmaster ─────────────────────────────────────────────
    ticketmaster_api_key: str = ""
    ticketmaster_base_url: str = "https://app.ticketmaster.com/discovery/v2"

    # ── Cache ─────────────────────────────────────────────────────
    cache_ttl_seconds: int = 60
    cache_max_size: int = 500

    # ── Rate Limiting ─────────────────────────────────────────────
    rate_limit_per_minute: int = 60

    # ── CORS ──────────────────────────────────────────────────────
    allowed_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    # ── Response Security ─────────────────────────────────────────
    expose_raw_response: bool = False
    strip_internal_fields: bool = True

    # ── App ───────────────────────────────────────────────────────
    app_env: str = "development"
    app_debug: bool = False
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    @property
    def allowed_origins_list(self) -> List[str]:
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]

    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"


@lru_cache()
def get_settings() -> Settings:
    """Return cached settings singleton."""
    return Settings()
