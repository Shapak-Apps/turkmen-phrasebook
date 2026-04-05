// src/utils/ErrorHandler.ts - Centralized Error Handling

import { ERROR_MESSAGES } from '../constants/AppConstants';

/**
 * ✅ ERROR TYPES
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  STORAGE = 'STORAGE',
  AUDIO = 'AUDIO',
  VALIDATION = 'VALIDATION',
  UNKNOWN = 'UNKNOWN',
  PERMISSION = 'PERMISSION',
  TIMEOUT = 'TIMEOUT',
}

/**
 * ✅ CUSTOM ERROR CLASS
 */
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly code?: string;
  public readonly context?: Record<string, any>;
  public readonly timestamp: number;

  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    code?: string,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.code = code;
    this.context = context;
    this.timestamp = Date.now();
  }

  /**
   * Convert to JSON for logging
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }

  /**
   * Get user-friendly message
   */
  getUserMessage(): string {
    switch (this.type) {
      case ErrorType.NETWORK:
        return ERROR_MESSAGES.NETWORK_ERROR;
      case ErrorType.STORAGE:
        return ERROR_MESSAGES.STORAGE_ERROR;
      case ErrorType.AUDIO:
        return ERROR_MESSAGES.AUDIO_ERROR;
      default:
        return this.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  /**
   * Check if error is recoverable
   */
  isRecoverable(): boolean {
    return [ErrorType.NETWORK, ErrorType.TIMEOUT].includes(this.type);
  }
}

/**
 * ✅ ERROR HANDLER CLASS
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: Array<(error: AppError) => void> = [];
  private errorQueue: AppError[] = [];
  private maxQueueSize = 100;

  /**
   * Get singleton instance
   */
  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Handle error with proper logging and user notification
   */
  handle(error: unknown, context?: Record<string, any>): AppError {
    const appError = this.normalizeError(error, context);
    
    // Log error
    this.logError(appError);
    
    // Add to queue
    this.addToQueue(appError);
    
    // Notify listeners
    this.notifyListeners(appError);
    
    return appError;
  }

  /**
   * Create specific error types
   */
  createNetworkError(message: string, context?: Record<string, any>): AppError {
    return new AppError(message, ErrorType.NETWORK, 'NETWORK_ERROR', context);
  }

  createStorageError(message: string, context?: Record<string, any>): AppError {
    return new AppError(message, ErrorType.STORAGE, 'STORAGE_ERROR', context);
  }

  createAudioError(message: string, context?: Record<string, any>): AppError {
    return new AppError(message, ErrorType.AUDIO, 'AUDIO_ERROR', context);
  }

  createValidationError(message: string, context?: Record<string, any>): AppError {
    return new AppError(message, ErrorType.VALIDATION, 'VALIDATION_ERROR', context);
  }

  /**
   * Add error listener
   */
  addListener(listener: (error: AppError) => void): () => void {
    this.errorListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.errorListeners.indexOf(listener);
      if (index > -1) {
        this.errorListeners.splice(index, 1);
      }
    };
  }

  /**
   * Get recent errors
   */
  getRecentErrors(count = 10): AppError[] {
    return this.errorQueue.slice(-count);
  }

  /**
   * Clear error queue
   */
  clearErrors(): void {
    this.errorQueue = [];
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    byType: Record<ErrorType, number>;
    recent: number;
  } {
    const byType = this.errorQueue.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {} as Record<ErrorType, number>);

    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recent = this.errorQueue.filter(error => error.timestamp > oneHourAgo).length;

    return {
      total: this.errorQueue.length,
      byType,
      recent,
    };
  }

  /**
   * Normalize any error to AppError
   */
  private normalizeError(error: unknown, context?: Record<string, any>): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      const type = this.inferErrorType(error);
      return new AppError(error.message, type, error.name, {
        ...context,
        originalStack: error.stack,
      });
    }

    if (typeof error === 'string') {
      return new AppError(error, ErrorType.UNKNOWN, 'STRING_ERROR', context);
    }

    return new AppError(
      'Unknown error occurred',
      ErrorType.UNKNOWN,
      'UNKNOWN_ERROR',
      { ...context, originalError: error }
    );
  }

  /**
   * Infer error type from Error object
   */
  private inferErrorType(error: Error): ErrorType {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (name.includes('network') || message.includes('network') || 
        message.includes('fetch') || message.includes('connection')) {
      return ErrorType.NETWORK;
    }

    if (name.includes('storage') || message.includes('storage') ||
        message.includes('asyncstorage')) {
      return ErrorType.STORAGE;
    }

    if (name.includes('audio') || message.includes('audio') ||
        message.includes('sound') || message.includes('speech')) {
      return ErrorType.AUDIO;
    }

    if (name.includes('validation') || message.includes('validation') ||
        message.includes('invalid')) {
      return ErrorType.VALIDATION;
    }

    if (name.includes('permission') || message.includes('permission')) {
      return ErrorType.PERMISSION;
    }

    if (name.includes('timeout') || message.includes('timeout')) {
      return ErrorType.TIMEOUT;
    }

    return ErrorType.UNKNOWN;
  }

  /**
   * Log error with appropriate level
   */
  private logError(error: AppError): void {
    const logData = {
      type: error.type,
      message: error.message,
      code: error.code,
      context: error.context,
      timestamp: new Date(error.timestamp).toISOString(),
    };

    if (error.type === ErrorType.UNKNOWN || !error.isRecoverable()) {
      console.error('AppError [ERROR]:', logData);
    } else {
      console.warn('AppError [WARN]:', logData);
    }

    // In production, send to crash reporting service
    // Example: Crashlytics.recordError(error);
  }

  /**
   * Add error to queue
   */
  private addToQueue(error: AppError): void {
    this.errorQueue.push(error);
    
    // Maintain queue size
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue = this.errorQueue.slice(-this.maxQueueSize);
    }
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(error: AppError): void {
    this.errorListeners.forEach(listener => {
      try {
        listener(error);
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError);
      }
    });
  }
}

/**
 * ✅ UTILITY FUNCTIONS
 */

/**
 * Wrap async function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: Record<string, any>
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      const handler = ErrorHandler.getInstance();
      throw handler.handle(error, { ...context, functionName: fn.name, args });
    }
  }) as T;
}

/**
 * Wrap sync function with error handling
 */
export function withSyncErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  context?: Record<string, any>
): T {
  return ((...args: Parameters<T>) => {
    try {
      return fn(...args);
    } catch (error) {
      const handler = ErrorHandler.getInstance();
      throw handler.handle(error, { ...context, functionName: fn.name, args });
    }
  }) as T;
}

/**
 * Safe async execution with default value
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  defaultValue: T,
  context?: Record<string, any>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const handler = ErrorHandler.getInstance();
    handler.handle(error, context);
    return defaultValue;
  }
}

/**
 * Safe sync execution with default value
 */
export function safeSync<T>(
  fn: () => T,
  defaultValue: T,
  context?: Record<string, any>
): T {
  try {
    return fn();
  } catch (error) {
    const handler = ErrorHandler.getInstance();
    handler.handle(error, context);
    return defaultValue;
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance();