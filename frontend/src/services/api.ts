import { CurrentWeather, Forecast } from '../types/weather.types';
import { ApiError, WeatherNotFoundError } from '../utils/errors';

/**
 * ApiClient - Handles all HTTP communication with the backend API
 * Provides type-safe methods for weather data requests
 * Throws custom error types for specific error cases
 */
class ApiClient {
  private baseUrl: string;

  /**
   * Initialize ApiClient with backend URL
   * @param baseUrl - Base URL of the backend API (e.g., "http://localhost:8000")
   */
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generic request method for making API calls
   * Handles errors and returns typed responses
   * @param endpoint - API endpoint path (e.g., "/weather/London")
   * @returns Typed response from API
   * @throws WeatherNotFoundError - When city is not found (404)
   * @throws ApiError - For network errors or other API failures
   */
  private async request<T>(endpoint: string): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      // Make fetch request
      const response = await fetch(url);

      // Handle city not found (404)
      if (response.status === 404) {
        // Extract city name from endpoint
        const cityName = endpoint.split('/').pop() || 'Unknown';
        throw new WeatherNotFoundError(cityName);
      }

      // Handle other HTTP errors
      if (!response.ok) {
        throw new ApiError(
          `API request failed: ${response.statusText}`,
          response.status
        );
      }

      // Parse JSON and return typed data
      const data: T = await response.json();
      return data;
    } catch (error) {
      // Re-throw custom errors as-is
      if (error instanceof WeatherNotFoundError || error instanceof ApiError) {
        throw error;
      }

      // Handle network errors (TypeError)
      if (error instanceof TypeError) {
        throw new ApiError('Network error: Unable to connect to backend');
      }

      // Handle unknown errors
      throw new ApiError(`An unexpected error occurred: ${String(error)}`);
    }
  }

  /**
   * Get current weather for a city
   * @param city - City name (e.g., "London", "New York")
   * @returns CurrentWeather object with temperature, condition, humidity, windSpeed
   * @throws WeatherNotFoundError - If city is not found
   * @throws ApiError - If API call fails
   */
  async getWeather(city: string): Promise<CurrentWeather> {
    return this.request<CurrentWeather>(`/weather/${city}`);
  }

  /**
   * Get 7-day weather forecast for a city
   * @param city - City name (e.g., "London", "New York")
   * @returns Forecast object containing 7 days of weather data
   * @throws WeatherNotFoundError - If city is not found
   * @throws ApiError - If API call fails
   */
  async getForecast(city: string): Promise<Forecast> {
    return this.request<Forecast>(`/forecast/${city}`);
  }
}

export default ApiClient;
