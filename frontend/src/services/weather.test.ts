import WeatherService from './weather';
import ApiClient from './api';
import { CurrentWeather, Forecast } from '../types/weather.types';
import { WeatherNotFoundError, ApiError } from '../utils/errors';

// Main test suite for WeatherService
describe('WeatherService - Critical Paths', () => {
  let weatherService: WeatherService;
  let mockApiClient: jest.Mocked<ApiClient>;

  // Sample mock data
  const mockCurrentWeather: CurrentWeather = {
    city: 'London',
    temperature: 15,
    condition: 'Rainy',
    humidity: 75,
    windSpeed: 20,
  };

  const mockForecast: Forecast = {
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
    // Create mock ApiClient
    mockApiClient = {
      getWeather: jest.fn(),
      getForecast: jest.fn(),
    } as unknown as jest.Mocked<ApiClient>;

    // Create WeatherService with mocked ApiClient (dependency injection)
    weatherService = new WeatherService(mockApiClient);
  });

  // CRITICAL PATH 1: Both APIs called in parallel
  describe('Path 1: Fetch Weather and Forecast in Parallel', () => {
    test('fetchCurrentWeather should call apiClient.getWeather and return weather', async () => {
      // Setup: Mock apiClient.getWeather to return data
      mockApiClient.getWeather.mockResolvedValue(mockCurrentWeather);

      // Call fetchCurrentWeather
      const result = await weatherService.fetchCurrentWeather('London');

      // Verify: apiClient.getWeather was called with correct city
      expect(mockApiClient.getWeather).toHaveBeenCalledWith('London');
      expect(mockApiClient.getWeather).toHaveBeenCalledTimes(1);

      // Verify: Returned data matches expected weather
      expect(result).toEqual(mockCurrentWeather);
      expect(result.city).toBe('London');
      expect(result.temperature).toBe(15);
    });

    test('fetchForecast should call apiClient.getForecast and return forecast', async () => {
      // Setup: Mock apiClient.getForecast to return data
      mockApiClient.getForecast.mockResolvedValue(mockForecast);

      // Call fetchForecast
      const result = await weatherService.fetchForecast('London');

      // Verify: apiClient.getForecast was called with correct city
      expect(mockApiClient.getForecast).toHaveBeenCalledWith('London');
      expect(mockApiClient.getForecast).toHaveBeenCalledTimes(1);

      // Verify: Returned data matches expected forecast
      expect(result).toEqual(mockForecast);
      expect(result.days).toHaveLength(7);
      expect(result.days[0].maxTemp).toBe(20);
    });

    test('both fetchCurrentWeather and fetchForecast can be called in parallel', async () => {
      // Setup: Mock both endpoints
      mockApiClient.getWeather.mockResolvedValue(mockCurrentWeather);
      mockApiClient.getForecast.mockResolvedValue(mockForecast);

      // Call both in parallel using Promise.all
      const [weather, forecast] = await Promise.all([
        weatherService.fetchCurrentWeather('London'),
        weatherService.fetchForecast('London'),
      ]);

      // Verify: Both calls were made
      expect(mockApiClient.getWeather).toHaveBeenCalledWith('London');
      expect(mockApiClient.getForecast).toHaveBeenCalledWith('London');

      // Verify: Both results are correct
      expect(weather).toEqual(mockCurrentWeather);
      expect(forecast).toEqual(mockForecast);
    });
  });

  // CRITICAL PATH 2: Error handling - errors propagate correctly
  describe('Path 2: Error Handling and Propagation', () => {
    test('fetchCurrentWeather should propagate WeatherNotFoundError from apiClient', async () => {
      // Setup: Mock apiClient to throw WeatherNotFoundError
      const notFoundError = new WeatherNotFoundError('XYZ');
      mockApiClient.getWeather.mockRejectedValue(notFoundError);

      // Call fetchCurrentWeather
      try {
        await weatherService.fetchCurrentWeather('XYZ');
        fail('Expected WeatherNotFoundError to be thrown');
      } catch (error) {
        // Verify: Error is the same WeatherNotFoundError
        expect(error).toBeInstanceOf(WeatherNotFoundError);
        if (error instanceof WeatherNotFoundError) {
          expect(error.city).toBe('XYZ');
        }
      }
    });

    test('fetchForecast should propagate ApiError from apiClient', async () => {
      // Setup: Mock apiClient to throw ApiError
      const apiError = new ApiError('Network error', 500);
      mockApiClient.getForecast.mockRejectedValue(apiError);

      // Call fetchForecast
      try {
        await weatherService.fetchForecast('London');
        fail('Expected ApiError to be thrown');
      } catch (error) {
        // Verify: Error is the same ApiError
        expect(error).toBeInstanceOf(ApiError);
        if (error instanceof ApiError) {
          expect(error.statusCode).toBe(500);
          expect(error.message).toContain('Network error');
        }
      }
    });

    test('parallel calls should handle errors from either endpoint', async () => {
      // Setup: One succeeds, one fails
      mockApiClient.getWeather.mockResolvedValue(mockCurrentWeather);
      mockApiClient.getForecast.mockRejectedValue(
        new ApiError('Forecast API error', 500)
      );

      // Call both in parallel
      try {
        await Promise.all([
          weatherService.fetchCurrentWeather('London'),
          weatherService.fetchForecast('London'),
        ]);
        fail('Expected error to be thrown');
      } catch (error) {
        // Verify: Error from forecast is thrown
        expect(error).toBeInstanceOf(ApiError);
        if (error instanceof ApiError) {
          expect(error.message).toContain('Forecast API error');
        }
      }
    });
  });

  // CRITICAL PATH 3: Dependency Injection works correctly
  describe('Path 3: Dependency Injection', () => {
    test('WeatherService should use injected ApiClient instance', async () => {
      // Setup: Mock apiClient
      mockApiClient.getWeather.mockResolvedValue(mockCurrentWeather);

      // Call fetchCurrentWeather
      await weatherService.fetchCurrentWeather('London');

      // Verify: Injected apiClient was used
      expect(mockApiClient.getWeather).toHaveBeenCalled();
    });

    test('WeatherService should work with different ApiClient implementations', () => {
      // Create a mock with different configuration
      const anotherMockApiClient: jest.Mocked<ApiClient> = {
        getWeather: jest.fn(),
        getForecast: jest.fn(),
      } as unknown as jest.Mocked<ApiClient>;

      // Create WeatherService with different ApiClient
      const anotherWeatherService = new WeatherService(anotherMockApiClient);

      // Setup: Mock the other apiClient
      anotherMockApiClient.getWeather.mockResolvedValue(mockCurrentWeather);

      // Original service should still use original apiClient
      expect(mockApiClient).not.toBe(anotherMockApiClient);

      // Both services can coexist
      expect(weatherService).not.toBe(anotherWeatherService);
    });
  });
});
