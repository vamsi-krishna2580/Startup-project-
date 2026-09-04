from typing import Dict, Any, List, Optional
from .calculator import CalculatorTool
from .financial_calculator import FinancialCalculatorTool
from .scenario_analysis import ScenarioAnalysisTool
from .web_search import WebSearchTool
from .competitor_research import CompetitorResearchTool
from .evidence_store import EvidenceStoreTool
from .claim_manager import ClaimManagerTool
from .scoring import ScoringTool

class ToolRegistry:
    """
    Central Tool Registry with Role-Based Permission Enforcement.
    Enforces that each specialized agent only utilizes its authorized tool subset.
    """

    # Agent role permissions according to Phase 20 specifications
    AGENT_PERMISSIONS: Dict[str, List[str]] = {
        "startup_analyst": [
            "calculator",
            "scoring",
            "evidence_store",
            "claim_manager"
        ],
        "market_researcher": [
            "web_search",
            "competitor_research",
            "calculator",
            "evidence_store",
            "claim_manager"
        ],
        "business_strategist": [
            "calculator",
            "scoring",
            "evidence_store",
            "claim_manager"
        ],
        "financial_planner": [
            "calculator",
            "financial_calculator",
            "scenario_analysis",
            "evidence_store"
        ],
        "investment_advisor": [
            "scoring",
            "evidence_store",
            "claim_manager"
        ],
        "contradiction_critic": [
            "evidence_store",
            "claim_manager"
        ],
        "decision_synthesizer": [
            "scoring",
            "evidence_store",
            "claim_manager"
        ]
    }

    TOOLS = {
        "calculator": CalculatorTool,
        "financial_calculator": FinancialCalculatorTool,
        "scenario_analysis": ScenarioAnalysisTool,
        "web_search": WebSearchTool,
        "competitor_research": CompetitorResearchTool,
        "evidence_store": EvidenceStoreTool,
        "claim_manager": ClaimManagerTool,
        "scoring": ScoringTool
    }

    @classmethod
    def get_authorized_tools(cls, agent_name: str) -> List[str]:
        return cls.AGENT_PERMISSIONS.get(agent_name.lower(), [])

    @classmethod
    def is_authorized(cls, agent_name: str, tool_name: str) -> bool:
        allowed = cls.get_authorized_tools(agent_name)
        return tool_name in allowed

    @classmethod
    def list_all_tools(cls) -> List[Dict[str, str]]:
        return [
            {"name": name, "description": tool.description}
            for name, tool in cls.TOOLS.items()
        ]

    @classmethod
    async def execute_tool(
        cls,
        agent_name: str,
        tool_name: str,
        method_name: str,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Executes a registered tool method after verifying agent authorization.
        """
        if not cls.is_authorized(agent_name, tool_name):
            return {
                "success": False,
                "error": f"Agent '{agent_name}' is not authorized to invoke tool '{tool_name}'."
            }

        tool_cls = cls.TOOLS.get(tool_name)
        if not tool_cls:
            return {
                "success": False,
                "error": f"Tool '{tool_name}' not found in registry."
            }

        method = getattr(tool_cls, method_name, None)
        if not method:
            return {
                "success": False,
                "error": f"Method '{method_name}' not found on tool '{tool_name}'."
            }

        try:
            import inspect
            if inspect.iscoroutinefunction(method):
                result = await method(**kwargs)
            else:
                result = method(**kwargs)
            return {"success": True, "data": result}
        except Exception as e:
            return {"success": False, "error": str(e)}

tool_registry = ToolRegistry()
