from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class EvidenceSchema(BaseModel):
    id: str
    investigation_id: str
    source: str
    source_type: str = Field(..., description="web_search | competitor_database | financial_model | benchmark_dataset | user_input")
    title: str
    content: str
    url: Optional[str] = None
    reliability: float = Field(default=0.8, ge=0.0, le=1.0)
    retrieved_at: str
    agent_id: str
    related_claim_ids: List[str] = Field(default_factory=list)

class ClaimSchema(BaseModel):
    id: str
    investigation_id: str
    text: str
    category: str = Field(..., description="concept | market | customer | business_model | unit_economics | competition | investment")
    confidence: float = Field(default=0.7, ge=0.0, le=1.0)
    status: str = Field(default="proposed", description="proposed | supported | weakly_supported | contradicted | rejected | assumption")
    evidence_ids: List[str] = Field(default_factory=list)
    source_agent: str
    created_at: str
    updated_at: str

class HypothesisSchema(BaseModel):
    id: str
    investigation_id: str
    hypothesis: str
    rationale: str
    confidence: float = Field(default=0.6, ge=0.0, le=1.0)
    related_claim_ids: List[str] = Field(default_factory=list)
    status: str = Field(default="pending", description="pending | validated | refuted | tested")
    validation_method: str

class ContradictionSchema(BaseModel):
    id: str
    investigation_id: str
    claim_a_id: str
    claim_b_id: str
    claim_a_text: str
    claim_b_text: str
    severity: str = Field(default="medium", description="low | medium | high | critical")
    resolution: Optional[str] = None
    status: str = Field(default="open", description="open | resolved | accepted_risk")

class ExperimentSchema(BaseModel):
    id: str
    investigation_id: str
    hypothesis_id: Optional[str] = None
    title: str
    description: str
    success_criteria: str
    expected_result: str
    status: str = Field(default="planned", description="planned | running | completed | inconclusive")

class DecisionSchema(BaseModel):
    id: str
    investigation_id: str
    decision: str
    rationale: str
    supporting_evidence_ids: List[str] = Field(default_factory=list)
    confidence: float = Field(default=0.8, ge=0.0, le=1.0)
    risks: List[str] = Field(default_factory=list)
    unresolved_questions: List[str] = Field(default_factory=list)
    created_at: str

class InvestigationStateResponse(BaseModel):
    investigation_id: str
    status: str
    startup_context: Dict[str, Any]
    claims_count: int
    evidence_count: int
    hypotheses_count: int
    contradictions_count: int
    experiments_count: int
    decisions_count: int
    events_count: int
    claims: List[ClaimSchema]
    evidence: List[EvidenceSchema]
    hypotheses: List[HypothesisSchema]
    contradictions: List[ContradictionSchema]
    experiments: List[ExperimentSchema]
    decisions: List[DecisionSchema]
