from fastapi import APIRouter, HTTPException, status
from typing import List, Dict, Any
from ..schemas.investigation import InvestigationStateResponse
from ..services.persistence import PersistenceService
from ..models.database import SessionLocal
from ..models.investigation import InvestigationModel
from ..models.claim import ClaimModel
from ..models.evidence import EvidenceModel
from ..models.contradiction import ContradictionModel
from ..models.agent_event import AgentEventModel

router = APIRouter(prefix="/api/investigations", tags=["Investigations State"])

@router.get("", response_model=List[Dict[str, Any]])
async def list_investigations():
    """
    Lists all persisted startup investigations with status and date.
    """
    db = SessionLocal()
    try:
        items = db.query(InvestigationModel).order_by(InvestigationModel.created_at.desc()).limit(50).all()
        return [
            {
                "id": inv.id,
                "idea": inv.idea,
                "industry": inv.industry,
                "status": inv.status,
                "created_at": inv.created_at.isoformat() if inv.created_at else None,
                "has_report": bool(inv.final_report)
            }
            for inv in items
        ]
    finally:
        db.close()

@router.get("/{investigation_id}", response_model=Dict[str, Any])
@router.get("/{investigation_id}/state", response_model=Dict[str, Any])
async def get_investigation_state(investigation_id: str):
    """
    Returns the complete structured epistemic state of an investigation.
    """
    clean_id = investigation_id.replace("rep-", "")
    state_data = PersistenceService.get_investigation_state(clean_id)
    if not state_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Investigation '{investigation_id}' not found."
        )
    return state_data

@router.get("/{investigation_id}/claims", response_model=List[Dict[str, Any]])
async def get_investigation_claims(investigation_id: str):
    clean_id = investigation_id.replace("rep-", "")
    db = SessionLocal()
    try:
        claims = db.query(ClaimModel).filter(ClaimModel.investigation_id == clean_id).all()
        return [
            {
                "id": c.id,
                "text": c.text,
                "category": c.category,
                "confidence": c.confidence,
                "status": c.status,
                "evidence_ids": c.evidence_ids or [],
                "source_agent": c.source_agent,
                "created_at": c.created_at.isoformat() if c.created_at else None
            }
            for c in claims
        ]
    finally:
        db.close()

@router.get("/{investigation_id}/evidence", response_model=List[Dict[str, Any]])
async def get_investigation_evidence(investigation_id: str):
    clean_id = investigation_id.replace("rep-", "")
    db = SessionLocal()
    try:
        evidence = db.query(EvidenceModel).filter(EvidenceModel.investigation_id == clean_id).all()
        return [
            {
                "id": e.id,
                "source": e.source,
                "source_type": e.source_type,
                "title": e.title,
                "content": e.content,
                "url": e.url,
                "reliability": e.reliability,
                "agent_id": e.agent_id,
                "retrieved_at": e.retrieved_at.isoformat() if e.retrieved_at else None
            }
            for e in evidence
        ]
    finally:
        db.close()

@router.get("/{investigation_id}/contradictions", response_model=List[Dict[str, Any]])
async def get_investigation_contradictions(investigation_id: str):
    clean_id = investigation_id.replace("rep-", "")
    db = SessionLocal()
    try:
        contras = db.query(ContradictionModel).filter(ContradictionModel.investigation_id == clean_id).all()
        return [
            {
                "id": cnt.id,
                "claim_a_text": cnt.claim_a_text,
                "claim_b_text": cnt.claim_b_text,
                "severity": cnt.severity,
                "resolution": cnt.resolution,
                "status": cnt.status
            }
            for cnt in contras
        ]
    finally:
        db.close()

@router.get("/{investigation_id}/events", response_model=List[Dict[str, Any]])
async def get_investigation_events(investigation_id: str):
    clean_id = investigation_id.replace("rep-", "")
    db = SessionLocal()
    try:
        events = db.query(AgentEventModel).filter(AgentEventModel.investigation_id == clean_id).order_by(AgentEventModel.timestamp.asc()).all()
        return [
            {
                "id": evt.id,
                "agent": evt.agent,
                "stage": evt.stage,
                "event_type": evt.event_type,
                "message": evt.message,
                "status": evt.status,
                "tool_name": evt.tool_name,
                "timestamp": evt.timestamp.isoformat() if evt.timestamp else None,
                "details": evt.details
            }
            for evt in events
        ]
    finally:
        db.close()
