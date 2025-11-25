import util.db
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure, PyMongoError

class MeService:
  def __init__(self):
    collection_name = "me"
    self.collection = util.db.get_collection(collection_name)

  def get_me(self):
    try:
      result = self.collection.find_one()
      if result:
        return util.db.convert_objectid_to_str(result)
      return None
    except (ServerSelectionTimeoutError, ConnectionFailure, PyMongoError) as e:
      print(f"MongoDB connection error in get_me: {str(e)}")
      # Return None instead of crashing
      return None