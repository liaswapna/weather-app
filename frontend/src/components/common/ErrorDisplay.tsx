import React from 'react';
import { ErrorDisplayProps } from '../../types/weather.types';

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onDismiss }) => {
  return (
    <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-6 mb-6 shadow-lg">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-4">
          <span className="text-3xl">⚠️</span>
          <div>
            <p className="text-red-900 font-bold text-lg mb-1">Error</p>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-red-600 hover:text-red-800 text-2xl cursor-pointer transition-colors duration-200 font-bold hover:scale-110"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ErrorDisplay;
