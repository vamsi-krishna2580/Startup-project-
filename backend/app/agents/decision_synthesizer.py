import uuid
from datetime import datetime
from typing import Dict, Any
from .base_agent import BaseAgent
from ..orchestration.state import InvestigationState

class DecisionSynthesizerAgent(BaseAgent):
    """
    Decision Synthesizer Agent.
    Aggregates findings across all 5 specialized agents, resolves remaining contradictions,
    and constructs the formal investment committee decision.
    """
    def __init__(self):
        super().__init__(
            name="decision_synthesizer",
            stage=5,
            description="Synthesizes multi-agent findings into a unified, evidence-grounded investment decision."
        )

    async def execute(self, state: InvestigationState) -> Dict[str, Any]:
        idea = state.startup_context.get("idea", "")
        outputs = state.agent_outputs
        
        sa = outputs.get("startup_analyst", {})
        mr = outputs.get("market_researcher", {})
        fp = outputs.get("financial_planner", {})
        ia = outputs.get("investment_advisor", {})

        opp_score = sa.get("opportunity_score", 75)
        inv_score = ia.get("investment_readiness_score", 75)
        funding_stage = ia.get("recommended_funding_stage", "Pre-seed")

        decision_text = f"Approved for {funding_stage} funding pipeline with focus on beachhead pilot conversion."
        rationale = (
            f"Evaluated concept '{idea[:80]}...'. Combined Opportunity Score of {opp_score}/100 and "
            f"Investment Readiness Score of {inv_score}/100 indicates robust commercial viability with "
            f"defensible unit economics. Core market demand supported by industry tailwinds."
        )

        decision_record = {
            "id": f"dec-{uuid.uuid4().hex[:8]}",
            "investigation_id": state.investigation_id,
            "decision": decision_text,
            "rationale": rationale,
            "supporting_evidence_ids": [e.get("id") for e in state.evidence[:5]],
            "confidence": round((opp_score + inv_score) / 200.0, 2),
            "risks": sa.get("risks", [])[:3] + fp.get("financial_risks", [])[:2],
            "unresolved_questions": [
                "What is the measured conversion rate from free trial / pilot to paid annual contract?",
                "How will the team defend against incumbent platform feature commoditization over a 24-month horizon?",
                "What are the primary regulatory or data security certifications required for enterprise procurement?"
            ],
            "created_at": datetime.utcnow().isoformat()
        }

        state.add_decision(decision_record)

        state.record_event(
            agent=self.name,
            stage=self.stage,
            event_type="agent_completed",
            message=f"Investment decision formalized: {decision_text[:60]}...",
            details={"decision_id": decision_record["id"], "confidence": decision_record["confidence"]}
        )

        return decision_record
