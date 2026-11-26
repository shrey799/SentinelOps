import json
from collections.abc import Iterator
from pathlib import Path
from uuid import UUID

import pytest
from fastapi.testclient import TestClient

from app.main import create_app
from app.repositories.events import InMemoryEventRepository
from app.schemas.events import SecurityEvent


@pytest.fixture
def client() -> Iterator[TestClient]:
    with TestClient(create_app()) as test_client:
        yield test_client


@pytest.fixture
def payload() -> dict[str, object]:
    path = Path(__file__).parents[1] / "examples" / "authentication_event.json"
    return json.loads(path.read_text(encoding="utf-8"))


def test_ingestion_and_retrieval(client: TestClient, payload: dict[str, object]) -> None:
    assert len(client.get("/api/events").json()) == 12
    response = client.post("/api/events/ingest", json=payload)
    assert response.status_code == 201
    event = response.json()
    SecurityEvent.model_validate(event)
    assert UUID(event["event_id"]).version == 4
    assert event["timestamp"] == "2026-11-25T14:30:00Z"
    assert event["username"] == "Morgan.Example"
    assert event["source_ip"] == "192.0.2.88"
    assert event["event_type"] == "authentication"
    assert event["authentication_result"] == "failure"
    assert event["source_system"] == "demo-vpn"
    assert event["synthetic"] is True
    stored = client.get("/api/events").json()
    assert len(stored) == 13
    assert event in stored


@pytest.mark.parametrize("value,expected", [
    ("success", "success"), (" Successful ", "success"), ("SUCCEEDED", "success"),
    ("failure", "failure"), (" Failed ", "failure"), ("FAIL", "failure"),
])
def test_result_aliases(client: TestClient, payload: dict[str, object], value: str, expected: str) -> None:
    payload["authentication_result"] = value
    response = client.post("/api/events/ingest", json=payload)
    assert response.status_code == 201
    assert response.json()["authentication_result"] == expected


@pytest.mark.parametrize("value,expected", [
    ("2026-11-25T14:30:00Z", "2026-11-25T14:30:00Z"),
    ("2026-11-26T00:15:00+05:30", "2026-11-25T18:45:00Z"),
])
def test_utc_conversion(client: TestClient, payload: dict[str, object], value: str, expected: str) -> None:
    payload["timestamp"] = value
    response = client.post("/api/events/ingest", json=payload)
    assert response.status_code == 201
    assert response.json()["timestamp"] == expected


@pytest.mark.parametrize("field,value", [
    ("source_ip", "999.1.1.1"), ("source_ip", 123),
    ("timestamp", "invalid"), ("timestamp", "2026-11-25T14:30:00"),
    ("timestamp", 123456), ("timestamp", "2026-11-25"),
    ("timestamp", "0001-01-01T00:00:00+14:00"),
    ("authentication_result", "maybe"), ("authentication_result", True),
    ("event_type", "file_access"), ("username", "   "),
    ("username", "x" * 129), ("source_system", "x" * 129),
    ("synthetic", False), ("event_id", "caller-supplied"),
    ("password", "must-not-be-echoed"),
])
def test_invalid_inputs_do_not_store(client: TestClient, payload: dict[str, object], field: str, value: object) -> None:
    payload[field] = value
    response = client.post("/api/events/ingest", json=payload)
    assert response.status_code == 422
    assert "must-not-be-echoed" not in response.text
    assert len(client.get("/api/events").json()) == 12


@pytest.mark.parametrize("field", ["timestamp", "username", "source_ip", "event_type", "authentication_result", "source_system"])
def test_missing_fields(client: TestClient, payload: dict[str, object], field: str) -> None:
    del payload[field]
    assert client.post("/api/events/ingest", json=payload).status_code == 422


def test_generated_ids_are_unique(client: TestClient, payload: dict[str, object]) -> None:
    ids = [client.post("/api/events/ingest", json=payload).json()["event_id"] for _ in range(5)]
    assert len(set(ids)) == 5


def test_generated_id_collision_returns_409(client: TestClient, payload: dict[str, object], monkeypatch: pytest.MonkeyPatch) -> None:
    existing = UUID(client.get("/api/events").json()[0]["event_id"])
    monkeypatch.setattr("app.services.normalization.uuid4", lambda: existing)
    assert client.post("/api/events/ingest", json=payload).status_code == 409
    assert len(client.get("/api/events").json()) == 12


def test_malformed_json_safe(client: TestClient) -> None:
    response = client.post("/api/events/ingest", content='{"secret":"must-not-be-echoed",', headers={"Content-Type": "application/json"})
    assert response.status_code == 422
    assert "must-not-be-echoed" not in response.text


def test_body_limit(client: TestClient) -> None:
    response = client.post("/api/events/ingest", content=b"x" * 16385, headers={"Content-Type": "application/json"})
    assert response.status_code == 422
    assert "exceeds" in response.text


def test_streamed_body_limit(client: TestClient) -> None:
    chunks = (b"x" * 8192 for _ in range(3))
    response = client.post("/api/events/ingest", content=chunks, headers={"Content-Type": "application/json"})
    assert response.status_code == 422


def test_repository_isolation(payload: dict[str, object]) -> None:
    with TestClient(create_app()) as first:
        first.post("/api/events/ingest", json=payload)
        assert len(first.get("/api/events").json()) == 13
    with TestClient(create_app()) as second:
        assert len(second.get("/api/events").json()) == 12


def test_repository_snapshots(client: TestClient) -> None:
    repository: InMemoryEventRepository = client.app.state.event_repository
    snapshot = repository.list_events()
    snapshot[0].username = "changed"
    assert repository.list_events()[0].username != "changed"


def test_ingest_cors(client: TestClient) -> None:
    response = client.options("/api/events/ingest", headers={
        "Origin": "http://127.0.0.1:5173", "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type",
    })
    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://127.0.0.1:5173"
