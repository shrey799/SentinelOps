from collections import Counter
from collections.abc import Iterator
from ipaddress import ip_address, ip_network

import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError

from app.main import create_app
from app.repositories.events import InMemoryEventRepository
from app.schemas.events import SecurityEvent


@pytest.fixture
def client() -> Iterator[TestClient]:
    with TestClient(create_app()) as test_client:
        yield test_client


def test_health(client: TestClient) -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"application": "SentinelOps", "status": "ok", "version": "0.1.0"}


def test_events(client: TestClient) -> None:
    response = client.get("/api/events")
    assert response.status_code == 200
    events = response.json()
    assert 10 <= len(events) <= 15
    assert len({event["event_id"] for event in events}) == len(events)
    networks = [ip_network(cidr) for cidr in ("192.0.2.0/24", "198.51.100.0/24", "203.0.113.0/24")]
    for event in events:
        parsed = SecurityEvent.model_validate(event)
        assert parsed.timestamp.utcoffset() is not None
        assert parsed.synthetic is True
        assert any(ip_address(event["source_ip"]) in network for network in networks)
        assert set(event) == {"event_id", "timestamp", "username", "source_ip", "event_type", "authentication_result", "source_system", "synthetic"}
    assert {event["authentication_result"] for event in events} == {"success", "failure"}
    failures = Counter((event["username"], event["source_ip"]) for event in events if event["authentication_result"] == "failure")
    assert max(failures.values()) >= 5


@pytest.mark.parametrize("field,value", [
    ("event_id", "invalid"), ("timestamp", "2026-11-22T14:00:00"),
    ("source_ip", "999.1.1.1"), ("username", ""),
    ("authentication_result", "unknown"), ("event_type", "unknown"),
    ("source_system", ""), ("synthetic", False),
])
def test_invalid_event_rejected(client: TestClient, field: str, value: object) -> None:
    event = client.get("/api/events").json()[0]
    event[field] = value
    with pytest.raises(ValidationError):
        SecurityEvent.model_validate(event)


def test_missing_field_rejected(client: TestClient) -> None:
    event = client.get("/api/events").json()[0]
    del event["username"]
    with pytest.raises(ValidationError):
        SecurityEvent.model_validate(event)


@pytest.mark.parametrize("origin", ["http://localhost:5173", "http://127.0.0.1:5173"])
def test_allowed_cors(client: TestClient, origin: str) -> None:
    response = client.options("/api/events", headers={"Origin": origin, "Access-Control-Request-Method": "GET"})
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == origin


def test_other_origin_rejected(client: TestClient) -> None:
    response = client.options("/api/events", headers={"Origin": "https://example.com", "Access-Control-Request-Method": "GET"})
    assert response.status_code == 400
    assert "access-control-allow-origin" not in response.headers


def test_unknown_route(client: TestClient) -> None:
    assert client.get("/api/missing").status_code == 404


def test_unsupported_method(client: TestClient) -> None:
    assert client.post("/api/events").status_code == 405


def test_internal_error_is_safe(monkeypatch: pytest.MonkeyPatch) -> None:
    def broken_samples(self: InMemoryEventRepository) -> list[SecurityEvent]:
        raise RuntimeError("private internal detail")

    monkeypatch.setattr(InMemoryEventRepository, "list_events", broken_samples)
    with TestClient(create_app(), raise_server_exceptions=False) as client:
        response = client.get("/api/events")
    assert response.status_code == 500
    assert response.json() == {"detail": "Internal server error"}
