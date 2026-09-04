import os
from typing import List
from pathlib import Path

# Load .env if present
try:
    from dotenv import load_dotenv
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.exists():
        load_dotenv(dotenv_path=env_path)
    else:
        # Also check root .env
        root_env = Path(__file__).resolve().parent.parent.parent / ".env"
        if root_env.exists():
            load_dotenv(dotenv_path=root_env)
except ImportError:
    pass

class Settings:
    PROJECT_NAME: str = "AI Startup Validator Multi-Agent System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # LLM Settings
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini").lower()
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-2.5-flash")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")

    # Search Tool Settings
    SEARCH_API_KEY: str = os.getenv("SEARCH_API_KEY", "")
    SEARCH_PROVIDER: str = os.getenv("SEARCH_PROVIDER", "duckduckgo").lower()

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./startup_investigations.db")

    # Server & CORS
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("true", "1", "yes")

    @property
    def cors_origins(self) -> List[str]:
        raw = os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173"
        )
        return [origin.strip() for origin in raw.split(",") if origin.strip()]

settings = Settings()
