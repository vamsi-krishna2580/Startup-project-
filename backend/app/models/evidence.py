from sqlalchemy import Column, String, Text, Float, DateTime, JSON, ForeignKey
from .database import Base
from ..utils.time import utc_now

class EvidenceModel(Base):
    __tablename__ = "evidence"

    id = Column(String(64), primary_key=True, index=True)
    investigation_id = Column(String(64), ForeignKey("investigations.id"), index=True, nullable=False)
    source = Column(String(256), nullable=False)
    source_type = Column(String(64), nullable=False)  # web_search, competitor_database, financial_model, benchmark_dataset, user_input
    title = Column(String(512), nullable=False)
    content = Column(Text, nullable=False)
    url = Column(String(1024), nullable=True)
    reliability = Column(Float, default=0.8)
    retrieved_at = Column(DateTime, default=utc_now)
    agent_id = Column(String(64), nullable=False)
    related_claim_ids = Column(JSON, default=list)  # List of claim IDs
