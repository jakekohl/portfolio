import util.db
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure, PyMongoError

class ProjectsService:
  def __init__(self):
    collection_name = "projects"
    self.collection = util.db.get_collection(collection_name)

  def get_projects(self):
    try:
      return [util.db.convert_objectid_to_str(project) for project in self.collection.find()]
    except (ServerSelectionTimeoutError, ConnectionFailure, PyMongoError) as e:
      print(f"MongoDB connection error in get_projects: {str(e)}")
      # Return empty list instead of crashing
      return []