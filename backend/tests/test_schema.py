import pytest
from pydantic import ValidationError

from app.schemas import WeatherRequest


def test_valid_request():
    req = WeatherRequest(
        latitude=40.7, longitude=-74.0,
        start_date="2026-07-01", end_date="2026-07-05",
    )
    assert req.latitude == 40.7


def test_latitude_out_of_range():
    with pytest.raises(ValidationError):
        WeatherRequest(
            latitude=200, longitude=-74.0,
            start_date="2026-07-01", end_date="2026-07-05",
        )


def test_longitude_out_of_range():
    with pytest.raises(ValidationError):
        WeatherRequest(
            latitude=40.7, longitude=-200,
            start_date="2026-07-01", end_date="2026-07-05",
        )


def test_end_date_before_start_date():
    with pytest.raises(ValidationError):
        WeatherRequest(
            latitude=40.7, longitude=-74.0,
            start_date="2026-07-05", end_date="2026-07-01",
        )


def test_date_range_too_long():
    with pytest.raises(ValidationError):
        WeatherRequest(
            latitude=40.7, longitude=-74.0,
            start_date="2026-07-01", end_date="2026-08-15",  # >30 days
        )


def test_invalid_date_format():
    with pytest.raises(ValidationError):
        WeatherRequest(
            latitude=40.7, longitude=-74.0,
            start_date="not-a-date", end_date="2026-07-05",
        )