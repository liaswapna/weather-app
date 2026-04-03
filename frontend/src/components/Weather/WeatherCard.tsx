import React from 'react';
import { WeatherCardProps } from '../../types/weather.types';

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">{weather.city}</h2>
      <p className="text-6xl font-bold mb-2">{weather.temperature}°C</p>
      <p className="text-xl text-gray-600 mb-4">{weather.condition}</p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Humidity</p>
          <p className="text-2xl font-bold">{weather.humidity}%</p>
        </div>
        <div>
          <p className="text-gray-600">Wind Speed</p>
          <p className="text-2xl font-bold">{weather.windSpeed} km/h</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
