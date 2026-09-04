from sqlalchemy import Column, String, Text, Float, DateTime, JSON, ForeignKey
from .database import Base
from ..utils.time import utc_now

class DecisionModel(Base):
    __tablename__ = "decisions"

    id = Column(String(64), primary_key=True, index=True)
    investigation_id = Column(String(64), ForeignKey("investigations.id"), index=True, nullable=False)
    decision = Column(Text, nullable=False)
    rationale = Column(Text, nullable=False)
    supporting_evidence_ids = Column(JSON, default=list)
    confidence = Column(Float, default=0.8)
    risks = Column(JSON, default=list)
    unresolved_questions = Column(JSON, default=list)
    created_at = Column(DateTime, default=utc_now)
