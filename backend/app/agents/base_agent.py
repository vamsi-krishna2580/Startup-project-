from abc import ABC, abstractmethod
from typing import Dict, Any, List
from ..orchestration.state import InvestigationState
from ..tools.registry import tool_registry

class BaseAgent(ABC):
    """
    Abstract Base Agent.
    Enforces role-based tool restrictions, state reading, event recording, and structured outputs.
    """
    def __init__(self, name: str, stage: int, description: str):
        self.name = name
        self.stage = stage
        self.description = description

    @property
    def authorized_tools(self) -> List[str]:
        return tool_registry.get_authorized_tools(self.name)

    async def invoke_tool(self, tool_name: str, method_name: str, **kwargs) -> Dict[str, Any]:
        return await tool_registry.execute_tool(
            agent_name=self.name,
            tool_name=tool_name,
            method_name=method_name,
            **kwargs
        )

    @abstractmethod
    async def execute(self, state: InvestigationState) -> Dict[str, Any]:
        """
        Execute the agent's domain investigation against the shared InvestigationState.
        Returns a dictionary corresponding to its domain schema section.
        """
        pass
