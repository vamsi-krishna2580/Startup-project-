import uuid
from typing import Dict, Any
from .base_agent import BaseAgent
from ..orchestration.state import InvestigationState
from ..services.llm_provider import LLMProvider

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
        claims = state.claims
        claims_text = "\n".join([f"- [{c.get('id')}] ({c.get('category')}): {c.get('text')}" for c in claims])

        state.record_event(
            agent=self.name,
            stage=self.stage,
            event_type="agent_started",
            message="Conducting contradiction critique across collected claims and market benchmarks."
        )

        prompt = f"""
You are an expert venture capital Contradiction Critic.
Audit the following startup claims and identify any potential contradictions, friction points, or over-optimistic assumptions:
Startup: {idea}

Claims Registered:
{claims_text if claims_text else "No formal claims cataloged yet."}

Identify 1 to 2 critical tensions or contradictions in JSON:
{{
  "contradictions": [
    {{
      "claim_a_summary": "Founder assumption or proposed benefit",
      "claim_b_summary": "Market reality, customer friction, or incumbent moat",
      "severity": "medium",
      "resolution": "Actionable strategic compromise or validation experiment"
    }}
  ],
  "criticism_summary": "High-level summary of dialectical friction and critical risks to de-risk."
}}
"""
        system_instruction = "You are a demanding investment committee critic. Look for hidden friction, switching costs, and capital intensity. Output JSON only."
        data = await LLMProvider.generate_json(prompt, system_instruction)

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
