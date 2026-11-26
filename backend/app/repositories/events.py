from collections.abc import Iterable
from threading import Lock
from uuid import UUID

from fastapi import Request

from app.schemas.events import SecurityEvent


class DuplicateEventError(Exception):
    """An event with this ID is already stored."""


class InMemoryEventRepository:
    def __init__(self, events: Iterable[SecurityEvent] = ()) -> None:
        self._events: dict[UUID, SecurityEvent] = {}
        self._lock = Lock()
        for event in events:
            self.add(event)

    def list_events(self) -> list[SecurityEvent]:
        """Return a snapshot so callers cannot mutate stored records."""
        with self._lock:
            return [event.model_copy(deep=True) for event in self._events.values()]

    def add(self, event: SecurityEvent) -> SecurityEvent:
        """Check IDs and insert atomically across request threads."""
        with self._lock:
            if event.event_id in self._events:
                raise DuplicateEventError()
            self._events[event.event_id] = event.model_copy(deep=True)
            return event.model_copy(deep=True)


def get_repository(request: Request) -> InMemoryEventRepository:
    return request.app.state.event_repository
