// src/components/LoadingStates.tsx - новый файл

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'large', 
  color = Colors.primary,
  message 
}) => (
  <View style={styles.spinnerContainer}>
    <ActivityIndicator size={size} color={color} />
    {message && <Text style={styles.loadingMessage}>{message}</Text>}
  </View>
);

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  marginBottom?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4,
  marginBottom = 8 
}) => (
  <View 
    style={[
      styles.skeleton, 
      { 
        width: width as any, // Type assertion для совместимости с DimensionValue
        height, 
        borderRadius, 
        marginBottom 
      }
    ]} 
  />
);

// Скелетон для карточки фразы
export const PhraseCardSkeleton: React.FC = () => (
  <View style={styles.phraseCardSkeleton}>
    <View style={styles.skeletonContent}>
      <Skeleton width="60%" height={24} marginBottom={8} />
      <Skeleton width="40%" height={16} marginBottom={8} />
      <Skeleton width="80%" height={18} marginBottom={6} />
      <Skeleton width="50%" height={14} marginBottom={0} />
    </View>
    <View style={styles.skeletonActions}>
      <Skeleton width={28} height={28} borderRadius={14} marginBottom={8} />
      <Skeleton width={28} height={28} borderRadius={14} marginBottom={8} />
      <Skeleton width={24} height={24} borderRadius={12} marginBottom={0} />
    </View>
  </View>
);

// Скелетон для списка категорий
export const CategoryGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <View style={styles.categoryGridSkeleton}>
    {Array.from({ length: count }).map((_, index) => (
      <View key={index} style={styles.categoryItemSkeleton}>
        <Skeleton width={48} height={48} borderRadius={24} marginBottom={8} />
        <Skeleton width="80%" height={14} marginBottom={4} />
        <Skeleton width="60%" height={12} marginBottom={0} />
      </View>
    ))}
  </View>
);

// Компонент загрузки с прогрессом
interface LoadingWithProgressProps {
  progress?: number; // 0-1
  message?: string;
  subMessage?: string;
}

export const LoadingWithProgress: React.FC<LoadingWithProgressProps> = ({
  progress,
  message = 'Загрузка...',
  subMessage
}) => (
  <View style={styles.progressContainer}>
    <ActivityIndicator size="large" color={Colors.primary} />
    <Text style={styles.progressMessage}>{message}</Text>
    {subMessage && <Text style={styles.progressSubMessage}>{subMessage}</Text>}
    
    {progress !== undefined && (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${Math.max(0, Math.min(100, progress * 100))}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
      </View>
    )}
  </View>
);

// Индикатор для кнопок
interface ButtonLoadingProps {
  loading?: boolean;
  children: React.ReactNode;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({ loading, children }) => (
  <View style={styles.buttonLoadingContainer}>
    {loading && <ActivityIndicator size="small" color={Colors.textWhite} style={styles.buttonSpinner} />}
    <View style={[styles.buttonContent, loading && styles.buttonContentLoading]}>
      {children}
    </View>
  </View>
);

// Пустое состояние с возможностью retry
interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  loading?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'document-outline',
  title,
  message,
  actionText,
  onAction,
  loading
}) => (
  <View style={styles.emptyStateContainer}>
    <Text style={styles.emptyStateIcon}>{icon}</Text>
    <Text style={styles.emptyStateTitle}>{title}</Text>
    <Text style={styles.emptyStateMessage}>{message}</Text>
    
    {actionText && onAction && (
      <View style={styles.emptyStateAction}>
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Text style={styles.emptyStateActionText} onPress={onAction}>
            {actionText}
          </Text>
        )}
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  buttonContent: {
    opacity: 1,
  },
  buttonContentLoading: {
    opacity: 0.7,
  },
  
  buttonLoadingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  
  buttonSpinner: {
    marginRight: 8,
  },
  categoryGridSkeleton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  categoryItemSkeleton: {
    alignItems: 'center',
    marginBottom: 20,
    width: '30%',
  },
  
  emptyStateAction: {
    justifyContent: 'center',
    minHeight: 20,
  },
  emptyStateActionText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  
  emptyStateContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateMessage: {
    color: Colors.textLight,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 30,
    textAlign: 'center',
  },
  emptyStateTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  loadingMessage: {
    color: Colors.textLight,
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  phraseCardSkeleton: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    flexDirection: 'row',
    height: 140,
    marginBottom: 12,
    padding: 16,
  },
  progressBarBackground: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 3,
    height: 6,
    marginBottom: 8,
    overflow: 'hidden',
    width: '100%',
  },
  
  progressBarContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressBarFill: {
    backgroundColor: Colors.primary,
    borderRadius: 3,
    height: '100%',
  },
  progressContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 40,
  },
  progressMessage: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 20,
    textAlign: 'center',
  },
  
  progressPercent: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: '500',
  },
  progressSubMessage: {
    color: Colors.textLight,
    fontSize: 14,
    marginBottom: 30,
    textAlign: 'center',
  },
  skeleton: {
    backgroundColor: Colors.backgroundLight,
    opacity: 0.7,
  },
  skeletonActions: {
    alignItems: 'center',
    marginLeft: 12,
  },
  skeletonContent: {
    flex: 1,
  },
  spinnerContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

// src/hooks/useAsyncOperation.ts - новый файл

import { useState, useCallback } from 'react';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface AsyncOperationState {
  loading: boolean;
  error: string | null;
  data: any;
}

export function useAsyncOperation<T = any>() {
  const [state, setState] = useState<AsyncOperationState>({
    loading: false,
    error: null,
    data: null,
  });
  
  const { handleError } = useErrorHandler();

  const execute = useCallback(async (
    operation: () => Promise<T>,
    options?: {
      onSuccess?: (data: T) => void;
      onError?: (error: Error) => void;
      loadingMessage?: string;
    }
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await operation();
      
      setState({
        loading: false,
        error: null,
        data: result,
      });

      if (options?.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setState({
        loading: false,
        error: errorMessage,
        data: null,
      });

      handleError(error, 'async operation');
      
      if (options?.onError) {
        options.onError(error as Error);
      }

      throw error;
    }
  }, [handleError]);

  const reset = useCallback(() => {
    setState({
      loading: false,
      error: null,
      data: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

