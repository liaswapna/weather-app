from fastapi import FastAPI
from src.core.config import Config
from src.core.logging import configureLogging
from src.api.weather import router

# Configure logging based on environment
configureLogging()

# Initialize FastAPI app
app = FastAPI(
    title="Weather App",
    description="A simple weather API wrapper using Open-Meteo",
    version="1.0.0",
    debug=Config.DEBUG
)

# Include routes
app.include_router(router)
