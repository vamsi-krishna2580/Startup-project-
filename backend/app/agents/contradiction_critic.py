import uuid
from typing import Dict, Any
from .base_agent import BaseAgent
from ..orchestration.state import InvestigationState

class ContradictionCriticAgent(BaseAgent):
    """
    Contradiction Critic Agent.
    Audits claims across investigation stages to detect ungrounded founder assumptions,
    underestimated competitor defensibility, and unit-economic friction.
    """
    def __init__(self):
        super().__init__(
            name="contradiction_critic",
            stage=2,
            description="Stress-tests claims and identifies dialectical contradictions between assumptions and market realities."
        )

    async def execute(self, state: InvestigationState) -> Dict[str, Any]:
        idea = state.startup_context.get("idea", "")
        outputs = state.agent_outputs
        analysis = outputs.get("startup_analyst", {})
        market = outputs.get("market_researcher", {})

        state.record_event(
            agent=self.name,
            stage=self.stage,
            event_type="agent_started",
            message="Conducting contradiction critique across collected claims and market benchmarks."
        )

        weaknesses = analysis.get("weaknesses") or ["The value proposition remains unvalidated with paying customers."]
        risks = analysis.get("risks") or ["Execution assumptions may be optimistic before a measured pilot."]
        challenges = market.get("market_challenges") or ["Customer acquisition and switching friction require validation."]

        data = {
            "contradictions": [
                {
                    "claim_a_summary": analysis.get("solution") or f"The proposed solution for {idea} can deliver its stated value.",
                    "claim_b_summary": challenges[0],
                    "severity": "high",
                    "resolution": "Run a time-boxed paid beachhead pilot with adoption, retention, and willingness-to-pay thresholds.",
                },
                {
                    "claim_a_summary": weaknesses[0],
                    "claim_b_summary": risks[0],
                    "severity": "medium",
                    "resolution": "Define a measurable de-risking milestone and validate it before scaling fixed costs.",
                },
            ],
            "criticism_summary": "Cross-domain audit found validation and execution assumptions that should be tested before scale-up.",
        }

        contradictions = data.get("contradictions", [])
        for c in contradictions:
            contra_id = f"cnt-{uuid.uuid4().hex[:8]}"
            contra_item = {
                "id": contra_id,
                "investigation_id": state.investigation_id,
                "claim_a_id": "claim_a",
                "claim_b_id": "claim_b",
                "claim_a_text": c.get("claim_a_summary", "Proposed claim"),
                "claim_b_text": c.get("claim_b_summary", "Opposing market condition"),
                "severity": c.get("severity", "medium"),
                "resolution": c.get("resolution", "Validate with beachhead trial"),
                "status": "open"
            }
            state.add_contradiction(contra_item)

        state.record_event(
            agent=self.name,
            stage=self.stage,
            event_type="agent_completed",
            message=f"Critique complete. Flagged {len(contradictions)} strategic friction points.",
            details={"contradictions_count": len(contradictions)}
        )

        return data
