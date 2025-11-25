from fastapi import APIRouter, HTTPException, Header, status, Query
from pydantic import BaseModel
from lib.github_stats_service import GitHubStatsService
from typing import Optional, List
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(tags=["github"])

GITHUB_STATS_SECRET = os.getenv("GITHUB_STATS_SECRET")

class ContributionDay(BaseModel):
  date: str
  count: int

class GitHubStatsResponse(BaseModel):
  contributions: List[ContributionDay]
  totalContributions: int
  lastUpdated: Optional[str] = None
  username: Optional[str] = None
  year: Optional[str] = None
  years: Optional[List[str]] = None

class IngestResponse(BaseModel):
  status: str
  contributionsCount: int
  totalContributions: int
  lastUpdated: str

@router.get("/github-stats", response_model=GitHubStatsResponse)
async def get_github_stats(
  year: Optional[str] = Query(None, description="Filter by calendar year (e.g., '2024'). If not provided, returns all years aggregated.")
):
  """Retrieve stored GitHub contribution statistics
  
  Query Parameters:
    - year: Optional calendar year filter (e.g., "2024"). Returns only that year's data.
            If omitted, returns aggregated data from all available years.
  """
  try:
    service = GitHubStatsService()
    stats = service.get_github_stats(year=year)
    
    if not stats:
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"GitHub stats not found{' for year ' + year if year else ''}. Please ingest data first."
      )
    
    return GitHubStatsResponse(
      contributions=stats.get("contributions", []),
      totalContributions=stats.get("totalContributions", 0),
      lastUpdated=stats.get("lastUpdated"),
      username=stats.get("username"),
      year=stats.get("year"),
      years=stats.get("years")
    )
  except HTTPException:
    # Re-raise HTTP exceptions (like 404)
    raise
  except Exception as e:
    # Handle any other errors (like MongoDB connection issues)
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail="Service temporarily unavailable. Please try again later."
    )

@router.post("/github-stats/ingest", response_model=IngestResponse)
async def ingest_github_stats(
  x_github_stats_secret: Optional[str] = Header(None, alias="X-GitHub-Stats-Secret"),
  from_date: Optional[str] = Query(None, description="Start date in YYYY-MM-DD format (e.g., 2020-01-01)"),
  to_date: Optional[str] = Query(None, description="End date in YYYY-MM-DD format (e.g., 2024-12-31). Defaults to today if not provided."),
  force_full_load: bool = Query(False, description="If true, replace all existing data instead of merging")
):
  """Ingest GitHub contribution data from GitHub API
  
  Query Parameters:
    - from_date: Optional start date (YYYY-MM-DD). If provided with to_date, fetches that specific range.
    - to_date: Optional end date (YYYY-MM-DD). Defaults to today if not provided.
    - force_full_load: If true, replaces all existing data. Otherwise merges with existing data.
  
  Examples:
    - Full initial load from 2020: ?from_date=2020-01-01&to_date=2024-12-31&force_full_load=true
    - Incremental update (default): No parameters
  """
  # Validate secret header
  if not GITHUB_STATS_SECRET:
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail="GitHub stats secret not configured on server"
    )
  
  if not x_github_stats_secret or x_github_stats_secret != GITHUB_STATS_SECRET:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid or missing X-GitHub-Stats-Secret header"
    )
  
  service = GitHubStatsService()
  
  # Check rate limit (skip if custom date range is provided, as it's likely an initial load)
  if not from_date:
    can_proceed, rate_limit_message = service.check_rate_limit()
    if not can_proceed:
      raise HTTPException(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        detail=rate_limit_message
      )
  
  try:
    # If from_date is provided but to_date is not, default to today
    if from_date and not to_date:
      to_date = datetime.now().strftime("%Y-%m-%d")
    
    result = await service.ingest_contributions(
      from_date=from_date,
      to_date=to_date,
      force_full_load=force_full_load
    )
    return IngestResponse(**result)
  except ValueError as e:
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail=str(e)
    )
  except Exception as e:
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail=f"Failed to ingest GitHub stats: {str(e)}"
    )

