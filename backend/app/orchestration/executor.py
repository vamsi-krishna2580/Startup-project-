from typing import Dict, Any
from .state import InvestigationState
from .actions import ActionType, AgentAction
from ..agents.startup_analyst import StartupAnalystAgent
from ..agents.market_researcher import MarketResearcherAgent
from ..agents.contradiction_critic import ContradictionCriticAgent
from ..agents.business_strategist import BusinessStrategistAgent
from ..agents.financial_planner import FinancialPlannerAgent
from ..agents.investment_advisor import InvestmentAdvisorAgent
from ..agents.decision_synthesizer import DecisionSynthesizerAgent

class ActionExecutor:
    """
    Action Executor.
    Instantiates and dispatches planned investigation actions to their respective specialized agents.
    """
    def __init__(self):
        self.agents = {
            "startup_analyst": StartupAnalystAgent(),
            "market_researcher": MarketResearcherAgent(),
            "contradiction_critic": ContradictionCriticAgent(),
            "business_strategist": BusinessStrategistAgent(),
            "financial_planner": FinancialPlannerAgent(),
            "investment_advisor": InvestmentAdvisorAgent(),
            "decision_synthesizer": DecisionSynthesizerAgent()
        }

    async def execute(self, action: AgentAction, state: InvestigationState) -> Dict[str, Any]:
        agent_name = action.agent_name
        agent = self.agents.get(agent_name)

        if not agent:
            raise ValueError(f"Agent '{agent_name}' not registered in ActionExecutor.")

        # Update state current stage
        state.current_stage = action.stage

        # Execute agent
        output = await agent.execute(state)

        # Store in state
        state.agent_outputs[agent_name] = output
        state.completed_actions.append(action.action_type.value)

        return output
