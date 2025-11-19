from fastapi import APIRouter
from pydantic import BaseModel
from .contact_data import CONTACT, SPECIALTIES

router = APIRouter()

class ContactResponse(BaseModel):
  contact: list[dict]
  specialties: list[dict]

@router.get("/contact", response_model=ContactResponse)
async def get_contact():
  return ContactResponse(
    contact=CONTACT,
    specialties=SPECIALTIES,
  )