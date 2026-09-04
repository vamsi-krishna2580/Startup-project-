from typing import List, Dict, Any, Union

class CompetitorResearchTool:
    """
    Competitor Landscape Normalization & Moat Evaluator.
    Standardizes competitor entries to the frontend CompetitorDetail schema.
    """
    name: str = "competitor_research"
    description: str = "Researches, benchmarks, and normalizes competitors into structured defensibility matrices."

    @staticmethod
    def normalize_competitors(
        raw_competitors: List[Union[str, Dict[str, Any]]],
        industry: str = "Tech / SaaS"
    ) -> List[Dict[str, str]]:
        normalized = []
        for item in raw_competitors:
            if isinstance(item, str):
                name = item.strip()
                normalized.append({
                    "name": name,
                    "focus": f"Incumbent enterprise or specialized provider in {industry}",
                    "advantage": "Established distribution channel, existing customer base, and brand trust",
                    "disadvantage": "High legacy pricing, rigid on-premise workflows, slower AI release cadence"
                })
            elif isinstance(item, dict):
                normalized.append({
                    "name": str(item.get("name", "Competitor Entity")),
                    "focus": str(item.get("focus", "Alternative sector provider")),
                    "advantage": str(item.get("advantage", "Brand equity & sales footprint")),
                    "disadvantage": str(item.get("disadvantage", "Manual overhead & lack of specialized automation"))
                })
        return normalized

    @staticmethod
    def evaluate_moat_strength(
        startup_innovation: str,
        competitors: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """
        Determines defensibility tier against incumbent competitors.
        """
        num_comps = len(competitors)
        has_network_effect = any(
            kw in startup_innovation.lower() 
            for kw in ["network effect", "data flywheel", "proprietary dataset", "api platform", "marketplace"]
        )
        
        if has_network_effect and num_comps > 0:
            moat_type = "Data Flywheel / Defensible Network Effect"
            moat_score = 8.5
        elif num_comps <= 2:
            moat_type = "Early Mover / High Speed-to-Execution Niche"
            moat_score = 7.0
        else:
            moat_type = "Feature Differentiation (Requires Proprietary IP to Scale)"
            moat_score = 6.0

        return {
            "moat_type": moat_type,
            "moat_score": moat_score,
            "competitor_density": "Crowded" if num_comps >= 5 else "Moderate" if num_comps >= 3 else "Concentrated"
        }
