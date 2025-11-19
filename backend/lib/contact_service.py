import util.db

class ContactService:
  def __init__(self):
    collection_name = "contact"
    specialties_collection_name = "specialties"
    self.contact_collection = util.db.get_collection(collection_name)
    self.specialties_collection = util.db.get_collection(specialties_collection_name)

  def get_contact(self):
    return [util.db.convert_objectid_to_str(contact) for contact in self.contact_collection.find()]

  def get_specialties(self):
    return [util.db.convert_objectid_to_str(specialty) for specialty in self.specialties_collection.find()]