// src/hooks/useAsyncOperation.ts - новый файл

import { useState, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';

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