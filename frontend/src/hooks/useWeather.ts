import { useState } from 'react';
import WeatherService from '../services/weather';
import { WeatherState } from '../types/weather.types';
import { ApiError, WeatherNotFoundError } from '../utils/errors';

/**
 * useWeather - Custom React hook for weather management
 * Centralized state management for weather data and API calls
 * Provides searchWeather function and state to components
 * Handles loading states and error messages
 *
 * @param weatherService - WeatherService instance for API communication
 * @returns Object containing state, functions, and helper properties
 *
 * @example
 * const { state, searchWeather, isLoading, error } = useWeather(weatherService);
 * searchWeather('London'); // Fetch weather for London
 */
const useWeather = (weatherService: WeatherService) => {
  // Initial state
  const initialState: WeatherState = {
    current: null,
    forecast: null,
    loading: false,
    error: null,
    searchedCity: '',
  };

  const [state, setState] = useState<WeatherState>(initialState);

  /**
   * Search for weather in a city
   * Fetches both current weather and 7-day forecast
   * Updates state with data or error message
   * Shows loading state during fetch
   *
   * @param city - City name to search for
   */
  const searchWeather = async (city: string) => {
    // Set loading state and clear previous error
    setState((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      // Fetch current weather and forecast in parallel using Promise.all
      // This is more efficient than fetching sequentially
      const [current, forecast] = await Promise.all([
        weatherService.fetchCurrentWeather(city),
        weatherService.fetchForecast(city),
      ]);

      // Update state with fetched data
      setState({
        current,
        forecast,
        loading: false,
        error: null,
        searchedCity: city,
      });
    } catch (error) {
      // Handle different error types with appropriate messages
      let errorMessage = 'An error occurred';

      if (error instanceof WeatherNotFoundError) {
        // City not found error
        errorMessage = `City "${error.city}" not found. Please try another city.`;
      } else if (error instanceof ApiError) {
        // API or network error
        errorMessage = error.message;
      } else if (error instanceof Error) {
        // Generic error
        errorMessage = error.message;
      }

      // Update state with error message
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  };

  /**
   * Clear the error message
   * Used when user clicks dismiss button on error display
   */
  const clearError = () => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  };

  /**
   * Reset all state to initial values
   * Used when user wants to start over or clear search
   */
  const reset = () => {
    setState(initialState);
  };

  return {
    // State object containing current, forecast, loading, error, searchedCity
    state,
    // Function to search for weather
    searchWeather,
    // Helper function to clear error message
    clearError,
    // Helper function to reset all state
    reset,
    // Helper properties for convenience
    isLoading: state.loading,
    error: state.error,
  };
};

export default useWeather;
