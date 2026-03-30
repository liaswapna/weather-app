import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from src.main import app

client = TestClient(app)


class TestHealthEndpoint:
    def test_health_check_returns_ok(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "OK"}


class TestWeatherEndpoint:
    def test_weather_success_returns_current_weather(self):
        with patch("src.services.weather.WeatherService.getCoordinates") as mockCoordinates, \
             patch("src.services.weather.WeatherService.getCurrentWeather") as mockWeather:

            mockCoordinates.return_value = {
                "latitude": 51.5074,
                "longitude": -0.1278,
                "name": "London"
            }
            mockWeather.return_value = {
                "city": "London",
                "temperature": 15.2,
                "condition": "Cloudy",
                "humidity": 72,
                "windSpeed": 10.5
            }

            response = client.get("/weather/London")
            assert response.status_code == 200
            data = response.json()
            assert data["city"] == "London"
            assert data["temperature"] == 15.2
            assert data["condition"] == "Cloudy"

    def test_weather_city_not_found_returns_404(self):
        with patch("src.services.weather.WeatherService.getCoordinates") as mockCoordinates:
            mockCoordinates.return_value = None

            response = client.get("/weather/InvalidCity")
            assert response.status_code == 404
            assert response.json()["detail"] == "City not found"

    def test_weather_api_failure_returns_500(self):
        with patch("src.services.weather.WeatherService.getCoordinates") as mockCoordinates, \
             patch("src.services.weather.WeatherService.getCurrentWeather") as mockWeather:

            mockCoordinates.return_value = {
                "latitude": 51.5074,
                "longitude": -0.1278,
                "name": "London"
            }
            mockWeather.return_value = None

            response = client.get("/weather/London")
            assert response.status_code == 500
            assert response.json()["detail"] == "Failed to fetch weather data"


class TestForecastEndpoint:
    def test_forecast_success_returns_forecast_data(self):
        with patch("src.services.weather.WeatherService.getCoordinates") as mockCoordinates, \
             patch("src.services.weather.WeatherService.getForecast") as mockForecast:

            mockCoordinates.return_value = {
                "latitude": 51.5074,
                "longitude": -0.1278,
                "name": "London"
            }
            mockForecast.return_value = {
                "city": "London",
                "days": [
                    {
                        "date": "2024-01-01",
                        "maxTemp": 15.0,
                        "minTemp": 10.0,
                        "condition": "Sunny"
                    },
                    {
                        "date": "2024-01-02",
                        "maxTemp": 14.0,
                        "minTemp": 9.0,
                        "condition": "Cloudy"
                    }
                ]
            }

            response = client.get("/forecast/London")
            assert response.status_code == 200
            data = response.json()
            assert data["city"] == "London"
            assert len(data["days"]) == 2
            assert data["days"][0]["condition"] == "Sunny"

    def test_forecast_city_not_found_returns_404(self):
        with patch("src.services.weather.WeatherService.getCoordinates") as mockCoordinates:
            mockCoordinates.return_value = None

            response = client.get("/forecast/InvalidCity")
            assert response.status_code == 404
            assert response.json()["detail"] == "City not found"

    def test_forecast_empty_data_returns_empty_days(self):
        with patch("src.services.weather.WeatherService.getCoordinates") as mockCoordinates, \
             patch("src.services.weather.WeatherService.getForecast") as mockForecast:

            mockCoordinates.return_value = {
                "latitude": 51.5074,
                "longitude": -0.1278,
                "name": "London"
            }
            mockForecast.return_value = {
                "city": "London",
                "days": []
            }

            response = client.get("/forecast/London")
            assert response.status_code == 200
            data = response.json()
            assert data["city"] == "London"
            assert len(data["days"]) == 0
