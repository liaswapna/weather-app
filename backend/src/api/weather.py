from fastapi import HTTPException, APIRouter
from src.services.weather import WeatherService
from src.schemas.weather import CurrentWeather, Forecast

# Create router
router = APIRouter()

# Initialize the weather service
weatherService = WeatherService()


@router.get("/health")
def healthCheck():
    """
    Health check endpoint to verify the API is running

    Returns:
        Status message
    """
    return {"status": "OK"}


@router.get("/weather/{city}", response_model=CurrentWeather)
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


@router.get("/forecast/{city}", response_model=Forecast)
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
