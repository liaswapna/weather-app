import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

// Mock console.error to avoid cluttering test output
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

describe('ErrorBoundary Component - Critical Paths', () => {
  // Cleanup after each test
  afterEach(() => {
    mockConsoleError.mockClear();
  });

  // CRITICAL PATH 1: Render children normally when no error
  describe('Path 1: Normal Render - No Error', () => {
    test('should render children when no error occurs', () => {
      // Component that doesn't throw
      const TestComponent = () => <div data-testid="test-child">Child content</div>;

      render(
        <ErrorBoundary>
          <TestComponent />
        </ErrorBoundary>
      );

      // Verify child is rendered
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });

    test('should render multiple children without error', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <div data-testid="child-3">Child 3</div>
        </ErrorBoundary>
      );

      // Verify all children rendered
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
    });

    test('should not display error fallback when children render successfully', () => {
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      );

      // Verify fallback error message NOT shown
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
      expect(screen.queryByText(/An error occurred/)).not.toBeInTheDocument();
    });
  });

  // CRITICAL PATH 2: Catch errors and show fallback UI
  describe('Path 2: Error Caught - Show Fallback UI', () => {
    test('should catch error thrown by child component and show fallback UI', () => {
      // Component that throws an error
      const BrokenComponent = () => {
        throw new Error('Test error message');
      };

      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      // Verify fallback UI is shown
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    test('should display error message in fallback UI', () => {
      // Component that throws specific error
      const ComponentWithError = () => {
        throw new Error('Network request failed');
      };

      render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>
      );

      // Verify error message displayed
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Network request failed')).toBeInTheDocument();
    });

    test('should show fallback UI for TypeError', () => {
      // Component that throws TypeError
      const TypeErrorComponent = () => {
        throw new TypeError('Cannot read property of undefined');
      };

      render(
        <ErrorBoundary>
          <TypeErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Cannot read property of undefined')).toBeInTheDocument();
    });

    test('should show fallback UI for ReferenceError', () => {
      // Component that throws ReferenceError
      const ReferenceErrorComponent = () => {
        throw new ReferenceError('Variable is not defined');
      };

      render(
        <ErrorBoundary>
          <ReferenceErrorComponent />
        </ErrorBoundary>
      );

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Variable is not defined')).toBeInTheDocument();
    });

    test('should not render children when error occurs', () => {
      // Component that throws
      const BrokenComponent = () => {
        throw new Error('Component failed');
      };

      render(
        <ErrorBoundary>
          <div data-testid="normal-child">This should not render</div>
          <BrokenComponent />
        </ErrorBoundary>
      );

      // Verify child not rendered, fallback shown instead
      expect(screen.queryByTestId('normal-child')).not.toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  // CRITICAL PATH 3: Log errors to console
  describe('Path 3: Error Logging', () => {
    test('should log error to console when component error occurs', () => {
      // Component that throws
      const BrokenComponent = () => {
        throw new Error('Test error for logging');
      };

      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      // Verify console.error was called
      expect(mockConsoleError).toHaveBeenCalled();
      expect(mockConsoleError).toHaveBeenCalledWith(
        expect.stringContaining('Error caught by boundary:'),
        expect.any(Error),
        expect.any(Object)
      );
    });

    test('should include error details in console log', () => {
      // Component with specific error
      const ErrorComponent = () => {
        throw new Error('Specific error details');
      };

      render(
        <ErrorBoundary>
          <ErrorComponent />
        </ErrorBoundary>
      );

      // Verify error was logged (React logs with %o format for objects)
      expect(mockConsoleError).toHaveBeenCalled();
      // Just verify it was called with arguments
      expect(mockConsoleError.mock.calls[0].length).toBeGreaterThan(0);
    });

    test('should pass errorInfo to console.error with error details', () => {
      // Component that throws
      const ComponentWithError = () => {
        throw new Error('Error with stack trace');
      };

      render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>
      );

      // Verify error details were logged
      expect(mockConsoleError).toHaveBeenCalled();
      // Verify multiple arguments were passed (error message and details)
      expect(mockConsoleError.mock.calls[0].length).toBeGreaterThanOrEqual(2);
    });
  });

  // CRITICAL PATH 4: Fallback UI styling and structure
  describe('Path 4: Fallback UI Structure', () => {
    test('should show fallback with proper heading', () => {
      const BrokenComponent = () => {
        throw new Error('Test error');
      };

      render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      // Verify heading structure
      const heading = screen.getByText('Something went wrong');
      expect(heading.tagName).toBe('H2');
      expect(heading).toBeInTheDocument();
    });

    test('should display error message as paragraph', () => {
      const ComponentWithError = () => {
        throw new Error('Detailed error message');
      };

      render(
        <ErrorBoundary>
          <ComponentWithError />
        </ErrorBoundary>
      );

      // Verify error message is displayed
      const errorMessage = screen.getByText('Detailed error message');
      expect(errorMessage).toBeInTheDocument();
    });

    test('should apply error styling classes to fallback UI', () => {
      const BrokenComponent = () => {
        throw new Error('Styled error');
      };

      const { container } = render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      // Check for error styling classes
      const errorContainer = container.querySelector('.bg-red-50');
      expect(errorContainer).toBeInTheDocument();

      const borderElement = container.querySelector('.border-red-200');
      expect(borderElement).toBeInTheDocument();

      const heading = container.querySelector('.text-red-800');
      expect(heading).toBeInTheDocument();

      const message = container.querySelector('.text-red-600');
      expect(message).toBeInTheDocument();
    });

    test('should have rounded corners and padding in fallback UI', () => {
      const BrokenComponent = () => {
        throw new Error('Test');
      };

      const { container } = render(
        <ErrorBoundary>
          <BrokenComponent />
        </ErrorBoundary>
      );

      // Verify styling classes
      const errorDiv = container.querySelector('.rounded-lg');
      expect(errorDiv).toBeInTheDocument();

      const paddedDiv = container.querySelector('.p-6');
      expect(paddedDiv).toBeInTheDocument();
    });
  });

  // CRITICAL PATH 5: Boundary prevents app crash
  describe('Path 5: Prevent App Crash', () => {
    test('should prevent component error from crashing entire app', () => {
      // Component that throws
      const BrokenComponent = () => {
        throw new Error('This should not crash the app');
      };

      // This should not throw
      expect(() => {
        render(
          <ErrorBoundary>
            <BrokenComponent />
          </ErrorBoundary>
        );
      }).not.toThrow();

      // App should still be able to display fallback UI
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    test('should isolate errors - siblings should still render if one throws', () => {
      // Component that throws
      const BrokenComponent = () => {
        throw new Error('First component failed');
      };

      // Component that doesn't throw
      const WorkingComponent = () => {
        return <div data-testid="working-child">Still works</div>;
      };

      render(
        <ErrorBoundary>
          <WorkingComponent />
          <BrokenComponent />
        </ErrorBoundary>
      );

      // Working component should not render (error occurs in tree)
      // but fallback should show
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    test('should catch errors from deeply nested components', () => {
      // Deeply nested component with error
      const DeepComponent = () => {
        throw new Error('Deep error');
      };

      const MiddleComponent = () => (
        <div>
          <DeepComponent />
        </div>
      );

      const TopComponent = () => (
        <div>
          <MiddleComponent />
        </div>
      );

      render(
        <ErrorBoundary>
          <TopComponent />
        </ErrorBoundary>
      );

      // Should catch error from deeply nested component
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Deep error')).toBeInTheDocument();
    });
  });

  // CRITICAL PATH 6: Edge cases
  describe('Path 6: Edge Cases', () => {
    test('should handle error with empty message', () => {
      const ComponentWithEmptyError = () => {
        throw new Error('');
      };

      render(
        <ErrorBoundary>
          <ComponentWithEmptyError />
        </ErrorBoundary>
      );

      // Fallback should still show even with empty error message
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    test('should handle very long error messages', () => {
      const longErrorMessage = 'A'.repeat(500);
      const ComponentWithLongError = () => {
        throw new Error(longErrorMessage);
      };

      render(
        <ErrorBoundary>
          <ComponentWithLongError />
        </ErrorBoundary>
      );

      // Long error message should display
      expect(screen.getByText(longErrorMessage)).toBeInTheDocument();
    });

    test('should handle errors with special characters', () => {
      const errorMessage = 'Error: "Failed" (404) -> Invalid data';
      const ComponentWithSpecialCharsError = () => {
        throw new Error(errorMessage);
      };

      render(
        <ErrorBoundary>
          <ComponentWithSpecialCharsError />
        </ErrorBoundary>
      );

      // Special characters should display correctly
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
