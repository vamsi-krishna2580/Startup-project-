from typing import List, Dict, Any, Optional
from ..utils.time import utc_now_iso

class InvestigationState:
    """
    Central investigation state container.
    Maintains all accumulated claims, evidence, hypotheses, contradictions, experiments,
    events, and stage outputs across the dynamic multi-agent lifecycle.
    """
    def __init__(self, investigation_id: str, startup_context: Dict[str, Any]):
        self.investigation_id = investigation_id
        self.startup_context = startup_context
        self.status: str = "initialized"
        self.current_stage: int = 1
        
        # Core structured entities
        self.claims: List[Dict[str, Any]] = []
        self.evidence: List[Dict[str, Any]] = []
        self.hypotheses: List[Dict[str, Any]] = []
        self.contradictions: List[Dict[str, Any]] = []
        self.experiments: List[Dict[str, Any]] = []
        self.decisions: List[Dict[str, Any]] = []
        self.events: List[Dict[str, Any]] = []
        
        # Structured agent outputs
        self.agent_outputs: Dict[str, Any] = {}
        
        # Cycle tracking
        self.iteration: int = 0
        self.max_iterations: int = 12
        self.completed_actions: List[str] = []

    def record_event(
        self,
        agent: str,
        stage: int,
        event_type: str,
        message: str,
        tool_name: Optional[str] = None,
        status: str = "completed",
        details: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        evt = {
            "id": f"evt-{self.investigation_id}-{len(self.events) + 1}",
            "investigation_id": self.investigation_id,
            "agent": agent,
            "stage": stage,
            "event_type": event_type,
            "message": message,
            "timestamp": utc_now_iso(),
            "status": status,
            "tool_name": tool_name,
            "details": details or {}
        }
        self.events.append(evt)
        return evt

    def add_claim(self, claim: Dict[str, Any]) -> None:
        self.claims.append(claim)

    def add_evidence(self, evidence_item: Dict[str, Any]) -> None:
        self.evidence.append(evidence_item)

    def add_hypothesis(self, hypothesis: Dict[str, Any]) -> None:
        self.hypotheses.append(hypothesis)

    def add_contradiction(self, contradiction: Dict[str, Any]) -> None:
        self.contradictions.append(contradiction)

    def add_experiment(self, experiment: Dict[str, Any]) -> None:
        self.experiments.append(experiment)

    def add_decision(self, decision: Dict[str, Any]) -> None:
        self.decisions.append(decision)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "investigation_id": self.investigation_id,
            "status": self.status,
            "current_stage": self.current_stage,
            "startup_context": self.startup_context,
            "claims_count": len(self.claims),
            "evidence_count": len(self.evidence),
            "hypotheses_count": len(self.hypotheses),
            "contradictions_count": len(self.contradictions),
            "experiments_count": len(self.experiments),
            "decisions_count": len(self.decisions),
            "events_count": len(self.events),
            "claims": self.claims,
            "evidence": self.evidence,
            "hypotheses": self.hypotheses,
            "contradictions": self.contradictions,
            "experiments": self.experiments,
            "decisions": self.decisions
        }
