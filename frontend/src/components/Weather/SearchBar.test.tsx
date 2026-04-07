import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

// Main test suite for SearchBar component
describe('SearchBar Component', () => {
  // Mock function to track when onSearch is called
  const mockOnSearch = jest.fn();

  // Run before each test to reset the mock
  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  // Test group: Check if all UI elements render correctly
  describe('Rendering', () => {
    // Test: Input field should be present
    test('renders search input field', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const input = screen.getByPlaceholderText('Enter city name...');
      expect(input).toBeInTheDocument();
    });

    // Test: Search button should be present
    test('renders search button', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    // Test: Title with emoji should be visible
    test('renders search title', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      expect(screen.getByText('🔍 Search Weather')).toBeInTheDocument();
    });

    // Test: Helper text should be visible
    test('renders helper text', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      expect(screen.getByText('Press Enter or click Search')).toBeInTheDocument();
    });
  });

  // Test group: Check if user input is handled correctly
  describe('Input Handling', () => {
    // Test: When user types, the input value should update
    test('updates input value when user types', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const input = screen.getByPlaceholderText('Enter city name...') as HTMLInputElement;

      // Simulate user typing "London"
      fireEvent.change(input, { target: { value: 'London' } });

      // Verify the input now contains "London"
      expect(input.value).toBe('London');
    });

    // Test: Input should accept spaces (for city names like "New York")
    test('accepts city name with spaces', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const input = screen.getByPlaceholderText('Enter city name...') as HTMLInputElement;

      // Simulate user typing "New York"
      fireEvent.change(input, { target: { value: 'New York' } });
      expect(input.value).toBe('New York');
    });

    // Test: Input should clear after successful search
    test('clears input after successful search', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const input = screen.getByPlaceholderText('Enter city name...') as HTMLInputElement;
      const button = screen.getByRole('button');

      // User types "Paris"
      fireEvent.change(input, { target: { value: 'Paris' } });

      // User clicks search button
      fireEvent.click(button);

      // Input should now be empty
      expect(input.value).toBe('');
    });
  });

  // Test group: Check search button functionality
  describe('Search Button Click', () => {
    // Test: Clicking button with valid input should call onSearch
    test('calls onSearch when search button is clicked', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const input = screen.getByPlaceholderText('Enter city name...');
      const button = screen.getByRole('button');

      // User types "Tokyo"
      fireEvent.change(input, { target: { value: 'Tokyo' } });

      // User clicks search button
      fireEvent.click(button);

      // Verify onSearch was called with "Tokyo"
      expect(mockOnSearch).toHaveBeenCalledWith('Tokyo');

      // Verify it was called exactly once
      expect(mockOnSearch).toHaveBeenCalledTimes(1);
    });

    // Test: Empty input should not trigger search
    test('does not call onSearch when input is empty', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const button = screen.getByRole('button');

      // User clicks button without typing anything
      fireEvent.click(button);

      // onSearch should NOT be called
      expect(mockOnSearch).not.toHaveBeenCalled();
    });

    // Test: Whitespace-only input should not trigger search
    test('does not call onSearch when input is only whitespace', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const input = screen.getByPlaceholderText('Enter city name...');
      const button = screen.getByRole('button');

      // User types only spaces
      fireEvent.change(input, { target: { value: '   ' } });

      // User clicks search button
      fireEvent.click(button);

      // onSearch should NOT be called
      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });

  // Test group: Check Enter key functionality
  describe('Enter Key Press', () => {
    // Test: Pressing Enter should trigger search
    test('calls onSearch when Enter key is pressed', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const input = screen.getByPlaceholderText('Enter city name...');

      // User types "Amsterdam"
      fireEvent.change(input, { target: { value: 'Amsterdam' } });

      // User presses Enter key
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

      // Verify onSearch was called with "Amsterdam"
      expect(mockOnSearch).toHaveBeenCalledWith('Amsterdam');
    });

    // Test: Input should clear after Enter press
    test('clears input after Enter key press', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const input = screen.getByPlaceholderText('Enter city name...') as HTMLInputElement;

      // User types "Barcelona"
      fireEvent.change(input, { target: { value: 'Barcelona' } });

      // User presses Enter key
      fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

      // Input should be cleared
      expect(input.value).toBe('');
    });

    // Test: Other keys should not trigger search
    test('does not call onSearch on other key presses', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const input = screen.getByPlaceholderText('Enter city name...');

      // User types "Rome"
      fireEvent.change(input, { target: { value: 'Rome' } });

      // User presses 'a' key (not Enter)
      fireEvent.keyPress(input, { key: 'a', code: 'KeyA', charCode: 97 });

      // onSearch should NOT be called
      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });

  // Test group: Check loading state behavior
  describe('Loading State', () => {
    // Test: Input should be disabled during loading
    test('disables input when loading is true', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={true} />);
      const input = screen.getByPlaceholderText('Enter city name...') as HTMLInputElement;

      // Input should be disabled
      expect(input.disabled).toBe(true);
    });

    // Test: Button should be disabled during loading
    test('disables button when loading is true', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={true} />);
      const button = screen.getByRole('button') as HTMLButtonElement;

      // Button should be disabled
      expect(button.disabled).toBe(true);
    });

    // Test: Input should be enabled when not loading
    test('enables input when loading is false', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const input = screen.getByPlaceholderText('Enter city name...') as HTMLInputElement;

      // Input should be enabled
      expect(input.disabled).toBe(false);
    });

    // Test: Button text should show "Searching..." during loading
    test('shows "Searching..." text on button when loading', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={true} />);

      // Button should display "⏳ Searching..."
      expect(screen.getByText(/⏳ Searching.../)).toBeInTheDocument();
    });

    // Test: Button text should show "Search" when not loading
    test('shows "Search" text on button when not loading', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);

      // Button should display "🔎 Search"
      expect(screen.getByText(/🔎 Search/)).toBeInTheDocument();
    });

    // Test: Disabled button should not trigger search
    test('prevents search when button is disabled', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={true} />);
      const button = screen.getByRole('button') as HTMLButtonElement;

      // User clicks disabled button
      fireEvent.click(button);

      // onSearch should NOT be called
      expect(mockOnSearch).not.toHaveBeenCalled();
    });
  });

  // Test group: Edge cases and special scenarios
  describe('Edge Cases', () => {
    // Test: Multiple searches in quick succession should work
    test('handles rapid consecutive searches', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const input = screen.getByPlaceholderText('Enter city name...') as HTMLInputElement;
      const button = screen.getByRole('button');

      // First search: City1
      fireEvent.change(input, { target: { value: 'City1' } });
      fireEvent.click(button);

      // Second search: City2
      fireEvent.change(input, { target: { value: 'City2' } });
      fireEvent.click(button);

      // Verify both searches were called
      expect(mockOnSearch).toHaveBeenCalledTimes(2);
      expect(mockOnSearch).toHaveBeenNthCalledWith(1, 'City1');
      expect(mockOnSearch).toHaveBeenNthCalledWith(2, 'City2');
    });

    // Test: Special characters in city names should be handled
    test('handles special characters in city name', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const input = screen.getByPlaceholderText('Enter city name...');
      const button = screen.getByRole('button');

      // User types city with special characters
      fireEvent.change(input, { target: { value: "Saint-Honoré" } });
      fireEvent.click(button);

      // Verify onSearch was called with special characters
      expect(mockOnSearch).toHaveBeenCalledWith("Saint-Honoré");
    });

    // Test: Numbers in city names should be handled
    test('handles numbers in city name', () => {
      render(<SearchBar onSearch={mockOnSearch} loading={false} />);
      const input = screen.getByPlaceholderText('Enter city name...');
      const button = screen.getByRole('button');

      // User types city with numbers
      fireEvent.change(input, { target: { value: 'City123' } });
      fireEvent.click(button);

      // Verify onSearch was called with numbers
      expect(mockOnSearch).toHaveBeenCalledWith('City123');
    });
  });
});
