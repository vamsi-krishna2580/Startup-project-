from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, JSON, ForeignKey
from .database import Base

class AgentEventModel(Base):
    __tablename__ = "agent_events"

    id = Column(String(64), primary_key=True, index=True)
    investigation_id = Column(String(64), ForeignKey("investigations.id"), index=True, nullable=False)
    agent = Column(String(64), nullable=False)
    stage = Column(Integer, nullable=False)
    event_type = Column(String(64), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(32), default="completed")
    tool_name = Column(String(64), nullable=True)
    details = Column(JSON, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
