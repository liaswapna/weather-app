/**
 * Custom error classes for the weather app
 * Allows specific error handling for different error types
 */

/**
 * ApiError - General API/network errors
 * Use when: API call fails, network error, backend returns error
 */
class ApiError extends Error {
  statusCode?: number;
  isApiError = true;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

/**
 * WeatherNotFoundError - Specific error for city not found
 * Use when: City name doesn't exist in the weather API
 */
class WeatherNotFoundError extends Error {
  city: string;
  isWeatherNotFoundError = true;

  constructor(city: string) {
    super(`City "${city}" not found`);
    this.city = city;
    this.name = 'WeatherNotFoundError';
  }
}

export { ApiError, WeatherNotFoundError };
