import { renderHook, act } from '@testing-library/react';
import useWeather from './useWeather';
import WeatherService from '../services/weather';
import { CurrentWeather, Forecast } from '../types/weather.types';
import { WeatherNotFoundError, ApiError } from '../utils/errors';

// Main test suite for useWeather hook
describe('useWeather Hook - Critical Paths', () => {
  // Mock WeatherService
  let mockWeatherService: jest.Mocked<WeatherService>;

  // Sample weather data for testing
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
    // Create a mock WeatherService with jest functions
    mockWeatherService = {
      fetchCurrentWeather: jest.fn(),
      fetchForecast: jest.fn(),
    } as unknown as jest.Mocked<WeatherService>;
  });

  // CRITICAL PATH 1: Successfully fetch and display weather for valid city
  describe('Path 1: Successful Weather Fetch', () => {
    test('should fetch weather data and update state when searchWeather is called with valid city', async () => {
      // Setup: Mock API responses
      mockWeatherService.fetchCurrentWeather.mockResolvedValue(mockCurrentWeather);
      mockWeatherService.fetchForecast.mockResolvedValue(mockForecast);

      // Render the hook with mocked service
      const { result } = renderHook(() => useWeather(mockWeatherService));

      // Initial state should be empty
      expect(result.current.state.current).toBeNull();
      expect(result.current.state.forecast).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();

      // Call searchWeather with "London"
      await act(async () => {
        await result.current.searchWeather('London');
      });

      // Verify: Both APIs were called in parallel
      expect(mockWeatherService.fetchCurrentWeather).toHaveBeenCalledWith('London');
      expect(mockWeatherService.fetchForecast).toHaveBeenCalledWith('London');

      // Verify: State is updated with fetched data
      expect(result.current.state.current).toEqual(mockCurrentWeather);
      expect(result.current.state.forecast).toEqual(mockForecast);
      expect(result.current.state.searchedCity).toBe('London');

      // Verify: Loading is complete and no error
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    test('should set loading=true while fetching and loading=false after fetch completes', async () => {
      // Setup: Mock APIs with delay to observe loading state
      let resolveCurrentWeather: any;
      let resolveForecast: any;

      mockWeatherService.fetchCurrentWeather.mockReturnValue(
        new Promise((resolve) => {
          resolveCurrentWeather = resolve;
        })
      );
      mockWeatherService.fetchForecast.mockReturnValue(
        new Promise((resolve) => {
          resolveForecast = resolve;
        })
      );

      const { result } = renderHook(() => useWeather(mockWeatherService));

      // Initial: loading should be false
      expect(result.current.isLoading).toBe(false);

      // Call searchWeather
      act(() => {
        result.current.searchWeather('London');
      });

      // During fetch: loading should be true
      expect(result.current.isLoading).toBe(true);

      // Complete the API calls
      await act(async () => {
        resolveCurrentWeather(mockCurrentWeather);
        resolveForecast(mockForecast);
      });

      // After fetch: loading should be false
      expect(result.current.isLoading).toBe(false);
    });
  });

  // CRITICAL PATH 2: Handle city not found error gracefully
  describe('Path 2: City Not Found Error', () => {
    test('should handle WeatherNotFoundError and show friendly error message', async () => {
      // Setup: Mock service to throw WeatherNotFoundError
      const notFoundError = new WeatherNotFoundError('XYZ');
      mockWeatherService.fetchCurrentWeather.mockRejectedValue(notFoundError);
      mockWeatherService.fetchForecast.mockRejectedValue(notFoundError);

      const { result } = renderHook(() => useWeather(mockWeatherService));

      // Call searchWeather with invalid city
      await act(async () => {
        await result.current.searchWeather('XYZ');
      });

      // Verify: Error message is friendly and specific
      expect(result.current.error).toContain('XYZ');
      expect(result.current.error).toContain('not found');

      // Verify: Loading is complete
      expect(result.current.isLoading).toBe(false);

      // Verify: No data is set
      expect(result.current.state.current).toBeNull();
      expect(result.current.state.forecast).toBeNull();
    });
  });

  // CRITICAL PATH 3: Handle API/network error gracefully
  describe('Path 3: API/Network Error', () => {
    test('should handle ApiError and show error message', async () => {
      // Setup: Mock service to throw ApiError (network/server error)
      const apiError = new ApiError('Network timeout', 500);
      mockWeatherService.fetchCurrentWeather.mockRejectedValue(apiError);
      mockWeatherService.fetchForecast.mockRejectedValue(apiError);

      const { result } = renderHook(() => useWeather(mockWeatherService));

      // Call searchWeather
      await act(async () => {
        await result.current.searchWeather('London');
      });

      // Verify: Error message is shown
      expect(result.current.error).toBeTruthy();
      expect(result.current.error).toContain('Network timeout');

      // Verify: Loading is complete
      expect(result.current.isLoading).toBe(false);

      // Verify: No data is set
      expect(result.current.state.current).toBeNull();
      expect(result.current.state.forecast).toBeNull();
    });
  });

  // CRITICAL PATH 4: User can dismiss error and see data
  describe('Path 4: Dismiss Error', () => {
    test('should clear error when clearError is called while keeping previous data intact', async () => {
      // Setup: First successful fetch
      mockWeatherService.fetchCurrentWeather.mockResolvedValue(mockCurrentWeather);
      mockWeatherService.fetchForecast.mockResolvedValue(mockForecast);

      const { result } = renderHook(() => useWeather(mockWeatherService));

      // Fetch weather successfully
      await act(async () => {
        await result.current.searchWeather('London');
      });

      expect(result.current.state.current).toEqual(mockCurrentWeather);
      expect(result.current.error).toBeNull();

      // Setup: Next search fails
      const notFoundError = new WeatherNotFoundError('XYZ');
      mockWeatherService.fetchCurrentWeather.mockRejectedValue(notFoundError);
      mockWeatherService.fetchForecast.mockRejectedValue(notFoundError);

      // Search for invalid city
      await act(async () => {
        await result.current.searchWeather('XYZ');
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.error).toContain('XYZ');

      // User clicks dismiss button - clearError is called
      act(() => {
        result.current.clearError();
      });

      // Verify: Error is cleared
      expect(result.current.error).toBeNull();

      // Verify: Previous London data is still there
      expect(result.current.state.current).toEqual(mockCurrentWeather);
      expect(result.current.state.searchedCity).toBe('London');
    });
  });

  // CRITICAL PATH 5: Latest search result overwrites previous (no race condition)
  describe('Path 5: Multiple Rapid Searches', () => {
    test('should use only latest search result when multiple searches happen rapidly', async () => {
      // Setup: Different data for different cities
      const londonWeather: CurrentWeather = {
        ...mockCurrentWeather,
        city: 'London',
        temperature: 15,
      };

      const parisWeather: CurrentWeather = {
        ...mockCurrentWeather,
        city: 'Paris',
        temperature: 20,
      };

      const parisForecasts: Forecast = {
        ...mockForecast,
        city: 'Paris',
      };

      // Setup: Mock to return different data for different cities
      mockWeatherService.fetchCurrentWeather.mockImplementation((city) => {
        if (city === 'London') return Promise.resolve(londonWeather);
        if (city === 'Paris') return Promise.resolve(parisWeather);
        return Promise.reject(new Error('Unknown city'));
      });

      mockWeatherService.fetchForecast.mockImplementation((city) => {
        if (city === 'London') return Promise.resolve(mockForecast);
        if (city === 'Paris') return Promise.resolve(parisForecasts);
        return Promise.reject(new Error('Unknown city'));
      });

      const { result } = renderHook(() => useWeather(mockWeatherService));

      // Rapid fire: Search London, then immediately search Paris
      await act(async () => {
        // Start both searches in rapid succession
        result.current.searchWeather('London');
        await new Promise((resolve) => setTimeout(resolve, 10));
        await result.current.searchWeather('Paris');
      });

      // Verify: Only Paris data is shown (latest search wins)
      expect(result.current.state.current).toEqual(parisWeather);
      expect(result.current.state.forecast).toEqual(parisForecasts);
      expect(result.current.state.searchedCity).toBe('Paris');

      // Verify: No mixed/old data from London
      expect(result.current.state.current.city).toBe('Paris');
      expect(result.current.state.current.temperature).toBe(20);

      // Verify: No loading or error
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });
});
