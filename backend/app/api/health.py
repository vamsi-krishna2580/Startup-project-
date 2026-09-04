from fastapi import APIRouter
from ..config import settings
from ..tools.registry import tool_registry

router = APIRouter(tags=["Health"])

@router.get("/health")
@router.get("/api/health")
async def health_check():
    """
    Health check endpoint verifying API service status and configured components.
    """
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "llm_provider": settings.LLM_PROVIDER,
        "llm_model": settings.LLM_MODEL,
        "llm_configured": bool(
            settings.GEMINI_API_KEY if settings.LLM_PROVIDER == "gemini"
            else settings.OPENAI_API_KEY if settings.LLM_PROVIDER in ("openai", "openai-compatible")
            else settings.ANTHROPIC_API_KEY if settings.LLM_PROVIDER == "anthropic"
            else True
        ),
        "search_configured": bool(settings.SEARCH_API_KEY),
        "database": settings.DATABASE_URL.split(":///")[0],
        "registered_tools": [t["name"] for t in tool_registry.list_all_tools()]
    }
