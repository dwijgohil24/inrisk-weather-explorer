from datetime import datetime, timezone
from fastapi import APIRouter

from app.schemas import WeatherRequest
from app.clients.open_meteo import fetch_weather_data
from app.clients.gcs import upload_json
from app.clients.gcs import list_files
from fastapi.responses import JSONResponse
from app.clients.gcs import read_json, FileNotFoundInBucket

router = APIRouter()


@router.post("/store-weather-data")
def store_weather_data(payload: WeatherRequest):
    weather_data = fetch_weather_data(
        payload.latitude,
        payload.longitude,
        payload.start_date.isoformat(),
        payload.end_date.isoformat(),
    )

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    filename = (
        f"weather_{payload.latitude}_{payload.longitude}_"
        f"{payload.start_date.isoformat()}_{payload.end_date.isoformat()}_"
        f"{timestamp}.json"
    )

    upload_json(filename, weather_data)

    return {"status": "ok", "file": filename}

@router.get("/list-weather-files")
def list_weather_files():
    files = list_files()
    return {"files": files}

@router.get("/weather-file-content/{file}")
def weather_file_content(file: str):
    return read_json(file)