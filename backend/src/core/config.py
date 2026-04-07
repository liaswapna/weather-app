from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration - centralized settings for the weather app wrapper"""
    # Environment settings
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    DEBUG = os.getenv("DEBUG", "true").lower() == "true"

    # Cache settings
    # How long to keep cached weather databefore refreshing
    CACHE_DURATION = timedelta(minutes=10)

    # Open-Meteo API endpoints
    # Convert city name to coordinates
    OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
    # Fetch weather and forecast data
    OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
