import React from 'react';
import { ForecastCardProps } from '../../types/weather.types';

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

const getBackgroundColor = (condition: string): string => {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('rain')) return 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
  if (conditionLower.includes('cloud')) return 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) return 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
  if (conditionLower.includes('snow')) return 'linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%)';
  if (conditionLower.includes('thunder')) return 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)';
  if (conditionLower.includes('fog')) return 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)';
  return 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
};

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)',
      width: '100%',
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      <h2 style={{
        fontSize: '1.4rem',
        fontWeight: 'bold',
        color: 'white',
        margin: '0 0 1rem 0'
      }}>
        {forecast.city} - 7 Day Forecast
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '1.2rem'
      }}>
        {forecast.days.map((day) => {
          const bgGradient = getBackgroundColor(day.condition);
          const emoji = getWeatherEmoji(day.condition);
          return (
            <div
              key={day.date}
              style={{
                background: bgGradient,
                borderRadius: '14px',
                padding: '1.2rem 0.8rem',
                textAlign: 'center',
                color: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                minHeight: '160px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              <p style={{
                fontSize: '0.9rem',
                fontWeight: 'bold',
                margin: '0 0 0.6rem 0',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {day.date}
              </p>

              <p style={{ fontSize: '3rem', margin: '0.3rem 0' }}>
                {emoji}
              </p>

              <p style={{
                fontSize: '1.8rem',
                fontWeight: 'bold',
                margin: '0.6rem 0 0.3rem 0'
              }}>
                {day.maxTemp}°
              </p>

              <p style={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.8)',
                margin: '0 0 0.6rem 0'
              }}>
                Low: {day.minTemp}°
              </p>

              <p style={{
                fontSize: '0.85rem',
                fontWeight: 'bold',
                margin: '0',
                textTransform: 'capitalize',
                lineHeight: '1.2'
              }}>
                {day.condition}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ForecastCard;
