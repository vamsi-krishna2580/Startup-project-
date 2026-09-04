import logging
from datetime import datetime
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from ..models.database import SessionLocal
from ..models.investigation import InvestigationModel
from ..models.evidence import EvidenceModel
from ..models.claim import ClaimModel
from ..models.hypothesis import HypothesisModel
from ..models.contradiction import ContradictionModel
from ..models.experiment import ExperimentModel
from ..models.decision import DecisionModel
from ..models.agent_event import AgentEventModel
from ..orchestration.state import InvestigationState

class PersistenceService:
    """
    Persistence Service.
    Syncs the live multi-agent InvestigationState and generated reports into SQLite.
    """

    @classmethod
    def save_investigation_state(
        cls,
        state: InvestigationState,
        final_report: Optional[Dict[str, Any]] = None
    ) -> None:
        db: Session = SessionLocal()
        try:
            # 1. Update or create Investigation
            inv = db.query(InvestigationModel).filter(InvestigationModel.id == state.investigation_id).first()
            if not inv:
                inv = InvestigationModel(
                    id=state.investigation_id,
                    idea=state.startup_context.get("idea", ""),
                    status=state.status,
                    industry=state.startup_context.get("industry"),
                    target_customer=state.startup_context.get("target_customer"),
                    region=state.startup_context.get("region"),
                    stage=state.startup_context.get("stage"),
                    budget=state.startup_context.get("budget"),
                    final_report=final_report,
                    orchestration_metadata={"iteration": state.iteration, "current_stage": state.current_stage}
                )
                db.add(inv)
            else:
                inv.status = state.status
                inv.final_report = final_report or inv.final_report
                inv.orchestration_metadata = {"iteration": state.iteration, "current_stage": state.current_stage}

            db.commit()

            # 2. Sync Evidence
            for evi in state.evidence:
                existing = db.query(EvidenceModel).filter(EvidenceModel.id == evi["id"]).first()
                if not existing:
                    db.add(EvidenceModel(
                        id=evi["id"],
                        investigation_id=state.investigation_id,
                        source=evi.get("source", ""),
                        source_type=evi.get("source_type", "benchmark"),
                        title=evi.get("title", ""),
                        content=evi.get("content", ""),
                        url=evi.get("url"),
                        reliability=evi.get("reliability", 0.8),
                        agent_id=evi.get("agent_id", "system"),
                        related_claim_ids=evi.get("related_claim_ids", [])
                    ))

            # 3. Sync Claims
            for clm in state.claims:
                existing = db.query(ClaimModel).filter(ClaimModel.id == clm["id"]).first()
                if not existing:
                    db.add(ClaimModel(
                        id=clm["id"],
                        investigation_id=state.investigation_id,
                        text=clm.get("text", ""),
                        category=clm.get("category", "concept"),
                        confidence=clm.get("confidence", 0.7),
                        status=clm.get("status", "proposed"),
                        evidence_ids=clm.get("evidence_ids", []),
                        source_agent=clm.get("source_agent", "system")
                    ))
                else:
                    existing.confidence = clm.get("confidence", existing.confidence)
                    existing.status = clm.get("status", existing.status)
                    existing.evidence_ids = clm.get("evidence_ids", existing.evidence_ids)

            # 4. Sync Contradictions
            for cnt in state.contradictions:
                existing = db.query(ContradictionModel).filter(ContradictionModel.id == cnt["id"]).first()
                if not existing:
                    db.add(ContradictionModel(
                        id=cnt["id"],
                        investigation_id=state.investigation_id,
                        claim_a_id=cnt.get("claim_a_id", ""),
                        claim_b_id=cnt.get("claim_b_id", ""),
                        claim_a_text=cnt.get("claim_a_text", ""),
                        claim_b_text=cnt.get("claim_b_text", ""),
                        severity=cnt.get("severity", "medium"),
                        resolution=cnt.get("resolution"),
                        status=cnt.get("status", "open")
                    ))

            # 5. Sync Decisions
            for dec in state.decisions:
                existing = db.query(DecisionModel).filter(DecisionModel.id == dec["id"]).first()
                if not existing:
                    db.add(DecisionModel(
                        id=dec["id"],
                        investigation_id=state.investigation_id,
                        decision=dec.get("decision", ""),
                        rationale=dec.get("rationale", ""),
                        supporting_evidence_ids=dec.get("supporting_evidence_ids", []),
                        confidence=dec.get("confidence", 0.8),
                        risks=dec.get("risks", []),
                        unresolved_questions=dec.get("unresolved_questions", [])
                    ))

            # 6. Sync Agent Events
            for evt in state.events:
                existing = db.query(AgentEventModel).filter(AgentEventModel.id == evt["id"]).first()
                if not existing:
                    db.add(AgentEventModel(
                        id=evt["id"],
                        investigation_id=state.investigation_id,
                        agent=evt.get("agent", "system"),
                        stage=evt.get("stage", 1),
                        event_type=evt.get("event_type", "info"),
                        message=evt.get("message", ""),
                        status=evt.get("status", "completed"),
                        tool_name=evt.get("tool_name"),
                        details=evt.get("details")
                    ))

            db.commit()
        except Exception:
            db.rollback()
            logging.getLogger(__name__).exception("Failed to persist investigation state")
            raise
        finally:
            db.close()

    @classmethod
    def get_investigation_report(cls, investigation_id: str) -> Optional[Dict[str, Any]]:
        db: Session = SessionLocal()
        try:
            inv = db.query(InvestigationModel).filter(InvestigationModel.id == investigation_id).first()
            if inv and inv.final_report:
                return inv.final_report
            return None
        finally:
            db.close()

    @classmethod
    def get_investigation_state(cls, investigation_id: str) -> Optional[Dict[str, Any]]:
        db: Session = SessionLocal()
        try:
            inv = db.query(InvestigationModel).filter(InvestigationModel.id == investigation_id).first()
            if not inv:
                return None

            claims = db.query(ClaimModel).filter(ClaimModel.investigation_id == investigation_id).all()
            evidence = db.query(EvidenceModel).filter(EvidenceModel.investigation_id == investigation_id).all()
            hypotheses = db.query(HypothesisModel).filter(HypothesisModel.investigation_id == investigation_id).all()
            contradictions = db.query(ContradictionModel).filter(ContradictionModel.investigation_id == investigation_id).all()
            experiments = db.query(ExperimentModel).filter(ExperimentModel.investigation_id == investigation_id).all()
            decisions = db.query(DecisionModel).filter(DecisionModel.investigation_id == investigation_id).all()

            return {
                "investigation_id": inv.id,
                "status": inv.status,
                "startup_context": {
                    "idea": inv.idea,
                    "industry": inv.industry,
                    "target_customer": inv.target_customer,
                    "region": inv.region,
                    "stage": inv.stage,
                    "budget": inv.budget
                },
                "claims_count": len(claims),
                "evidence_count": len(evidence),
                "hypotheses_count": len(hypotheses),
                "contradictions_count": len(contradictions),
                "experiments_count": len(experiments),
                "decisions_count": len(decisions),
                "claims": [{
                    "id": c.id, "text": c.text, "category": c.category,
                    "confidence": c.confidence, "status": c.status,
                    "evidence_ids": c.evidence_ids or [], "source_agent": c.source_agent
                } for c in claims],
                "evidence": [{
                    "id": e.id, "source": e.source, "source_type": e.source_type,
                    "title": e.title, "content": e.content, "url": e.url,
                    "reliability": e.reliability, "agent_id": e.agent_id
                } for e in evidence],
                "contradictions": [{
                    "id": cnt.id, "claim_a_text": cnt.claim_a_text, "claim_b_text": cnt.claim_b_text,
                    "severity": cnt.severity, "resolution": cnt.resolution, "status": cnt.status
                } for cnt in contradictions],
                "decisions": [{
                    "id": d.id, "decision": d.decision, "rationale": d.rationale,
                    "confidence": d.confidence, "risks": d.risks or [],
                    "unresolved_questions": d.unresolved_questions or []
                } for d in decisions]
            }
        finally:
            db.close()
