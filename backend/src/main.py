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

# Enable CORS for development (allow requests from frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(router)
