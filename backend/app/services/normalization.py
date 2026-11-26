from datetime import timezone
from typing import TYPE_CHECKING
from uuid import uuid4

from app.schemas.events import SecurityEvent

if TYPE_CHECKING:
    from app.schemas.ingestion import EventIngestRequest

RESULT_ALIASES = {
    "success": "success", "successful": "success", "succeeded": "success",
    "failure": "failure", "failed": "failure", "fail": "failure",
}


def normalize_result(value: object) -> str:
    """Map explicitly supported result strings; never guess unknown values."""
    if not isinstance(value, str) or len(value) > 32:
        raise ValueError("Unsupported authentication result")
    result = RESULT_ALIASES.get(value.strip().lower())
    if result is None:
        raise ValueError("Unsupported authentication result")
    return result


def normalize_event(incoming: "EventIngestRequest") -> SecurityEvent:
    """Produce the existing response schema with a server ID and UTC time."""
    return SecurityEvent(
        event_id=uuid4(),
        timestamp=incoming.timestamp.astimezone(timezone.utc),
        username=incoming.username,
        source_ip=incoming.source_ip,
        event_type=incoming.event_type,
        authentication_result=incoming.authentication_result,
        source_system=incoming.source_system,
        synthetic=True,
    )
