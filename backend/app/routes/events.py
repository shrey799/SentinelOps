from fastapi import APIRouter

from app.data.sample_events import get_sample_events
from app.schemas.events import SecurityEvent

router = APIRouter()


@router.get("/events", response_model=list[SecurityEvent], tags=["Synthetic events"])
def get_events() -> list[SecurityEvent]:
    """Return synthetic authentication examples; no real monitoring or detection."""
    return get_sample_events()
