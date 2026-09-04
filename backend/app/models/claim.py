from sqlalchemy import Column, String, Text, Float, DateTime, JSON, ForeignKey
from .database import Base
from ..utils.time import utc_now

class ClaimModel(Base):
    __tablename__ = "claims"

    id = Column(String(64), primary_key=True, index=True)
    investigation_id = Column(String(64), ForeignKey("investigations.id"), index=True, nullable=False)
    text = Column(Text, nullable=False)
    category = Column(String(64), nullable=False)  # concept, market, customer, business_model, unit_economics, competition, investment
    confidence = Column(Float, default=0.7)
    status = Column(String(64), default="proposed")  # proposed, supported, weakly_supported, contradicted, rejected, assumption
    evidence_ids = Column(JSON, default=list)  # List of related evidence IDs
    source_agent = Column(String(64), nullable=False)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)
