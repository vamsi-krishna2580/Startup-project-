# AI Startup Validator

A presentation-ready React + Vite frontend backed by a FastAPI multi-agent startup analysis service.

## Run the project

Open two PowerShell terminals from this folder.

Backend:

```powershell
cd backend
uv sync
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Frontend:

```powershell
npm install
npm run dev
```

Open <http://localhost:3000>. API documentation is at <http://localhost:8000/docs>.

## Presentation modes

- **Auto** (default): uses the live FastAPI service and automatically switches to labeled demo data if the server cannot be reached.
- **Strict API**: shows provider/backend errors instead of using frontend demo data.
- **Demo**: guaranteed offline presentation mode with no API or internet dependency.

The backend also has a deterministic resilience layer. If Gemini is unavailable, overloaded, or rate-limited, the API still returns a complete report marked `api-fallback`; the Results page displays a visible warning that market figures should be verified.

## Verify before presenting

```powershell
npm run check
npm audit --audit-level=moderate
cd backend
uv lock --check
uv run pytest -q
```

Expected result: six frontend tests, three backend tests, a successful production build, and zero npm vulnerabilities.

## Configuration

Copy `backend/.env.example` to `backend/.env` and provide the key for the selected provider. Keep `.env` private. The browser request timeout defaults to three minutes and can be changed with `VITE_API_TIMEOUT_MS`.

### Switching to Ollama through Colab and ngrok

The frontend always talks to FastAPI; only FastAPI talks to the selected model provider. Set these values in `backend/.env`, then restart FastAPI:

```env
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama3.1:8b
OLLAMA_BASE_URL=https://your-tunnel.ngrok-free.app
LLM_TIMEOUT_SECONDS=120
```

Do not put the Ollama/ngrok URL in the frontend Backend URL field. That field must continue to point to FastAPI (`http://localhost:8000`). The Ollama adapter calls `<OLLAMA_BASE_URL>/api/chat` and sends the ngrok interstitial-bypass header automatically.
