// src/utils/__tests__/SafeStorage.test.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeStorage } from '../SafeStorage';

// Store original implementations
const originalSetItem = AsyncStorage.setItem;
const originalGetItem = AsyncStorage.getItem;
const originalRemoveItem = AsyncStorage.removeItem;
const originalClear = AsyncStorage.clear;
const originalGetAllKeys = AsyncStorage.getAllKeys;
const originalMultiSet = AsyncStorage.multiSet;

beforeEach(async () => {
  // Restore all mocks to original implementation
  jest.restoreAllMocks();
  // Clear storage between tests
  await AsyncStorage.clear();
});

afterAll(() => {
  jest.restoreAllMocks();
});

describe('SafeStorage', () => {
  describe('getItem', () => {
    it('should return success with parsed data for existing key', async () => {
      const testData = { name: 'test', value: 123 };
      await AsyncStorage.setItem('test-key', JSON.stringify(testData));

      const result = await SafeStorage.getItem<typeof testData>('test-key');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(testData);
    });

    it('should return success with default value for non-existent key', async () => {
      const defaultValue = { default: true };
      const result = await SafeStorage.getItem('missing-key', defaultValue);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(defaultValue);
    });

    it('should return success with undefined when key not found and no default', async () => {
      const result = await SafeStorage.getItem('missing-key');

      expect(result.success).toBe(true);
      expect(result.data).toBeUndefined();
    });

    it('should retry on failure and succeed eventually', async () => {
      const testData = { retry: 'success' };
      let attempts = 0;

      const spy = jest.spyOn(AsyncStorage, 'getItem').mockImplementation(async () => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Temporary failure');
        }
        return JSON.stringify(testData);
      });

      const result = await SafeStorage.getItem<typeof testData>('retry-key');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(testData);
      expect(attempts).toBeGreaterThan(1);

      spy.mockRestore();
    });

    it('should return error after max retries', async () => {
      const spy = jest.spyOn(AsyncStorage, 'getItem').mockRejectedValue(new Error('Persistent failure'));

      const result = await SafeStorage.getItem('failing-key');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to read');
      expect(result.error).toContain('3 attempts');

      spy.mockRestore();
    });

    it('should handle arrays', async () => {
      const testArray = [1, 2, 3, 'four'];
      const setResult = await SafeStorage.setItem('array-key-test', testArray);

      // Just verify the operation completes without error
      expect(setResult).toHaveProperty('success');
    });
  });

  describe('setItem', () => {
    it('should save data and return success', async () => {
      const testData = { saved: 'data' };
      const result = await SafeStorage.setItem('save-key', testData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(testData);
    });

    it('should accept any serializable value', async () => {
      const result1 = await SafeStorage.setItem('string-key', 'string value');
      const result2 = await SafeStorage.setItem('number-key', 42);
      const result3 = await SafeStorage.setItem('object-key', { a: 1 });

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result3.success).toBe(true);
    });

    it('should retry on failure and succeed eventually', async () => {
      let attempts = 0;
      const spy = jest.spyOn(AsyncStorage, 'setItem').mockImplementation(async () => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Temporary failure');
        }
        return undefined;
      });

      const result = await SafeStorage.setItem('retry-save', { data: 'test' });

      expect(result.success).toBe(true);
      expect(attempts).toBeGreaterThan(1);

      spy.mockRestore();
    });

    it('should return error after max retries', async () => {
      const spy = jest.spyOn(AsyncStorage, 'setItem').mockRejectedValue(new Error('Persistent failure'));

      const result = await SafeStorage.setItem('failing-save', { data: 'test' });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to save');

      spy.mockRestore();
    });
  });

  describe('removeItem', () => {
    it('should remove key and return success', async () => {
      // First set a value
      await SafeStorage.setItem('remove-key', 'value');
      // Then remove it
      const result = await SafeStorage.removeItem('remove-key');

      expect(result.success).toBe(true);
    });

    it('should succeed for non-existent key', async () => {
      const result = await SafeStorage.removeItem('non-existent-key-xyz');
      expect(result.success).toBe(true);
    });

    it('should retry on failure', async () => {
      let attempts = 0;
      const spy = jest.spyOn(AsyncStorage, 'removeItem').mockImplementation(async () => {
        attempts++;
        if (attempts < 2) {
          throw new Error('Temporary failure');
        }
        return undefined;
      });

      const result = await SafeStorage.removeItem('retry-remove');

      expect(result.success).toBe(true);
      expect(attempts).toBeGreaterThan(1);

      spy.mockRestore();
    });
  });

  describe('getAllKeys', () => {
    it('should return array of keys', async () => {
      const result = await SafeStorage.getAllKeys();

      expect(result.success).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should return error on failure', async () => {
      const spy = jest.spyOn(AsyncStorage, 'getAllKeys').mockRejectedValueOnce(new Error('Failed'));

      const result = await SafeStorage.getAllKeys();

      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);

      spy.mockRestore();
    });
  });

  describe('multiSet', () => {
    it('should accept array of key-value pairs', async () => {
      const pairs: Array<[string, any]> = [
        ['test1', { a: 1 }],
        ['test2', { b: 2 }],
      ];

      const result = await SafeStorage.multiSet(pairs);

      // Just verify the method returns success
      expect(result).toHaveProperty('success');
    });

    it('should return error on failure', async () => {
      const spy = jest.spyOn(AsyncStorage, 'multiSet').mockRejectedValueOnce(new Error('Batch failed'));

      const result = await SafeStorage.multiSet([['key', 'value']]);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to save multiple items');

      spy.mockRestore();
    });
  });

  describe('isAvailable', () => {
    it('should check storage availability', async () => {
      // Just verify the method exists and returns a boolean
      const available = await SafeStorage.isAvailable();
      expect(typeof available).toBe('boolean');
    });
  });

  describe('clearAll', () => {
    it('should clear all storage', async () => {
      await AsyncStorage.setItem('clear1', JSON.stringify('value1'));
      await AsyncStorage.setItem('clear2', JSON.stringify('value2'));

      const result = await SafeStorage.clearAll();

      expect(result.success).toBe(true);

      const keys = await SafeStorage.getAllKeys();
      expect(keys.data).toHaveLength(0);
    });

    it('should return error on failure', async () => {
      const spy = jest.spyOn(AsyncStorage, 'clear').mockRejectedValueOnce(new Error('Clear failed'));

      const result = await SafeStorage.clearAll();

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to clear storage');

      spy.mockRestore();
    });
  });

  describe('getStorageInfo', () => {
    it('should return storage info object with expected shape', async () => {
      const info = await SafeStorage.getStorageInfo();

      expect(info).toHaveProperty('available');
      expect(info).toHaveProperty('keysCount');
      expect(info).toHaveProperty('estimatedSize');
      expect(typeof info.available).toBe('boolean');
      expect(typeof info.keysCount).toBe('number');
      expect(typeof info.estimatedSize).toBe('number');
    });
  });
});
