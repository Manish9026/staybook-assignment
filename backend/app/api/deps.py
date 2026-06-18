"""
FastAPI dependency injection helpers.
"""
from fastapi import Depends

from app.config import Settings, get_settings
from app.services.ticketmaster import TicketmasterClient, get_ticketmaster_client


def settings_dep() -> Settings:
    return get_settings()


def ticketmaster_dep() -> TicketmasterClient:
    return get_ticketmaster_client()
