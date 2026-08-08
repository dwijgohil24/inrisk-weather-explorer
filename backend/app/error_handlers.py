from fastapi import FastAPI
from fastapi.responses import JSONResponse

from app.clients.gcs import StorageError, FileNotFoundInBucket
from app.clients.open_meteo import OpenMeteoError


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(FileNotFoundInBucket)
    async def file_not_found_handler(request, exc):
        return JSONResponse(status_code=404, content={"status": "error", "message": "not found"})

    @app.exception_handler(StorageError)
    async def storage_error_handler(request, exc):
        return JSONResponse(status_code=500, content={"status": "error", "message": "storage operation failed"})

    @app.exception_handler(OpenMeteoError)
    async def open_meteo_error_handler(request, exc):
        return JSONResponse(
            status_code=502,
            content={"status": "error", "message": "failed to fetch weather data from upstream provider"},
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request, exc):
        return JSONResponse(status_code=500, content={"status": "error", "message": "internal server error"})