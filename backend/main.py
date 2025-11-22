from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from items import health, me, projects, contact
from items.version import __version__
from datetime import datetime
import os
from dotenv import load_dotenv
load_dotenv()
app = FastAPI(
  title="Jake Kohl Portfolio",
  description="API for Jake Kohl's Software Engineering Portfolio",
  version=__version__,
  docs_url="/docs",
  redoc_url="/redoc",
)

list_cors_domains = []

cors_domains = os.getenv("CORS_DOMAINS")

for domain in cors_domains.split(","):
  list_cors_domains.append(domain.strip())

if cors_domains is None:
  list_cors_domains = ["*"]

print(list_cors_domains)

app.add_middleware(
  CORSMiddleware,
  allow_origins=list_cors_domains,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(me.router)
app.include_router(projects.router)
app.include_router(contact.router)

@app.get("/")
async def root():
  return {"message": "Hello World! Welcome to the Jake Kohl Portfolio API",
    "docs": "https://portfolio.jakekohl.com/docs",
    "repo": "https://github.com/jakekohl/portfolio",
    "version": __version__,
    "timestamp": datetime.now(),
  }

@app.get("/items/{item_id}")
async def read_item(item_id: int):
  return {"item_id": item_id}