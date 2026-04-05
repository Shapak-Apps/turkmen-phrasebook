// src/hooks/useOffline.ts - ИСПРАВЛЕННАЯ ВЕРСИЯ
import { useState, useEffect, useCallback, useRef } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';
import { phrases } from '../data/phrases';
import { categories } from '../data/categories';
import { SafeStorage } from '../utils/SafeStorage';

const OFFLINE_DATA_KEY = 'shapak_offline_data_v2';
const SYNC_QUEUE_KEY = 'shapak_sync_queue';
const LAST_SYNC_KEY = 'shapak_last_sync';
const CACHE_VERSION = '2.0';

interface OfflineData {
  phrases: typeof phrases;
  categories: typeof categories;
  version: string;
  cachedAt: number;
  lastUpdated: number;
  checksum: string;
}

interface OfflineStatus {
  isOnline: boolean;
  isDataCached: boolean;
  cacheStatus: 'initializing' | 'cached' | 'syncing' | 'error' | 'outdated';
  lastSync: number | null;
  syncProgress: number;
  syncQueueSize: number;
  cacheSize: number;
  networkType: string | null;
}

export function useOffline() {
  const [status, setStatus] = useState<OfflineStatus>({
    isOnline: true,
    isDataCached: false,
    cacheStatus: 'initializing',
    lastSync: null,
    syncProgress: 0,
    syncQueueSize: 0,
    cacheSize: 0,
    networkType: null,
  });

  const isInitializedRef = useRef(false);

  // Безопасная проверка сети
  const checkNetworkStatus = useCallback(async () => {
    try {
      const netState = await NetInfo.fetch();
      const isConnected = netState.isConnected ?? false;
      const networkType = netState.type || 'unknown';

      setStatus(prev => ({
        ...prev,
        isOnline: isConnected,
        networkType: networkType,
      }));

      return isConnected;
    } catch (error) {
      console.warn('Network check failed:', error);
      // В случае ошибки предполагаем, что интернет есть
      setStatus(prev => ({ ...prev, isOnline: true }));
      return true;
    }
  }, []);

  // Инициализация при первом запуске
  useEffect(() => {
    if (!isInitializedRef.current) {
      initializeOfflineSystem();
      isInitializedRef.current = true;
    }
  }, []);

  // Мониторинг состояния сети с обработкой ошибок
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    try {
      unsubscribe = NetInfo.addEventListener(state => {
        try {
          const isConnected = state.isConnected ?? false;
          const networkType = state.type || 'unknown';

          setStatus(prev => ({
            ...prev,
            isOnline: isConnected,
            networkType: networkType,
          }));
        } catch (error) {
          console.warn('Network state update failed:', error);
        }
      });
    } catch (error) {
      console.warn('Failed to subscribe to network changes:', error);
    }

    return () => {
      try {
        if (unsubscribe) {
          unsubscribe();
        }
      } catch (error) {
        console.warn('Failed to unsubscribe from network changes:', error);
      }
    };
  }, []);

  const initializeOfflineSystem = async () => {
    try {
      setStatus(prev => ({ ...prev, cacheStatus: 'initializing' }));
      
      // Проверяем есть ли кэшированные данные
      const result = await SafeStorage.getItem<OfflineData>(OFFLINE_DATA_KEY);
      
      if (result.success && result.data && validateCacheData(result.data)) {
  const cacheData = result.data; // ✅ Безопасное присвоение
  setStatus(prev => ({
    ...prev,
    isDataCached: true,
    cacheStatus: 'cached',
    cacheSize: JSON.stringify(cacheData).length,
    lastSync: cacheData.lastUpdated, // ✅ Исправлено
  }));
      } else {
        // Создаем начальный кэш
        await createInitialCache();
      }
    } catch (error) {
      console.warn('Failed to initialize offline system:', error);
      setStatus(prev => ({ ...prev, cacheStatus: 'error' }));
    }
  };

  const createInitialCache = async () => {
    try {
      const checksum = generateChecksum(phrases, categories);
      
      const offlineData: OfflineData = {
        phrases,
        categories,
        version: CACHE_VERSION,
        cachedAt: Date.now(),
        lastUpdated: Date.now(),
        checksum,
      };

      const result = await SafeStorage.setItem(OFFLINE_DATA_KEY, offlineData);
      
      if (result.success) {
        setStatus(prev => ({
          ...prev,
          isDataCached: true,
          cacheStatus: 'cached',
          cacheSize: JSON.stringify(offlineData).length,
          lastSync: Date.now(),
        }));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.warn('Failed to create cache:', error);
      setStatus(prev => ({ ...prev, cacheStatus: 'error' }));
    }
  };

  const validateCacheData = (data: OfflineData): boolean => {
    try {
      return !!(
        data &&
        data.phrases &&
        Array.isArray(data.phrases) &&
        data.categories &&
        Array.isArray(data.categories) &&
        data.version &&
        data.cachedAt &&
        data.lastUpdated
      );
    } catch (error) {
      console.warn('Cache validation failed:', error);
      return false;
    }
  };

  const generateChecksum = (phrasesData: any, categoriesData: any): string => {
    try {
      const combined = JSON.stringify({ phrasesData, categoriesData });
      // Используем простой хеш вместо btoa для поддержки Unicode (туркменские символы)
      let hash = 0;
      for (let i = 0; i < combined.length; i++) {
        const char = combined.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash).toString(16).slice(0, 16);
    } catch (error) {
      console.warn('Checksum generation failed:', error);
      return 'default_checksum';
    }
  };

  const refreshCache = useCallback(async (force: boolean = false) => {
    try {
      const isOnline = await checkNetworkStatus();
      
      if (!isOnline && !force) {
        Alert.alert(
          'Нет соединения',
          'Для обновления кэша требуется подключение к интернету'
        );
        return false;
      }

      setStatus(prev => ({ ...prev, cacheStatus: 'syncing' }));
      
      await createInitialCache();
      return true;
      
    } catch (error) {
      console.warn('Cache refresh failed:', error);
      setStatus(prev => ({ ...prev, cacheStatus: 'error' }));
      return false;
    }
  }, []);

  const getCachedData = useCallback(async (): Promise<{
    phrases: typeof phrases;
    categories: typeof categories;
    fromCache: boolean;
  }> => {
    try {
      const result = await SafeStorage.getItem<OfflineData>(OFFLINE_DATA_KEY);
      
      if (result.success && result.data && validateCacheData(result.data)) {
        return {
          phrases: result.data.phrases,
          categories: result.data.categories,
          fromCache: true,
        };
      }
    } catch (error) {
      console.warn('Failed to get cached data:', error);
    }

    // Fallback к встроенным данным
    return {
      phrases,
      categories,
      fromCache: false,
    };
  }, []);

  const clearCache = useCallback(async () => {
    try {
      await SafeStorage.removeItem(OFFLINE_DATA_KEY);
      await SafeStorage.removeItem(LAST_SYNC_KEY);

      setStatus(prev => ({
        ...prev,
        isDataCached: false,
        cacheStatus: 'initializing',
        lastSync: null,
        cacheSize: 0,
      }));

      await createInitialCache();
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }, []);

  const getCacheInfo = useCallback(async () => {
    try {
      const result = await SafeStorage.getItem<OfflineData>(OFFLINE_DATA_KEY);
      
      if (result.success && result.data) {
        const cacheData = result.data; // Безопасное присвоение
        return {
          version: cacheData.version,
          cachedAt: new Date(cacheData.cachedAt),
          lastUpdated: new Date(cacheData.lastUpdated),
          phrasesCount: cacheData.phrases.length,
          categoriesCount: cacheData.categories.length,
          checksum: cacheData.checksum,
          sizeBytes: JSON.stringify(cacheData).length,
        };
      }
    } catch (error) {
      console.warn('Failed to get cache info:', error);
    }
    
    return null;
  }, []);

  return {
    ...status,
    refreshCache,
    getCachedData,
    clearCache,
    getCacheInfo,
    checkNetworkStatus,
  };
}