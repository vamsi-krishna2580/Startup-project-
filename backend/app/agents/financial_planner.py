from typing import Dict, Any
from .base_agent import BaseAgent
from ..orchestration.state import InvestigationState
from ..services.llm_provider import LLMProvider
from ..tools.financial_calculator import FinancialCalculatorTool
from ..tools.scenario_analysis import ScenarioAnalysisTool
from ..tools.claim_manager import ClaimManagerTool
from ..tools.evidence_store import EvidenceStoreTool

class FinancialPlannerAgent(BaseAgent):
    """
    Stage 4: Financial Planner Agent.
    Constructs deterministic financial models: runway, burn rate, break-even timelines,
    capital utilization, and 4-year timeline projections.
    """
    def __init__(self):
        super().__init__(
            name="financial_planner",
            stage=4,
            description="Models financial feasibility, burn rate, break-even unit mechanics, and 4-year pro forma projections."
        )

    async def execute(self, state: InvestigationState) -> Dict[str, Any]:
        idea = state.startup_context.get("idea", "")
        industry = state.startup_context.get("industry") or "Technology"
        budget = state.startup_context.get("budget") or "$100,000"

        state.record_event(
            agent=self.name,
            stage=self.stage,
            event_type="agent_started",
            message=f"Synthesizing financial projections and capital requirements for {industry}."
        )

        prompt = f"""
You are an expert venture capital CFO and Financial Analyst.
Synthesize realistic startup financial figures and parameters for:
Startup Idea: {idea}
Industry: {industry}
Initial Available Budget: {budget}

Provide realistic benchmark estimates in JSON strictly matching this schema:
{{
  "startup_cost_estimate": "$75,000 - $120,000 (Initial engineering, compliance, pilot infrastructure)",
  "operating_costs": "$18,000 - $28,000 / month (Cloud, core team, tools, acquisition)",
  "revenue_projection": "Year 1: $120k ARR; Year 2: $550k ARR; Year 3: $1.8M ARR",
  "break_even_estimate": "16 - 20 months from commercial pilot launch",
  "funding_required": "$350,000 - $500,000 (Targeting 18-month seed runway)",
  "funding_utilization": "55% Product Engineering & AI pipeline, 25% Go-To-Market & Sales, 15% Ops/Compliance, 5% Reserve",
  "financial_risks": [
    "Extended enterprise pilot conversion cycles delaying cash collections",
    "High compute infrastructure costs scaling faster than subscription tiers",
    "Customer acquisition cost inflation across paid distribution channels"
  ],
  "profitability_potential": "High operating leverage with 75%+ software gross margins at scale",
  "model_parameters": {{
    "year_1_revenue": 140000,
    "year_1_costs": 290000,
    "annual_growth_rate": 2.6,
    "cost_scale_factor": 1.65,
    "base_monthly_burn": 24000
  }}
}}
"""
        system_instruction = "You are a seasoned CFO. Use realistic unit economics, software margins, and conservative burn rate estimates. Output JSON only."
        data = await LLMProvider.generate_json(prompt, system_instruction)

        params = data.get("model_parameters", {})
        y1_rev = float(params.get("year_1_revenue", 120000))
        y1_costs = float(params.get("year_1_costs", 280000))
        growth_rate = float(params.get("annual_growth_rate", 2.5))
        cost_scale = float(params.get("cost_scale_factor", 1.6))

        # Deterministic 4-year projection generation
        projections = FinancialCalculatorTool.generate_projections(
            year_1_revenue=y1_rev,
            year_1_costs=y1_costs,
            annual_growth_rate=growth_rate,
            cost_scale_factor=cost_scale
        )

        # Scenario sensitivity analysis
        base_burn = float(params.get("base_monthly_burn", 25000))
        scenarios = ScenarioAnalysisTool.run_scenarios(
            base_arr_year2=projections[1]["revenue"],
            base_monthly_burn=base_burn,
            base_cac=1200.0,
            base_break_even_months=18
        )

        # Register financial evidence
        evi_item = EvidenceStoreTool.create_evidence_item(
            investigation_id=state.investigation_id,
            source="Financial Engine Model",
            source_type="financial_model",
            title="4-Year Financial Projections & Break-Even Curve",
            content=f"Startup Cost: {data.get('startup_cost_estimate')}. Funding Target: {data.get('funding_required')}. Break-even: {data.get('break_even_estimate')}",
            agent_id=self.name,
            reliability=0.88
        )
        state.add_evidence(evi_item)

        # Register financial claim
        state.add_claim(ClaimManagerTool.create_claim(
            investigation_id=state.investigation_id,
            text=f"Capital Requirement: {data.get('funding_required', '')[:160]}",
            category="unit_economics",
            source_agent=self.name,
            confidence=0.86,
            status="supported",
            evidence_ids=[evi_item["id"]]
        ))

        result = {
            "startup_cost_estimate": data.get("startup_cost_estimate", "$80,000 - $120,000"),
            "operating_costs": data.get("operating_costs", "$20,000 - $30,000 / month"),
            "revenue_projection": data.get("revenue_projection", "Year 1: $120k; Year 2: $500k; Year 3: $1.8M"),
            "break_even_estimate": data.get("break_even_estimate", "16 - 20 months"),
            "funding_required": data.get("funding_required", "$350,000 - $500,000"),
            "funding_utilization": data.get("funding_utilization", "50% Engineering, 30% GTM, 20% Ops"),
            "financial_risks": data.get("financial_risks", []),
            "profitability_potential": data.get("profitability_potential", "Strong margin potential"),
            "timeline_projections": projections
        }

        state.record_event(
            agent=self.name,
            stage=self.stage,
            event_type="agent_completed",
            message=f"Financial model computed. Runway capital: {data.get('funding_required', '').split('(')[0]}.",
            tool_name="financial_calculator",
            details={"projections_years": len(projections)}
        )

        return result
