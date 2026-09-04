from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .config import settings
from .models.database import init_db
from .api.health import router as health_router
from .api.startup import router as startup_router
from .api.investigations import router as investigations_router
from .api.chat import router as chat_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite tables on startup
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Agentic Multi-Agent Backend for AI Startup Validator. Implements dynamic orchestrator, 5 specialized agents, and structured SQLite investigation state.",
    lifespan=lifespan
)

# CORS configuration allowing frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(health_router)
app.include_router(startup_router)
app.include_router(investigations_router)
app.include_router(chat_router)

@app.get("/")
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "endpoints": {
            "health": "/health",
            "analyze": "/api/startup/analyze",
            "investigations": "/api/investigations",
            "chat": "/api/chat"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
