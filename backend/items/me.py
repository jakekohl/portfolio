from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from lib.me_service import MeService

router = APIRouter(tags=["me"])

class MeResponse(BaseModel):
  name: str
  experiences: list[dict]
  title: str
  avatarUrl: str
  skills: dict

@router.get("/me", response_model=MeResponse)
async def get_me():
  try:
    me_data = MeService().get_me()
    if not me_data:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Profile data not found"
      )
    return MeResponse(
      name=me_data.get("name", ""),
      experiences=me_data.get("experiences", []),
      title=me_data.get("title", ""),
      avatarUrl=me_data.get("avatarUrl", ""),
      skills=me_data.get("skills", {
        "languages": [],
        "frameworks": [],
        "systems": [],
        "databases": [],
        "tools": [],
        "soft_skills": [],
        "other": [],
      }),
    )
  except HTTPException:
    raise
  except Exception as e:
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail="Service temporarily unavailable. Please try again later."
    )