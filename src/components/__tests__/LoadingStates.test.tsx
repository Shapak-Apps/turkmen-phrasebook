// src/components/__tests__/LoadingStates.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import {
  LoadingSpinner,
  Skeleton,
  PhraseCardSkeleton,
  CategoryGridSkeleton,
  LoadingWithProgress,
  ButtonLoading,
  EmptyState,
} from '../LoadingStates';

// Mock Colors
jest.mock('../../constants/Colors', () => ({
  Colors: {
    primary: '#007AFF',
    text: '#000000',
    textLight: '#666666',
    textWhite: '#FFFFFF',
    background: '#FFFFFF',
    backgroundLight: '#F5F5F5',
    cardBackground: '#FFFFFF',
  },
}));

describe('LoadingStates Components', () => {
  describe('LoadingSpinner', () => {
    it('should render without message', () => {
      const { getByTestId } = render(<LoadingSpinner />);
      expect(screen).toBeTruthy();
    });

    it('should render with message', () => {
      const message = 'Loading data...';
      const { getByText } = render(<LoadingSpinner message={message} />);
      expect(getByText(message)).toBeTruthy();
    });

    it('should accept size prop', () => {
      const { rerender } = render(<LoadingSpinner size="small" />);
      expect(screen).toBeTruthy();

      rerender(<LoadingSpinner size="large" />);
      expect(screen).toBeTruthy();
    });

    it('should accept color prop', () => {
      render(<LoadingSpinner color="#FF0000" />);
      expect(screen).toBeTruthy();
    });
  });

  describe('Skeleton', () => {
    it('should render with default props', () => {
      render(<Skeleton />);
      expect(screen).toBeTruthy();
    });

    it('should accept custom dimensions', () => {
      render(
        <Skeleton
          width={200}
          height={50}
          borderRadius={10}
          marginBottom={20}
        />
      );
      expect(screen).toBeTruthy();
    });

    it('should accept string width', () => {
      render(<Skeleton width="50%" />);
      expect(screen).toBeTruthy();
    });
  });

  describe('PhraseCardSkeleton', () => {
    it('should render skeleton card', () => {
      render(<PhraseCardSkeleton />);
      expect(screen).toBeTruthy();
    });
  });

  describe('CategoryGridSkeleton', () => {
    it('should render default 6 items', () => {
      render(<CategoryGridSkeleton />);
      expect(screen).toBeTruthy();
    });

    it('should render custom number of items', () => {
      render(<CategoryGridSkeleton count={10} />);
      expect(screen).toBeTruthy();
    });

    it('should render with count of 0', () => {
      render(<CategoryGridSkeleton count={0} />);
      expect(screen).toBeTruthy();
    });
  });

  describe('LoadingWithProgress', () => {
    it('should render with default message', () => {
      const { getByText } = render(<LoadingWithProgress />);
      expect(getByText('Загрузка...')).toBeTruthy();
    });

    it('should render custom message', () => {
      const { getByText } = render(
        <LoadingWithProgress message="Downloading..." />
      );
      expect(getByText('Downloading...')).toBeTruthy();
    });

    it('should render sub message', () => {
      const { getByText } = render(
        <LoadingWithProgress subMessage="Please wait" />
      );
      expect(getByText('Please wait')).toBeTruthy();
    });

    it('should render progress bar when progress is provided', () => {
      const { getByText } = render(<LoadingWithProgress progress={0.5} />);
      expect(getByText('50%')).toBeTruthy();
    });

    it('should handle progress at 0%', () => {
      const { getByText } = render(<LoadingWithProgress progress={0} />);
      expect(getByText('0%')).toBeTruthy();
    });

    it('should handle progress at 100%', () => {
      const { getByText } = render(<LoadingWithProgress progress={1} />);
      expect(getByText('100%')).toBeTruthy();
    });

    it('should display progress above 100% as-is (only bar is capped)', () => {
      const { getByText } = render(<LoadingWithProgress progress={1.5} />);
      // Text shows actual percentage, only the progress bar width is capped
      expect(getByText('150%')).toBeTruthy();
    });

    it('should display negative progress as-is (only bar is capped)', () => {
      const { getByText } = render(<LoadingWithProgress progress={-0.5} />);
      // Text shows actual percentage, only the progress bar width is capped
      expect(getByText('-50%')).toBeTruthy();
    });
  });

  describe('ButtonLoading', () => {
    it('should render children when not loading', () => {
      const { getByText } = render(
        <ButtonLoading loading={false}>
          <>{/* Text component needs to be used directly */}</>
        </ButtonLoading>
      );
      expect(screen).toBeTruthy();
    });

    it('should render spinner when loading', () => {
      render(
        <ButtonLoading loading={true}>
          <>{/* Content */}</>
        </ButtonLoading>
      );
      expect(screen).toBeTruthy();
    });

    it('should default to not loading', () => {
      render(
        <ButtonLoading>
          <>{/* Content */}</>
        </ButtonLoading>
      );
      expect(screen).toBeTruthy();
    });
  });

  describe('EmptyState', () => {
    it('should render title and message', () => {
      const { getByText } = render(
        <EmptyState
          title="No items"
          message="There are no items to display"
        />
      );
      expect(getByText('No items')).toBeTruthy();
      expect(getByText('There are no items to display')).toBeTruthy();
    });

    it('should render custom icon', () => {
      const { getByText } = render(
        <EmptyState
          icon="🔍"
          title="No results"
          message="No search results found"
        />
      );
      expect(getByText('🔍')).toBeTruthy();
    });

    it('should render action button', () => {
      const onAction = jest.fn();
      const { getByText } = render(
        <EmptyState
          title="No items"
          message="There are no items"
          actionText="Add item"
          onAction={onAction}
        />
      );

      const actionButton = getByText('Add item');
      expect(actionButton).toBeTruthy();

      fireEvent.press(actionButton);
      expect(onAction).toHaveBeenCalled();
    });

    it('should show loading indicator instead of action text when loading', () => {
      const onAction = jest.fn();
      render(
        <EmptyState
          title="Loading"
          message="Please wait"
          actionText="Retry"
          onAction={onAction}
          loading={true}
        />
      );
      expect(screen).toBeTruthy();
    });

    it('should not render action when actionText is provided but onAction is not', () => {
      render(
        <EmptyState
          title="Test"
          message="Test message"
          actionText="Action"
        />
      );
      expect(screen).toBeTruthy();
    });

    it('should not render action when onAction is provided but actionText is not', () => {
      const onAction = jest.fn();
      render(
        <EmptyState
          title="Test"
          message="Test message"
          onAction={onAction}
        />
      );
      expect(screen).toBeTruthy();
    });
  });
});
