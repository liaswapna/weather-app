import httpx
from typing import Optional
from config import Config
from models import CurrentWeather, Forecast, ForecastDay


class WeatherService:
    """Handles all weather-related API calls and data processing"""

    def __init__(self):
        self.geocodingUrl = Config.OPEN_METEO_GEOCODING_URL
        self.forecastUrl = Config.OPEN_METEO_FORECAST_URL

    async def makeApiRequest(self, url: str, params: dict) -> dict:
        """
        Make an HTTP GET request to Open-Meteo API

        Args:
            url: The API endpoint URL
            params: Query parameters for the request

        Returns:
            JSON response as dictionary
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            data = response.json()

        return data

    async def getCoordinates(self, city: str) -> Optional[dict]:
        """
        Convert city name to latitude and longitude coordinates

        Args:
            city: City name (e.g., "London")

        Returns:
            Dictionary with latitude, longitude, and name, or None if not found
        """

        params = {"name": city, "count": 1, "language": "en"}
        data = await self.makeApiRequest(self.geocodingUrl, params)

        if not data.get("results"):
            return None

        result = data["results"][0]
        return {
            "latitude": result["latitude"],
            "longitude": result["longitude"],
            "name": city
        }

    def getWeatherCondition(self, weatherCode: int) -> str:
        """
        Convert weather code to human-readable condition

        Args:
            weatherCode: Numeric code from Open-Meteo API

        Returns:
            Weather condition as string (e.g., "Sunny", "Rainy")
        """
        conditions = {
            0: "Sunny",
            1: "Mainly Sunny",
            2: "Partly Cloudy",
            3: "Cloudy",
            45: "Foggy",
            48: "Foggy",
            51: "Light Drizzle",
            53: "Moderate Drizzle",
            55: "Heavy Drizzle",
            61: "Light Rain",
            63: "Moderate Rain",
            65: "Heavy Rain",
            71: "Light Snow",
            73: "Moderate Snow",
            75: "Heavy Snow",
            80: "Light Showers",
            81: "Moderate Showers",
            82: "Heavy Showers",
        }
        return conditions.get(weatherCode, "Unknown")

    async def getCurrentWeather(self, latitude: float, longitude: float, cityName: str) -> CurrentWeather:
        """
        Fetch current weather data for given coordinates

        Args:
            latitude: Location latitude
            longitude: Location longitude
            cityName: City name for the response

        Returns:
            CurrentWeather object with temperature, condition, humidity, windspeed
        """
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "current": "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m"
        }

        data = await self.makeApiRequest(self.forecastUrl, params)

        current = data.get("current")
        if not current:
            return None

        return CurrentWeather(
            city=cityName,
            temperature=current["temperature_2m"],
            condition=self.getWeatherCondition(current["weather_code"]),
            humidity=current["relative_humidity_2m"],
            windSpeed=current["wind_speed_10m"]
        )

    async def getForecast(self, latitude: float, longitude: float, cityName: str) -> Forecast:
        """
        Fetch 7-day weather forecast for given coordinates

        Args:
            latitude: Location latitude
            longitude: Location longitude
            cityName: City name for the response

        Returns:
            Forecast object containing 7 days of weather data
        """
        params = {
            "latitude": latitude,
            "longitude": longitude,
            "daily": "weather_code,temperature_2m_max,temperature_2m_min"
        }

        data = await self.makeApiRequest(self.forecastUrl, params)
        if not data.get("daily") or not data["daily"].get("time"):
            return Forecast(city=cityName, days=[])

        daily = data["daily"]
        days = []
        for day in range(len(daily["time"])):
            forecastDay = ForecastDay(
                date=daily["time"][day],
                maxTemp=daily["temperature_2m_max"][day],
                minTemp=daily["temperature_2m_min"][day],
                condition=self.getWeatherCondition(daily["weather_code"][day])
            )
            days.append(forecastDay)

        return Forecast(
            city=cityName,
            days=days
        )
