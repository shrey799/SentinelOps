from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException

from app.repositories.events import DuplicateEventError, InMemoryEventRepository, get_repository
from app.schemas.events import SecurityEvent
from app.schemas.ingestion import EventIngestRequest
from app.services.normalization import normalize_event

router = APIRouter()
Repository = Annotated[InMemoryEventRepository, Depends(get_repository)]


@router.get("/events", response_model=list[SecurityEvent], tags=["Synthetic events"])
def get_events(repository: Repository) -> list[SecurityEvent]:
    """Return synthetic authentication examples; no real monitoring or detection."""
    return repository.list_events()


@router.post("/events/ingest", response_model=SecurityEvent, status_code=201, tags=["Synthetic events"])
def ingest_event(incoming: EventIngestRequest, repository: Repository) -> SecurityEvent:
    """Normalize and store one synthetic event for this server process."""
    event = normalize_event(incoming)
    try:
        return repository.add(event)
    except DuplicateEventError:
        raise HTTPException(status_code=409, detail="Event ID already exists") from None
