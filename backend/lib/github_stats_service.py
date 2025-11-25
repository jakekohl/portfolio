import util.db
import os
import httpx
import asyncio
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dotenv import load_dotenv
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure, PyMongoError

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_API_URL = "https://api.github.com/graphql"

class GitHubStatsService:
  def __init__(self):
    collection_name = "github_stats"
    self.collection = util.db.get_collection(collection_name)

  def get_available_years(self) -> List[str]:
    """Get list of available years in the database"""
    try:
      year_docs = list(self.collection.find({"_id": {"$regex": "^\\d{4}$"}}).sort("_id", -1))
      return [doc.get("_id") for doc in year_docs]
    except (ServerSelectionTimeoutError, ConnectionFailure, PyMongoError) as e:
      print(f"MongoDB connection error in get_available_years: {str(e)}")
      return []

  def get_github_stats(self, year: Optional[str] = None) -> Optional[Dict]:
    """Retrieve stored GitHub stats from database
    
    Args:
      year: Optional year filter (e.g., "2024"). If provided, returns only that year's data.
            If None, aggregates all years.
    """
    try:
      if year:
        # Get specific year document
        year_doc = self.collection.find_one({"_id": year})
        if not year_doc:
          return None
        
        year_doc = util.db.convert_objectid_to_str(year_doc)
        return {
          "contributions": year_doc.get("contributions", []),
          "totalContributions": year_doc.get("totalContributions", 0),
          "lastUpdated": year_doc.get("lastUpdated"),
          "username": year_doc.get("username"),
          "year": year_doc.get("_id"),
          "years": [year]  # Single year in list for consistency
        }
      else:
        # Get all year documents and aggregate
        year_docs = list(self.collection.find({"_id": {"$regex": "^\\d{4}$"}}).sort("_id", 1))
        
        if not year_docs:
          return None
        
        # Aggregate contributions from all years
        all_contributions = []
        total_contributions = 0
        latest_update = None
        username = None
        
        for year_doc in year_docs:
          year_doc = util.db.convert_objectid_to_str(year_doc)
          year_contributions = year_doc.get("contributions", [])
          all_contributions.extend(year_contributions)
          total_contributions += year_doc.get("totalContributions", 0)
          
          # Track latest update time
          year_update = year_doc.get("lastUpdated")
          if year_update:
            if not latest_update or year_update > latest_update:
              latest_update = year_update
          
          # Get username from first document
          if not username:
            username = year_doc.get("username")
        
        # Sort contributions by date
        all_contributions.sort(key=lambda x: x.get("date", ""))
        
        return {
          "contributions": all_contributions,
          "totalContributions": total_contributions,
          "lastUpdated": latest_update,
          "username": username,
          "years": [doc.get("_id") for doc in year_docs]
        }
    except (ServerSelectionTimeoutError, ConnectionFailure, PyMongoError) as e:
      # Log the error but don't crash - return None so endpoint can handle gracefully
      print(f"MongoDB connection error in get_github_stats: {str(e)}")
      return None

  async def fetch_github_username(self) -> str:
    """Fetch GitHub username from token"""
    if not GITHUB_TOKEN:
      raise ValueError("GITHUB_TOKEN environment variable is not set")
    
    query = """
    query {
      viewer {
        login
      }
    }
    """
    
    async with httpx.AsyncClient() as client:
      response = await client.post(
        GITHUB_API_URL,
        json={"query": query},
        headers={
          "Authorization": f"Bearer {GITHUB_TOKEN}",
          "Content-Type": "application/json"
        },
        timeout=30.0
      )
      response.raise_for_status()
      data = response.json()
      
      if "errors" in data:
        raise Exception(f"GitHub API error: {data['errors']}")
      
      return data["data"]["viewer"]["login"]

  async def fetch_contributions_single_year(
    self,
    username: str,
    from_date: datetime,
    to_date: datetime
  ) -> List[Dict[str, int]]:
    """Fetch contributions for a single year (GitHub API limitation: max 1 year per request)"""
    if not GITHUB_TOKEN:
      raise ValueError("GITHUB_TOKEN environment variable is not set")
    
    # Format dates for GraphQL (ISO 8601)
    from_date_str = from_date.strftime("%Y-%m-%dT00:00:00Z")
    to_date_str = to_date.strftime("%Y-%m-%dT23:59:59Z")
    
    query = """
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
    """
    
    variables = {
      "username": username,
      "from": from_date_str,
      "to": to_date_str
    }
    
    async with httpx.AsyncClient() as client:
      response = await client.post(
        GITHUB_API_URL,
        json={"query": query, "variables": variables},
        headers={
          "Authorization": f"Bearer {GITHUB_TOKEN}",
          "Content-Type": "application/json"
        },
        timeout=30.0
      )
      response.raise_for_status()
      data = response.json()
      
      if "errors" in data:
        raise Exception(f"GitHub API error: {data['errors']}")
      
      if not data.get("data", {}).get("user"):
        raise Exception(f"User '{username}' not found")
      
      # Extract contributions
      weeks = data["data"]["user"]["contributionsCollection"]["contributionCalendar"]["weeks"]
      contributions = []
      
      for week in weeks:
        for day in week["contributionDays"]:
          contributions.append({
            "date": day["date"],
            "count": day["contributionCount"]
          })
      
      return contributions

  async def fetch_contributions(
    self, 
    username: str, 
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None
  ) -> List[Dict[str, int]]:
    """Fetch contributions from GitHub GraphQL API, handling multi-year ranges by splitting into year chunks"""
    # Default to last year if no dates provided
    if not to_date:
      to_date = datetime.now()
    if not from_date:
      from_date = to_date - timedelta(days=365)
    
    # Calculate the date range
    date_diff = (to_date - from_date).days
    
    # If range is more than 1 year, split into year chunks
    # GitHub API limitation: max 1 year per request
    if date_diff > 365:
      all_contributions = []
      current_from = from_date
      
      while current_from < to_date:
        # Calculate end date for this chunk (exactly 365 days from start, or to_date if less)
        # Use timedelta to handle leap years correctly
        one_year_later = current_from + timedelta(days=365)
        current_to = min(one_year_later, to_date)
        
        # Fetch contributions for this year chunk
        year_contributions = await self.fetch_contributions_single_year(
          username, current_from, current_to
        )
        all_contributions.extend(year_contributions)
        
        # Move to next chunk (start exactly where previous chunk ended)
        current_from = current_to
        
        # Small delay between requests to avoid rate limiting
        if current_from < to_date:
          await asyncio.sleep(0.5)
      
      return all_contributions
    else:
      # Single year or less - make one API call
      return await self.fetch_contributions_single_year(username, from_date, to_date)

  def merge_contributions(
    self, 
    existing: List[Dict[str, int]], 
    new: List[Dict[str, int]]
  ) -> List[Dict[str, int]]:
    """Merge new contributions with existing, overwriting overlapping dates"""
    # Create a dictionary from existing contributions for easy lookup
    contributions_dict = {item["date"]: item["count"] for item in existing}
    
    # Update with new contributions (overwrites overlapping dates)
    for item in new:
      contributions_dict[item["date"]] = item["count"]
    
    # Convert back to list and sort by date
    merged = [
      {"date": date, "count": count}
      for date, count in sorted(contributions_dict.items())
    ]
    
    return merged

  async def ingest_contributions(
    self, 
    from_date: Optional[datetime] = None,
    to_date: Optional[datetime] = None,
    force_full_load: bool = False
  ) -> Dict:
    """Ingest contributions from GitHub API and store in database
    
    Args:
      from_date: Optional start date for data range (YYYY-MM-DD string or datetime)
      to_date: Optional end date for data range (YYYY-MM-DD string or datetime)
      force_full_load: If True, replace all existing data instead of merging
    """
    # Fetch username from token
    username = await self.fetch_github_username()
    
    # Handle date parameters
    if isinstance(from_date, str):
      from_date = datetime.fromisoformat(from_date)
    if isinstance(to_date, str):
      to_date = datetime.fromisoformat(to_date)
    
    # Check if we have existing data and should do incremental update
    existing_stats = self.get_github_stats()
    should_merge = not force_full_load and existing_stats and existing_stats.get("lastUpdated")
    
    if from_date and to_date:
      # Custom date range provided - fetch that range
      contributions = await self.fetch_contributions(username, from_date, to_date)
      
      # Group contributions by year
      contributions_by_year = {}
      for contrib in contributions:
        year = contrib["date"][:4]  # Extract year from YYYY-MM-DD format
        if year not in contributions_by_year:
          contributions_by_year[year] = []
        contributions_by_year[year].append(contrib)
      
      # Store/update each year as a separate document
      total_contributions_all_years = 0
      total_count_all_years = 0
      years_updated = []
      latest_update = datetime.utcnow().isoformat() + "Z"
      
      try:
        for year, year_contributions in contributions_by_year.items():
          year_total = sum(item["count"] for item in year_contributions)
          total_contributions_all_years += year_total
          total_count_all_years += len(year_contributions)
          
          year_doc = {
            "_id": year,
            "contributions": year_contributions,
            "lastUpdated": latest_update,
            "totalContributions": year_total,
            "username": username,
            "year": int(year)
          }
          
          if force_full_load:
            # Replace the year document
            self.collection.replace_one(
              {"_id": year},
              year_doc,
              upsert=True
            )
            years_updated.append(year)
          elif should_merge:
            # Merge with existing year data
            existing_year_doc = self.collection.find_one({"_id": year})
            if existing_year_doc:
              existing_contribs = existing_year_doc.get("contributions", [])
              merged_contribs = self.merge_contributions(existing_contribs, year_contributions)
              year_doc["contributions"] = merged_contribs
              year_doc["totalContributions"] = sum(item["count"] for item in merged_contribs)
            
            self.collection.replace_one(
              {"_id": year},
              year_doc,
              upsert=True
            )
            years_updated.append(year)
          else:
            # Update or insert year document
            self.collection.replace_one(
              {"_id": year},
              year_doc,
              upsert=True
            )
            years_updated.append(year)
      except (ServerSelectionTimeoutError, ConnectionFailure, PyMongoError) as e:
        raise Exception(f"Failed to save to MongoDB: {str(e)}")
      
      return {
        "status": "updated" if should_merge else "created",
        "contributionsCount": total_count_all_years,
        "totalContributions": total_contributions_all_years,
        "lastUpdated": latest_update,
        "yearsUpdated": years_updated
      }
    elif should_merge:
      # Incremental update: fetch from 3 days before last update to today
      last_updated = datetime.fromisoformat(existing_stats["lastUpdated"].replace("Z", "+00:00"))
      from_date = last_updated - timedelta(days=3)
      to_date = datetime.now()
      
      # Fetch new contributions
      new_contributions = await self.fetch_contributions(username, from_date, to_date)
      
      # Group by year and update each year document
      contributions_by_year = {}
      for contrib in new_contributions:
        year = contrib["date"][:4]
        if year not in contributions_by_year:
          contributions_by_year[year] = []
        contributions_by_year[year].append(contrib)
      
      total_contributions_all_years = 0
      total_count_all_years = 0
      years_updated = []
      latest_update = datetime.utcnow().isoformat() + "Z"
      
      try:
        for year, year_contributions in contributions_by_year.items():
          # Get existing year data
          existing_year_doc = self.collection.find_one({"_id": year})
          existing_contribs = existing_year_doc.get("contributions", []) if existing_year_doc else []
          
          # Merge with new data
          merged_contribs = self.merge_contributions(existing_contribs, year_contributions)
          year_total = sum(item["count"] for item in merged_contribs)
          total_contributions_all_years += year_total
          total_count_all_years += len(merged_contribs)
          
          year_doc = {
            "_id": year,
            "contributions": merged_contribs,
            "lastUpdated": latest_update,
            "totalContributions": year_total,
            "username": username,
            "year": int(year)
          }
          
          self.collection.replace_one(
            {"_id": year},
            year_doc,
            upsert=True
          )
          years_updated.append(year)
      except (ServerSelectionTimeoutError, ConnectionFailure, PyMongoError) as e:
        raise Exception(f"Failed to update MongoDB: {str(e)}")
      
      return {
        "status": "updated",
        "contributionsCount": total_count_all_years,
        "totalContributions": total_contributions_all_years,
        "lastUpdated": latest_update,
        "yearsUpdated": years_updated
      }
    else:
      # Initial load: fetch last year
      to_date = datetime.now()
      from_date = to_date - timedelta(days=365)
      
      contributions = await self.fetch_contributions(username, from_date, to_date)
      
      # Group by year (should be just one year for initial load)
      contributions_by_year = {}
      for contrib in contributions:
        year = contrib["date"][:4]
        if year not in contributions_by_year:
          contributions_by_year[year] = []
        contributions_by_year[year].append(contrib)
      
      total_contributions_all_years = 0
      total_count_all_years = 0
      years_updated = []
      latest_update = datetime.utcnow().isoformat() + "Z"
      
      try:
        for year, year_contributions in contributions_by_year.items():
          year_total = sum(item["count"] for item in year_contributions)
          total_contributions_all_years += year_total
          total_count_all_years += len(year_contributions)
          
          year_doc = {
            "_id": year,
            "contributions": year_contributions,
            "lastUpdated": latest_update,
            "totalContributions": year_total,
            "username": username,
            "year": int(year)
          }
          
          self.collection.replace_one(
            {"_id": year},
            year_doc,
            upsert=True
          )
          years_updated.append(year)
      except (ServerSelectionTimeoutError, ConnectionFailure, PyMongoError) as e:
        raise Exception(f"Failed to insert into MongoDB: {str(e)}")
      
      return {
        "status": "created",
        "contributionsCount": total_count_all_years,
        "totalContributions": total_contributions_all_years,
        "lastUpdated": latest_update,
        "yearsUpdated": years_updated
      }

  def check_rate_limit(self) -> tuple[bool, Optional[str]]:
    """Check if ingestion can proceed based on rate limit (1 hour for non-dev environments)"""
    environment = os.getenv("ENVIRONMENT", "dev").lower()
    
    # No rate limit in dev environment
    if environment == "dev":
      return True, None
    
    # Check rate limit for other environments
    try:
      existing_stats = self.get_github_stats()
      if not existing_stats or not existing_stats.get("lastUpdated"):
        return True, None
    except Exception as e:
      # If we can't check rate limit due to DB issues, allow the request
      print(f"Error checking rate limit: {str(e)}")
      return True, None
    
    try:
      # Parse the ISO format timestamp (handles both with and without timezone)
      last_updated_str = existing_stats["lastUpdated"]
      if last_updated_str.endswith("Z"):
        last_updated_str = last_updated_str[:-1] + "+00:00"
      
      last_updated = datetime.fromisoformat(last_updated_str)
      # Convert to UTC naive datetime for comparison
      if last_updated.tzinfo:
        last_updated = last_updated.replace(tzinfo=None)
      
      time_since_update = datetime.utcnow() - last_updated
      
      # Rate limit: 1 hour
      if time_since_update < timedelta(hours=1):
        remaining_seconds = int((timedelta(hours=1) - time_since_update).total_seconds())
        return False, f"Rate limit: Please wait {remaining_seconds} seconds before next ingestion"
      
      return True, None
    except (ValueError, AttributeError) as e:
      # If parsing fails, allow the request (better to allow than block)
      return True, None

