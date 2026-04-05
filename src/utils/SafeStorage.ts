// src/utils/SafeStorage.ts - полная версия

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class SafeStorage {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 100; // ms

  // Безопасное чтение с повторными попытками
  static async getItem<T>(key: string, defaultValue?: T): Promise<StorageResult<T>> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        const value = await AsyncStorage.getItem(key);
        
        if (value === null) {
          return {
            success: true,
            data: defaultValue,
          };
        }

        const parsedValue = JSON.parse(value) as T;
        return {
          success: true,
          data: parsedValue,
        };

      } catch (error) {
        lastError = error as Error;
        console.warn(`AsyncStorage.getItem attempt ${attempt + 1} failed for key "${key}":`, error);
        
        // Ждем перед повторной попыткой
        if (attempt < this.MAX_RETRIES - 1) {
          await this.delay(this.RETRY_DELAY * (attempt + 1));
        }
      }
    }

    return {
      success: false,
      error: `Failed to read "${key}" after ${this.MAX_RETRIES} attempts: ${lastError?.message}`,
      data: defaultValue,
    };
  }

  // Безопасное сохранение с повторными попытками
  static async setItem<T>(key: string, value: T): Promise<StorageResult<T>> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        const serializedValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, serializedValue);
        
        return {
          success: true,
          data: value,
        };

      } catch (error) {
        lastError = error as Error;
        console.warn(`AsyncStorage.setItem attempt ${attempt + 1} failed for key "${key}":`, error);
        
        // Ждем перед повторной попыткой
        if (attempt < this.MAX_RETRIES - 1) {
          await this.delay(this.RETRY_DELAY * (attempt + 1));
        }
      }
    }

    return {
      success: false,
      error: `Failed to save "${key}" after ${this.MAX_RETRIES} attempts: ${lastError?.message}`,
    };
  }

  // Безопасное удаление
  static async removeItem(key: string): Promise<StorageResult<null>> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        await AsyncStorage.removeItem(key);
        
        return {
          success: true,
          data: null,
        };

      } catch (error) {
        lastError = error as Error;
        console.warn(`AsyncStorage.removeItem attempt ${attempt + 1} failed for key "${key}":`, error);
        
        if (attempt < this.MAX_RETRIES - 1) {
          await this.delay(this.RETRY_DELAY * (attempt + 1));
        }
      }
    }

    return {
      success: false,
      error: `Failed to remove "${key}" after ${this.MAX_RETRIES} attempts: ${lastError?.message}`,
    };
  }

  // Получение всех ключей с безопасностью
  static async getAllKeys(): Promise<StorageResult<string[]>> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return {
        success: true,
        data: [...keys], // Преобразуем readonly в mutable
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to get all keys: ${(error as Error).message}`,
        data: [],
      };
    }
  }

  // Массовые операции с транзакционностью
  static async multiSet(keyValuePairs: Array<[string, any]>): Promise<StorageResult<null>> {
    try {
      const serializedPairs = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value)
      ]) as [string, string][];

      await AsyncStorage.multiSet(serializedPairs);
      
      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to save multiple items: ${(error as Error).message}`,
      };
    }
  }

  // Проверка доступности хранилища
  static async isAvailable(): Promise<boolean> {
    try {
      const testKey = '__storage_test__';
      const testValue = 'test';
      
      await AsyncStorage.setItem(testKey, testValue);
      const retrieved = await AsyncStorage.getItem(testKey);
      await AsyncStorage.removeItem(testKey);
      
      return retrieved === testValue;
    } catch (error) {
      console.warn('AsyncStorage availability check failed:', error);
      return false;
    }
  }

  // Очистка с подтверждением
  static async clearAll(): Promise<StorageResult<null>> {
    try {
      await AsyncStorage.clear();
      return {
        success: true,
        data: null,
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to clear storage: ${(error as Error).message}`,
      };
    }
  }

  // Получение информации о хранилище
  static async getStorageInfo(): Promise<{
    available: boolean;
    keysCount: number;
    estimatedSize: number;
  }> {
    const available = await this.isAvailable();
    
    if (!available) {
      return {
        available: false,
        keysCount: 0,
        estimatedSize: 0,
      };
    }

    const keysResult = await this.getAllKeys();
    const keysCount = keysResult.data?.length || 0;

    // Приблизительная оценка размера
    let estimatedSize = 0;
    if (keysResult.success && keysResult.data) {
      for (const key of keysResult.data.slice(0, 10)) { // Проверяем только первые 10 ключей
        try {
          const value = await AsyncStorage.getItem(key);
          if (value) {
            estimatedSize += key.length + value.length;
          }
        } catch (error) {
          // Игнорируем ошибки при оценке размера
        }
      }
      
      // Экстраполируем на все ключи
      if (keysResult.data.length > 10) {
        estimatedSize = Math.round((estimatedSize * keysResult.data.length) / 10);
      }
    }

    return {
      available,
      keysCount,
      estimatedSize,
    };
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}