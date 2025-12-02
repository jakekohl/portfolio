# Backend Services
Simple backend for hosting data for [Jake Kohl's Professional Portfolio Site](https://www.jakekohl.dev)

## Getting Started

```
# Clone the repo
git clone https://github.com/jakekohl/portfolio

# Install requirements
cd backend
pip install -r requirements.txt

# Run the main.py
python main.py
```

## General API Notes

`POST /github-stats/ingest` is setup to requires a secret header in order to invoke it. It also should be rate-limited unless running locally using the `ENVIRONMENT="DEV"` variable.

```
curl -X POST "http://localhost:8000/github-stats/ingest?from_date=2014-01-01&to_date=2025-12-31&force_full_load=true" \
  -H "X-GitHub-Stats-Secret: [insert GITHUB_SECRET value here]"
```