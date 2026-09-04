from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from .database import Base
from ..utils.time import utc_now

class ContradictionModel(Base):
    __tablename__ = "contradictions"

    id = Column(String(64), primary_key=True, index=True)
    investigation_id = Column(String(64), ForeignKey("investigations.id"), index=True, nullable=False)
    claim_a_id = Column(String(64), nullable=False)
    claim_b_id = Column(String(64), nullable=False)
    claim_a_text = Column(Text, nullable=False)
    claim_b_text = Column(Text, nullable=False)
    severity = Column(String(32), default="medium")  # low, medium, high, critical
    resolution = Column(Text, nullable=True)
    status = Column(String(32), default="open")  # open, resolved, accepted_risk
    created_at = Column(DateTime, default=utc_now)
