import util.db
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure, PyMongoError

class RolesService:
  def __init__(self):
    collection_name = "roles"
    self.collection = util.db.get_collection(collection_name)

  def get_roles(self):
    try:
      result = self.collection.find (sort=[("order", 1)])
      return list(result)
    except (ServerSelectionTimeoutError, ConnectionFailure, PyMongoError) as e:
      print(f"MongoDB connection error in get_roles: {str(e)}")
      return []