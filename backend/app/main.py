import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes import events, health

logger = logging.getLogger(__name__)

app = FastAPI(
    title="SentinelOps",
    version="0.1.0",
    description="Educational Mini-SIEM API. All authentication events are synthetic.",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=[],
)
app.include_router(health.router, prefix="/api")
app.include_router(events.router, prefix="/api")


@app.exception_handler(Exception)
async def handle_unexpected_error(request: Request, exc: Exception) -> JSONResponse:
    """Keep internal exceptions and event details out of HTTP responses and logs."""
    logger.error("Unhandled backend error (%s)", type(exc).__name__)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})
