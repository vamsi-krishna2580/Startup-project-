from typing import Optional
from .state import InvestigationState
from .actions import ActionType, AgentAction

class InvestigationPlanner:
    """
    Dynamic Investigation Planner.
    Analyzes the current epistemic state (claims, evidence, contradictions, completed agent outputs)
    and decides the next logical investigation action.
    """

    @staticmethod
    def plan_next_action(state: InvestigationState) -> AgentAction:
        outputs = state.agent_outputs
        completed = state.completed_actions

        # 1. Startup Concept Analysis
        if "startup_analyst" not in outputs and ActionType.ANALYZE_STARTUP_CONCEPT.value not in completed:
            return AgentAction(
                action_type=ActionType.ANALYZE_STARTUP_CONCEPT,
                agent_name="startup_analyst",
                stage=1,
                reasoning="Initial concept deconstruction required: dissect problem, value proposition, strengths, weaknesses, and opportunity score."
            )

        # 2. Market Research
        if "market_researcher" not in outputs and ActionType.RESEARCH_MARKET_LANDSCAPE.value not in completed:
            return AgentAction(
                action_type=ActionType.RESEARCH_MARKET_LANDSCAPE,
                agent_name="market_researcher",
                stage=2,
                reasoning="Market intelligence required: benchmark TAM/SAM/SOM, competitor moats, customer segments, and demand trajectory."
            )

        # 3. Contradiction Critique (Inspect claims between Concept & Market)
        if "contradiction_critic" not in outputs and ActionType.CRITIQUE_CONTRADICTIONS.value not in completed:
            return AgentAction(
                action_type=ActionType.CRITIQUE_CONTRADICTIONS,
                agent_name="contradiction_critic",
                stage=2,
                reasoning="Critical audit required: detect friction between founder assertions, competitor defensibility, and market realities."
            )

        # 4. Business Strategy Formulation
        if "business_strategist" not in outputs and ActionType.FORMULATE_BUSINESS_STRATEGY.value not in completed:
            return AgentAction(
                action_type=ActionType.FORMULATE_BUSINESS_STRATEGY,
                agent_name="business_strategist",
                stage=3,
                reasoning="Commercial architecture required: design 9-block canvas, revenue model, CAC channels, and defensible growth loops."
            )

        # 5. Financial Feasibility Modeling
        if "financial_planner" not in outputs and ActionType.MODEL_FINANCIAL_FEASIBILITY.value not in completed:
            return AgentAction(
                action_type=ActionType.MODEL_FINANCIAL_FEASIBILITY,
                agent_name="financial_planner",
                stage=4,
                reasoning="Financial modeling required: calculate burn rate, break-even unit milestones, runway capital, and 4-year projection trajectory."
            )

        # 6. Investment Advisory & Pitch Deck Blueprint
        if "investment_advisor" not in outputs and ActionType.SYNTHESIZE_INVESTMENT_REPORT.value not in completed:
            return AgentAction(
                action_type=ActionType.SYNTHESIZE_INVESTMENT_REPORT,
                agent_name="investment_advisor",
                stage=5,
                reasoning="Venture readiness evaluation required: compute investment score, recommended funding round, SWOT, and 12-slide pitch deck."
            )

        # 7. Decision Synthesis
        if "decision_synthesizer" not in outputs and ActionType.SYNTHESIZE_DECISION.value not in completed:
            return AgentAction(
                action_type=ActionType.SYNTHESIZE_DECISION,
                agent_name="decision_synthesizer",
                stage=5,
                reasoning="Synthesize final investment committee verdict and resolve remaining open hypotheses."
            )

        # 8. All investigation requirements met
        return AgentAction(
            action_type=ActionType.FINALIZE_REPORT,
            agent_name="system_orchestrator",
            stage=5,
            reasoning="Investigation converged. Assemble verified findings into validated StartupReport payload."
        )
