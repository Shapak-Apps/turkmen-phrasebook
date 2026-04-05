// src/hooks/useErrorHandler.ts
import { useCallback } from 'react';
import { Alert } from 'react-native';

interface ErrorInfo {
  message: string;
  code?: string;
  context?: string;
  timestamp: number;
  userId?: string;
}

export function useErrorHandler() {
  /**
   * Обработка ошибок с логированием
   */
  const handleError = useCallback((error: unknown, context?: string) => {
    const errorInfo: ErrorInfo = {
      message: error instanceof Error ? error.message : 'Unknown error',
      context,
      timestamp: Date.now(),
    };

    // Логируем в консоль для разработки
    console.error(`[${context || 'Unknown'}] Error:`, error);

    // В продакшене здесь можно отправлять ошибки в сервис мониторинга
    // crashlytics.recordError(error);
    // Sentry.captureException(error, { extra: { context } });

    return errorInfo;
  }, []);

  /**
   * Показ алерта с ошибкой пользователю
   */
  const showErrorAlert = useCallback((title: string, message: string, onRetry?: () => void) => {
    const buttons = [
      { text: 'OK', style: 'default' as const },
    ];

    if (onRetry) {
      buttons.unshift({
        text: 'Повторить',
        style: 'default' as const,
      });
    }

    Alert.alert(
      title,
      message,
      buttons.map(button => ({
        ...button,
        onPress: button.text === 'Повторить' ? onRetry : undefined,
      }))
    );
  }, []);

  /**
   * Обработка сетевых ошибок
   */
  const handleNetworkError = useCallback((error: unknown, context?: string) => {
    const errorInfo = handleError(error, `Network: ${context}`);
    
    showErrorAlert(
      'Ошибка сети',
      'Проверьте подключение к интернету и попробуйте снова'
    );

    return errorInfo;
  }, [handleError, showErrorAlert]);

  /**
   * Обработка ошибок хранилища
   */
  const handleStorageError = useCallback((error: unknown, context?: string) => {
    const errorInfo = handleError(error, `Storage: ${context}`);
    
    showErrorAlert(
      'Ошибка хранилища',
      'Не удалось сохранить или загрузить данные. Попробуйте перезапустить приложение'
    );

    return errorInfo;
  }, [handleError, showErrorAlert]);

  /**
   * Безопасный вызов асинхронной функции с обработкой ошибок
   */
  const safeAsyncCall = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    context?: string,
    showAlert: boolean = false
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      const errorInfo = handleError(error, context);
      
      if (showAlert) {
        showErrorAlert(
          'Ошибка',
          errorInfo.message
        );
      }
      
      return null;
    }
  }, [handleError, showErrorAlert]);

  /**
   * Retry функция с экспоненциальной задержкой
   */
  const retryWithBackoff = useCallback(async <T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
    context?: string
  ): Promise<T | null> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        const isLastAttempt = attempt === maxRetries - 1;
        
        if (isLastAttempt) {
          handleError(error, `${context} (final attempt)`);
          return null;
        }
        
        handleError(error, `${context} (attempt ${attempt + 1})`);
        
        // Экспоненциальная задержка: 1s, 2s, 4s, ...
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    return null;
  }, [handleError]);

  return {
    handleError,
    showErrorAlert,
    handleNetworkError,
    handleStorageError,
    safeAsyncCall,
    retryWithBackoff,
  };
}