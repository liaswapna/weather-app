import ApiClient from './api';
import { ApiError, WeatherNotFoundError } from '../utils/errors';
import { CurrentWeather, Forecast } from '../types/weather.types';

// Main test suite for ApiClient
describe('ApiClient - Critical Paths', () => {
  let apiClient: ApiClient;
  const baseUrl = 'http://localhost:8000';

  // Sample mock data
  const mockWeatherData: CurrentWeather = {
    city: 'London',
    temperature: 15,
    condition: 'Rainy',
    humidity: 75,
    windSpeed: 20,
  };

  const mockForecastData: Forecast = {
    city: 'London',
    days: [
      { date: 'Monday', maxTemp: 20, minTemp: 15, condition: 'Sunny' },
      { date: 'Tuesday', maxTemp: 18, minTemp: 12, condition: 'Cloudy' },
      { date: 'Wednesday', maxTemp: 15, minTemp: 10, condition: 'Rainy' },
      { date: 'Thursday', maxTemp: 16, minTemp: 11, condition: 'Rainy' },
      { date: 'Friday', maxTemp: 19, minTemp: 14, condition: 'Clear' },
      { date: 'Saturday', maxTemp: 22, minTemp: 17, condition: 'Sunny' },
      { date: 'Sunday', maxTemp: 24, minTemp: 19, condition: 'Clear' },
    ],
  };

  // Setup before each test
  beforeEach(() => {
    // Create ApiClient instance
    apiClient = new ApiClient(baseUrl);

    // Mock the global fetch function
    global.fetch = jest.fn();
  });

  // Cleanup after each test
  afterEach(() => {
    jest.resetAllMocks();
  });

  // CRITICAL PATH 1: Successful API call - getWeather
  describe('Path 1: Successful API Calls', () => {
    test('getWeather should fetch and return CurrentWeather for valid city', async () => {
      // Setup: Mock fetch to return successful response
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockWeatherData),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call getWeather
      const result = await apiClient.getWeather('London');

      // Verify: Correct URL was called
      expect(global.fetch).toHaveBeenCalledWith(`${baseUrl}/weather/London`);

      // Verify: Returned data matches expected structure
      expect(result).toEqual(mockWeatherData);
      expect(result.city).toBe('London');
      expect(result.temperature).toBe(15);
      expect(result.condition).toBe('Rainy');
      expect(result.humidity).toBe(75);
      expect(result.windSpeed).toBe(20);
    });

    test('getForecast should fetch and return Forecast for valid city', async () => {
      // Setup: Mock fetch to return successful forecast
      const mockResponse = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(mockForecastData),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call getForecast
      const result = await apiClient.getForecast('London');

      // Verify: Correct URL was called
      expect(global.fetch).toHaveBeenCalledWith(`${baseUrl}/forecast/London`);

      // Verify: Returned data matches expected structure
      expect(result).toEqual(mockForecastData);
      expect(result.city).toBe('London');
      expect(result.days).toHaveLength(7);
      expect(result.days[0].date).toBe('Monday');
    });
  });

  // CRITICAL PATH 2: Handle 404 error - City not found
  describe('Path 2: City Not Found (404) Error', () => {
    test('getWeather should throw WeatherNotFoundError when city not found (404)', async () => {
      // Setup: Mock fetch to return 404
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn(),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call getWeather with invalid city
      try {
        await apiClient.getWeather('XYZ');
        // Should not reach here
        fail('Expected WeatherNotFoundError to be thrown');
      } catch (error) {
        // Verify: Error is WeatherNotFoundError
        expect(error).toBeInstanceOf(WeatherNotFoundError);

        // Verify: Error contains city name
        if (error instanceof WeatherNotFoundError) {
          expect(error.city).toBe('XYZ');
          expect(error.message).toContain('XYZ');
        }
      }
    });

    test('getForecast should throw WeatherNotFoundError when city not found (404)', async () => {
      // Setup: Mock fetch to return 404
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: jest.fn(),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call getForecast with invalid city
      try {
        await apiClient.getForecast('InvalidCity');
        fail('Expected WeatherNotFoundError to be thrown');
      } catch (error) {
        // Verify: Error is WeatherNotFoundError
        expect(error).toBeInstanceOf(WeatherNotFoundError);
      }
    });
  });

  // CRITICAL PATH 3: Handle 500 error - Server error
  describe('Path 3: Server Error (500)', () => {
    test('getWeather should throw ApiError when server returns 500', async () => {
      // Setup: Mock fetch to return 500
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: jest.fn(),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      // Call getWeather
      try {
        await apiClient.getWeather('London');
        fail('Expected ApiError to be thrown');
      } catch (error) {
        // Verify: Error is ApiError (not WeatherNotFoundError)
        expect(error).toBeInstanceOf(ApiError);
        expect(error).not.toBeInstanceOf(WeatherNotFoundError);

        // Verify: Error contains status code
        if (error instanceof ApiError) {
          expect(error.statusCode).toBe(500);
          expect(error.message).toContain('Internal Server Error');
        }
      }
    });

    test('getForecast should throw ApiError on network failure', async () => {
      // Setup: Mock fetch to throw network error
      (global.fetch as jest.Mock).mockRejectedValue(
        new TypeError('Failed to fetch')
      );

      // Call getForecast
      try {
        await apiClient.getForecast('London');
        fail('Expected ApiError to be thrown');
      } catch (error) {
        // Verify: Error is ApiError with network message
        expect(error).toBeInstanceOf(ApiError);
        if (error instanceof ApiError) {
          expect(error.message).toContain('Network error');
        }
      }
    });
  });
});
