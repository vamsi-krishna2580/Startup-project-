from typing import Dict, Any
from .base_agent import BaseAgent
from ..orchestration.state import InvestigationState
from ..services.llm_provider import LLMProvider
from ..tools.scoring import ScoringTool
from ..tools.claim_manager import ClaimManagerTool

class InvestmentAdvisorAgent(BaseAgent):
    """
    Stage 5: Investment Advisor Agent.
    Evaluates venture readiness, formulates 4-quadrant SWOT analysis,
    computes institutional investment readiness score, recommends funding stage,
    and structures a 12-slide pitch deck blueprint.
    """
    def __init__(self):
        super().__init__(
            name="investment_advisor",
            stage=5,
            description="Evaluates venture investability, SWOT matrix, funding stage fit, and 12-slide investor pitch blueprint."
        )

    async def execute(self, state: InvestigationState) -> Dict[str, Any]:
        idea = state.startup_context.get("idea", "")
        industry = state.startup_context.get("industry") or "Technology"
        stage_pref = state.startup_context.get("stage") or "Pre-seed"

        state.record_event(
            agent=self.name,
            stage=self.stage,
            event_type="agent_started",
            message=f"Conducting investment committee review and readiness audit for {industry}."
        )

        prompt = f"""
You are an expert venture capital General Partner and Investment Committee Chair.
Conduct an investment evaluation for:
Startup Idea: {idea}
Industry: {industry}
Stated Stage: {stage_pref}

Provide an institutional investment report in JSON strictly matching this schema:
{{
  "executive_summary": "Comprehensive executive summary for venture investors (3-4 sentences)",
  "elevator_pitch": "High-impact, concise 30-second elevator pitch",
  "swot": {{
    "strengths": ["Institutional strength 1", "Strength 2", "Strength 3", "Strength 4"],
    "weaknesses": ["Vulnerability 1", "Weakness 2", "Weakness 3"],
    "opportunities": ["Growth opportunity 1", "Opportunity 2", "Opportunity 3"],
    "threats": ["Competitive or market threat 1", "Threat 2", "Threat 3"]
  }},
  "pitch_deck_outline": [
    "Problem: The critical industry pain point and cost of inaction",
    "Solution: Technical architecture and proprietary differentiation",
    "Market Size: TAM, SAM, and Beachhead expansion potential",
    "Product: Live platform walkthrough and high-conversion features",
    "Business Model: Pricing tiers, unit margins, and expansion mechanics",
    "Traction & Pilots: Validation metrics, pipeline, and early benchmarks",
    "Competitive Moat: Defensibility matrix and switching cost barriers",
    "Go-To-Market: Channel economics, customer acquisition, and partner network",
    "Financial Plan: 4-year projection model and break-even horizon",
    "The Team: Founder domain expertise and advisory pedigree",
    "The Ask: Capital requirement, milestone targets, and 18-month runway",
    "Vision: Long-term platform category dominance"
  ],
  "unit_economics_score": 8.0,
  "execution_feasibility_score": 7.5,
  "defensibility_moat_score": 7.0,
  "traction_evidence_score": 7.0,
  "market_tailwinds_score": 8.5
}}
"""
        system_instruction = "You are a seasoned venture capital GP. Provide a rigorous, institutional evaluation. Output JSON only."
        data = await LLMProvider.generate_json(prompt, system_instruction)

        # Deterministic scoring via ScoringTool
        ue_sc = float(data.get("unit_economics_score", 7.5))
        ef_sc = float(data.get("execution_feasibility_score", 7.0))
        dm_sc = float(data.get("defensibility_moat_score", 7.0))
        tr_sc = float(data.get("traction_evidence_score", 6.5))
        mt_sc = float(data.get("market_tailwinds_score", 8.0))

        readiness_res = ScoringTool.calculate_investment_readiness(
            unit_economics_score=ue_sc,
            execution_feasibility=ef_sc,
            defensibility_moat=dm_sc,
            traction_evidence=tr_sc,
            market_tailwinds=mt_sc
        )

        score = readiness_res["investment_readiness_score"]
        funding_stage = readiness_res["recommended_funding_stage"]
        recommendation = readiness_res["investor_recommendation"]
        final_verdict = readiness_res["final_verdict"]

        # Register investment claim
        state.add_claim(ClaimManagerTool.create_claim(
            investigation_id=state.investigation_id,
            text=f"Readiness Verdict: {final_verdict}",
            category="investment",
            source_agent=self.name,
            confidence=0.88,
            status="supported"
        ))

        swot_data = data.get("swot", {})
        result = {
            "executive_summary": data.get("executive_summary", ""),
            "elevator_pitch": data.get("elevator_pitch", ""),
            "swot": {
                "strengths": swot_data.get("strengths", []),
                "weaknesses": swot_data.get("weaknesses", []),
                "opportunities": swot_data.get("opportunities", []),
                "threats": swot_data.get("threats", [])
            },
            "investment_readiness_score": score,
            "recommended_funding_stage": funding_stage,
            "investor_recommendation": recommendation,
            "pitch_deck_outline": data.get("pitch_deck_outline", []),
            "final_verdict": final_verdict
        }

        state.record_event(
            agent=self.name,
            stage=self.stage,
            event_type="agent_completed",
            message=f"Investment report synthesized. Score: {score}/100 • Stage: {funding_stage}.",
            tool_name="scoring",
            details={"investment_readiness_score": score, "funding_stage": funding_stage}
        )

        return result
