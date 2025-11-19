from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from items import health, me, projects, contact
from items.version import __version__
from datetime import datetime
import os
from dotenv import load_dotenv
load_dotenv()
app = FastAPI(
  title="Jake Kohl Portfolio API",
  description="API for Jake Kohl Portfolio",
  version=__version__,
  docs_url="/docs",
  redoc_url="/redoc",
)

app.add_middleware(
  CORSMiddleware,
  allow_origins=[os.getenv("CORS_DOMAINS")],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(me.router)
app.include_router(projects.router)
app.include_router(contact.router)

@app.get("/")
async def root():
  return {"message": "Hello World! Welcome to the Jake Kohl Portfolio API",
    "docs": "https://jakekohl-portfolio-be.vercel.app/docs",
    "redoc": "https://jakekohl-portfolio-be.vercel.app/redoc",
    "repo": "https://github.com/jakekohl/jakekohl-portfolio-be",
    "version": __version__,
    "timestamp": datetime.now(),
  }

@app.get("/items/{item_id}")
async def read_item(item_id: int):
  return {"item_id": item_id}