from typing import Dict, Any

class ScoringTool:
    """
    Deterministic Multi-Factor Scoring Engine.
    Computes rigorous 0-100 scores and funding stage classifications based on weighted rubric components.
    """
    name: str = "scoring"
    description: str = "Computes opportunity score, investment readiness score, and recommended funding stage."

    @staticmethod
    def calculate_opportunity_score(
        problem_severity: float,       # 1-10
        solution_innovation: float,    # 1-10
        market_tam_score: float,       # 1-10
        defensibility_moat: float,     # 1-10
        timing_catalyst: float         # 1-10
    ) -> Dict[str, Any]:
        # Weighted formula:
        # Problem Severity (25%) + Solution Innovation (25%) + Market TAM (20%) + Defensibility (15%) + Timing (15%)
        raw = (
            (problem_severity * 2.5) +
            (solution_innovation * 2.5) +
            (market_tam_score * 2.0) +
            (defensibility_moat * 1.5) +
            (timing_catalyst * 1.5)
        )
        score = max(0, min(100, int(round(raw))))

        if score >= 80:
            verdict = "High Opportunity • Strong Product-Market Resonance"
        elif score >= 65:
            verdict = "Moderate-to-High Opportunity • Clear Niche Viability"
        elif score >= 50:
            verdict = "Moderate Opportunity • Requires Refined Customer Positioning"
        else:
            verdict = "Challenged Opportunity • High Market Friction & Defensibility Risks"

        return {
            "opportunity_score": score,
            "verdict": verdict,
            "breakdown": {
                "problem_severity": problem_severity,
                "solution_innovation": solution_innovation,
                "market_tam_score": market_tam_score,
                "defensibility_moat": defensibility_moat,
                "timing_catalyst": timing_catalyst
            }
        }

    @staticmethod
    def calculate_investment_readiness(
        unit_economics_score: float,   # 1-10
        execution_feasibility: float,  # 1-10
        defensibility_moat: float,     # 1-10
        traction_evidence: float,      # 1-10
        market_tailwinds: float        # 1-10
    ) -> Dict[str, Any]:
        # Weighted formula:
        # Unit Economics (25%) + Defensibility Moat (20%) + Execution Feasibility (20%) + Traction (20%) + Tailwinds (15%)
        raw = (
            (unit_economics_score * 2.5) +
            (defensibility_moat * 2.0) +
            (execution_feasibility * 2.0) +
            (traction_evidence * 2.0) +
            (market_tailwinds * 1.5)
        )
        score = max(0, min(100, int(round(raw))))

        if score >= 80:
            stage = "Seed"
            rec = "Institutional syndicates and early-stage venture funds are recommended. Unit economics and defensibility demonstrate venture scale."
            verdict = "Approved for Investment Committee • High Conviction"
        elif score >= 65:
            stage = "Pre-seed"
            rec = "Angel syndicates, accelerators, and strategic founder-operator networks are optimal to de-risk customer onboarding."
            verdict = "Conditionally Investable • Requires Pilot Validation"
        elif score >= 50:
            stage = "Pre-seed"
            rec = "Grant funding, incubator programs, or founder bootstrapping recommended prior to formal venture equity raises."
            verdict = "Early Research Tier • Defensibility Gaps Present"
        else:
            stage = "Not investment ready"
            rec = "Venture capital not recommended in current state. Validate core customer willingness to pay and lower initial capex."
            verdict = "High Capital Risk • Strategic Pivot Recommended"

        return {
            "investment_readiness_score": score,
            "recommended_funding_stage": stage,
            "investor_recommendation": rec,
            "final_verdict": verdict
        }
