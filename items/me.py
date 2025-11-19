from fastapi import APIRouter
from pydantic import BaseModel
from .me_data import ME

router = APIRouter()

@router.get("/me", response_model=dict)
async def get_me():
  return ME