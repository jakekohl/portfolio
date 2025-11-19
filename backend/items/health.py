from fastapi import APIRouter
from datetime import datetime
from .version import __version__

router = APIRouter()

@router.get("/health", response_model=dict)
async def health_check():
  return {
    "status": "ok",
    "message": "API is running",
    "version": __version__,
    "timestamp": datetime.now(),
    "repo": "https://github.com/jakekohl/jakekohl-portfolio-be",
  }