from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class AgentEventSchema(BaseModel):
    id: str
    investigation_id: str
    agent: str
    stage: int = Field(..., ge=1, le=5)
    event_type: str
    message: str
    timestamp: str
    status: str = Field(default="completed", description="started | running | completed | failed")
    tool_name: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
