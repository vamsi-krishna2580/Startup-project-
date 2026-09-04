from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from ..services.persistence import PersistenceService
from ..services.llm_provider import LLMProvider

router = APIRouter(prefix="/api/chat", tags=["Founder Advisory Chat"])

class ChatMessageRequest(BaseModel):
    investigation_id: Optional[str] = None
    message: str
    target_agent: Optional[str] = "investment_committee"

class ChatMessageResponse(BaseModel):
    reply: str
    target_agent: str
    citations: list = []

@router.post("", response_model=ChatMessageResponse)
async def chat_with_advisor(req: ChatMessageRequest):
    """
    Interactive Q&A allowing founders to query the multi-agent committee about their startup analysis.
    """
    context_str = ""
    if req.investigation_id:
        clean_id = req.investigation_id.replace("rep-", "")
        report = PersistenceService.get_investigation_report(clean_id)
        if report:
            context_str = f"""
STARTUP REPORT CONTEXT:
Idea: {report.get('idea')}
Opportunity Score: {report.get('startup_analysis', {}).get('opportunity_score')}/100
Investment Readiness: {report.get('investment_report', {}).get('investment_readiness_score')}/100
Funding Stage: {report.get('investment_report', {}).get('recommended_funding_stage')}
TAM/SAM/SOM: {report.get('market_research', {}).get('market_size')}
Financials: {report.get('financial_plan', {}).get('funding_required')}
"""

    prompt = f"""
You are the VC Advisory Committee for this startup.
{context_str}

The founder asks:
"{req.message}"

Provide a direct, analytical, helpful, and venture-grounded answer in JSON:
{{
  "reply": "Your clear, actionable, advisory response (2-3 paragraphs)",
  "citations": ["Relevant aspect or metric cited"]
}}
"""
    system_instruction = "You are a pragmatic, supportive venture partner. Give clear, actionable advice. Output JSON only."
    data = await LLMProvider.generate_json(prompt, system_instruction)

    return ChatMessageResponse(
        reply=data.get("reply", "Understood. The committee advises focusing on beachhead validation first."),
        target_agent=req.target_agent or "investment_committee",
        citations=data.get("citations", [])
    )
