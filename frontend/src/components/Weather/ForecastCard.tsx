import React from 'react';
import { ForecastCardProps } from '../../types/weather.types';

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-6">{forecast.city} - 7 Day Forecast</h2>
      <div className="grid grid-cols-7 gap-4">
        {forecast.days.map((day) => (
          <div key={day.date} className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="font-bold">{day.date}</p>
            <p className="text-lg font-semibold mt-2">{day.maxTemp}°</p>
            <p className="text-sm text-gray-600">{day.minTemp}°</p>
            <p className="text-sm mt-2">{day.condition}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;
