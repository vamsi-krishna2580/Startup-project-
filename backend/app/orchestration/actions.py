from enum import Enum
from typing import Dict, Any, Optional

class ActionType(str, Enum):
    ANALYZE_STARTUP_CONCEPT = "analyze_startup_concept"
    RESEARCH_MARKET_LANDSCAPE = "research_market_landscape"
    CRITIQUE_CONTRADICTIONS = "critique_contradictions"
    FORMULATE_BUSINESS_STRATEGY = "formulate_business_strategy"
    MODEL_FINANCIAL_FEASIBILITY = "model_financial_feasibility"
    SYNTHESIZE_INVESTMENT_REPORT = "synthesize_investment_report"
    SYNTHESIZE_DECISION = "synthesize_decision"
    FINALIZE_REPORT = "finalize_report"

class AgentAction:
    def __init__(
        self,
        action_type: ActionType,
        agent_name: str,
        stage: int,
        reasoning: str,
        parameters: Optional[Dict[str, Any]] = None
    ):
        self.action_type = action_type
        self.agent_name = agent_name
        self.stage = stage
        self.reasoning = reasoning
        self.parameters = parameters or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "action_type": self.action_type.value,
            "agent_name": self.agent_name,
            "stage": self.stage,
            "reasoning": self.reasoning,
            "parameters": self.parameters
        }
