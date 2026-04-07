import React, { useMemo } from 'react';
import ApiClient from './services/api';
import WeatherService from './services/weather';
import useWeather from './hooks/useWeather';
import { SearchBar, WeatherCard, ForecastCard } from './components/Weather';
import { LoadingSpinner, ErrorDisplay, ErrorBoundary } from './components/common';

const App: React.FC = () => {
  const services = useMemo(() => {
    const apiClient = new ApiClient('http://localhost:8000');
    const weatherService = new WeatherService(apiClient);
    return { apiClient, weatherService };
  }, []);

  const { state, searchWeather, isLoading, error, clearError } = useWeather(
    services.weatherService
  );

  return (
    <ErrorBoundary>
      <div style={{ background: 'linear-gradient(to bottom right, #0f172a, #1e3a8a, #0f172a)', minHeight: '100vh', display: 'flex', flexDirection: 'column', margin: 0, padding: 0 }}>
        {/* Header */}
        <header style={{ background: 'linear-gradient(to right, #2563eb, #1d4ed8, #1e40af)', color: 'white', padding: '0.8rem', boxShadow: '0 20px 25px rgba(0,0,0,0.1)', flexShrink: 0, margin: 0 }}>
          <div style={{ maxWidth: '100%', margin: '0', paddingLeft: '0.8rem', paddingRight: '0.8rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.6rem 0' }}>🌍 Weather App</h1>
            <div style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '0.9rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <p style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0 0 0.2rem 0' }}>
                👋 Welcome!
              </p>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.95)', margin: '0 0 0.4rem 0' }}>
                Get real-time weather updates
              </p>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', margin: '0' }}>
                🔍 Search for a city below to see its current weather and 7-day forecast
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0.8rem', paddingBottom: '0.8rem', margin: 0, background: 'transparent' }}>
          {/* Centered Search Section */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.8rem', flexShrink: 0 }}>
            <div style={{ width: '100%', maxWidth: '26rem', paddingLeft: '0.3rem', paddingRight: '0.3rem' }}>
              <SearchBar onSearch={searchWeather} loading={isLoading} />

              {isLoading && <LoadingSpinner message="Fetching weather data..." />}

              {error && !isLoading && (
                <ErrorDisplay error={error} onDismiss={clearError} />
              )}
            </div>
          </div>
        </div>

        {/* Weather Results */}
        {!isLoading && state.current && (
          <div style={{ width: '100%', margin: '0', paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0.3rem', boxSizing: 'border-box', overflow: 'hidden' }}>
            <WeatherCard weather={state.current} />
            {state.forecast && <ForecastCard forecast={state.forecast} />}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;
