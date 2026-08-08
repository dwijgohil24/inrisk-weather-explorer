# InRisk Labs — Weather Explorer
 
A small full-stack app that fetches historical daily weather (Open-Meteo), stores the raw
response in Google Cloud Storage, and exposes a dashboard to trigger fetches, browse stored
files, and visualize temperature data.
 
Built as a case study for InRisk Labs' Full Stack Engineer role.
 
## Tech Stack
 
**Backend**
- Python 3 + FastAPI — chosen over Flask for built-in request validation via Pydantic and
  auto-generated API docs (`/docs`), which double as a manual testing tool while the frontend
  doesn't exist yet.
- `google-cloud-storage` — official SDK for reading/writing/listing objects in GCS.
- `httpx` — for calling the Open-Meteo API.
- `python-dotenv` — loads local config/credentials from `.env` (never committed).

**Cloud**
- Google Cloud Storage (GCS) — object storage for the raw weather JSON.
- GCP Cloud Run — planned deployment target for the backend (containerized). *(Not yet deployed.)*

## Architecture
 
```
backend/
  app/
    main.py              # creates the app, wires middleware/routers/handlers — no logic itself
    config.py             # loads and validates env vars in one place
    error_handlers.py     # centralized exception -> HTTP response mapping
    schemas.py             # Pydantic request models (validation)
    routes/
      health.py
      weather.py           # the three required endpoints
    clients/
      open_meteo.py        # Open-Meteo API wrapper
      gcs.py                # GCS storage wrapper
  scripts/                 # one-off dev/debug scripts, not part of the running app
  tests/
    test_schemas.py         # validation logic, pure unit tests
    test_error_handling.py  # error paths, using FastAPI's TestClient + mocking
  requirements.txt
  pytest.ini
  .env                     # local secrets/config, gitignored
  secrets/key.json          # local-only GCS service account key, gitignored
```
 
Each piece has one job: `routes/` only handles HTTP concerns (parsing requests, returning
responses); `clients/` only knows how to talk to an external service and raises its own
domain-specific exceptions on failure (`OpenMeteoError`, `StorageError`,
`FileNotFoundInBucket`); `error_handlers.py` is the only place that decides how an exception
becomes an HTTP status code, registered once and applied automatically to every route.

## Local Setup
 
```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
 
Create `backend/.env` (gitignored):
```
GCS_BUCKET_NAME=<your-bucket-name>
GCS_PROJECT_ID=inrisk-labs-weather-explorer
GOOGLE_APPLICATION_CREDENTIALS=./secrets/key.json
ALLOWED_ORIGINS=http://localhost:3000
```
 
Place your downloaded service account key at `backend/secrets/key.json`.
 
Run the server:
```bash
uvicorn app.main:app --reload
```
 
- API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`
Run tests:
```bash
pytest
```