import asyncio
import uuid
from typing import Dict, Any, Optional, Callable
from .state import InvestigationState
from .actions import ActionType
from .planner import InvestigationPlanner
from .executor import ActionExecutor
from ..schemas.startup import StartupReport, AnalyzeStartupRequest
from ..services.persistence import PersistenceService
from ..services.fallback_analysis import FallbackAnalysisService
from ..services.llm_provider import LLMConfigurationError, LLMExecutionError
from ..utils.time import utc_now_iso

class MultiAgentOrchestrator:
    """
    Multi-Agent Dynamic Orchestrator.
    Executes the dynamic state-driven loop:
    STATE -> PLANNER -> ACTION -> EXECUTOR -> OBSERVATION -> STATE UPDATE -> VERIFICATION
    """
    def __init__(self):
        self.planner = InvestigationPlanner()
        self.executor = ActionExecutor()

    async def run_investigation(
        self,
        request: AnalyzeStartupRequest,
        event_callback: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> StartupReport:
        investigation_id = f"inv-{uuid.uuid4().hex[:12]}"
        
        context = {
            "idea": request.idea,
            "industry": request.industry or "Technology / SaaS",
            "target_customer": request.target_customer or "Early adopters and growth enterprises",
            "region": request.region or "North America / Global",
            "stage": request.stage or "Idea / MVP Stage",
            "budget": request.budget or "$50,000 - $150,000"
        }

        state = InvestigationState(investigation_id=investigation_id, startup_context=context)
        state.status = "in_progress"

        # Record initiation event
        init_evt = state.record_event(
            agent="system_orchestrator",
            stage=1,
            event_type="investigation_started",
            message=f"Investigation {investigation_id} started for: {request.idea[:60]}..."
        )
        if event_callback:
            event_callback(init_evt)

        # Dynamic Agentic Loop
        while state.iteration < state.max_iterations:
            state.iteration += 1

            # Planner selects all actions that are safe to execute concurrently.
            actions = self.planner.plan_ready_actions(state)

            if actions[0].action_type == ActionType.FINALIZE_REPORT:
                state.record_event(
                    agent="system_orchestrator",
                    stage=5,
                    event_type="investigation_converged",
                    message="All domain requirements fulfilled. Synthesizing final investment package."
                )
                break

            for action in actions:
                state.record_event(
                    agent=action.agent_name,
                    stage=action.stage,
                    event_type="action_dispatched",
                    message=f"Dispatching action: {action.action_type.value}. Rationale: {action.reasoning}",
                    details={"reasoning": action.reasoning},
                )

            results = await asyncio.gather(
                *(self.executor.execute(action, state) for action in actions),
                return_exceptions=True,
            )
            for action, result in zip(actions, results):
                if isinstance(result, BaseException):
                    state.record_event(
                        agent=action.agent_name,
                        stage=action.stage,
                        event_type="action_failed",
                        message=f"Action execution error: {result}",
                        status="failed",
                    )
                    if isinstance(result, (LLMConfigurationError, LLMExecutionError)):
                        fallback = FallbackAnalysisService.build(action.agent_name, state.startup_context)
                        state.agent_outputs[action.agent_name] = fallback
                        state.completed_actions.append(action.action_type.value)
                        state.fallback_agents.append(action.agent_name)
                        state.record_event(
                            agent=action.agent_name,
                            stage=action.stage,
                            event_type="provider_fallback",
                            message="External model unavailable; completed this stage with the deterministic baseline engine.",
                            status="completed",
                            details={"provider_error": str(result)},
                        )
                        continue
                    raise result

        # Compile final StartupReport strictly matching frontend interface
        outputs = state.agent_outputs
        final_report_data = {
            "id": f"rep-{investigation_id}",
            "idea": request.idea,
            "created_at": utc_now_iso(),
            "startup_analysis": outputs.get("startup_analyst"),
            "market_research": outputs.get("market_researcher"),
            "business_strategy": outputs.get("business_strategist"),
            "financial_plan": outputs.get("financial_planner"),
            "investment_report": outputs.get("investment_advisor"),
            "source": "api-fallback" if state.fallback_agents else "api",
            "optional_inputs": {
                "industry": request.industry,
                "target_customer": request.target_customer,
                "region": request.region,
                "stage": request.stage,
                "budget": request.budget
            }
        }

        report = StartupReport(**final_report_data)
        state.status = "completed"

        # Persist final state and report in SQLite
        PersistenceService.save_investigation_state(state, final_report=report.model_dump())

        return report

orchestrator = MultiAgentOrchestrator()
