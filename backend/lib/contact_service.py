import util.db
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure, PyMongoError

class ContactService:
  def __init__(self):
    collection_name = "contact"
    specialties_collection_name = "specialties"
    self.contact_collection = util.db.get_collection(collection_name)
    self.specialties_collection = util.db.get_collection(specialties_collection_name)

  def get_contact(self):
    try:
      return [util.db.convert_objectid_to_str(contact) for contact in self.contact_collection.find()]
    except (ServerSelectionTimeoutError, ConnectionFailure, PyMongoError) as e:
      print(f"MongoDB connection error in get_contact: {str(e)}")
      # Return empty list instead of crashing
      return []

  def get_specialties(self):
    try:
      return [util.db.convert_objectid_to_str(specialty) for specialty in self.specialties_collection.find()]
    except (ServerSelectionTimeoutError, ConnectionFailure, PyMongoError) as e:
      print(f"MongoDB connection error in get_specialties: {str(e)}")
      # Return empty list instead of crashing
      return []