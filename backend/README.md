# AI Startup Validator — Agentic Multi-Agent Backend

A production-grade, state-driven multi-agent backend for the AI Startup Validator platform. Built with **FastAPI**, **Pydantic v2**, **SQLAlchemy**, and **SQLite**.

---

## 🏛 Architecture Overview

```
[ Frontend: React + Vite ] (Port 3000 / 5173)
             │
             ▼ HTTP / REST (Exact Contract: POST /api/startup/analyze)
[ FastAPI Gateway & Routers ] (Port 8000)
             │
             ▼
[ Multi-Agent Orchestrator & Planner ]
  ├── 1. Startup Analyst Agent (Concept Deconstruction & Opportunity Scoring)
  ├── 2. Market Researcher Agent (TAM/SAM/SOM, Sector Trends, Competitor Matrix)
  ├── 3. Contradiction Critic Agent (Assumptions vs. Market Reality Friction Audit)
  ├── 4. Business Strategist Agent (9-Block Canvas, CAC/GTM, Monetization)
  ├── 5. Financial Planner Agent (Runway, Burn Rate, Break-even, 4-Yr Projections)
  ├── 6. Investment Advisor Agent (SWOT Matrix, Readiness Score, 12-Slide Deck)
  └── 7. Decision Synthesizer Agent (Committee Consensus & Final Verdict)
             │
             ▼
[ Tool Registry (Deterministic & Role-Gated) ]
  ├── calculator (AST-safe math evaluation)
  ├── financial_calculator (Unit economics, burn rate, break-even, 4-yr models)
  ├── scenario_analysis (Base, optimistic, pessimistic sensitivity models)
  ├── scoring (Weighted 0-100 opportunity and investment readiness formulas)
  ├── competitor_research (Defensibility benchmarks and competitor schemas)
  ├── evidence_store (Catalog, provenance, and reliability metrics)
  ├── claim_manager (FACT, ESTIMATE, ASSUMPTION, CONTRADICTION states)
  └── web_search (Provider abstraction: Tavily/DuckDuckGo or unconfigured fallback)
             │
             ▼
[ Persistent SQLite Database (`startup_investigations.db`) ]
  ├── investigations (Full reports & session state)
  ├── claims (Confidence, status, evidence links)
  ├── evidence (Citations, source type, reliability scores)
  ├── contradictions (Severity & proposed resolutions)
  ├── hypotheses & experiments (Validation criteria)
  ├── decisions (Committee rationale & residual risks)
  └── agent_events (Timeline audit log of all dispatched actions)
```

---

## 🚀 Quickstart

### 1. Configure Environment
Copy `.env.example` to `.env` and set your preferred LLM provider:

```bash
cd backend
cp .env.example .env
```

Set your API key (e.g., `GEMINI_API_KEY`, `OPENAI_API_KEY`, or `ANTHROPIC_API_KEY`).

### 2. Install Dependencies
```bash
uv sync
```

### 3. Run FastAPI Server
```bash
uv run uvicorn app.main:app --port 8000 --reload
```
or run as a module:
```bash
python -m backend.app.main
```

The interactive OpenAPI docs will be available at:  
👉 **`http://localhost:8000/docs`**

---

## 🔌 API Endpoints

### Core Startup Analysis (Frontend Contract)
- `POST /api/startup/analyze` — Primary entry point. Analyzes a startup across 5 stages and returns the exact `StartupReport` JSON structure.
- `GET /api/startup/{id}` — Retrieve a completed validation report by ID.
- `POST /api/startup/{id}/refine` — Re-evaluate analysis with refined founder parameters.

### Investigation State & Epistemic Records
- `GET /api/investigations` — List past validation investigations.
- `GET /api/investigations/{id}/state` — Full investigation state (claims, evidence, contradictions, decisions).
- `GET /api/investigations/{id}/claims` — Structured claim catalog with verification status.
- `GET /api/investigations/{id}/evidence` — Grounded evidence corpus and reliability metrics.
- `GET /api/investigations/{id}/contradictions` — Dialectical contradictions and tensions detected.
- `GET /api/investigations/{id}/events` — Step-by-step audit log of agent execution.

### Interactive Advisory Chat
- `POST /api/chat` — Founder conversational Q&A with the multi-agent investment committee.

### Health & Readiness
- `GET /health` / `GET /api/health` — Service status, LLM configuration, and registered tools.

---

## 🤖 Model Context Protocol (MCP) Server

An MCP-compliant stdio server is included in `mcp_server/server.py`. It allows LLM IDE clients (Claude Code, Cursor, Windsurf) to directly invoke the backend tools:
```bash
python -m backend.mcp_server.server
```
Exposes tools:
- `calculator`
- `financial_calculator`
- `scoring`
