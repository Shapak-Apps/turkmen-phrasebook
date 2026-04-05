// src/services/__tests__/StorageService.test.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService, StorageServiceImpl } from '../StorageService';

// Clear mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  AsyncStorage.clear();
});

describe('StorageService', () => {
  describe('get', () => {
    it('should return null for non-existent key', async () => {
      const result = await StorageService.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('should return stored value for existing key', async () => {
      const testData = { name: 'test', value: 123 };
      await AsyncStorage.setItem('test-key', JSON.stringify(testData));

      const result = await StorageService.get<typeof testData>('test-key');
      expect(result).toEqual(testData);
    });

    it('should handle JSON parse errors gracefully', async () => {
      await AsyncStorage.setItem('invalid-json', 'not valid json{');

      const result = await StorageService.get('invalid-json');
      expect(result).toBeNull();
    });

    it('should return primitive values correctly', async () => {
      await AsyncStorage.setItem('string-key', JSON.stringify('hello'));
      await AsyncStorage.setItem('number-key', JSON.stringify(42));
      await AsyncStorage.setItem('boolean-key', JSON.stringify(true));

      expect(await StorageService.get<string>('string-key')).toBe('hello');
      expect(await StorageService.get<number>('number-key')).toBe(42);
      expect(await StorageService.get<boolean>('boolean-key')).toBe(true);
    });
  });

  describe('getWithResult', () => {
    it('should return success with data for existing key', async () => {
      const testData = { foo: 'bar' };
      await AsyncStorage.setItem('result-key', JSON.stringify(testData));

      const result = await StorageService.getWithResult<typeof testData>('result-key');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(testData);
    });

    it('should return success with undefined for non-existent key', async () => {
      const result = await StorageService.getWithResult('non-existent');
      expect(result.success).toBe(true);
      expect(result.data).toBeUndefined();
    });

    it('should return error for invalid JSON', async () => {
      await AsyncStorage.setItem('bad-json', '{invalid}');

      const result = await StorageService.getWithResult('bad-json');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('set', () => {
    it('should store value and return true', async () => {
      const testData = { test: 'data' };
      const success = await StorageService.set('set-key', testData);

      expect(success).toBe(true);
      const stored = await AsyncStorage.getItem('set-key');
      expect(JSON.parse(stored!)).toEqual(testData);
    });

    it('should overwrite existing value', async () => {
      await StorageService.set('overwrite-key', { old: 'value' });
      await StorageService.set('overwrite-key', { new: 'value' });

      const result = await StorageService.get('overwrite-key');
      expect(result).toEqual({ new: 'value' });
    });

    it('should handle arrays correctly', async () => {
      const testArray = [1, 2, 3, 'four', { five: 5 }];
      await StorageService.set('array-key', testArray);

      const result = await StorageService.get('array-key');
      expect(result).toEqual(testArray);
    });
  });

  describe('setWithResult', () => {
    it('should return success result when storing', async () => {
      const result = await StorageService.setWithResult('result-set', { data: 'test' });
      expect(result.success).toBe(true);
      expect(result.data).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove existing key and return true', async () => {
      await StorageService.set('remove-key', 'value');
      const success = await StorageService.remove('remove-key');

      expect(success).toBe(true);
      const result = await StorageService.get('remove-key');
      expect(result).toBeNull();
    });

    it('should return true for non-existent key', async () => {
      const success = await StorageService.remove('non-existent-key');
      expect(success).toBe(true);
    });
  });

  describe('clear', () => {
    it('should remove all stored data', async () => {
      await StorageService.set('key1', 'value1');
      await StorageService.set('key2', 'value2');
      await StorageService.set('key3', 'value3');

      const success = await StorageService.clear();
      expect(success).toBe(true);

      const keys = await StorageService.getAllKeys();
      expect(keys).toHaveLength(0);
    });
  });

  describe('getAllKeys', () => {
    it('should return empty array when no keys', async () => {
      const keys = await StorageService.getAllKeys();
      expect(keys).toEqual([]);
    });

    it('should return all stored keys', async () => {
      await StorageService.set('key-a', 'a');
      await StorageService.set('key-b', 'b');
      await StorageService.set('key-c', 'c');

      const keys = await StorageService.getAllKeys();
      expect(keys).toContain('key-a');
      expect(keys).toContain('key-b');
      expect(keys).toContain('key-c');
    });
  });

  describe('multiGet', () => {
    it('should return values for multiple keys', async () => {
      await StorageService.set('multi-1', { id: 1 });
      await StorageService.set('multi-2', { id: 2 });
      await StorageService.set('multi-3', { id: 3 });

      const result = await StorageService.multiGet<{ id: number }>(['multi-1', 'multi-2', 'multi-3']);

      expect(result['multi-1']).toEqual({ id: 1 });
      expect(result['multi-2']).toEqual({ id: 2 });
      expect(result['multi-3']).toEqual({ id: 3 });
    });

    it('should return null for non-existent keys in batch', async () => {
      await StorageService.set('exists', { data: 'yes' });

      const result = await StorageService.multiGet(['exists', 'does-not-exist']);

      expect(result['exists']).toEqual({ data: 'yes' });
      expect(result['does-not-exist']).toBeNull();
    });
  });

  describe('multiSet', () => {
    it('should store multiple key-value pairs', async () => {
      const pairs: Array<[string, any]> = [
        ['batch-1', { a: 1 }],
        ['batch-2', { b: 2 }],
        ['batch-3', { c: 3 }],
      ];

      const success = await StorageService.multiSet(pairs);
      expect(success).toBe(true);

      expect(await StorageService.get('batch-1')).toEqual({ a: 1 });
      expect(await StorageService.get('batch-2')).toEqual({ b: 2 });
      expect(await StorageService.get('batch-3')).toEqual({ c: 3 });
    });
  });

  describe('exists', () => {
    it('should return true for existing key', async () => {
      await StorageService.set('exists-key', 'value');
      const exists = await StorageService.exists('exists-key');
      expect(exists).toBe(true);
    });

    it('should return false for non-existent key', async () => {
      const exists = await StorageService.exists('non-existent');
      expect(exists).toBe(false);
    });
  });

  describe('getStorageInfo', () => {
    it('should return storage statistics', async () => {
      await StorageService.set('info-1', 'value1');
      await StorageService.set('info-2', 'value2');

      const info = await StorageService.getStorageInfo();

      expect(info.totalKeys).toBeGreaterThanOrEqual(2);
      expect(typeof info.estimatedSize).toBe('number');
    });

    it('should return zeros for empty storage', async () => {
      const info = await StorageService.getStorageInfo();
      expect(info.totalKeys).toBe(0);
    });
  });

  describe('StorageServiceImpl class', () => {
    it('should be instantiable for custom usage', () => {
      const customInstance = new StorageServiceImpl();
      expect(customInstance).toBeInstanceOf(StorageServiceImpl);
    });
  });
});
