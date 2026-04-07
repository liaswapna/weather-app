from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration - centralized settings for the weather app wrapper"""
    # Environment settings
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    DEBUG = os.getenv("DEBUG", "true").lower() == "true"

    # CORS configuration - environment-specific for security
    if ENVIRONMENT == "development":
        # Development: allow localhost for local testing
        CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]
    else:
        # Production: restrict to specific frontend domain
        # Set FRONTEND_URL environment variable to your production domain
        # Example: https://weather-app.vercel.app or https://yourdomain.com
        CORS_ORIGINS = [os.getenv("FRONTEND_URL", "https://yourdomain.com")]

    # Cache settings
    # How long to keep cached weather databefore refreshing
    CACHE_DURATION = timedelta(minutes=10)

    # Open-Meteo API endpoints
    # Convert city name to coordinates
    OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"
    # Fetch weather and forecast data
    OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"
