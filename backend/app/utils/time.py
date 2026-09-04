from datetime import datetime, timezone


def utc_now() -> datetime:
    """Return naive UTC for SQLite DateTime columns without deprecated utcnow()."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


def utc_now_iso() -> str:
    """Return an unambiguous ISO-8601 UTC timestamp."""
    return datetime.now(timezone.utc).isoformat()
