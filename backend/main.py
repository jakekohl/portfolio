from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from items import health, me, projects, contact, github_stats
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
app.include_router(github_stats.router)

@app.get("/" , tags=["root"])
async def root():
  return {
    "message": "Hello World!",
    "description": "This is the backend api for Jake Kohl\'s developer portfolio",
    "website": os.getenv("PORTFOLIO_URL"),
    "repo": "https://github.com/jakekohl/portfolio",
    "docs": os.getenv("API_URL") + app.docs_url,
    "version": __version__,
    "timestamp": datetime.now(),
  }