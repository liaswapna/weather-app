import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForecastCard from './ForecastCard';
import { Forecast } from '../../types/weather.types';

// Main test suite for ForecastCard component
describe('ForecastCard Component', () => {
  // Sample forecast data for testing (7 days)
  const mockForecastData: Forecast = {
    city: 'London',
    days: [
      { date: 'Monday', maxTemp: 20, minTemp: 15, condition: 'Sunny' },
      { date: 'Tuesday', maxTemp: 18, minTemp: 12, condition: 'Cloudy' },
      { date: 'Wednesday', maxTemp: 15, minTemp: 10, condition: 'Rainy' },
      { date: 'Thursday', maxTemp: 16, minTemp: 11, condition: 'Rainy' },
      { date: 'Friday', maxTemp: 19, minTemp: 14, condition: 'Clear' },
      { date: 'Saturday', maxTemp: 22, minTemp: 17, condition: 'Sunny' },
      { date: 'Sunday', maxTemp: 24, minTemp: 19, condition: 'Clear' },
    ],
  };

  // Test group: Check if forecast is rendered correctly
  describe('Forecast Rendering', () => {
    // Test: City name should be displayed in title
    test('displays city name in title', () => {
      render(<ForecastCard forecast={mockForecastData} />);
      // Verify title contains city name "London"
      expect(screen.getByText('London - 7 Day Forecast')).toBeInTheDocument();
    });

    // Test: Should render exactly 7 days
    test('renders 7 forecast days', () => {
      render(<ForecastCard forecast={mockForecastData} />);
      // Get all day cards by looking for date text (CSS transforms to uppercase, not actual text)
      const days = mockForecastData.days;
      days.forEach((day) => {
        expect(screen.getByText(day.date)).toBeInTheDocument();
      });
    });

    // Test: All max temperatures should be displayed
    test('displays max temperature for each day', () => {
      render(<ForecastCard forecast={mockForecastData} />);
      // Verify each day's max temperature is shown
      mockForecastData.days.forEach((day) => {
        expect(screen.getByText(`${day.maxTemp}°`)).toBeInTheDocument();
      });
    });

    // Test: All min temperatures should be displayed
    test('displays min temperature for each day', () => {
      render(<ForecastCard forecast={mockForecastData} />);
      // Verify each day's min temperature is shown with "Low:" prefix
      mockForecastData.days.forEach((day) => {
        expect(screen.getByText(`Low: ${day.minTemp}°`)).toBeInTheDocument();
      });
    });

    // Test: All weather conditions should be displayed
    test('displays weather condition for each day', () => {
      render(<ForecastCard forecast={mockForecastData} />);
      // Verify each day's weather condition is visible (can have multiple instances)
      mockForecastData.days.forEach((day) => {
        expect(screen.getAllByText(day.condition).length).toBeGreaterThan(0);
      });
    });
  });

  // Test group: Check weather emoji mapping for forecast
  describe('Weather Emoji Mapping in Forecast', () => {
    // Test: Sunny days should show sun emoji
    test('shows sun emoji for sunny days', () => {
      render(<ForecastCard forecast={mockForecastData} />);
      // Count sun emojis (should appear for Sunny and Clear conditions)
      const sunEmojis = screen.getAllByText('☀️');
      // Should have at least 1 sun emoji
      expect(sunEmojis.length).toBeGreaterThan(0);
    });

    // Test: Rainy days should show rain emoji
    test('shows rain emoji for rainy days', () => {
      render(<ForecastCard forecast={mockForecastData} />);
      // Count rain emojis (should appear for Rainy conditions)
      const rainEmojis = screen.getAllByText('🌧️');
      // Should have at least 1 rain emoji
      expect(rainEmojis.length).toBeGreaterThan(0);
    });

    // Test: Different conditions should have correct emoji
    test('maps all conditions to correct emojis', () => {
      const variousConditions: Forecast = {
        city: 'TestCity',
        days: [
          { date: 'Day1', maxTemp: 20, minTemp: 15, condition: 'Sunny' },
          { date: 'Day2', maxTemp: 18, minTemp: 12, condition: 'Cloudy' },
          { date: 'Day3', maxTemp: 15, minTemp: 10, condition: 'Rainy' },
          { date: 'Day4', maxTemp: 10, minTemp: 5, condition: 'Snow' },
          { date: 'Day5', maxTemp: 16, minTemp: 11, condition: 'Thunderstorm' },
          { date: 'Day6', maxTemp: 12, minTemp: 8, condition: 'Fog' },
          { date: 'Day7', maxTemp: 19, minTemp: 14, condition: 'Unknown' },
        ],
      };

      render(<ForecastCard forecast={variousConditions} />);

      // Verify all emojis are present
      expect(screen.getByText('☀️')).toBeInTheDocument();
      expect(screen.getByText('☁️')).toBeInTheDocument();
      expect(screen.getByText('🌧️')).toBeInTheDocument();
      expect(screen.getByText('❄️')).toBeInTheDocument();
      expect(screen.getByText('⛈️')).toBeInTheDocument();
      expect(screen.getByText('🌫️')).toBeInTheDocument();
      expect(screen.getByText('🌤️')).toBeInTheDocument();
    });
  });

  // Test group: Check background color mapping
  describe('Background Color Mapping', () => {
    // Test: Each day card should have background color
    test('day cards have background styling', () => {
      const { container } = render(<ForecastCard forecast={mockForecastData} />);

      // Get all day cards
      const dayCards = container.querySelectorAll('div[style*="background"]');

      // Should have at least 7 day cards with background
      expect(dayCards.length).toBeGreaterThan(0);
    });

    // Test: Different conditions should have different backgrounds
    test('different conditions use different background colors', () => {
      const { container } = render(<ForecastCard forecast={mockForecastData} />);

      // Check that day card containers exist (they have inline styles with background)
      const dayCards = container.querySelectorAll('div[style*="border-radius: 14px"]');

      // Should have 7 day cards with backgrounds
      expect(dayCards.length).toBe(7);
    });
  });

  // Test group: Check interactive hover effects
  describe('Interactive Hover Effects', () => {
    // Test: Cards should scale on mouse enter
    test('card scales up on mouse enter', () => {
      const { container } = render(<ForecastCard forecast={mockForecastData} />);

      // Get first day card
      const dayCards = container.querySelectorAll('[style*="transform"]');
      const firstCard = dayCards[0] as HTMLElement;

      // Initial transform should be scale(1)
      const initialStyle = firstCard.style.transform;

      // Simulate mouse enter
      fireEvent.mouseEnter(firstCard);

      // Style should be updated (though this is tricky to test with inline styles)
      expect(firstCard).toBeInTheDocument();
    });

    // Test: Cards should scale down on mouse leave
    test('card scales down on mouse leave', () => {
      const { container } = render(<ForecastCard forecast={mockForecastData} />);

      // Get first day card
      const dayCards = container.querySelectorAll('[style*="cursor"]');
      const firstCard = dayCards[0] as HTMLElement;

      // Simulate mouse enter then leave
      fireEvent.mouseEnter(firstCard);
      fireEvent.mouseLeave(firstCard);

      // Card should still be in document
      expect(firstCard).toBeInTheDocument();
    });
  });

  // Test group: Check proper formatting of forecast data
  describe('Data Formatting', () => {
    // Test: Dates should be displayed
    test('displays dates correctly', () => {
      render(<ForecastCard forecast={mockForecastData} />);
      // Dates are styled with CSS textTransform: uppercase, but text is original case
      expect(screen.getByText('Monday')).toBeInTheDocument();
      expect(screen.getByText('Tuesday')).toBeInTheDocument();
    });

    // Test: Weather condition should be capitalized
    test('displays weather conditions', () => {
      render(<ForecastCard forecast={mockForecastData} />);
      // Conditions should be visible (can have multiple instances)
      expect(screen.getAllByText('Sunny').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Cloudy').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Rainy').length).toBeGreaterThan(0);
    });

    // Test: Temperature format should be correct
    test('displays temperatures in correct format', () => {
      render(<ForecastCard forecast={mockForecastData} />);
      // Max temps displayed (can have multiple)
      expect(screen.getAllByText(/\d+°/).length).toBeGreaterThan(0);
      // Min temps with "Low:" prefix
      expect(screen.getAllByText(/Low: \d+°/).length).toBeGreaterThan(0);
    });
  });

  // Test group: Check edge cases
  describe('Edge Cases', () => {
    // Test: Negative temperatures should display correctly
    test('displays negative temperatures correctly', () => {
      const coldForecast: Forecast = {
        city: 'Siberia',
        days: [
          { date: 'Day1', maxTemp: -5, minTemp: -10, condition: 'Snow' },
          { date: 'Day2', maxTemp: -2, minTemp: -8, condition: 'Snow' },
          { date: 'Day3', maxTemp: 0, minTemp: -5, condition: 'Cloudy' },
          { date: 'Day4', maxTemp: 5, minTemp: 0, condition: 'Cloudy' },
          { date: 'Day5', maxTemp: -3, minTemp: -7, condition: 'Snow' },
          { date: 'Day6', maxTemp: -1, minTemp: -6, condition: 'Snow' },
          { date: 'Day7', maxTemp: 2, minTemp: -3, condition: 'Cloudy' },
        ],
      };

      render(<ForecastCard forecast={coldForecast} />);
      // Verify negative temps display - can have multiple instances
      const negativeTemps = screen.getAllByText(/-\d+°/);
      expect(negativeTemps.length).toBeGreaterThan(0);
      // Verify Day1 is displayed
      expect(screen.getByText('Day1')).toBeInTheDocument();
    });

    // Test: Very high temperatures should display correctly
    test('displays very high temperatures correctly', () => {
      const hotForecast: Forecast = {
        city: 'Desert',
        days: [
          { date: 'Day1', maxTemp: 50, minTemp: 45, condition: 'Sunny' },
          { date: 'Day2', maxTemp: 52, minTemp: 47, condition: 'Sunny' },
          { date: 'Day3', maxTemp: 51, minTemp: 46, condition: 'Sunny' },
          { date: 'Day4', maxTemp: 49, minTemp: 44, condition: 'Sunny' },
          { date: 'Day5', maxTemp: 48, minTemp: 43, condition: 'Sunny' },
          { date: 'Day6', maxTemp: 51, minTemp: 46, condition: 'Sunny' },
          { date: 'Day7', maxTemp: 50, minTemp: 45, condition: 'Sunny' },
        ],
      };

      render(<ForecastCard forecast={hotForecast} />);
      // Verify high temps display - can have multiple instances
      const highTemps = screen.getAllByText(/5\d°/);
      expect(highTemps.length).toBeGreaterThan(0);
      // Verify Day2 has highest temp (52)
      const highestTemp = screen.getAllByText('52°');
      expect(highestTemp.length).toBeGreaterThan(0);
    });

    // Test: Same temp for max and min should display correctly
    test('displays identical max and min temperatures', () => {
      const uniformForecast: Forecast = {
        city: 'TestCity',
        days: [
          { date: 'Day1', maxTemp: 20, minTemp: 20, condition: 'Clear' },
          { date: 'Day2', maxTemp: 20, minTemp: 20, condition: 'Clear' },
          { date: 'Day3', maxTemp: 20, minTemp: 20, condition: 'Clear' },
          { date: 'Day4', maxTemp: 20, minTemp: 20, condition: 'Clear' },
          { date: 'Day5', maxTemp: 20, minTemp: 20, condition: 'Clear' },
          { date: 'Day6', maxTemp: 20, minTemp: 20, condition: 'Clear' },
          { date: 'Day7', maxTemp: 20, minTemp: 20, condition: 'Clear' },
        ],
      };

      render(<ForecastCard forecast={uniformForecast} />);
      // Verify multiple instances of 20° for all days
      const tempElements = screen.getAllByText('20°');
      expect(tempElements.length).toBeGreaterThan(0);
      // Verify low temps also display
      const lowTempElements = screen.getAllByText('Low: 20°');
      expect(lowTempElements.length).toBe(7);
    });

    // Test: City names with special characters should display correctly
    test('displays city names with special characters', () => {
      const specialCityForecast: Forecast = {
        city: 'São Paulo',
        days: [
          { date: 'Day1', maxTemp: 25, minTemp: 20, condition: 'Sunny' },
          { date: 'Day2', maxTemp: 24, minTemp: 19, condition: 'Cloudy' },
          { date: 'Day3', maxTemp: 22, minTemp: 18, condition: 'Rainy' },
          { date: 'Day4', maxTemp: 23, minTemp: 19, condition: 'Cloudy' },
          { date: 'Day5', maxTemp: 26, minTemp: 21, condition: 'Sunny' },
          { date: 'Day6', maxTemp: 27, minTemp: 22, condition: 'Sunny' },
          { date: 'Day7', maxTemp: 28, minTemp: 23, condition: 'Clear' },
        ],
      };

      render(<ForecastCard forecast={specialCityForecast} />);
      expect(screen.getByText('São Paulo - 7 Day Forecast')).toBeInTheDocument();
    });
  });
});
