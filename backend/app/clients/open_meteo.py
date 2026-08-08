import httpx

OPEN_METEO_URL = "https://archive-api.open-meteo.com/v1/archive"
DAILY_VARIABLES = "temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min"


class OpenMeteoError(Exception):
    """Raised when the Open-Meteo API call fails or is unreachable."""


def fetch_weather_data(latitude: float, longitude: float, start_date: str, end_date: str) -> dict:
    params = {
        "latitude": latitude,
        "longitude": longitude,
        "start_date": start_date,
        "end_date": end_date,
        "daily": DAILY_VARIABLES,
        "timezone": "auto",
    }
    try:
        response = httpx.get(OPEN_METEO_URL, params=params, timeout=10)
        response.raise_for_status()
    except httpx.HTTPError as e:
        raise OpenMeteoError(f"failed to fetch weather data: {e}") from e

    return response.json()