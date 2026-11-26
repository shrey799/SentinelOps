from datetime import datetime, timezone
from typing import Literal

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, IPvAnyAddress, field_validator

from app.services.normalization import normalize_result


class EventIngestRequest(BaseModel):
    """One synthetic authentication event; callers cannot choose event IDs."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    timestamp: AwareDatetime
    username: str = Field(min_length=1, max_length=128)
    source_ip: IPvAnyAddress
    event_type: Literal["authentication"]
    authentication_result: Literal["success", "failure"]
    source_system: str = Field(min_length=1, max_length=128)
    synthetic: Literal[True] = True

    @field_validator("timestamp", mode="before")
    @classmethod
    def parse_timestamp(cls, value: object) -> datetime:
        """Require an ISO 8601 string with time; AwareDatetime checks timezone."""
        if not isinstance(value, str) or len(value) > 64:
            raise ValueError("Expected a timezone-aware ISO 8601 timestamp")
        value = value.strip()
        if "T" not in value:
            raise ValueError("Expected a timezone-aware ISO 8601 timestamp")
        return datetime.fromisoformat(value)

    @field_validator("timestamp")
    @classmethod
    def check_utc_range(cls, value: datetime) -> datetime:
        try:
            value.astimezone(timezone.utc)
        except (OverflowError, ValueError):
            raise ValueError("Timestamp is outside the supported UTC range") from None
        return value

    @field_validator("source_ip", mode="before")
    @classmethod
    def trim_ip(cls, value: object) -> str:
        if not isinstance(value, str) or len(value) > 64:
            raise ValueError("Expected an IP address string")
        return value.strip()

    @field_validator("event_type", mode="before")
    @classmethod
    def normalize_type(cls, value: object) -> str:
        if not isinstance(value, str) or len(value) > 32:
            raise ValueError("Unsupported event type")
        return value.strip().lower()

    @field_validator("authentication_result", mode="before")
    @classmethod
    def normalize_authentication_result(cls, value: object) -> str:
        return normalize_result(value)
