from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from lib.projects_service import ProjectsService
from typing import Optional, Dict

router = APIRouter(tags=["projects"])

class ProjectResponse(BaseModel):
  title: str
  description: str
  technologies: list[str]
  skillsLeveraged: list[str]
  status: str
  github: str
  demo: Optional[str] = None
  features: list[str]
  dataTest: str
  images: list[Dict[str, str]]

@router.get("/projects", response_model=list[ProjectResponse])
async def get_projects():
  try:
    projects = ProjectsService().get_projects()
    return projects
  except Exception as e:
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail="Service temporarily unavailable. Please try again later."
    )