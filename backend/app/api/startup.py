from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any
from ..schemas.startup import StartupReport, AnalyzeStartupRequest
from ..orchestration.orchestrator import orchestrator
from ..services.llm_provider import LLMConfigurationError, LLMExecutionError
from ..services.persistence import PersistenceService

router = APIRouter(prefix="/api/startup", tags=["Startup Analysis"])

@router.post("/analyze", response_model=StartupReport, status_code=status.HTTP_200_OK)
async def analyze_startup(request: AnalyzeStartupRequest):
    """
    Main analysis endpoint conforming to the existing frontend API contract.
    Coordinates the multi-agent investigation workflow across 5 specialized roles.
    """
    if not request.idea or not request.idea.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Startup idea description cannot be empty."
        )

    try:
        report = await orchestrator.run_investigation(request)
        return report
    except LLMConfigurationError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "LLM_CONFIGURATION_ERROR",
                "message": str(e),
                "suggestion": "Configure GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY in backend/.env."
            }
        )
    except LLMExecutionError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={
                "error": "LLM_EXECUTION_ERROR",
                "message": str(e)
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "error": "INVESTIGATION_PIPELINE_ERROR",
                "message": f"An error occurred during multi-agent orchestration: {str(e)}"
            }
        )

@router.get("/{report_id}", response_model=StartupReport)
async def get_startup_report(report_id: str):
    """
    Fetches a previously completed startup validation report.
    """
    # If ID was stored with "rep-inv-..." or "inv-..."
    clean_id = report_id.replace("rep-", "")
    report = PersistenceService.get_investigation_report(clean_id)
    if not report:
        report = PersistenceService.get_investigation_report(report_id)

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID '{report_id}' not found in database."
        )
    return report

@router.post("/{report_id}/refine")
async def refine_startup_analysis(report_id: str, updates: Dict[str, Any]):
    """
    Refines an existing startup analysis with updated parameters or founder clarifications.
    """
    clean_id = report_id.replace("rep-", "")
    existing = PersistenceService.get_investigation_state(clean_id)
    if not existing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Investigation not found.")

    context = existing.get("startup_context", {})
    context.update(updates)

    req = AnalyzeStartupRequest(**context)
    new_report = await orchestrator.run_investigation(req)
    return new_report
