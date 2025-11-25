from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from lib.contact_service import ContactService

router = APIRouter(tags=["contact"])

class ContactResponse(BaseModel):
  contact: list[dict]
  specialties: list[dict]

@router.get("/contact", response_model=ContactResponse)
async def get_contact():
  try:
    return ContactResponse(
      contact=ContactService().get_contact(),
      specialties=ContactService().get_specialties(),
    )
  except Exception as e:
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail="Service temporarily unavailable. Please try again later."
    )