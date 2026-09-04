import uuid
from typing import List, Dict, Any, Optional
from ..utils.time import utc_now_iso

class ClaimManagerTool:
    """
    Claim Management & Epistemic Verification Tool.
    Classifies assertions as FACT, ESTIMATE, ASSUMPTION, INFERENCE, OPINION, or UNKNOWN.
    Tracks evidence linkage and confidence shifts over the investigation lifecycle.
    """
    name: str = "claim_manager"
    description: str = "Creates, monitors, and evaluates structured claims and evidence provenance."

    @staticmethod
    def create_claim(
        investigation_id: str,
        text: str,
        category: str,
        source_agent: str,
        confidence: float = 0.7,
        status: str = "proposed",
        evidence_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        claim_id = f"clm-{uuid.uuid4().hex[:8]}"
        now = utc_now_iso()
        return {
            "id": claim_id,
            "investigation_id": investigation_id,
            "text": text,
            "category": category,
            "confidence": max(0.0, min(1.0, confidence)),
            "status": status,  # proposed, supported, weakly_supported, contradicted, rejected, assumption
            "evidence_ids": evidence_ids or [],
            "source_agent": source_agent,
            "created_at": now,
            "updated_at": now
        }

    @staticmethod
    def attach_evidence(claim: Dict[str, Any], evidence_id: str, boost_confidence: float = 0.15) -> Dict[str, Any]:
        evidence_ids = claim.get("evidence_ids", [])
        if evidence_id not in evidence_ids:
            evidence_ids.append(evidence_id)
        
        current_conf = claim.get("confidence", 0.5)
        new_conf = min(0.95, current_conf + boost_confidence)
        
        claim["evidence_ids"] = evidence_ids
        claim["confidence"] = round(new_conf, 2)
        claim["status"] = "supported" if len(evidence_ids) >= 2 else "weakly_supported"
        claim["updated_at"] = utc_now_iso()
        return claim

    @staticmethod
    def mark_contradicted(claim: Dict[str, Any], penalty: float = 0.3) -> Dict[str, Any]:
        current_conf = claim.get("confidence", 0.5)
        claim["confidence"] = max(0.1, round(current_conf - penalty, 2))
        claim["status"] = "contradicted"
        claim["updated_at"] = utc_now_iso()
        return claim

    @staticmethod
    def categorize_epistemic_balance(claims: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Calculates verification ratio between verified facts/estimates vs ungrounded assumptions.
        """
        total = len(claims)
        if total == 0:
            return {"supported": 0, "assumptions": 0, "contradicted": 0, "verification_ratio": 0.0}

        supported = sum(1 for c in claims if c.get("status") in ("supported", "weakly_supported"))
        assumptions = sum(1 for c in claims if c.get("status") in ("assumption", "proposed"))
        contradicted = sum(1 for c in claims if c.get("status") == "contradicted")

        return {
            "total_claims": total,
            "supported": supported,
            "assumptions": assumptions,
            "contradicted": contradicted,
            "verification_ratio": round(supported / total, 2) if total > 0 else 0.0
        }
