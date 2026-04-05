// src/hooks/useOfflineDataManager.ts - ПОЛНОСТЬЮ ИСПРАВЛЕННАЯ ВЕРСИЯ
import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, Alert, AppStateStatus } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { SafeStorage } from '../utils/SafeStorage';
import { useErrorHandler } from './useErrorHandler';
import { useAnimations } from './useAnimations';
import { phrases } from '../data/phrases';
import { categories } from '../data/categories';

// Ключи хранения
const CACHE_KEYS = {
  OFFLINE_DATA: 'shapak_offline_data_v3',
  SYNC_QUEUE: 'shapak_sync_queue_v3',
  LAST_SYNC: 'shapak_last_sync_v3',
  NETWORK_HISTORY: 'shapak_network_history',
  USER_PREFERENCES: 'shapak_offline_preferences',
} as const;

const CACHE_VERSION = '3.0.0';
const SYNC_RETRY_DELAYS = [1000, 5000, 15000, 60000]; // Экспоненциальная задержка
const MAX_NETWORK_HISTORY = 50;

interface NetworkState {
  isConnected: boolean;
  type: string | null;
  timestamp: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
}

interface OfflinePreferences {
  autoSync: boolean;
  syncOnlyOnWifi: boolean;
  maxCacheSize: number; // MB
  keepHistoryDays: number;
  enableBackgroundSync: boolean;
}

interface SyncQueueItem {
  id: string;
  type: 'favorite' | 'history' | 'settings' | 'user_data';
  action: 'create' | 'update' | 'delete' | 'bulk_update';
  data: any;
  timestamp: number;
  retryCount: number;
  priority: 'high' | 'medium' | 'low';
  requiresNetwork: boolean;
  estimatedSize: number; // bytes
}

interface CacheStats {
  totalSize: number;
  itemCount: number;
  lastUpdated: number;
  hitRate: number; // 0-1
  missCount: number;
  hitCount: number;
}

interface OfflineDataManagerState {
  isOnline: boolean;
  networkQuality: NetworkState['quality'];
  isSyncing: boolean;
  syncProgress: number; // 0-1
  cacheStats: CacheStats;
  queueSize: number;
  lastSync: number | null;
  dataFreshness: 'fresh' | 'stale' | 'expired' | 'unknown';
  preferences: OfflinePreferences;
  networkHistory: NetworkState[];
}

const defaultPreferences: OfflinePreferences = {
  autoSync: true,
  syncOnlyOnWifi: false,
  maxCacheSize: 50, // 50MB
  keepHistoryDays: 30,
  enableBackgroundSync: true,
};

export function useOfflineDataManager() {
  const [state, setState] = useState<OfflineDataManagerState>({
    isOnline: true,
    networkQuality: 'unknown',
    isSyncing: false,
    syncProgress: 0,
    cacheStats: {
      totalSize: 0,
      itemCount: 0,
      lastUpdated: 0,
      hitRate: 0,
      missCount: 0,
      hitCount: 0,
    },
    queueSize: 0,
    lastSync: null,
    dataFreshness: 'unknown',
    preferences: defaultPreferences,
    networkHistory: [],
  });

  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const networkUnsubscribeRef = useRef<(() => void) | null>(null);

  const { handleError } = useErrorHandler();
  const { hapticFeedback } = useAnimations();

  // Инициализация при первом запуске
  useEffect(() => {
    if (!isInitializedRef.current) {
      initializeOfflineManager();
      isInitializedRef.current = true;
    }

    return () => {
      cleanup();
    };
  }, []);

  // Мониторинг состояния приложения для background sync
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && state.preferences.enableBackgroundSync) {
        // Приложение вернулось в активное состояние
        checkNetworkAndSync();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [state.preferences.enableBackgroundSync]);

  const cleanup = () => {
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }
    if (networkUnsubscribeRef.current) {
      networkUnsubscribeRef.current();
    }
  };

  const initializeOfflineManager = async () => {
    try {
      // Загружаем настройки пользователя
      const prefsResult = await SafeStorage.getItem<OfflinePreferences>(
        CACHE_KEYS.USER_PREFERENCES,
        defaultPreferences
      );

      if (prefsResult.success && prefsResult.data) {
        setState(prev => ({ 
          ...prev, 
          preferences: { ...defaultPreferences, ...prefsResult.data }
        }));
      }

      // Безопасная загрузка истории сети
      const networkHistoryResult = await SafeStorage.getItem<NetworkState[]>(
        CACHE_KEYS.NETWORK_HISTORY,
        []
      );

      if (networkHistoryResult.success && networkHistoryResult.data) {
        const networkHistory = Array.isArray(networkHistoryResult.data) 
          ? networkHistoryResult.data 
          : [];
        
        setState(prev => ({ 
          ...prev, 
          networkHistory: networkHistory.slice(-MAX_NETWORK_HISTORY)
        }));
      }

      // Загружаем очередь синхронизации
      const queueResult = await SafeStorage.getItem<SyncQueueItem[]>(
        CACHE_KEYS.SYNC_QUEUE,
        []
      );

      if (queueResult.success && queueResult.data) {
        const queue = Array.isArray(queueResult.data) ? queueResult.data : [];
        setSyncQueue(queue);
        setState(prev => ({ ...prev, queueSize: queue.length }));
      }

      // Загружаем время последней синхронизации
      const lastSyncResult = await SafeStorage.getItem<number>(
        CACHE_KEYS.LAST_SYNC,
        0
      );

    if (lastSyncResult.success && lastSyncResult.data) {
  const lastSyncTime = lastSyncResult.data;
  setState((prev: OfflineDataManagerState) => ({ 
    ...prev, 
    lastSync: lastSyncTime,
    dataFreshness: getDataFreshness(lastSyncTime)
  }));
}

      // Обновляем статистику кэша
      await updateCacheStats();

      // Начинаем мониторинг сети
      startNetworkMonitoring();

      // Запускаем автосинхронизацию
      const prefs = prefsResult.data || defaultPreferences;
      if (prefs.autoSync !== false) {
        processSyncQueue();
      }

    } catch (error) {
      handleError(error, 'offline manager initialization');
    }
  };


  const startNetworkMonitoring = () => {
    networkUnsubscribeRef.current = NetInfo.addEventListener((netState: NetInfoState) => {
      const isConnected = netState.isConnected ?? false;
      const networkType = netState.type || null;
      const quality = assessNetworkQuality(netState);

      const networkState: NetworkState = {
        isConnected,
        type: networkType,
        timestamp: Date.now(),
        quality,
      };

      setState(prev => {
        const newNetworkHistory = [...prev.networkHistory, networkState].slice(-MAX_NETWORK_HISTORY);
        
        return {
          ...prev,
          isOnline: isConnected,
          networkQuality: quality,
          networkHistory: newNetworkHistory,
        };
      });

      // Безопасное сохранение истории сети
      SafeStorage.setItem(CACHE_KEYS.NETWORK_HISTORY, 
        [...state.networkHistory, networkState].slice(-MAX_NETWORK_HISTORY)
      ).catch(error => {
        console.warn('Failed to save network history:', error);
      });

      // Автосинхронизация при восстановлении соединения
      if (isConnected && state.preferences.autoSync) {
        const shouldSyncOnWifi = state.preferences.syncOnlyOnWifi;
        const isWifi = networkType === 'wifi';
        
        if (!shouldSyncOnWifi || isWifi) {
          setTimeout(() => processSyncQueue(), 1000);
        }
      }
    });
  };

  const assessNetworkQuality = (netState: NetInfoState): NetworkState['quality'] => {
    if (!netState.isConnected) return 'poor';
    
    // Для WiFi
    if (netState.type === 'wifi') {
      const details = netState.details as any;
      if (details?.strength !== undefined) {
        if (details.strength > 80) return 'excellent';
        if (details.strength > 60) return 'good';
        if (details.strength > 40) return 'fair';
        return 'poor';
      }
      return 'good'; // WiFi обычно хорошее
    }

    // Для мобильной сети
    if (netState.type === 'cellular') {
      const details = netState.details as any;
      if (details?.cellularGeneration === '5g') return 'excellent';
      if (details?.cellularGeneration === '4g') return 'good';
      if (details?.cellularGeneration === '3g') return 'fair';
      return 'poor';
    }

    return 'unknown';
  };

  const getDataFreshness = (lastSyncTime: number): OfflineDataManagerState['dataFreshness'] => {
    if (!lastSyncTime) return 'unknown';
    
    const now = Date.now();
    const hoursSinceSync = (now - lastSyncTime) / (1000 * 60 * 60);
    
    if (hoursSinceSync < 1) return 'fresh';
    if (hoursSinceSync < 24) return 'stale';
    return 'expired';
  };

  const addToSyncQueue = useCallback(async (item: Omit<SyncQueueItem, 'id' | 'timestamp' | 'retryCount'>) => {
    const queueItem: SyncQueueItem = {
      ...item,
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
    };

    setSyncQueue(prev => {
      const newQueue = [...prev, queueItem];
      SafeStorage.setItem(CACHE_KEYS.SYNC_QUEUE, newQueue);
      return newQueue;
    });

    setState(prev => ({ ...prev, queueSize: prev.queueSize + 1 }));

    // Попытка немедленной синхронизации если онлайн
    if (state.isOnline) {
      processSyncQueue();
    }
  }, [state.isOnline]);

  // ИСПРАВЛЕНИЕ: processSyncQueue с правильными зависимостями
  const processSyncQueue = useCallback(async () => {
    if (state.isSyncing || syncQueue.length === 0) return;

    // Проверяем сетевые требования
    if (state.preferences.syncOnlyOnWifi && state.networkQuality !== 'excellent' && state.networkQuality !== 'good') {
      return;
    }

    try {
      setState(prev => ({ ...prev, isSyncing: true, syncProgress: 0 }));

      const processedItems: string[] = [];
      const failedItems: SyncQueueItem[] = [];

      for (let i = 0; i < syncQueue.length; i++) {
        const item = syncQueue[i];
        
        setState(prev => ({ 
          ...prev, 
          syncProgress: (i + 1) / syncQueue.length 
        }));

        try {
          // Проверяем требования к сети
          if (item.requiresNetwork && !state.isOnline) {
            failedItems.push(item);
            continue;
          }

          // Симулируем синхронизацию (в реальном приложении - API вызовы)
          await simulateSyncOperation(item);
          
          processedItems.push(item.id);
          
          // Обновляем статистику кэша
          setState(prev => ({
            ...prev,
            cacheStats: {
              ...prev.cacheStats,
              hitCount: prev.cacheStats.hitCount + 1,
            }
          }));

        } catch (error) {
          console.warn(`Sync failed for item ${item.id}:`, error);
          
          if (item.retryCount < SYNC_RETRY_DELAYS.length - 1) {
            failedItems.push({
              ...item,
              retryCount: item.retryCount + 1,
            });
          } else {
            handleError(error, `sync item ${item.type} after ${item.retryCount} retries`);
            
            // Обновляем статистику промахов
            setState(prev => ({
              ...prev,
              cacheStats: {
                ...prev.cacheStats,
                missCount: prev.cacheStats.missCount + 1,
              }
            }));
          }
        }

        // Небольшая задержка между операциями
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Обновляем очередь
      setSyncQueue(failedItems);
      await SafeStorage.setItem(CACHE_KEYS.SYNC_QUEUE, failedItems);

      // Обновляем время последней синхронизации
      const now = Date.now();
      await SafeStorage.setItem(CACHE_KEYS.LAST_SYNC, now);
      
      setState(prev => ({
        ...prev,
        lastSync: now,
        dataFreshness: 'fresh',
        queueSize: failedItems.length,
        isSyncing: false,
        syncProgress: 1,
      }));

      // Haptic feedback при успешной синхронизации
      if (processedItems.length > 0) {
        hapticFeedback('success');
      }

      // Планируем retry для неудачных элементов
      if (failedItems.length > 0) {
        const maxRetryCount = Math.max(...failedItems.map(item => item.retryCount));
        const delay = SYNC_RETRY_DELAYS[maxRetryCount] || SYNC_RETRY_DELAYS[SYNC_RETRY_DELAYS.length - 1];
        
        setTimeout(() => {
          if (state.isOnline) processSyncQueue();
        }, delay);
      }

    } catch (error) {
      handleError(error, 'sync queue processing');
      setState(prev => ({ ...prev, isSyncing: false, syncProgress: 0 }));
    }
  }, [state.isSyncing, syncQueue, state.isOnline, state.preferences, state.networkQuality, hapticFeedback, handleError]);

  const simulateSyncOperation = async (item: SyncQueueItem): Promise<void> => {
    // В реальном приложении здесь были бы API вызовы
    const delay = Math.random() * 200 + 100; // 100-300ms
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Симулируем случайные сбои (5% вероятность)
    if (Math.random() < 0.05) {
      throw new Error('Simulated network error');
    }
  };

  const checkNetworkAndSync = useCallback(async () => {
    const netState = await NetInfo.fetch();
    
    if (netState.isConnected && syncQueue.length > 0) {
      const shouldSyncOnWifi = state.preferences.syncOnlyOnWifi;
      const isWifi = netState.type === 'wifi';
      
      if (!shouldSyncOnWifi || isWifi) {
        processSyncQueue();
      }
    }
  }, [syncQueue.length, state.preferences.syncOnlyOnWifi, processSyncQueue]);

  // Удаляем дублированное объявление startAutoSync
  const forcSync = useCallback(async (): Promise<boolean> => {
    try {
      if (!state.isOnline) {
        Alert.alert('Нет подключения', 'Для синхронизации требуется подключение к интернету');
        return false;
      }

      hapticFeedback('medium');
      await processSyncQueue();
      return true;
    } catch (error) {
      handleError(error, 'force sync');
      return false;
    }
  }, [state.isOnline, processSyncQueue, hapticFeedback, handleError]);

  const clearCache = useCallback(async (): Promise<boolean> => {
    try {
      Alert.alert(
        'Очистить кэш?',
        'Это удалит все сохраненные данные. Подключение к интернету потребуется для повторной загрузки.',
        [
          { text: 'Отмена', style: 'cancel' },
          {
            text: 'Очистить',
            style: 'destructive',
            onPress: async () => {
              await SafeStorage.removeItem(CACHE_KEYS.OFFLINE_DATA);
              setState(prev => ({
                ...prev,
                cacheStats: {
                  totalSize: 0,
                  itemCount: 0,
                  lastUpdated: 0,
                  hitRate: 0,
                  missCount: 0,
                  hitCount: 0,
                },
                dataFreshness: 'unknown',
              }));
              hapticFeedback('success');
            }
          }
        ]
      );
      return true;
    } catch (error) {
      handleError(error, 'cache clear');
      return false;
    }
  }, [hapticFeedback, handleError]);

  const updateCacheStats = useCallback(async () => {
    try {
      // Имитация подсчета статистики кэша
      const cacheData = await SafeStorage.getItem(CACHE_KEYS.OFFLINE_DATA, null);
      
      if (cacheData.success && cacheData.data) {
        const dataString = JSON.stringify(cacheData.data);
        const sizeBytes = new Blob([dataString]).size;
        
        setState((prev: OfflineDataManagerState) => ({
          ...prev,
          cacheStats: {
            ...prev.cacheStats,
            totalSize: sizeBytes,
            itemCount: phrases.length + categories.length,
            lastUpdated: Date.now(),
          }
        }));
      }
    } catch (error) {
      console.warn('Failed to update cache stats:', error);
    }
  }, []);

  const updatePreferences = useCallback(async (newPreferences: Partial<OfflinePreferences>) => {
    try {
      const updatedPreferences = { ...state.preferences, ...newPreferences };
      
      setState((prev: OfflineDataManagerState) => ({ 
        ...prev, 
        preferences: updatedPreferences 
      }));
      await SafeStorage.setItem(CACHE_KEYS.USER_PREFERENCES, updatedPreferences);
      
      hapticFeedback('light');
    } catch (error) {
      handleError(error, 'preferences update');
    }
  }, [state.preferences, hapticFeedback, handleError]);

  const getDetailedStats = useCallback(async () => {
    const avgNetworkQuality = state.networkHistory.length > 0 
      ? state.networkHistory.reduce((acc, curr) => {
          const qualityScore = { excellent: 4, good: 3, fair: 2, poor: 1, unknown: 0 };
          return acc + qualityScore[curr.quality];
        }, 0) / state.networkHistory.length
      : 0;

    return {
      ...state,
      avgNetworkQuality,
      totalSyncAttempts: state.cacheStats.hitCount + state.cacheStats.missCount,
      dataAgeHours: state.lastSync ? (Date.now() - state.lastSync) / (1000 * 60 * 60) : null,
      queuePriorityBreakdown: syncQueue.reduce((acc, item) => {
        acc[item.priority] = (acc[item.priority] || 0) + 1;
        return acc;
      }, {} as Record<SyncQueueItem['priority'], number>),
    };
  }, [state, syncQueue]);

  return {
    // Состояние
    ...state,
    syncQueue,
    
    // Основные функции
    addToSyncQueue,
    processSyncQueue,
    forcSync,
    
    // Управление кэшем
    clearCache,
    updateCacheStats,
    
    // Настройки
    updatePreferences,
    
    // Мониторинг и статистика
    getDetailedStats,
    checkNetworkAndSync,
    
    // Утилиты
    isDataFresh: state.dataFreshness === 'fresh',
    isDataStale: state.dataFreshness === 'stale',
    isDataExpired: state.dataFreshness === 'expired',
    canUseOffline: state.cacheStats.itemCount > 0,
  };
}