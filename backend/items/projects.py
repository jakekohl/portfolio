from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel
from lib.projects_service import ProjectsService
from typing import Optional, Dict

router = APIRouter(tags=["projects"])

class ProjectResponse(BaseModel):
  title: str
  entity: Optional[str] = None
  description: str
  startDate: Optional[str] = None
  endDate: Optional[str] = None
  technologies: list[str]
  skillsLeveraged: list[str]
  status: str
  github: Optional[str] = None
  demo: Optional[str] = None
  url: Optional[str] = None
  features: list[str]
  dataTest: str
  images: list[Dict[str, str]] = []

class EntityResponse(BaseModel):
  entities: list[str]

@router.get("/projects", response_model=list[ProjectResponse])
async def get_projects(
  entity: Optional[str] = Query(None, description="Filter results based on associated entity (Company, Individual, etc). If not provided, returns all projects.")
):
  """Retrieves stored projects

  Query Parameters:
    - entity: Optional Entity Filter ('Self', 'Tagboard', etc). Returns only projects associated to that entity. If omitted, returns all projects.
  """
  try:
    projects = ProjectsService().get_projects(entity=entity)
    return projects
  except Exception as e:
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail="Service temporarily unavailable. Please try again later."
    )

@router.get("/projects/entities", response_model=EntityResponse, description="Filter results based on entity description. If not provided, returns all entities.")
async def get_entities():
  """Retrieves all unique entities from projects

  Query Parameters:
    - None

  Returns:
    - A list of all unique entities from projects
  """
  try:
    entities = ProjectsService().get_entities()
    return EntityResponse(entities=entities)
  except Exception as e:
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail="Service temporarily unavailable. Please try again later."
    )

@router.post("/projects", response_model=ProjectResponse)
async def create_project(project: ProjectResponse):
  """Creates a new project

  Query Parameters:
    - None

  Returns:
    - The created project
  """
  try:
    project = ProjectsService().create_project(project=project)
    return project
  except HTTPException:
    # Re-raise HTTP exceptions (like 404)
    raise
  except Exception as e:
    # Handle any other errors (like MongoDB connection issues)
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail="Service temporarily unavailable. Please try again later."
    )