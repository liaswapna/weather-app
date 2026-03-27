from fastapi import FastAPI, HTTPException
from services import WeatherService
from models import CurrentWeather, Forecast
import logging

# Configure logging to show INFO level and above
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Initialize FastAPI app
app = FastAPI(
    title="Weather App",
    description="A simple weather API wrapper using Open-Meteo",
    version="1.0.0"
)

# Initialize the weather service
weatherService = WeatherService()


@app.get("/health")
def healthCheck():
    """
    Health check endpoint to verify the API is running

    Returns:
        Status message
    """
    return {"status": "OK"}


@app.get("/weather/{city}", response_model=CurrentWeather)
async def getWeatherEndPoint(city: str):
    """
    Get current weather for a city

    Args:
        city: City name (e.g., "London", "New York")

    Returns:
        CurrentWeather object with temperature, condition, humidity, wind speed
    """
    coordinates = await weatherService.getCoordinates(city)

    if not coordinates:
        raise HTTPException(status_code=404, detail="City not found")

    weather = await weatherService.getCurrentWeather(
        coordinates["latitude"],
        coordinates["longitude"],
        coordinates["name"]
    )

    if not weather:
        raise HTTPException(
            status_code=500, detail="Failed to fetch weather data")

    return weather


@app.get("/forecast/{city}", response_model=Forecast)
async def getForecastEndpoint(city: str):
    """
      Get 7-day weather forecast for a city

      Args:
          city: City name (e.g., "London", "New York")

      Returns:
          Forecast object containing 7 days of weather data
    """
    coordinates = await weatherService.getCoordinates(city)

    if not coordinates:
        raise HTTPException(status_code=404, detail="City not found")

    forecast = await weatherService.getForecast(
        coordinates["latitude"],
        coordinates["longitude"],
        coordinates["name"]
    )

    return forecast
