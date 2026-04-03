import React, { useMemo } from 'react';
import ApiClient from './services/api';
import WeatherService from './services/weather';
import useWeather from './hooks/useWeather';
import { SearchBar, WeatherCard, ForecastCard } from './components/Weather';
import { LoadingSpinner, ErrorDisplay, ErrorBoundary } from './components/common';

const App: React.FC = () => {
  // Initialize services with useMemo to avoid recreating on every render
  const services = useMemo(() => {
    const apiClient = new ApiClient('http://localhost:8000');
    const weatherService = new WeatherService(apiClient);
    return { apiClient, weatherService };
  }, []);

  // Use the weather hook with the weather service
  const { state, searchWeather, isLoading, error, clearError } = useWeather(
    services.weatherService
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-blue-600 text-white py-6 shadow-md">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold">Weather App</h1>
            <p className="text-blue-100 mt-2">Get weather for any city worldwide</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto py-8 px-4">
          {/* Loading Spinner - Show while fetching */}
          {isLoading && <LoadingSpinner message="Fetching weather data..." />}

          {/* Error Display - Show if there's an error */}
          {error && !isLoading && (
            <ErrorDisplay error={error} onDismiss={clearError} />
          )}

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar onSearch={searchWeather} loading={isLoading} />
          </div>

          {/* Weather Display - Show current weather and forecast if available */}
          {!isLoading && (
            <>
              {state.current ? (
                <div className="space-y-6">
                  {/* Current Weather Card */}
                  <WeatherCard weather={state.current} />

                  {/* Forecast Card */}
                  {state.forecast && <ForecastCard forecast={state.forecast} />}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Search for a city to see its weather
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
