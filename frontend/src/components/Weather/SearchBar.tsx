import React, { useState } from 'react';
import { SearchBarProps } from '../../types/weather.types';

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [city, setCity] = useState<string>('');

  const handleSearch = () => {
    if (city.trim()) {
      onSearch(city);
      setCity('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex gap-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter city name"
          disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
