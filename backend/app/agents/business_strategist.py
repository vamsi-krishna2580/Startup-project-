from typing import Dict, Any
from .base_agent import BaseAgent
from ..orchestration.state import InvestigationState
from ..services.llm_provider import LLMProvider
from ..tools.claim_manager import ClaimManagerTool

class BusinessStrategistAgent(BaseAgent):
    """
    Stage 3: Business Strategist Agent.
    Formulates commercial business architecture, revenue model, pricing mechanics,
    go-to-market channels, unit economics, and 9-block Business Model Canvas components.
    """
    def __init__(self):
        super().__init__(
            name="business_strategist",
            stage=3,
            description="Designs business architecture, monetization models, pricing, and distribution flywheels."
        )

    async def execute(self, state: InvestigationState) -> Dict[str, Any]:
        idea = state.startup_context.get("idea", "")
        industry = state.startup_context.get("industry") or "Technology"
        target_customer = state.startup_context.get("target_customer") or "Target segment"

        state.record_event(
            agent=self.name,
            stage=self.stage,
            event_type="agent_started",
            message="Architecting monetization tiers, go-to-market engine, and 9-block Canvas."
        )

        prompt = f"""
You are an expert venture capital Business Strategist.
Design an institutional commercial strategy for:
Startup Idea: {idea}
Industry: {industry}
Target Customer: {target_customer}

Output a comprehensive business strategy in JSON strictly matching this schema:
{{
  "business_model": "Core business archetype (e.g. B2B Vertical SaaS, Two-Sided Marketplace, Usage-Based API)",
  "revenue_model": "Detailed breakdown of recurring and expansion revenue streams",
  "pricing_strategy": "Pricing tiers, entry pilot threshold, and expansion metric",
  "unique_value_proposition": "Clear, differentiated value proposition statement",
  "go_to_market_strategy": "Phased go-to-market roadmap (Beachhead -> Expansion -> Enterprise)",
  "customer_acquisition": ["Channel 1 with CAC mechanic", "Channel 2 with CAC mechanic", "Channel 3"],
  "sales_channels": ["Direct sales channel 1", "Self-service/PLG channel 2", "Channel 3"],
  "partnerships": ["Strategic partner category 1", "Technology integration partner 2", "Channel reseller 3"],
  "growth_strategy": "Land-and-expand growth loop and retention dynamics",
  "key_partners": ["Ecosystem partner 1", "Partner 2", "Partner 3"],
  "key_activities": ["Core development activity 1", "Operational activity 2", "Go-to-market activity 3"],
  "key_resources": ["Proprietary IP/dataset 1", "Engineering infrastructure 2", "Leadership asset 3"],
  "customer_relationships": ["Customer success model 1", "Self-service loop 2", "Executive sponsor review 3"],
  "cost_structure": ["Primary cost driver 1", "Cost driver 2", "Cost driver 3"]
}}
"""
        system_instruction = "You are an elite corporate strategist. Design realistic, high-margin, defensible business models. Output JSON only."
        data = await LLMProvider.generate_json(prompt, system_instruction)

        # Register business model claims
        state.add_claim(ClaimManagerTool.create_claim(
            investigation_id=state.investigation_id,
            text=f"Monetization: {data.get('pricing_strategy', '')[:160]}",
            category="business_model",
            source_agent=self.name,
            confidence=0.84,
            status="proposed"
        ))

        state.record_event(
            agent=self.name,
            stage=self.stage,
            event_type="agent_completed",
            message=f"Business strategy established. Model: {data.get('business_model', '')[:50]}.",
            details={"business_model": data.get("business_model")}
        )

        return data
