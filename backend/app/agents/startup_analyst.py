from typing import Dict, Any
from .base_agent import BaseAgent
from ..orchestration.state import InvestigationState
from ..services.llm_provider import LLMProvider
from ..tools.scoring import ScoringTool
from ..tools.claim_manager import ClaimManagerTool

class StartupAnalystAgent(BaseAgent):
    """
    Stage 1: Startup Analyst Agent.
    Deconstructs the founder's initial concept, isolates the problem space and proposed solution,
    extracts core claims, identifies vulnerability vectors, and computes initial opportunity score.
    """
    def __init__(self):
        super().__init__(
            name="startup_analyst",
            stage=1,
            description="Deconstructs core concept, problem, solution, innovation tier, and foundational opportunity score."
        )

    async def execute(self, state: InvestigationState) -> Dict[str, Any]:
        idea = state.startup_context.get("idea", "")
        industry = state.startup_context.get("industry") or "Technology"
        target_customer = state.startup_context.get("target_customer") or "Target segment"
        stage = state.startup_context.get("stage") or "Idea / MVP"

        state.record_event(
            agent=self.name,
            stage=self.stage,
            event_type="agent_started",
            message=f"Initiating concept deconstruction for startup in {industry}."
        )

        prompt = f"""
You are an expert venture capital Startup Analyst.
Analyze the following startup concept deeply and objectively:
Startup Idea: {idea}
Industry: {industry}
Target Customer: {target_customer}
Development Stage: {stage}

Provide a comprehensive, analytical deconstruction in JSON adhering strictly to this schema:
{{
  "summary": "Executive teardown of the concept and core value (2-3 sentences)",
  "problem": "Unpacking the problem statement, inefficiency, and friction points",
  "solution": "Proposed solution, technical delivery, and customer workflow",
  "innovation": "Innovation classification and technical novelty",
  "strengths": ["Key operational or strategic strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "weaknesses": ["Key vulnerability or operational bottleneck 1", "Weakness 2", "Weakness 3"],
  "risks": ["Strategic, competitive, or regulatory risk 1", "Risk 2", "Risk 3"],
  "suggestions": ["Actionable execution milestone 1", "Milestone 2", "Milestone 3", "Milestone 4"],
  "problem_severity_score": 8.0,
  "solution_innovation_score": 7.5,
  "market_tam_score": 7.0,
  "defensibility_moat_score": 6.5,
  "timing_catalyst_score": 8.0
}}
"""
        system_instruction = "You are an elite VC startup analyst. Be candid, analytical, rigorous, and grounded. Output JSON only."
        data = await LLMProvider.generate_json(prompt, system_instruction)

        # Deterministic scoring using scoring tool
        problem_sev = float(data.get("problem_severity_score", 7.5))
        sol_innov = float(data.get("solution_innovation_score", 7.0))
        tam_sc = float(data.get("market_tam_score", 7.0))
        moat_sc = float(data.get("defensibility_moat_score", 6.5))
        timing_sc = float(data.get("timing_catalyst_score", 7.5))

        score_res = ScoringTool.calculate_opportunity_score(
            problem_severity=problem_sev,
            solution_innovation=sol_innov,
            market_tam_score=tam_sc,
            defensibility_moat=moat_sc,
            timing_catalyst=timing_sc
        )

        opportunity_score = score_res["opportunity_score"]
        verdict = score_res["verdict"]

        # Register key claims in the investigation state
        state.add_claim(ClaimManagerTool.create_claim(
            investigation_id=state.investigation_id,
            text=f"Core Problem: {data.get('problem', '')[:160]}",
            category="concept",
            source_agent=self.name,
            confidence=0.85,
            status="proposed"
        ))

        state.add_claim(ClaimManagerTool.create_claim(
            investigation_id=state.investigation_id,
            text=f"Core Solution: {data.get('solution', '')[:160]}",
            category="concept",
            source_agent=self.name,
            confidence=0.80,
            status="proposed"
        ))

        result = {
            "summary": data.get("summary", ""),
            "problem": data.get("problem", ""),
            "solution": data.get("solution", ""),
            "innovation": data.get("innovation", ""),
            "strengths": data.get("strengths", []),
            "weaknesses": data.get("weaknesses", []),
            "risks": data.get("risks", []),
            "suggestions": data.get("suggestions", []),
            "opportunity_score": opportunity_score,
            "verdict": verdict
        }

        state.record_event(
            agent=self.name,
            stage=self.stage,
            event_type="agent_completed",
            message=f"Concept deconstruction finalized. Opportunity Score: {opportunity_score}/100.",
            tool_name="scoring",
            details={"opportunity_score": opportunity_score, "verdict": verdict}
        )

        return result
