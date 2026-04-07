import ApiClient from './api';
import { CurrentWeather, Forecast } from '../types/weather.types';

/**
 * WeatherService - Business logic layer for weather operations
 * Uses ApiClient to fetch data and applies business logic
 * Provides clean interface for components to consume weather data
 * Implements dependency injection pattern for testability
 */
class WeatherService {
  private apiClient: ApiClient;

  /**
   * Initialize WeatherService with an ApiClient instance
   * Uses dependency injection for flexibility and testability
   * @param apiClient - ApiClient instance for API communication
   */
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Fetch current weather for a city
   * Delegates to ApiClient for HTTP communication
   * Can be extended with business logic (caching, transformation, validation)
   *
   * @param city - City name (e.g., "London", "New York")
   * @returns CurrentWeather object with temperature, condition, humidity, windSpeed
   * @throws WeatherNotFoundError - If city is not found
   * @throws ApiError - If API call fails or network error occurs
   */
  async fetchCurrentWeather(city: string): Promise<CurrentWeather> {
    try {
      // Call ApiClient to fetch weather
      const weather = await this.apiClient.getWeather(city);

      // Can add business logic here:
      // - Data transformation (e.g., convert units)
      // - Caching
      // - Validation
      // - Logging
      // For now, return as-is

      return weather;
    } catch (error) {
      // Can add error handling logic here:
      // - Fallback logic
      // - Error transformation
      // - Logging
      // For now, re-throw

      throw error;
    }
  }

  /**
   * Fetch 7-day weather forecast for a city
   * Delegates to ApiClient for HTTP communication
   * Can be extended with business logic (caching, transformation, validation)
   *
   * @param city - City name (e.g., "London", "New York")
   * @returns Forecast object containing array of 7 ForecastDay objects
   * @throws WeatherNotFoundError - If city is not found
   * @throws ApiError - If API call fails or network error occurs
   */
  async fetchForecast(city: string): Promise<Forecast> {
    try {
      // Call ApiClient to fetch forecast
      const forecast = await this.apiClient.getForecast(city);

      // Can add business logic here:
      // - Data transformation (e.g., sort, filter days)
      // - Caching
      // - Validation
      // - Logging
      // For now, return as-is

      return forecast;
    } catch (error) {
      // Can add error handling logic here:
      // - Fallback logic
      // - Error transformation
      // - Logging
      // For now, re-throw

      throw error;
    }
  }
}

export default WeatherService;
