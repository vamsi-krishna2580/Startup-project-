import os
from typing import List, Dict, Any
from ..config import settings

class WebSearchTool:
    """
    Web Search Provider Abstraction.
    Queries external search engines if credentials are provided.
    Fails gracefully with explicit limitation disclosure if unconfigured, strictly avoiding fabricated URLs.
    """
    name: str = "web_search"
    description: str = "Conducts real-time external web searches for market sizing, competitor intelligence, and regulatory trends."

    @staticmethod
    async def search(query: str, max_results: int = 5) -> Dict[str, Any]:
        api_key = settings.SEARCH_API_KEY
        provider = settings.SEARCH_PROVIDER

        if not api_key:
            return {
                "success": False,
                "provider": provider,
                "query": query,
                "results": [],
                "status": "tool_unconfigured",
                "message": "SEARCH_API_KEY is not configured in backend environment. Real-time external web search skipped to prevent synthetic citation hallucination."
            }

        # If Tavily configured:
        if provider == "tavily" and api_key:
            try:
                import httpx
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(
                        "https://api.tavily.com/search",
                        json={
                            "api_key": api_key,
                            "query": query,
                            "search_depth": "basic",
                            "include_answer": True,
                            "max_results": max_results
                        }
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        results = []
                        for item in data.get("results", []):
                            results.append({
                                "title": item.get("title", ""),
                                "url": item.get("url", ""),
                                "snippet": item.get("content", ""),
                                "score": item.get("score", 0.8)
                            })
                        return {
                            "success": True,
                            "provider": "tavily",
                            "query": query,
                            "results": results,
                            "summary": data.get("answer", "")
                        }
            except Exception as e:
                return {
                    "success": False,
                    "provider": "tavily",
                    "query": query,
                    "results": [],
                    "error": str(e)
                }

        # Fallback for generic unconfigured
        return {
            "success": False,
            "provider": provider,
            "query": query,
            "results": [],
            "status": "unsupported_provider",
            "message": f"Provider '{provider}' configured but client adapter not active."
        }
