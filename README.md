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
- GCP Cloud Run — planned deployment target for the backend (containerized).
