import React from 'react';
import { LoadingSpinnerProps } from '../../types/weather.types';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
        <p className="text-gray-600 text-lg font-medium">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
