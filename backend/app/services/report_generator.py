from typing import Dict, Any
from ..schemas.startup import StartupReport

class ReportGeneratorService:
    """
    Report Generator Service.
    Produces markdown briefs, executive summaries, and structured export payloads from StartupReport models.
    """

    @staticmethod
    def generate_markdown_summary(report: StartupReport) -> str:
        sa = report.startup_analysis
        mr = report.market_research
        bs = report.business_strategy
        fp = report.financial_plan
        ia = report.investment_report

        md = f"""# AI Startup Validation Report: {report.idea}

**Generated Date:** {report.created_at}  
**Opportunity Score:** {sa.opportunity_score}/100  
**Investment Readiness:** {ia.investment_readiness_score}/100 ({ia.recommended_funding_stage})  
**Analyst Verdict:** {sa.verdict}  

---

## 1. Concept Analysis
- **Summary:** {sa.summary}
- **Core Problem:** {sa.problem}
- **Proposed Solution:** {sa.solution}
- **Innovation Tier:** {sa.innovation}

## 2. Market Intelligence
- **Market Size (TAM/SAM/SOM):** {mr.market_size}
- **Demand Trajectory:** {mr.market_demand}
- **Target Customers:** {', '.join(mr.target_customers)}

## 3. Commercial Strategy
- **Business Model:** {bs.business_model}
- **Revenue Streams:** {bs.revenue_model}
- **Pricing Strategy:** {bs.pricing_strategy}
- **Defensible UVP:** {bs.unique_value_proposition}

## 4. Financial Feasibility
- **Startup Cost:** {fp.startup_cost_estimate}
- **Monthly Operating Burn:** {fp.operating_costs}
- **Funding Target:** {fp.funding_required}
- **Break-even Milestone:** {fp.break_even_estimate}

## 5. Investment Committee Recommendation
- **Verdict:** {ia.final_verdict}
- **Recommendation:** {ia.investor_recommendation}
- **Funding Fit:** {ia.recommended_funding_stage}
"""
        return md
