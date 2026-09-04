from typing import Dict, Any
from .base_agent import BaseAgent
from ..orchestration.state import InvestigationState
from ..services.llm_provider import LLMProvider
from ..tools.competitor_research import CompetitorResearchTool
from ..tools.claim_manager import ClaimManagerTool
from ..tools.evidence_store import EvidenceStoreTool

class MarketResearcherAgent(BaseAgent):
    """
    Stage 2: Market Researcher Agent.
    Evaluates TAM/SAM/SOM market sizing, industry catalysts, customer segments,
    pain points, and builds a defensibility benchmark against competitors.
    """
    def __init__(self):
        super().__init__(
            name="market_researcher",
            stage=2,
            description="Analyzes market sizing, competitive dynamics, customer segments, and sector tailwinds."
        )

    async def execute(self, state: InvestigationState) -> Dict[str, Any]:
        idea = state.startup_context.get("idea", "")
        industry = state.startup_context.get("industry") or "Technology"
        target_customer = state.startup_context.get("target_customer") or "Target segment"

        state.record_event(
            agent=self.name,
            stage=self.stage,
            event_type="agent_started",
            message=f"Benchmarking total addressable market and competitive dynamics for {industry}."
        )

        prompt = f"""
You are an expert venture capital Market Researcher.
Conduct rigorous market sizing, trend analysis, and competitor benchmarking for:
Startup Idea: {idea}
Industry: {industry}
Target Customer: {target_customer}

Output a comprehensive market research report in JSON strictly matching this schema:
{{
  "target_customers": ["Specific customer persona 1", "Persona 2", "Persona 3"],
  "customer_segments": ["Segment Tier A", "Segment Tier B", "Segment Tier C"],
  "market_size": "TAM: $XB globally; SAM: $YM serviceable addressable; SOM: $ZM early beachhead",
  "market_demand": "CAGR percentage, growth driver analysis, and adoption velocity",
  "industry_trends": ["Macro trend 1", "Technological tailwind 2", "Regulatory shift 3", "Trend 4"],
  "raw_competitors": [
    {{
      "name": "Competitor 1",
      "focus": "Core focus of this competitor",
      "advantage": "Key advantage / distribution strength",
      "disadvantage": "Critical vulnerability or customer complaint"
    }},
    {{
      "name": "Competitor 2",
      "focus": "Core focus of this competitor",
      "advantage": "Key advantage / distribution strength",
      "disadvantage": "Critical vulnerability or customer complaint"
    }},
    {{
      "name": "Competitor 3",
      "focus": "Core focus of this competitor",
      "advantage": "Key advantage / distribution strength",
      "disadvantage": "Critical vulnerability or customer complaint"
    }}
  ],
  "customer_pain_points": ["Critical customer friction 1", "Pain point 2", "Pain point 3", "Pain point 4"],
  "market_opportunities": ["High-margin opportunity 1", "Expansion vector 2", "Channel opportunity 3"],
  "market_challenges": ["Adoption obstacle 1", "Switching cost barrier 2", "Regulatory challenge 3"]
}}
"""
        system_instruction = "You are a senior venture research director. Provide grounded market sizing figures and realistic competitor benchmarks. Output JSON only."
        data = await LLMProvider.generate_json(prompt, system_instruction)

        # Normalize competitors using CompetitorResearchTool
        raw_comps = data.get("raw_competitors", [])
        normalized_comps = CompetitorResearchTool.normalize_competitors(raw_comps, industry=industry)

        # Record evidence in evidence store
        market_size_text = data.get("market_size", "")
        evi_item = EvidenceStoreTool.create_evidence_item(
            investigation_id=state.investigation_id,
            source=f"Sector Intelligence: {industry}",
            source_type="benchmark_dataset",
            title=f"Addressable Market & Demand Model ({industry})",
            content=f"Market Sizing: {market_size_text}. Demand Dynamics: {data.get('market_demand', '')}",
            agent_id=self.name,
            reliability=0.85
        )
        state.add_evidence(evi_item)

        # Register market claims
        state.add_claim(ClaimManagerTool.create_claim(
            investigation_id=state.investigation_id,
            text=f"Market Demand: {data.get('market_demand', '')[:160]}",
            category="market",
            source_agent=self.name,
            confidence=0.82,
            status="supported",
            evidence_ids=[evi_item["id"]]
        ))

        result = {
            "target_customers": data.get("target_customers", []),
            "customer_segments": data.get("customer_segments", []),
            "market_size": market_size_text,
            "market_demand": data.get("market_demand", ""),
            "industry_trends": data.get("industry_trends", []),
            "competitors": normalized_comps,
            "customer_pain_points": data.get("customer_pain_points", []),
            "market_opportunities": data.get("market_opportunities", []),
            "market_challenges": data.get("market_challenges", [])
        }

        state.record_event(
            agent=self.name,
            stage=self.stage,
            event_type="agent_completed",
            message=f"Market intelligence gathered. Sizing: {market_size_text.split(';')[0]}.",
            tool_name="competitor_research",
            details={"competitor_count": len(normalized_comps)}
        )

        return result
