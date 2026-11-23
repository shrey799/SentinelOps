from typing import Literal
from uuid import UUID

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, IPvAnyAddress


class SecurityEvent(BaseModel):
    """Authentication event contract, reusable for future normalized logs."""

    model_config = ConfigDict(extra="forbid")

    event_id: UUID
    timestamp: AwareDatetime
    username: str = Field(min_length=1, max_length=128)
    source_ip: IPvAnyAddress
    event_type: Literal["authentication"]
    authentication_result: Literal["success", "failure"]
    source_system: str = Field(min_length=1, max_length=128)
    synthetic: Literal[True]
