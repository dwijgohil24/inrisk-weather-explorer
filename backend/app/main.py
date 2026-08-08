from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import config
from app.routes import health
from app.routes import weather
from app.error_handlers import register_exception_handlers

app = FastAPI(title="InRisk Weather Explorer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(weather.router)
register_exception_handlers(app)