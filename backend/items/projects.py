from fastapi import APIRouter
from pydantic import BaseModel
from lib.projects_service import ProjectsService
from typing import Optional, Dict

router = APIRouter()

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
  return ProjectsService().get_projects()