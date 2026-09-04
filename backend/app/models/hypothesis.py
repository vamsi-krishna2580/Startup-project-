from datetime import datetime
from sqlalchemy import Column, String, Text, Float, DateTime, JSON, ForeignKey
from .database import Base

class HypothesisModel(Base):
    __tablename__ = "hypotheses"

    id = Column(String(64), primary_key=True, index=True)
    investigation_id = Column(String(64), ForeignKey("investigations.id"), index=True, nullable=False)
    hypothesis = Column(Text, nullable=False)
    rationale = Column(Text, nullable=False)
    confidence = Column(Float, default=0.6)
    related_claim_ids = Column(JSON, default=list)
    status = Column(String(64), default="pending")  # pending, validated, refuted, tested
    validation_method = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
