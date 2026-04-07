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
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
      borderRadius: '16px',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      backdropFilter: 'blur(10px)',
      border: '2px solid rgba(255,255,255,0.3)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <h3 style={{
        fontSize: '1.4rem',
        color: 'white',
        fontWeight: 'bold',
        margin: '0 0 1rem 0',
        textAlign: 'center'
      }}>
        🔍 Search Weather
      </h3>

      <div style={{
        display: 'flex',
        gap: '0.6rem',
        marginBottom: '0.8rem',
        alignItems: 'stretch'
      }}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter city name..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '1rem 1.2rem',
            borderRadius: '12px',
            border: '2px solid rgba(255,255,255,0.3)',
            fontSize: '1rem',
            fontWeight: '500',
            backgroundColor: 'rgba(255,255,255,0.95)',
            color: '#333',
            outline: 'none',
            transition: 'all 0.3s ease',
            cursor: loading ? 'not-allowed' : 'text',
            opacity: loading ? 0.6 : 1,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            height: '100%',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.6)';
            (e.target as HTMLInputElement).style.boxShadow = '0 10px 40px rgba(99, 102, 241, 0.3)';
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.3)';
            (e.target as HTMLInputElement).style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            background: loading
              ? 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            opacity: loading ? 0.7 : 1,
            transform: loading ? 'scale(0.95)' : 'scale(1)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            height: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            }
          }}
        >
          {loading ? '⏳ Searching...' : '🔎 Search'}
        </button>
      </div>

      <p style={{
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        margin: '0.6rem 0 0 0'
      }}>
        Press Enter or click Search
      </p>
    </div>
  );
};

export default SearchBar;
