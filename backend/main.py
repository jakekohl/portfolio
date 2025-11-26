from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from items import health, me, projects, contact, github_stats, roles
from items.version import __version__
from datetime import datetime
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

app = FastAPI(
  title="Jake Kohl Portfolio",
  description="API for Jake Kohl's Software Engineering Portfolio",
  version=__version__,
  docs_url="/docs",
)

list_cors_domains = []

cors_domains = os.getenv("CORS_DOMAINS")

if cors_domains is None:
  list_cors_domains = ["*"]
else:
  for domain in cors_domains.split(","):
    list_cors_domains.append(domain.strip())

print(list_cors_domains)

app.add_middleware(
  CORSMiddleware,
  allow_origins=list_cors_domains,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

# Mount static files (for favicon.ico and other public assets)
public_dir = Path(__file__).parent / "public"
if public_dir.exists():
    app.mount("/static", StaticFiles(directory=str(public_dir)), name="static")

# Include routers
app.include_router(health.router)
app.include_router(me.router)
app.include_router(roles.router)
app.include_router(projects.router)
app.include_router(contact.router)
app.include_router(github_stats.router)

@app.get("/" , tags=["root"])
async def root():
  api_url = os.getenv("API_URL") or ""
  docs_url = f"{api_url}{app.docs_url}" if api_url else app.docs_url
  return {
    "message": "Hello World!",
    "description": "This is the backend api for Jake Kohl\'s developer portfolio",
    "website": os.getenv("PORTFOLIO_URL"),
    "repo": "https://github.com/jakekohl/portfolio",
    "docs": docs_url,
    "version": __version__,
    "timestamp": datetime.now(),
  }

# Serve favicon.ico at the root level
@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    from fastapi.responses import FileResponse
    favicon_path = public_dir / "favicon.ico"
    if favicon_path.exists():
        return FileResponse(str(favicon_path))
    return {"error": "Favicon not found"}