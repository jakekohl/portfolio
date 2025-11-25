from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson import ObjectId
import os
load_dotenv()

MONGODB_USER = os.getenv("MONGODB_USER")
MONGODB_PASS = os.getenv("MONGODB_PASS")
MONGODB_CLUSTER = os.getenv("MONGODB_CLUSTER")
MONGODB_APPNAME = os.getenv("MONGODB_APPNAME")
ENVIRONMENT = os.getenv("ENVIRONMENT", "dev").lower()

uri = f"mongodb+srv://{MONGODB_USER}:{MONGODB_PASS}@{MONGODB_CLUSTER}.mongodb.net/?appName={MONGODB_APPNAME}"

# Configure SSL/TLS based on environment
# In dev, allow invalid certificates to work around SSL certificate issues
# In production, use strict SSL verification
# Note: tlsAllowInvalidCertificates=True should only be used in development
# For production, ensure proper SSL certificates are configured

# Create a new client and connect to the server
# tlsAllowInvalidCertificates is set to True only in dev environment to handle SSL certificate issues
client = MongoClient(uri, server_api=ServerApi('1'), tlsAllowInvalidCertificates=(ENVIRONMENT == "dev"))

# Get the database
db = client.get_database("portfolio")

def get_collection(collection_name: str):
  return db.get_collection(collection_name)

def get_document(collection_name: str, document_id: str):
  return get_collection(collection_name).find_one({"_id": document_id})

def get_documents(collection_name: str):
  return get_collection(collection_name).find()

def insert_document(collection_name: str, document: dict):
  return get_collection(collection_name).insert_one(document)

def update_document(collection_name: str, document_id: str, document: dict):
  return get_collection(collection_name).update_one({"_id": document_id}, {"$set": document})

def convert_objectid_to_str(document):
  """Convert ObjectId fields to strings for JSON serialization"""
  if document is None:
    return None
  if isinstance(document, dict):
    result = {}
    for key, value in document.items():
      if isinstance(value, ObjectId):
        result[key] = str(value)
      elif isinstance(value, dict):
        result[key] = convert_objectid_to_str(value)
      elif isinstance(value, list):
        result[key] = [convert_objectid_to_str(item) for item in value]
      else:
        result[key] = value
    return result
  elif isinstance(document, list):
    return [convert_objectid_to_str(item) for item in document]
  else:
    return document