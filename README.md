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

**Frontend**
- **Next.js** (App Router) + plain **JavaScript** — TypeScript was deliberately skipped for
  this project; starting React itself from zero, adding a type system on top at the same time
  would have doubled what was being learned per line of code. Noted here as a scope decision,
  not an oversight.
- **Tailwind CSS v4** — CSS-first theming via an `@theme` block (no `tailwind.config.js`),
  custom brand color palette and font wired up in `globals.css`.
- **Recharts** — the temperature line chart.
  
**Cloud**
- Google Cloud Storage (GCS) — object storage for the raw weather JSON.
- GCP Cloud Run — planned deployment target for the backend (containerized).*

## Backend Architecture
 
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

## Frontend Architecture
 
```
frontend/
  src/
    app/
      layout.jsx              # root layout, loads Inter font via next/font/google
      page.jsx                 # thin server component — header + <Dashboard />
      globals.css               # Tailwind v4 @theme block: brand colors, warm accent, font
    components/
      Card.jsx                   # reusable card wrapper, shared styling
      Dashboard.jsx                # client component — owns ALL shared state
      InputPanel.jsx                # form -> POST /store-weather-data
      FileList.jsx                   # presentational — renders stored files, no fetching
      DailyTable.jsx                  # paginated table (10/20/50 rows)
      TemperatureChart.jsx             # Recharts line chart
    lib/
      api.js                    # centralized fetch wrapper for every backend call
      weather.js                 # shared transform: Open-Meteo arrays -> row objects
  .env.local                  # NEXT_PUBLIC_API_URL, gitignored
  package.json
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

**Frontend:**
```bash
cd frontend
npm install
```
 
Create `frontend/.env.local` (gitignored):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```
 
```bash
npm run dev
```
Open `http://localhost:3000`.
 
- API docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`
Run tests:
```bash
pytest
```
