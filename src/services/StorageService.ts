// src/services/StorageService.ts - Enhanced Storage Service with Error Handling

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageResult } from '../utils/SafeStorage';
import { ERROR_MESSAGES } from '../constants/AppConstants';

// Storage service interface
interface IStorageService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<boolean>;
  remove(key: string): Promise<boolean>;
  clear(): Promise<boolean>;
}

/**
 * ✅ ENHANCED STORAGE SERVICE
 * Provides type-safe, error-handled storage operations
 * Note: No encryption is applied. For sensitive data, use expo-secure-store
 */
class StorageServiceImpl implements IStorageService {
  constructor() {
    // Encryption removed for security compliance
  }

  /**
   * Get value from storage with type safety
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) return null;
      
      const parsed = JSON.parse(value);
      return this.decryptIfNeeded(parsed);
    } catch (error) {
      console.warn(`StorageService.get failed for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Get value with detailed result information
   */
  async getWithResult<T>(key: string): Promise<StorageResult<T>> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        return { success: true, data: undefined };
      }
      
      const parsed = JSON.parse(value);
      const decrypted = this.decryptIfNeeded(parsed);
      
      return { success: true, data: decrypted };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.STORAGE_ERROR;
      console.warn(`StorageService.getWithResult failed for key "${key}":`, error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Set value in storage
   */
  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      const encrypted = this.encryptIfNeeded(value);
      const serialized = JSON.stringify(encrypted);
      await AsyncStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.warn(`StorageService.set failed for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Set value with detailed result information
   */
  async setWithResult<T>(key: string, value: T): Promise<StorageResult<boolean>> {
    try {
      const encrypted = this.encryptIfNeeded(value);
      const serialized = JSON.stringify(encrypted);
      await AsyncStorage.setItem(key, serialized);
      return { success: true, data: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : ERROR_MESSAGES.STORAGE_ERROR;
      console.warn(`StorageService.setWithResult failed for key "${key}":`, error);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Remove key from storage
   */
  async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`StorageService.remove failed for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Clear all storage
   */
  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.warn('StorageService.clear failed:', error);
      return false;
    }
  }

  /**
   * Get all keys
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return [...keys]; // Convert readonly to mutable
    } catch (error) {
      console.warn('StorageService.getAllKeys failed:', error);
      return [];
    }
  }

  /**
   * Get multiple values at once
   */
  async multiGet<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const keyValuePairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, T | null> = {};
      
      keyValuePairs.forEach(([key, value]) => {
        if (value !== null) {
          try {
            const parsed = JSON.parse(value);
            result[key] = this.decryptIfNeeded(parsed);
          } catch {
            result[key] = null;
          }
        } else {
          result[key] = null;
        }
      });
      
      return result;
    } catch (error) {
      console.warn('StorageService.multiGet failed:', error);
      return keys.reduce((acc, key) => ({ ...acc, [key]: null }), {});
    }
  }

  /**
   * Set multiple values at once
   */
  async multiSet<T>(keyValuePairs: Array<[string, T]>): Promise<boolean> {
    try {
      const serializedPairs: Array<[string, string]> = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(this.encryptIfNeeded(value))
      ]);
      
      await AsyncStorage.multiSet(serializedPairs);
      return true;
    } catch (error) {
      console.warn('StorageService.multiSet failed:', error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.warn(`StorageService.exists failed for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Get storage usage information
   */
  async getStorageInfo(): Promise<{
    totalKeys: number;
    estimatedSize: number;
  }> {
    try {
      const keys = await this.getAllKeys();
      let estimatedSize = 0;
      
      // Sample a few keys to estimate total size
      const sampleKeys = keys.slice(0, Math.min(10, keys.length));
      for (const key of sampleKeys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          estimatedSize += key.length + value.length;
        }
      }
      
      // Extrapolate for all keys
      const avgSizePerKey = estimatedSize / sampleKeys.length || 0;
      const totalEstimatedSize = avgSizePerKey * keys.length;
      
      return {
        totalKeys: keys.length,
        estimatedSize: Math.round(totalEstimatedSize),
      };
    } catch (error) {
      console.warn('StorageService.getStorageInfo failed:', error);
      return { totalKeys: 0, estimatedSize: 0 };
    }
  }

  /**
   * No encryption - data stored as-is
   * Note: For sensitive data, consider using expo-secure-store instead
   */
  private encryptIfNeeded<T>(data: T): T {
    // Encryption removed for security compliance
    // The weak XOR encryption was not providing real security
    return data;
  }

  /**
   * No decryption needed - data retrieved as-is
   */
  private decryptIfNeeded<T>(data: T | string): T {
    // Decryption removed (no longer encrypting)
    return data as T;
  }
}

// Export singleton instance
export const StorageService = new StorageServiceImpl();

// Export class for testing or custom instances
export { StorageServiceImpl };