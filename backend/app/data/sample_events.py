from datetime import datetime, timedelta, timezone
from uuid import NAMESPACE_URL, uuid5

from app.schemas.events import SecurityEvent


def get_sample_events() -> list[SecurityEvent]:
    """Return a fixed fictional timeline using RFC 5737 documentation IPs.

    Repeated failures illustrate a pattern, not a detection or real incident.
    Fixed IDs and timestamps keep examples reproducible across requests.
    """
    examples = [
        ("alex.morgan", "192.0.2.10", "success", "demo-vpn"),
        ("sam.chen", "198.51.100.24", "success", "demo-linux-01"),
        ("jordan.lee", "203.0.113.42", "failure", "demo-vpn"),
        ("jordan.lee", "203.0.113.42", "failure", "demo-vpn"),
        ("jordan.lee", "203.0.113.42", "failure", "demo-vpn"),
        ("jordan.lee", "203.0.113.42", "failure", "demo-vpn"),
        ("jordan.lee", "203.0.113.42", "failure", "demo-vpn"),
        ("taylor.reed", "192.0.2.55", "failure", "demo-workstation-01"),
        ("taylor.reed", "192.0.2.55", "success", "demo-workstation-01"),
        ("casey.patel", "198.51.100.80", "success", "demo-sso"),
        ("alex.morgan", "192.0.2.10", "success", "demo-sso"),
        ("sam.chen", "203.0.113.18", "failure", "demo-linux-01"),
    ]
    start = datetime(2026, 11, 22, 14, 0, tzinfo=timezone.utc)
    return [
        SecurityEvent(
            event_id=uuid5(NAMESPACE_URL, f"sentinelops/synthetic/auth/{index}"),
            timestamp=start + timedelta(seconds=index * 30),
            username=username,
            source_ip=source_ip,
            event_type="authentication",
            authentication_result=result,
            source_system=system,
            synthetic=True,
        )
        for index, (username, source_ip, result, system) in enumerate(examples)
    ]
