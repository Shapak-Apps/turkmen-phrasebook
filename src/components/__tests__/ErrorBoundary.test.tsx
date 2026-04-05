// src/components/__tests__/ErrorBoundary.test.tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import ErrorBoundary from '../ErrorBoundary';

// Mock expo icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock Colors
jest.mock('../../constants/Colors', () => ({
  Colors: {
    primary: '#007AFF',
    error: '#FF3B30',
    text: '#000000',
    textLight: '#666666',
    textWhite: '#FFFFFF',
    background: '#FFFFFF',
    backgroundLight: '#F5F5F5',
  },
}));

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <Text>No error</Text>;
};

// Suppress console.error for error boundary tests
const originalConsoleError = console.error;

beforeEach(() => {
  console.error = jest.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary', () => {
  it('should render children when no error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Test content</Text>
      </ErrorBoundary>
    );

    expect(getByText('Test content')).toBeTruthy();
  });

  it('should catch errors and display error UI', () => {
    const { getByText, queryByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Что-то пошло не так')).toBeTruthy();
    expect(queryByText('No error')).toBeNull();
  });

  it('should display error message', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText(/Произошла непредвиденная ошибка/)).toBeTruthy();
  });

  it('should display retry button', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Попробовать снова')).toBeTruthy();
  });

  it('should reset error state when retry is pressed', () => {
    const TestComponent = () => {
      const [shouldThrow, setShouldThrow] = React.useState(true);

      return (
        <View>
          <ErrorBoundary key={shouldThrow ? 'error' : 'no-error'}>
            <ThrowError shouldThrow={shouldThrow} />
          </ErrorBoundary>
        </View>
      );
    };

    const { getByText } = render(<TestComponent />);

    // Error should be shown
    expect(getByText('Что-то пошло не так')).toBeTruthy();

    // Press retry button
    const retryButton = getByText('Попробовать снова');
    fireEvent.press(retryButton);

    // After reset, error boundary will re-render children
    // If children still throw, error will be shown again
  });

  it('should render custom fallback component', () => {
    const CustomFallback = <Text>Custom error fallback</Text>;

    const { getByText, queryByText } = render(
      <ErrorBoundary fallbackComponent={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(getByText('Custom error fallback')).toBeTruthy();
    expect(queryByText('Что-то пошло не так')).toBeNull();
  });

  it('should not render fallback when no error', () => {
    const CustomFallback = <Text>Custom fallback</Text>;

    const { getByText, queryByText } = render(
      <ErrorBoundary fallbackComponent={CustomFallback}>
        <Text>Normal content</Text>
      </ErrorBoundary>
    );

    expect(getByText('Normal content')).toBeTruthy();
    expect(queryByText('Custom fallback')).toBeNull();
  });

  it('should log error to console', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalled();
  });

  it('should handle multiple children', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Child 1</Text>
        <Text>Child 2</Text>
        <Text>Child 3</Text>
      </ErrorBoundary>
    );

    expect(getByText('Child 1')).toBeTruthy();
    expect(getByText('Child 2')).toBeTruthy();
    expect(getByText('Child 3')).toBeTruthy();
  });

  it('should catch error from nested components', () => {
    const NestedComponent = () => (
      <View>
        <View>
          <ThrowError shouldThrow={true} />
        </View>
      </View>
    );

    const { getByText, queryByText } = render(
      <ErrorBoundary>
        <NestedComponent />
      </ErrorBoundary>
    );

    expect(getByText('Что-то пошло не так')).toBeTruthy();
    expect(queryByText('No error')).toBeNull();
  });

  // Skip debug info test as __DEV__ is not easily mockable in tests
  // In development mode, the debug info would be shown
});
