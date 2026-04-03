import React from 'react';
import { ErrorDisplayProps } from '../../types/weather.types';

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center">
        <p className="text-red-800 font-medium">{error}</p>
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800 text-xl cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
