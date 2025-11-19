from fastapi import APIRouter
from pydantic import BaseModel
from lib.me_service import MeService

router = APIRouter()

class MeResponse(BaseModel):
  _id: str
  name: str
  experiences: list[dict]

@router.get("/me", response_model=MeResponse)
async def get_me():
  return MeResponse(
    _id=MeService().get_me()["_id"],
    name=MeService().get_me()["name"],
    experiences=MeService().get_me()["experiences"],
  )