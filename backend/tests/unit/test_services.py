import pytest
from unittest.mock import patch
from src.services.weather import WeatherService
from src.schemas.weather import CurrentWeather


class TestGetWeatherCondition:
    """Test suite for getWeatherCondition method"""

    def test_sunny_condition_returns_sunny(self):
        """Test weather code 0 returns 'Sunny'"""
        service = WeatherService()
        assert service.getWeatherCondition(0) == "Sunny"

    def test_cloudy_condition_returns_cloudy(self):
        """Test weather code 3 returns 'Cloudy'"""
        service = WeatherService()
        assert service.getWeatherCondition(3) == "Cloudy"

    def test_light_rain_condition_returns_light_rain(self):
        """Test weather code 61 returns 'Light Rain'"""
        service = WeatherService()
        assert service.getWeatherCondition(61) == "Light Rain"

    def test_unknown_code_returns_unknown(self):
        """Test invalid weather code returns 'Unknown'"""
        service = WeatherService()
        assert service.getWeatherCondition(999) == "Unknown"


class TestGetCoordinates:
    """Test suite for getCoordinates method"""

    @pytest.mark.asyncio
    async def test_success_returns_coordinates(self):
        """Test successful coordinate retrieval for valid city"""
        service = WeatherService()
        mockData = {
            "results": [
                {
                    "latitude": 51.5074,
                    "longitude": -0.1278,
                    "name": "London"
                }
            ]
        }

        with patch('src.services.weather.WeatherService.makeApiRequest',
                   return_value=mockData):
            result = await service.getCoordinates("London")

            assert result is not None
            assert result["latitude"] == 51.5074
            assert result["longitude"] == -0.1278
            assert result["name"] == "London"

    @pytest.mark.asyncio
    async def test_city_not_found_returns_none(self):
        """Test getCoordinates returns None for non-existent city"""
        service = WeatherService()
        mockData = {"results": []}

        with patch('src.services.weather.WeatherService.makeApiRequest',
                   return_value=mockData):
            result = await service.getCoordinates("InvalidCity123")

            assert result is None

    @pytest.mark.asyncio
    async def test_cache_hit_second_call(self):
        """Test that second call uses cache and doesn't call API"""
        service = WeatherService()
        mockData = {
            "results": [
                {
                    "latitude": 51.5074,
                    "longitude": -0.1278,
                    "name": "London"
                }
            ]
        }

        with patch('src.services.weather.WeatherService.makeApiRequest',
                   return_value=mockData) as mockApi:
            # First call
            result1 = await service.getCoordinates("London")

            # Second call should use cache
            result2 = await service.getCoordinates("London")

            # API should only be called once
            assert mockApi.call_count == 1
            assert result1 == result2


class TestGetCurrentWeather:
    """Test suite for getCurrentWeather method"""

    @pytest.mark.asyncio
    async def test_success_returns_current_weather(self):
        """Test successful weather data retrieval"""
        service = WeatherService()
        mockData = {
            "current": {
                "temperature_2m": 15.5,
                "weather_code": 3,
                "relative_humidity_2m": 65,
                "wind_speed_10m": 10.2
            }
        }

        with patch('src.services.weather.WeatherService.makeApiRequest',
                   return_value=mockData):
            result = await service.getCurrentWeather(51.5, -0.1, "London")

            assert result is not None
            assert result.city == "London"
            assert result.temperature == 15.5
            assert result.condition == "Cloudy"
            assert result.humidity == 65
            assert result.windSpeed == 10.2

    @pytest.mark.asyncio
    async def test_api_failure_returns_none(self):
        """Test getCurrentWeather returns None when API fails"""
        service = WeatherService()
        mockData = {"current": None}

        with patch('src.services.weather.WeatherService.makeApiRequest',
                   return_value=mockData):
            result = await service.getCurrentWeather(51.5, -0.1, "London")

            assert result is None


class TestGetForecast:
    """Test suite for getForecast method"""

    @pytest.mark.asyncio
    async def test_success_returns_forecast(self):
        """Test successful 7-day forecast retrieval"""
        service = WeatherService()
        mockData = {
            "daily": {
                "time": ["2026-03-27", "2026-03-28"],
                "temperature_2m_max": [20.0, 18.0],
                "temperature_2m_min": [10.0, 8.0],
                "weather_code": [0, 1]
            }
        }

        with patch('src.services.weather.WeatherService.makeApiRequest',
                   return_value=mockData):
            result = await service.getForecast(51.5, -0.1, "London")

            assert result is not None
            assert result.city == "London"
            assert len(result.days) == 2
            assert result.days[0].date == "2026-03-27"
            assert result.days[0].maxTemp == 20.0

    @pytest.mark.asyncio
    async def test_no_data_returns_empty_forecast(self):
        """Test getForecast returns empty forecast when no data"""
        service = WeatherService()
        mockData = {"daily": None}

        with patch('src.services.weather.WeatherService.makeApiRequest',
                   return_value=mockData):
            result = await service.getForecast(51.5, -0.1, "London")

            assert result is not None
            assert result.city == "London"
            assert len(result.days) == 0
