from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from lib.roles_service import RolesService
from bson import ObjectId

router = APIRouter(tags=["roles"])

class RoleResponse(BaseModel):
  _id: ObjectId
  title: str
  company: str
  location: str
  startDate: str
  endDate: str
  description: list[str]
  url: str

@router.get("/roles", response_model=list[RoleResponse])
async def get_roles():
  try:
    roles = RolesService().get_roles()
    return [RoleResponse(**role) for role in roles]
  except Exception as e:
    print(f"Error in get_roles: {str(e)}")
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail="Service temporarily unavailable. Please try again later."
    )