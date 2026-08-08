# import httpx
# import json
from app.clients.open_meteo import fetch_weather_data

# BASE_URL = "https://archive-api.open-meteo.com/v1/archive"

# params = {
#     "latitude": 40.71,
#     "longitude": -74.01,
#     "start_date": "2026-07-01",
#     "end_date": "2026-07-03",
#     "daily": "temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min",
#     "timezone": "auto",
# }

data = fetch_weather_data(40.71, -74.01, "2026-07-01", "2026-07-03")
print(data["daily"]["time"])
# response = httpx.get(BASE_URL, params=params, timeout=10)
# response.raise_for_status()
# print(json.dumps(response.json(), indent=2))