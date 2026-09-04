from typing import Any, Dict


class FallbackAnalysisService:
    """Build schema-valid baseline findings when an external LLM is unavailable."""

    @staticmethod
    def build(agent_name: str, context: Dict[str, Any]) -> Dict[str, Any]:
        idea = context.get("idea") or "The proposed startup"
        industry = context.get("industry") or "Technology / SaaS"
        customer = context.get("target_customer") or "early adopter businesses"
        budget = context.get("budget") or "$50,000 - $150,000"

        builders = {
            "startup_analyst": lambda: {
                "summary": f"{idea} addresses a plausible workflow problem for {customer}. The opportunity is promising but requires paid-pilot validation before aggressive scaling.",
                "problem": f"Customers in {industry} face fragmented workflows, avoidable manual effort, and limited decision visibility.",
                "solution": f"A focused product that applies automation and decision support to the stated workflow for {customer}.",
                "innovation": "Vertical workflow automation with domain-specific data and feedback loops.",
                "strengths": ["Focused customer problem", "Measurable operational ROI", "Recurring usage potential"],
                "weaknesses": ["Customer willingness to pay is not yet proven", "Data quality and integrations may slow onboarding"],
                "risks": ["Incumbents may add similar features", "Long pilot cycles may delay revenue"],
                "suggestions": ["Run three paid design-partner pilots", "Measure time saved and retention", "Validate one repeatable acquisition channel"],
                "opportunity_score": 68,
                "verdict": "Moderate-to-High Opportunity • Validate with Paid Pilots",
            },
            "market_researcher": lambda: {
                "target_customers": [customer, "Operational team leaders", "Digitally progressive small and mid-sized businesses"],
                "customer_segments": ["Design partners", "Early adopters", "Mainstream SMB buyers"],
                "market_size": "TAM/SAM/SOM require source-backed primary research; use a bottom-up customer-count × annual-contract-value model.",
                "market_demand": f"Demand in {industry} is supported by automation adoption, but purchase intent must be validated directly.",
                "industry_trends": ["AI-assisted workflows", "Demand for measurable ROI", "API-driven software integration"],
                "competitors": [{
                    "name": "Existing workflow platforms",
                    "focus": "Broad horizontal tooling",
                    "advantage": "Installed customer base and integrations",
                    "disadvantage": "Limited depth for the proposed vertical workflow",
                }],
                "customer_pain_points": ["Manual repetitive work", "Fragmented tools", "Slow decisions", "Limited reporting"],
                "market_opportunities": ["Vertical specialization", "Integration-led distribution", "Usage-based expansion"],
                "market_challenges": ["Switching costs", "Trust and data security", "Proving ROI during pilots"],
            },
            "business_strategist": lambda: {
                "business_model": "B2B vertical SaaS with a paid pilot entry motion",
                "revenue_model": "Recurring subscriptions plus onboarding and premium integration fees",
                "pricing_strategy": "Start with a fixed-fee pilot, then tier by locations, users, or workflow volume",
                "unique_value_proposition": f"Help {customer} complete a critical workflow faster, with fewer errors and clearer decisions.",
                "go_to_market_strategy": "Recruit design partners, convert measured pilots to annual contracts, then expand through referrals and channel partners",
                "customer_acquisition": ["Founder-led outbound", "Industry communities", "Integration partnerships"],
                "sales_channels": ["Direct consultative sales", "Partner referrals", "Product-led trial after onboarding is simplified"],
                "partnerships": ["Domain associations", "Data providers", "Adjacent software platforms"],
                "growth_strategy": "Win one narrow beachhead, document repeatable ROI, and expand into adjacent workflows",
                "key_partners": ["Integration partners", "Industry advisors"],
                "key_activities": ["Product development", "Customer onboarding", "Outcome measurement"],
                "key_resources": ["Domain workflows", "Customer feedback", "Integration layer"],
                "customer_relationships": ["High-touch pilots", "Quarterly value reviews"],
                "cost_structure": ["Engineering", "Cloud services", "Customer acquisition"],
            },
            "financial_planner": lambda: {
                "startup_cost_estimate": f"Plan initial scope within the available capital of {budget}",
                "operating_costs": "Track team, cloud, sales, compliance, and integration costs monthly",
                "revenue_projection": "Base case: pilot revenue in Year 1, repeatable annual contracts in Year 2, channel expansion in Year 3",
                "break_even_estimate": "Target 18-24 months, subject to pilot conversion and gross-margin validation",
                "funding_required": budget,
                "funding_utilization": "55% product, 25% go-to-market, 15% operations/compliance, 5% reserve",
                "financial_risks": ["Long sales cycles", "Integration costs", "Cloud usage growing faster than revenue"],
                "profitability_potential": "Attractive if recurring gross margin exceeds 70% and acquisition payback stays below 12 months",
                "timeline_projections": [
                    {"year": "Year 1", "revenue": 120000, "costs": 280000, "gross_profit": -160000},
                    {"year": "Year 2", "revenue": 420000, "costs": 480000, "gross_profit": -60000},
                    {"year": "Year 3", "revenue": 1050000, "costs": 760000, "gross_profit": 290000},
                    {"year": "Year 4", "revenue": 2200000, "costs": 1250000, "gross_profit": 950000},
                ],
            },
        }

        try:
            return builders[agent_name]()
        except KeyError as exc:
            raise ValueError(f"No fallback is defined for agent '{agent_name}'.") from exc
