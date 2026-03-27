from datetime import timedelta


class Config:
    """Application configuration - centralized settings for the weather app wrapper"""

    # Cache settings
    # How long to keep cached weather databefore refreshing
    CACHE_DURATION = timedelta(minutes=10)

    # Open-Meteo API endpoints
    # Convert city name to coordinates
    OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
    # Fetch weather and forecast data
    OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
