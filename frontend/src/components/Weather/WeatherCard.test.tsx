import React from 'react';
import { render, screen } from '@testing-library/react';
import WeatherCard from './WeatherCard';
import { CurrentWeather } from '../../types/weather.types';

// Main test suite for WeatherCard component
describe('WeatherCard Component', () => {
  // Sample weather data for testing
  const mockWeatherData: CurrentWeather = {
    city: 'London',
    temperature: 15,
    condition: 'Rainy',
    humidity: 75,
    windSpeed: 20,
  };

  // Test group: Check if all weather information is rendered correctly
  describe('Weather Data Display', () => {
    // Test: City name should be displayed
    test('displays city name', () => {
      render(<WeatherCard weather={mockWeatherData} />);
      // Verify city name "London" is visible
      expect(screen.getByText('London')).toBeInTheDocument();
    });

    // Test: Temperature should be displayed with °C unit
    test('displays temperature with Celsius unit', () => {
      render(<WeatherCard weather={mockWeatherData} />);
      // Verify temperature is shown as "15°C"
      expect(screen.getByText('15°C')).toBeInTheDocument();
    });

    // Test: Weather condition should be displayed
    test('displays weather condition', () => {
      render(<WeatherCard weather={mockWeatherData} />);
      // Verify weather condition "Rainy" is visible
      expect(screen.getByText('Rainy')).toBeInTheDocument();
    });

    // Test: Humidity percentage should be displayed
    test('displays humidity percentage', () => {
      render(<WeatherCard weather={mockWeatherData} />);
      // Verify humidity "75%" is visible
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    // Test: Wind speed should be displayed with unit
    test('displays wind speed in km/h', () => {
      render(<WeatherCard weather={mockWeatherData} />);
      // Verify wind speed "20 km/h" is visible
      expect(screen.getByText('20 km/h')).toBeInTheDocument();
    });

    // Test: "Current Weather" label should be present
    test('displays "Current Weather" label', () => {
      render(<WeatherCard weather={mockWeatherData} />);
      // Verify the subtitle is present
      expect(screen.getByText('Current Weather')).toBeInTheDocument();
    });
  });

  // Test group: Check weather emoji mapping
  describe('Weather Emoji Mapping', () => {
    // Test: Rainy condition should show rain emoji
    test('shows rain emoji for rainy condition', () => {
      const rainyWeather: CurrentWeather = { ...mockWeatherData, condition: 'Rainy' };
      render(<WeatherCard weather={rainyWeather} />);
      // Verify rain emoji is displayed
      expect(screen.getByText('🌧️')).toBeInTheDocument();
    });

    // Test: Cloudy condition should show cloud emoji
    test('shows cloud emoji for cloudy condition', () => {
      const cloudyWeather: CurrentWeather = { ...mockWeatherData, condition: 'Cloudy' };
      render(<WeatherCard weather={cloudyWeather} />);
      // Verify cloud emoji is displayed
      expect(screen.getByText('☁️')).toBeInTheDocument();
    });

    // Test: Clear/Sunny condition should show sun emoji
    test('shows sun emoji for clear condition', () => {
      const clearWeather: CurrentWeather = { ...mockWeatherData, condition: 'Clear' };
      render(<WeatherCard weather={clearWeather} />);
      // Verify sun emoji is displayed
      expect(screen.getByText('☀️')).toBeInTheDocument();
    });

    // Test: Sunny condition should show sun emoji
    test('shows sun emoji for sunny condition', () => {
      const sunnyWeather: CurrentWeather = { ...mockWeatherData, condition: 'Sunny' };
      render(<WeatherCard weather={sunnyWeather} />);
      // Verify sun emoji is displayed
      expect(screen.getByText('☀️')).toBeInTheDocument();
    });

    // Test: Snowy condition should show snow emoji
    test('shows snow emoji for snowy condition', () => {
      const snowyWeather: CurrentWeather = { ...mockWeatherData, condition: 'Snow' };
      render(<WeatherCard weather={snowyWeather} />);
      // Verify snow emoji is displayed
      expect(screen.getByText('❄️')).toBeInTheDocument();
    });

    // Test: Thunderstorm condition should show thunder emoji
    test('shows thunder emoji for thunderstorm condition', () => {
      const thunderWeather: CurrentWeather = { ...mockWeatherData, condition: 'Thunderstorm' };
      render(<WeatherCard weather={thunderWeather} />);
      // Verify thunder emoji is displayed
      expect(screen.getByText('⛈️')).toBeInTheDocument();
    });

    // Test: Foggy condition should show fog emoji
    test('shows fog emoji for foggy condition', () => {
      const foggyWeather: CurrentWeather = { ...mockWeatherData, condition: 'Fog' };
      render(<WeatherCard weather={foggyWeather} />);
      // Verify fog emoji is displayed
      expect(screen.getByText('🌫️')).toBeInTheDocument();
    });

    // Test: Unknown condition should show default emoji
    test('shows default emoji for unknown condition', () => {
      const unknownWeather: CurrentWeather = { ...mockWeatherData, condition: 'Unknown' };
      render(<WeatherCard weather={unknownWeather} />);
      // Verify default emoji is displayed
      expect(screen.getByText('🌤️')).toBeInTheDocument();
    });

    // Test: Emoji mapping should be case-insensitive
    test('emoji mapping is case-insensitive', () => {
      const mixedCaseWeather: CurrentWeather = { ...mockWeatherData, condition: 'RAINY' };
      render(<WeatherCard weather={mixedCaseWeather} />);
      // Verify emoji works regardless of case
      expect(screen.getByText('🌧️')).toBeInTheDocument();
    });
  });

  // Test group: Check proper rendering of UI labels and icons
  describe('UI Labels and Icons', () => {
    // Test: Humidity label with emoji should be present
    test('displays humidity label with emoji', () => {
      render(<WeatherCard weather={mockWeatherData} />);
      // Verify humidity label is visible
      expect(screen.getByText('💧 Humidity')).toBeInTheDocument();
    });

    // Test: Wind speed label with emoji should be present
    test('displays wind speed label with emoji', () => {
      render(<WeatherCard weather={mockWeatherData} />);
      // Verify wind speed label is visible
      expect(screen.getByText('💨 Wind Speed')).toBeInTheDocument();
    });
  });

  // Test group: Check various temperature values
  describe('Temperature Display', () => {
    // Test: Positive temperature should display correctly
    test('displays positive temperature correctly', () => {
      const warmWeather: CurrentWeather = { ...mockWeatherData, temperature: 25 };
      render(<WeatherCard weather={warmWeather} />);
      expect(screen.getByText('25°C')).toBeInTheDocument();
    });

    // Test: Zero temperature should display correctly
    test('displays zero temperature correctly', () => {
      const freezingWeather: CurrentWeather = { ...mockWeatherData, temperature: 0 };
      render(<WeatherCard weather={freezingWeather} />);
      expect(screen.getByText('0°C')).toBeInTheDocument();
    });

    // Test: Negative temperature should display correctly
    test('displays negative temperature correctly', () => {
      const coldWeather: CurrentWeather = { ...mockWeatherData, temperature: -5 };
      render(<WeatherCard weather={coldWeather} />);
      expect(screen.getByText('-5°C')).toBeInTheDocument();
    });

    // Test: Decimal temperature should display correctly
    test('displays decimal temperature correctly', () => {
      const preciseWeather: CurrentWeather = { ...mockWeatherData, temperature: 15.5 };
      render(<WeatherCard weather={preciseWeather} />);
      expect(screen.getByText('15.5°C')).toBeInTheDocument();
    });
  });

  // Test group: Check different humidity values
  describe('Humidity Display', () => {
    // Test: Low humidity should display correctly
    test('displays low humidity correctly', () => {
      const dryWeather: CurrentWeather = { ...mockWeatherData, humidity: 20 };
      render(<WeatherCard weather={dryWeather} />);
      expect(screen.getByText('20%')).toBeInTheDocument();
    });

    // Test: High humidity should display correctly
    test('displays high humidity correctly', () => {
      const humidWeather: CurrentWeather = { ...mockWeatherData, humidity: 95 };
      render(<WeatherCard weather={humidWeather} />);
      expect(screen.getByText('95%')).toBeInTheDocument();
    });

    // Test: 100% humidity should display correctly
    test('displays 100% humidity correctly', () => {
      const veryHumidWeather: CurrentWeather = { ...mockWeatherData, humidity: 100 };
      render(<WeatherCard weather={veryHumidWeather} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
    });
  });

  // Test group: Check different wind speed values
  describe('Wind Speed Display', () => {
    // Test: Low wind speed should display correctly
    test('displays low wind speed correctly', () => {
      const calmWeather: CurrentWeather = { ...mockWeatherData, windSpeed: 5 };
      render(<WeatherCard weather={calmWeather} />);
      expect(screen.getByText('5 km/h')).toBeInTheDocument();
    });

    // Test: High wind speed should display correctly
    test('displays high wind speed correctly', () => {
      const stormyWeather: CurrentWeather = { ...mockWeatherData, windSpeed: 60 };
      render(<WeatherCard weather={stormyWeather} />);
      expect(screen.getByText('60 km/h')).toBeInTheDocument();
    });

    // Test: Zero wind speed should display correctly
    test('displays zero wind speed correctly', () => {
      const stillWeather: CurrentWeather = { ...mockWeatherData, windSpeed: 0 };
      render(<WeatherCard weather={stillWeather} />);
      expect(screen.getByText('0 km/h')).toBeInTheDocument();
    });
  });

  // Test group: Check edge cases and special scenarios
  describe('Edge Cases', () => {
    // Test: City name with spaces should display correctly
    test('displays city name with spaces', () => {
      const newYorkWeather: CurrentWeather = { ...mockWeatherData, city: 'New York' };
      render(<WeatherCard weather={newYorkWeather} />);
      expect(screen.getByText('New York')).toBeInTheDocument();
    });

    // Test: Long city name should display correctly
    test('displays long city name', () => {
      const longCityWeather: CurrentWeather = {
        ...mockWeatherData,
        city: 'São Paulo'
      };
      render(<WeatherCard weather={longCityWeather} />);
      expect(screen.getByText('São Paulo')).toBeInTheDocument();
    });

    // Test: Weather condition with mixed case should display
    test('displays weather condition with mixed case', () => {
      const mixedCaseCondition: CurrentWeather = {
        ...mockWeatherData,
        condition: 'Partly Cloudy'
      };
      render(<WeatherCard weather={mixedCaseCondition} />);
      expect(screen.getByText('Partly Cloudy')).toBeInTheDocument();
    });
  });
});
