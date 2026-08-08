const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function storeWeatherData(payload) {
  return apiRequest("/store-weather-data", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listWeatherFiles() {
  return apiRequest("/list-weather-files");
}

export function getWeatherFileContent(filename) {
  return apiRequest(`/weather-file-content/${encodeURIComponent(filename)}`);
}