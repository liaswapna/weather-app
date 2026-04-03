import React from 'react';
import { LoadingSpinnerProps } from '../../types/weather.types';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center text-3xl">🌦️</div>
          </div>
        </div>
        <p className="text-gray-700 text-lg font-semibold">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
