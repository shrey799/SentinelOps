from typing import Literal

from pydantic import BaseModel


class HealthResponse(BaseModel):
    application: str
    status: Literal["ok"]
    version: str
