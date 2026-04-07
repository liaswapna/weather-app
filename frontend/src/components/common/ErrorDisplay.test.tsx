import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorDisplay from './ErrorDisplay';

// Main test suite for ErrorDisplay component
describe('ErrorDisplay Component', () => {
  // Mock function to track when onDismiss is called
  const mockOnDismiss = jest.fn();

  // Run before each test to reset the mock
  beforeEach(() => {
    mockOnDismiss.mockClear();
  });

  // Test group: Check if error message renders correctly
  describe('Error Message Display', () => {
    // Test: Error message should be displayed
    test('displays the error message', () => {
      const errorMessage = 'City not found. Please try another city.';
      render(<ErrorDisplay error={errorMessage} onDismiss={mockOnDismiss} />);
      // Verify error message is visible
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Test: "Error" label should be displayed
    test('displays "Error" label', () => {
      render(<ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />);
      // Verify "Error" label is present
      expect(screen.getByText('Error')).toBeInTheDocument();
    });

    // Test: Different error messages should display correctly
    test('displays different error messages correctly', () => {
      const { rerender } = render(
        <ErrorDisplay error="Network error" onDismiss={mockOnDismiss} />
      );
      expect(screen.getByText('Network error')).toBeInTheDocument();

      // Re-render with different error
      rerender(<ErrorDisplay error="API timeout" onDismiss={mockOnDismiss} />);
      expect(screen.getByText('API timeout')).toBeInTheDocument();

      // Re-render with another error
      rerender(<ErrorDisplay error="Invalid input" onDismiss={mockOnDismiss} />);
      expect(screen.getByText('Invalid input')).toBeInTheDocument();
    });

    // Test: Long error message should display
    test('displays long error message', () => {
      const longError = 'An unexpected error occurred while fetching weather data. Please check your internet connection and try again.';
      render(<ErrorDisplay error={longError} onDismiss={mockOnDismiss} />);
      expect(screen.getByText(longError)).toBeInTheDocument();
    });

    // Test: Error message with special characters should display
    test('displays error message with special characters', () => {
      const specialError = "Error: City 'London' not found (404)";
      render(<ErrorDisplay error={specialError} onDismiss={mockOnDismiss} />);
      expect(screen.getByText(specialError)).toBeInTheDocument();
    });
  });

  // Test group: Check if close button exists and functions correctly
  describe('Close Button', () => {
    // Test: Close button (✕) should be present
    test('displays close button with ✕ symbol', () => {
      render(<ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />);
      // Verify close button is visible
      const closeButton = screen.getByRole('button');
      expect(closeButton).toBeInTheDocument();
      expect(closeButton.textContent).toBe('✕');
    });

    // Test: Close button should be clickable
    test('close button is clickable', () => {
      render(<ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />);
      const closeButton = screen.getByRole('button');
      // Button should not be disabled
      expect(closeButton).not.toBeDisabled();
    });

    // Test: Close button should trigger onDismiss callback
    test('calls onDismiss when close button is clicked', () => {
      render(<ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />);
      const closeButton = screen.getByRole('button');

      // Click the close button
      fireEvent.click(closeButton);

      // Verify onDismiss was called
      expect(mockOnDismiss).toHaveBeenCalled();
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });

    // Test: Multiple clicks should call onDismiss multiple times
    test('calls onDismiss multiple times on multiple clicks', () => {
      render(<ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />);
      const closeButton = screen.getByRole('button');

      // Click multiple times
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);
      fireEvent.click(closeButton);

      // Verify onDismiss was called 3 times
      expect(mockOnDismiss).toHaveBeenCalledTimes(3);
    });
  });

  // Test group: Check visual elements and styling
  describe('Visual Elements', () => {
    // Test: Warning emoji should be present
    test('displays warning emoji (⚠️)', () => {
      render(<ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />);
      // Verify warning emoji is visible
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    // Test: Component should have error styling
    test('component has proper styling classes', () => {
      const { container } = render(
        <ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />
      );

      // Find the main container with background gradient
      const errorContainer = container.querySelector(
        '.bg-gradient-to-r.from-red-50.to-red-100'
      );
      expect(errorContainer).toBeInTheDocument();
    });

    // Test: Component should have red border
    test('component has red border styling', () => {
      const { container } = render(
        <ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />
      );

      // Find element with border-red class
      const borderElement = container.querySelector('[class*="border-red"]');
      expect(borderElement).toBeInTheDocument();
    });

    // Test: Component should have rounded corners
    test('component has rounded corners', () => {
      const { container } = render(
        <ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />
      );

      // Find element with rounded-xl class
      const roundedElement = container.querySelector('.rounded-xl');
      expect(roundedElement).toBeInTheDocument();
    });

    // Test: Component should have shadow effect
    test('component has shadow effect', () => {
      const { container } = render(
        <ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />
      );

      // Find element with shadow-lg class
      const shadowElement = container.querySelector('.shadow-lg');
      expect(shadowElement).toBeInTheDocument();
    });
  });

  // Test group: Check layout and positioning
  describe('Layout and Structure', () => {
    // Test: Error message and close button should be on same line
    test('error message and close button are positioned correctly', () => {
      const { container } = render(
        <ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />
      );

      // Find flex container that arranges items
      const flexContainer = container.querySelector('.flex.justify-between');
      expect(flexContainer).toBeInTheDocument();
    });

    // Test: Warning emoji and text should be grouped together
    test('warning emoji and text are grouped together', () => {
      const { container } = render(
        <ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />
      );

      // Find the container that groups emoji and text
      const groupContainer = container.querySelector('.flex.items-start.gap-4');
      expect(groupContainer).toBeInTheDocument();
    });

    // Test: Component should have bottom margin
    test('component has bottom margin for spacing', () => {
      const { container } = render(
        <ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />
      );

      // Find element with mb-6 class
      const marginElement = container.querySelector('.mb-6');
      expect(marginElement).toBeInTheDocument();
    });
  });

  // Test group: Check text styling
  describe('Text Styling', () => {
    // Test: "Error" label should be bold
    test('"Error" label is bold and prominent', () => {
      render(<ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />);
      const errorLabel = screen.getByText('Error');

      // Check element has bold font
      expect(errorLabel.className).toContain('font-bold');
    });

    // Test: "Error" label should have dark red color
    test('"Error" label has dark red color', () => {
      render(<ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />);
      const errorLabel = screen.getByText('Error');

      // Check element has red color
      expect(errorLabel.className).toContain('text-red');
    });

    // Test: Error message should have red color
    test('error message has red color', () => {
      render(<ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />);
      const errorMessage = screen.getByText('Test error');

      // Check element has red color
      expect(errorMessage.className).toContain('text-red');
    });

    // Test: Close button should have red color
    test('close button has red color with hover effect', () => {
      render(<ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />);
      const closeButton = screen.getByRole('button');

      // Check button has red color and hover effect classes
      expect(closeButton.className).toContain('text-red');
      expect(closeButton.className).toContain('hover:text-red');
    });
  });

  // Test group: Check edge cases and special scenarios
  describe('Edge Cases', () => {
    // Test: Empty error message should still render
    test('renders with empty error message', () => {
      const { container } = render(
        <ErrorDisplay error="" onDismiss={mockOnDismiss} />
      );
      // Component should still be in DOM
      expect(container.firstChild).toBeInTheDocument();
    });

    // Test: Very long error message should display
    test('handles very long error message', () => {
      const veryLongError = 'This is a very long error message that describes a complex error condition with multiple details about what went wrong and why the operation failed in the application.';
      render(<ErrorDisplay error={veryLongError} onDismiss={mockOnDismiss} />);
      expect(screen.getByText(veryLongError)).toBeInTheDocument();
    });

    // Test: Error message with numbers should display
    test('displays error message with numbers and codes', () => {
      const errorWithCode = 'Error 404: Resource not found. Status code: 404';
      render(<ErrorDisplay error={errorWithCode} onDismiss={mockOnDismiss} />);
      expect(screen.getByText(errorWithCode)).toBeInTheDocument();
    });

    // Test: Error message with quotes should display
    test('displays error message with quotes', () => {
      const errorWithQuotes = 'Error: "London" is not a valid city name';
      render(<ErrorDisplay error={errorWithQuotes} onDismiss={mockOnDismiss} />);
      expect(screen.getByText(errorWithQuotes)).toBeInTheDocument();
    });

    // Test: Multiple ErrorDisplay components should work independently
    test('renders multiple error displays independently', () => {
      render(
        <>
          <ErrorDisplay error="First error" onDismiss={jest.fn()} />
          <ErrorDisplay error="Second error" onDismiss={jest.fn()} />
        </>
      );

      // Both errors should be visible
      expect(screen.getByText('First error')).toBeInTheDocument();
      expect(screen.getByText('Second error')).toBeInTheDocument();

      // Should have 2 close buttons
      const closeButtons = screen.getAllByRole('button');
      expect(closeButtons.length).toBe(2);
    });

    // Test: onDismiss callback should be called when button is clicked
    test('onDismiss callback is called when button is clicked', () => {
      render(<ErrorDisplay error="Test error" onDismiss={mockOnDismiss} />);
      const closeButton = screen.getByRole('button');

      // Click the button
      fireEvent.click(closeButton);

      // Check that callback was called
      expect(mockOnDismiss).toHaveBeenCalled();
      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });
  });
});
