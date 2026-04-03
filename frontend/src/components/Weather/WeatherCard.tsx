import React from 'react';
import { WeatherCardProps } from '../../types/weather.types';

const getWeatherEmoji = (condition: string): string => {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('rain')) return '🌧️';
  if (conditionLower.includes('cloud')) return '☁️';
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return '☀️';
  if (conditionLower.includes('snow')) return '❄️';
  if (conditionLower.includes('thunder')) return '⛈️';
  if (conditionLower.includes('fog')) return '🌫️';
  return '🌤️';
};

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const weatherEmoji = getWeatherEmoji(weather.condition);

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '18px',
      padding: '1.8rem',
      marginBottom: '1.5rem',
      color: 'white',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      textAlign: 'center',
      width: '100%',
      maxWidth: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <div style={{ marginBottom: '1.2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
          {weather.city}
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', margin: '0' }}>
          Current Weather
        </p>
      </div>

      <div style={{ fontSize: '4.5rem', marginBottom: '0.8rem' }}>
        {weatherEmoji}
      </div>

      <div style={{
        fontSize: '3.5rem',
        fontWeight: 'bold',
        marginBottom: '0.8rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
      }}>
        {weather.temperature}°C
      </div>

      <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.95)', marginBottom: '1.5rem', textTransform: 'capitalize' }}>
        {weather.condition}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '12px',
          padding: '1rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', margin: '0 0 0.5rem 0' }}>
            💧 Humidity
          </p>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0' }}>
            {weather.humidity}%
          </p>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '12px',
          padding: '1rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', margin: '0 0 0.5rem 0' }}>
            💨 Wind Speed
          </p>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0' }}>
            {weather.windSpeed} km/h
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
