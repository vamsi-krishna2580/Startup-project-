from typing import Dict, Any
from .base_agent import BaseAgent
from ..orchestration.state import InvestigationState
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

        analysis = state.agent_outputs.get("startup_analyst", {})
        market = state.agent_outputs.get("market_researcher", {})
        strategy = state.agent_outputs.get("business_strategist", {})
        financials = state.agent_outputs.get("financial_planner", {})
        opportunity_score = float(analysis.get("opportunity_score", 70))
        normalized_score = max(1.0, min(10.0, opportunity_score / 10.0))

        data = {
            "executive_summary": (
                f"{analysis.get('summary', idea)} The addressable market is assessed as "
                f"{market.get('market_size', 'requiring validation')}. The proposed "
                f"{strategy.get('business_model', 'business model')} targets {industry}, with "
                f"an estimated funding requirement of {financials.get('funding_required', 'to be confirmed')}."
            ),
            "elevator_pitch": (
                f"{idea} for {state.startup_context.get('target_customer') or 'a focused customer segment'}, "
                f"delivered through a {strategy.get('business_model', 'scalable')} model."
            ),
            "swot": {
                "strengths": analysis.get("strengths", [])[:4],
                "weaknesses": analysis.get("weaknesses", [])[:4],
                "opportunities": market.get("market_opportunities", [])[:4],
                "threats": (market.get("market_challenges", []) + analysis.get("risks", []))[:4],
            },
            "pitch_deck_outline": [
                "Problem: Customer pain and cost of inaction",
                "Solution: Product workflow and differentiation",
                "Market Size: TAM, SAM, SOM, and beachhead",
                "Product: Demo and measurable customer outcomes",
                "Business Model: Pricing, margins, and expansion",
                "Traction: Pilot evidence and conversion metrics",
                "Competition: Alternatives and defensible moat",
                "Go-To-Market: Acquisition channels and economics",
                "Financial Plan: Projections and break-even",
                "Team: Domain expertise and execution capability",
                "The Ask: Capital allocation and milestones",
                "Vision: Long-term category opportunity",
            ],
            "unit_economics_score": normalized_score,
            "execution_feasibility_score": max(1.0, normalized_score - 0.5),
            "defensibility_moat_score": max(1.0, normalized_score - 1.0),
            "traction_evidence_score": 7.0 if stage_pref.lower() not in {"idea", "pre-seed"} else 5.5,
            "market_tailwinds_score": normalized_score,
        }

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
