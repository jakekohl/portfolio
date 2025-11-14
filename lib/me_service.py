import util.db

class MeService:
  def __init__(self):
    collection_name = "me"
    self.collection = util.db.get_collection(collection_name)

  def get_me(self):
    return util.db.convert_objectid_to_str(self.collection.find_one())