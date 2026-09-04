import uuid
from typing import List, Dict, Any, Optional
from ..utils.time import utc_now_iso

class EvidenceStoreTool:
    """
    Evidence Store Tool.
    Allows agents to catalog, link, and retrieve grounded factual evidence and citations.
    """
    name: str = "evidence_store"
    description: str = "Stores, categorizes, and retrieves grounded evidence records and reliability scores."

    @staticmethod
    def create_evidence_item(
        investigation_id: str,
        source: str,
        source_type: str,
        title: str,
        content: str,
        agent_id: str,
        url: Optional[str] = None,
        reliability: float = 0.8,
        related_claim_ids: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        evidence_id = f"evi-{uuid.uuid4().hex[:8]}"
        return {
            "id": evidence_id,
            "investigation_id": investigation_id,
            "source": source,
            "source_type": source_type,
            "title": title,
            "content": content,
            "url": url,
            "reliability": max(0.0, min(1.0, reliability)),
            "retrieved_at": utc_now_iso(),
            "agent_id": agent_id,
            "related_claim_ids": related_claim_ids or []
        }

    @staticmethod
    def filter_by_reliability(evidence_list: List[Dict[str, Any]], min_reliability: float = 0.7) -> List[Dict[str, Any]]:
        return [e for e in evidence_list if e.get("reliability", 0.0) >= min_reliability]

    @staticmethod
    def summarize_evidence_corpus(evidence_list: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not evidence_list:
            return {
                "count": 0,
                "average_reliability": 0.0,
                "sources": [],
                "source_types": []
            }
        avg_rel = sum(e.get("reliability", 0.0) for e in evidence_list) / len(evidence_list)
        sources = list(set(e.get("source", "Unknown") for e in evidence_list))
        source_types = list(set(e.get("source_type", "Unknown") for e in evidence_list))
        return {
            "count": len(evidence_list),
            "average_reliability": round(avg_rel, 2),
            "sources": sources,
            "source_types": source_types
        }
