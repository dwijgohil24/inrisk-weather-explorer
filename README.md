# inrisk-weather-explorer

Problem Statement : 
Build and deploy a small full-stack weather explorer that:
1. Fetches historical daily weather for a user-chosen location and date range
(Open-Meteo API).
2. Stores the raw JSON in a Cloud object storage (Google Cloud Storage or AWS
S3) of your choice - Use only free-tier / no-cost resources - Nothing that
requires a paid plan or credit card commitment beyond a provider's free tier
3. Exposes a web dashboard to trigger fetch/store, list stored files, view a file, and visualize temps.