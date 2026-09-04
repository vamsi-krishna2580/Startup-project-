from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from .database import Base
from ..utils.time import utc_now

class ExperimentModel(Base):
    __tablename__ = "experiments"

    id = Column(String(64), primary_key=True, index=True)
    investigation_id = Column(String(64), ForeignKey("investigations.id"), index=True, nullable=False)
    hypothesis_id = Column(String(64), nullable=True)
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=False)
    success_criteria = Column(Text, nullable=False)
    expected_result = Column(Text, nullable=False)
    status = Column(String(32), default="planned")  # planned, running, completed, inconclusive
    created_at = Column(DateTime, default=utc_now)
