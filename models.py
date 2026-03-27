from pydantic import BaseModel


class CurrentWeather(BaseModel):
    """Response model for current weather data"""
    city: str
    temperature: float
    condition: str
    humidity: int
    windSpeed: float


class ForecastDay(BaseModel):
    """Model representing weather for a single day"""
    date: str
    maxTemp: float
    minTemp: float
    condition: str


class Forecast(BaseModel):
    """Response model for multi-day forecast"""
    city: str
    days: list[ForecastDay]
