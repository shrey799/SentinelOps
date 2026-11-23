from fastapi import APIRouter, Request

from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["Health"])
def get_health(request: Request) -> HealthResponse:
    return HealthResponse(application="SentinelOps", status="ok", version=request.app.version)
