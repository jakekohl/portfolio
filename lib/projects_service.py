import util.db

class ProjectsService:
  def __init__(self):
    collection_name = "projects"
    self.collection = util.db.get_collection(collection_name)

  def get_projects(self):
    return [util.db.convert_objectid_to_str(project) for project in self.collection.find()]