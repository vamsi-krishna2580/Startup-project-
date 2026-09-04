from typing import Dict, Any, List

class FinancialCalculatorTool:
    """
    Deterministic Financial Feasibility & Unit Economics Engine.
    Executes precise arithmetic for break-even, runway, burn rate, and 4-year projections.
    """
    name: str = "financial_calculator"
    description: str = "Calculates unit economics, gross margins, break-even milestones, runway, and capitalization requirements."

    @staticmethod
    def calculate_unit_economics(
        price_per_unit: float,
        variable_cost_per_unit: float,
        customer_acquisition_cost: float = 0.0
    ) -> Dict[str, Any]:
        contribution_margin = price_per_unit - variable_cost_per_unit
        margin_pct = (contribution_margin / price_per_unit * 100.0) if price_per_unit > 0 else 0.0
        net_contribution = contribution_margin - customer_acquisition_cost
        
        return {
            "price_per_unit": price_per_unit,
            "variable_cost_per_unit": variable_cost_per_unit,
            "contribution_margin": round(contribution_margin, 2),
            "contribution_margin_pct": round(margin_pct, 1),
            "customer_acquisition_cost": customer_acquisition_cost,
            "net_unit_profit": round(net_contribution, 2),
            "viable": contribution_margin > 0
        }

    @staticmethod
    def calculate_break_even(
        monthly_fixed_costs: float,
        price_per_unit: float,
        variable_cost_per_unit: float
    ) -> Dict[str, Any]:
        contribution_margin = price_per_unit - variable_cost_per_unit
        if contribution_margin <= 0:
            return {
                "success": False,
                "error": "Negative or zero contribution margin. Break-even impossible without price adjustment or cost reduction."
            }

        units_per_month = monthly_fixed_costs / contribution_margin
        revenue_per_month = units_per_month * price_per_unit

        return {
            "success": True,
            "monthly_fixed_costs": monthly_fixed_costs,
            "units_needed_monthly": round(units_per_month, 1),
            "revenue_needed_monthly": round(revenue_per_month, 2),
            "annual_revenue_run_rate": round(revenue_per_month * 12, 2)
        }

    @staticmethod
    def calculate_runway_and_funding(
        monthly_burn_rate: float,
        target_runway_months: int = 18,
        mvp_capex_cost: float = 50000.0,
        contingency_pct: float = 15.0
    ) -> Dict[str, Any]:
        operational_capital = monthly_burn_rate * target_runway_months
        subtotal = operational_capital + mvp_capex_cost
        contingency_buffer = subtotal * (contingency_pct / 100.0)
        total_recommended_funding = subtotal + contingency_buffer

        return {
            "monthly_burn_rate": monthly_burn_rate,
            "target_runway_months": target_runway_months,
            "operational_runway_capital": round(operational_capital, 2),
            "mvp_capex_cost": round(mvp_capex_cost, 2),
            "contingency_buffer": round(contingency_buffer, 2),
            "total_recommended_funding": round(total_recommended_funding, 2),
            "formatted_funding": f"${total_recommended_funding:,.0f}"
        }

    @staticmethod
    def generate_projections(
        year_1_revenue: float,
        year_1_costs: float,
        annual_growth_rate: float = 2.5,
        cost_scale_factor: float = 1.6
    ) -> List[Dict[str, Any]]:
        """
        Generates standard 4-year timeline projection model matching frontend FinancialChart schema.
        """
        projections = []
        current_rev = year_1_revenue
        current_cost = year_1_costs

        for i in range(1, 5):
            year_name = f"Year {i}"
            gross_profit = current_rev - current_cost
            projections.append({
                "year": year_name,
                "revenue": round(current_rev, 2),
                "costs": round(current_cost, 2),
                "gross_profit": round(gross_profit, 2)
            })
            current_rev = current_rev * annual_growth_rate
            current_cost = current_cost * cost_scale_factor

        return projections
