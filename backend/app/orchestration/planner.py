from typing import List
from .state import InvestigationState
from .actions import ActionType, AgentAction

class InvestigationPlanner:
    """
    Dynamic Investigation Planner.
    Analyzes the current epistemic state (claims, evidence, contradictions, completed agent outputs)
    and decides the next logical investigation action.
    """

    @staticmethod
    def plan_ready_actions(state: InvestigationState) -> List[AgentAction]:
        """Return every action whose inputs are currently available.

        The five report-producing agents depend only on the founder context, so
        they can safely run together. Critique waits for those findings, and the
        final deterministic decision waits for the critique.
        """
        outputs = state.agent_outputs
        completed = state.completed_actions

        core_actions = [
            AgentAction(
                action_type=ActionType.ANALYZE_STARTUP_CONCEPT,
                agent_name="startup_analyst",
                stage=1,
                reasoning="Deconstruct the problem, value proposition, vulnerabilities, and opportunity score.",
            ),
            AgentAction(
                action_type=ActionType.RESEARCH_MARKET_LANDSCAPE,
                agent_name="market_researcher",
                stage=2,
                reasoning="Benchmark market size, competitors, customer segments, and demand trajectory.",
            ),
            AgentAction(
                action_type=ActionType.FORMULATE_BUSINESS_STRATEGY,
                agent_name="business_strategist",
                stage=3,
                reasoning="Design monetization, distribution, partnerships, and growth loops.",
            ),
            AgentAction(
                action_type=ActionType.MODEL_FINANCIAL_FEASIBILITY,
                agent_name="financial_planner",
                stage=4,
                reasoning="Model burn, break-even, runway capital, and four-year projections.",
            ),
            AgentAction(
                action_type=ActionType.SYNTHESIZE_INVESTMENT_REPORT,
                agent_name="investment_advisor",
                stage=5,
                reasoning="Evaluate readiness, SWOT, funding-stage fit, and pitch-deck structure.",
            ),
        ]
        ready_core = [
            action for action in core_actions
            if action.agent_name not in outputs and action.action_type.value not in completed
        ]
        if ready_core:
            return ready_core

        # Inspect the complete report findings for cross-domain contradictions.
        if "contradiction_critic" not in outputs and ActionType.CRITIQUE_CONTRADICTIONS.value not in completed:
            return [AgentAction(
                action_type=ActionType.CRITIQUE_CONTRADICTIONS,
                agent_name="contradiction_critic",
                stage=2,
                reasoning="Critical audit required: detect friction between founder assertions, competitor defensibility, and market realities."
            )]

        # Deterministic final decision uses all completed outputs.
        if "decision_synthesizer" not in outputs and ActionType.SYNTHESIZE_DECISION.value not in completed:
            return [AgentAction(
                action_type=ActionType.SYNTHESIZE_DECISION,
                agent_name="decision_synthesizer",
                stage=5,
                reasoning="Synthesize final investment committee verdict and resolve remaining open hypotheses."
            )]

        return [AgentAction(
            action_type=ActionType.FINALIZE_REPORT,
            agent_name="system_orchestrator",
            stage=5,
            reasoning="Investigation converged. Assemble verified findings into validated StartupReport payload."
        )]

    @classmethod
    def plan_next_action(cls, state: InvestigationState) -> AgentAction:
        """Backward-compatible single-action planner API."""
        return cls.plan_ready_actions(state)[0]
