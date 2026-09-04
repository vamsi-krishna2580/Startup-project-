from sqlalchemy import Column, String, Text, DateTime, JSON
from .database import Base
from ..utils.time import utc_now

class InvestigationModel(Base):
    __tablename__ = "investigations"

    id = Column(String(64), primary_key=True, index=True)
    idea = Column(Text, nullable=False)
    status = Column(String(32), default="pending", index=True)  # pending, in_progress, completed, failed
    industry = Column(String(128), nullable=True)
    target_customer = Column(String(256), nullable=True)
    region = Column(String(128), nullable=True)
    stage = Column(String(64), nullable=True)
    budget = Column(String(64), nullable=True)
    
    # Serialized final report matching StartupReport schema
    final_report = Column(JSON, nullable=True)
    
    # Detailed orchestration state metadata
    orchestration_metadata = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
