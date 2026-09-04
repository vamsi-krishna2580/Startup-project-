from typing import Dict, Any

class ScenarioAnalysisTool:
    """
    Three-Tier Financial Scenario Analysis Tool.
    Models Base, Optimistic, and Pessimistic cases for sensitivity testing.
    """
    name: str = "scenario_analysis"
    description: str = "Conducts sensitivity modeling across base, optimistic, and pessimistic risk horizons."

    @staticmethod
    def run_scenarios(
        base_arr_year2: float,
        base_monthly_burn: float,
        base_cac: float,
        base_break_even_months: int = 18
    ) -> Dict[str, Any]:
        return {
            "pessimistic": {
                "label": "Downside / Stress Test",
                "arr_year2": round(base_arr_year2 * 0.45, 2),
                "monthly_burn": round(base_monthly_burn * 1.35, 2),
                "cac": round(base_cac * 1.6, 2),
                "break_even_months": int(base_break_even_months * 1.8),
                "survival_strategy": "Pivot to organic acquisition, freeze headcount, cut non-essential cloud infrastructure."
            },
            "base": {
                "label": "Base Operating Plan",
                "arr_year2": round(base_arr_year2, 2),
                "monthly_burn": round(base_monthly_burn, 2),
                "cac": round(base_cac, 2),
                "break_even_months": base_break_even_months,
                "survival_strategy": "Execute targeted outbound sales, standard pilot conversion cycles."
            },
            "optimistic": {
                "label": "Upside / Accelerated Scaling",
                "arr_year2": round(base_arr_year2 * 1.8, 2),
                "monthly_burn": round(base_monthly_burn * 0.9, 2),
                "cac": round(base_cac * 0.7, 2),
                "break_even_months": max(6, int(base_break_even_months * 0.65)),
                "survival_strategy": "Reinvest gross profits aggressively into channel partnerships and engineering moats."
            }
        }
