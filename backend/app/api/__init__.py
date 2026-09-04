from .health import router as health_router
from .startup import router as startup_router
from .investigations import router as investigations_router
from .chat import router as chat_router

__all__ = [
    "health_router",
    "startup_router",
    "investigations_router",
    "chat_router"
]
