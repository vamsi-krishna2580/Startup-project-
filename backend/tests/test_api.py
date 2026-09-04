import asyncio
import os
import tempfile
from pathlib import Path
from unittest.mock import AsyncMock
import pytest

TEST_DB = Path(tempfile.gettempdir()) / f"startup-validator-tests-{os.getpid()}.db"
os.environ["DATABASE_URL"] = f"sqlite:///{TEST_DB.as_posix()}"
os.environ["GEMINI_API_KEY"] = "test-key"

from fastapi.testclient import TestClient

from app.main import app
from app.models.database import engine
from app.config import settings
from app.services.llm_provider import LLMExecutionError, LLMProvider


FAKE_LLM_RESPONSE = {
    "summary": "A focused workflow automation opportunity.",
    "problem": "Small teams lose time to fragmented manual work.",
    "solution": "An AI assistant automates the repetitive workflow.",
    "innovation": "Vertical workflow intelligence.",
    "strengths": ["Clear pain", "Recurring use", "Measurable ROI"],
    "weaknesses": ["Needs pilot validation"],
    "risks": ["Incumbent response"],
    "suggestions": ["Run a paid pilot"],
    "problem_severity_score": 8,
    "solution_innovation_score": 8,
    "market_tam_score": 7,
    "defensibility_moat_score": 6,
    "timing_catalyst_score": 8,
    "target_customers": ["Small service businesses"],
    "customer_segments": ["Early adopters"],
    "market_size": "TAM $1B; SAM $200M; SOM $10M",
    "market_demand": "Growing demand for workflow automation",
    "industry_trends": ["AI adoption"],
    "raw_competitors": [{
        "name": "Example competitor",
        "focus": "Horizontal automation",
        "advantage": "Distribution",
        "disadvantage": "Limited vertical depth",
    }],
    "customer_pain_points": ["Manual administration"],
    "market_opportunities": ["Vertical specialization"],
    "market_challenges": ["Customer switching friction"],
    "business_model": "B2B SaaS",
    "revenue_model": "Monthly subscriptions",
    "pricing_strategy": "Tiered per-location pricing",
    "unique_value_proposition": "Faster work with fewer errors",
    "go_to_market_strategy": "Paid pilots followed by referrals",
    "customer_acquisition": ["Founder-led sales"],
    "sales_channels": ["Direct sales"],
    "partnerships": ["Industry associations"],
    "growth_strategy": "Expand from a narrow beachhead",
    "key_partners": ["Integration partners"],
    "key_activities": ["Product development"],
    "key_resources": ["Workflow data"],
    "customer_relationships": ["High-touch onboarding"],
    "cost_structure": ["Engineering"],
    "startup_cost_estimate": "$100,000",
    "operating_costs": "$20,000 per month",
    "revenue_projection": "Year 1 $120k; Year 2 $500k",
    "break_even_estimate": "18 months",
    "funding_required": "$400,000",
    "funding_utilization": "60% product, 30% sales, 10% operations",
    "financial_risks": ["Long sales cycles"],
    "profitability_potential": "Strong at software scale",
    "model_parameters": {
        "year_1_revenue": 120000,
        "year_1_costs": 280000,
        "annual_growth_rate": 2.5,
        "cost_scale_factor": 1.6,
        "base_monthly_burn": 25000,
    },
    "executive_summary": "A promising but validation-dependent opportunity.",
    "elevator_pitch": "AI workflow automation for underserved small teams.",
    "swot": {
        "strengths": ["Focused product"],
        "weaknesses": ["Early stage"],
        "opportunities": ["Large fragmented market"],
        "threats": ["Incumbents"],
    },
    "pitch_deck_outline": ["Problem", "Solution", "Market", "Traction"],
    "unit_economics_score": 7,
    "execution_feasibility_score": 7,
    "traction_evidence_score": 6,
    "market_tailwinds_score": 8,
}


def test_health_and_validation_contract():
    with TestClient(app) as client:
        assert client.get("/health").status_code == 200
        assert client.get("/api/health").json()["status"] == "ok"
        invalid = client.post("/api/startup/analyze", json={"idea": "", "budget": 1000})
        assert invalid.status_code == 422


def test_analysis_runs_agents_concurrently_and_persists(monkeypatch):
    active = 0
    maximum_active = 0

    async def fake_generate(*_args, **_kwargs):
        nonlocal active, maximum_active
        active += 1
        maximum_active = max(maximum_active, active)
        await asyncio.sleep(0.03)
        active -= 1
        return FAKE_LLM_RESPONSE

    monkeypatch.setattr(LLMProvider, "generate_json", fake_generate)

    with TestClient(app) as client:
        response = client.post("/api/startup/analyze", json={
            "idea": "AI scheduling assistant for independent medical clinics",
            "industry": "Healthcare",
            "target_customer": "Independent clinics",
            "region": "India",
            "stage": "MVP",
            "budget": "USD 100,000",
        })
        assert response.status_code == 200, response.text
        report = response.json()
        assert report["source"] == "api"
        assert report["startup_analysis"]["opportunity_score"] > 0
        assert report["investment_report"]["investment_readiness_score"] > 0
        assert maximum_active == 4

        investigation_id = report["id"].replace("rep-", "")
        assert client.get(f"/api/startup/{investigation_id}").status_code == 200
        state = client.get(f"/api/investigations/{investigation_id}/state").json()
        assert state["status"] == "completed"
        assert state["contradictions_count"] == 2
        events = client.get(f"/api/investigations/{investigation_id}/events").json()
        assert len(events) >= 10
        assert len({event["id"] for event in events}) == len(events)


def test_provider_failure_returns_complete_labeled_fallback(monkeypatch):
    monkeypatch.setattr(
        LLMProvider,
        "generate_json",
        AsyncMock(side_effect=LLMExecutionError("Gemini timed out after 90 seconds.")),
    )

    with TestClient(app) as client:
        response = client.post(
            "/api/startup/analyze",
            json={"idea": "AI scheduling assistant for independent clinics"},
        )

    assert response.status_code == 200
    assert response.json()["source"] == "api-fallback"
    assert response.json()["startup_analysis"]["opportunity_score"] == 68


@pytest.mark.asyncio
async def test_ollama_ngrok_adapter_is_provider_independent(monkeypatch):
    captured = {}

    class FakeResponse:
        status_code = 200
        text = ""

        @staticmethod
        def json():
            return {"message": {"content": '{"ollama": "working"}'}}

    async def fake_post(provider_name, url, payload, headers=None, timeout=None):
        captured.update({
            "provider": provider_name,
            "url": url,
            "payload": payload,
            "headers": headers,
        })
        return FakeResponse()

    monkeypatch.setattr(settings, "LLM_PROVIDER", "ollama")
    monkeypatch.setattr(settings, "OLLAMA_BASE_URL", "https://example.ngrok-free.app/")
    monkeypatch.setattr(settings, "OLLAMA_MODEL", "llama3.1:8b")
    monkeypatch.setattr(LLMProvider, "_post_json", fake_post)

    result = await LLMProvider.generate_json("Return JSON", "System instruction")

    assert result == {"ollama": "working"}
    assert captured["provider"] == "Ollama"
    assert captured["url"] == "https://example.ngrok-free.app/api/chat"
    assert captured["payload"]["model"] == "llama3.1:8b"
    assert captured["payload"]["format"] == "json"
    assert captured["headers"]["ngrok-skip-browser-warning"] == "true"


def teardown_module():
    engine.dispose()
    TEST_DB.unlink(missing_ok=True)
