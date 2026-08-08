from fastapi.testclient import TestClient

from app.main import app
from app.clients.open_meteo import OpenMeteoError
from app.clients.gcs import StorageError, FileNotFoundInBucket

client = TestClient(app)


def test_store_weather_data_returns_502_on_open_meteo_failure(monkeypatch):
    def fake_fetch(*args, **kwargs):
        raise OpenMeteoError("upstream down")

    monkeypatch.setattr("app.routes.weather.fetch_weather_data", fake_fetch)

    response = client.post("/store-weather-data", json={
        "latitude": 40.7, "longitude": -74.0,
        "start_date": "2026-07-01", "end_date": "2026-07-05",
    })

    assert response.status_code == 502
    assert response.json()["status"] == "error"


def test_list_weather_files_returns_500_on_storage_failure(monkeypatch):
    def fake_list_files():
        raise StorageError("bucket unreachable")

    monkeypatch.setattr("app.routes.weather.list_files", fake_list_files)

    response = client.get("/list-weather-files")

    assert response.status_code == 500
    assert response.json()["status"] == "error"


def test_weather_file_content_returns_404_when_missing(monkeypatch):
    def fake_read_json(filename):
        raise FileNotFoundInBucket(filename)

    monkeypatch.setattr("app.routes.weather.read_json", fake_read_json)

    response = client.get("/weather-file-content/does-not-exist.json")

    assert response.status_code == 404
    assert response.json() == {"status": "error", "message": "not found"}