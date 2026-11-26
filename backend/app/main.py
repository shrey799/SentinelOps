import logging
from contextlib import asynccontextmanager
from collections.abc import AsyncIterator

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.data.sample_events import get_sample_events
from app.middleware import IngestBodyLimitMiddleware
from app.repositories.events import InMemoryEventRepository
from app.routes import events, health

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    # One repository per app lifetime, not a new dataset on every request.
    app.state.event_repository = InMemoryEventRepository(get_sample_events())
    yield


async def handle_invalid_request(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Do not echo submitted values, custom exception contexts, or JSON bodies."""
    fields = {"timestamp", "username", "source_ip", "event_type", "authentication_result", "source_system", "synthetic"}
    errors = []
    for error in exc.errors():
        field = next((part for part in error["loc"] if part in fields), "body")
        errors.append({"field": field, "message": "Missing, invalid, or unsupported value"})
    return JSONResponse(status_code=422, content={"detail": errors})


async def handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
    logger.error("Unhandled backend error (%s)", type(exc).__name__)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


def create_app() -> FastAPI:
    """Build independent app instances for isolated test storage."""
    app = FastAPI(
        title="SentinelOps",
        version="0.1.0",
        description="Educational Mini-SIEM API. All authentication events are synthetic.",
        lifespan=lifespan,
    )
    app.add_middleware(IngestBodyLimitMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_credentials=False,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
    )
    app.include_router(health.router, prefix="/api")
    app.include_router(events.router, prefix="/api")
    app.add_exception_handler(RequestValidationError, handle_invalid_request)
    app.add_exception_handler(Exception, handle_unexpected_error)
    return app


app = create_app()
