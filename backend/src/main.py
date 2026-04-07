from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

# Enable CORS with environment-specific origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router)
