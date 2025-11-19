from fastapi import APIRouter
from pydantic import BaseModel
from lib.contact_service import ContactService

router = APIRouter()

class ContactResponse(BaseModel):
  contact: list[dict]
  specialties: list[dict]

@router.get("/contact", response_model=ContactResponse)
async def get_contact():
  return ContactResponse(
    contact=ContactService().get_contact(),
    specialties=ContactService().get_specialties(),
  )