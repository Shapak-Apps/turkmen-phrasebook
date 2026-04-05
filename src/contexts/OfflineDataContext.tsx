// src/contexts/OfflineDataContext.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { View, Text, ActivityIndicator, Alert } from 'react-native';
import { phrases as defaultPhrases } from '../data/phrases';
import { categories as defaultCategories } from '../data/categories';
import { useOffline } from '../hooks/useOffline';
import { Phrase, Category } from '../types';
import { Colors } from '../constants/Colors';

interface OfflineDataContextType {
  // Данные
  phrases: Phrase[];
  categories: Category[];
  
  // Состояние
  isLoading: boolean;
  isOfflineMode: boolean;
  dataSource: 'cache' | 'local' | 'hybrid';
  lastUpdate: Date | null;
  
  // Функции
  refreshData: () => Promise<boolean>;
  getPhrase: (id: string) => Phrase | undefined;
  getCategory: (id: string) => Category | undefined;
  getPhrasesByCategory: (categoryId: string) => Phrase[];
  searchPhrases: (query: string, categoryId?: string) => Phrase[];
  
  // Offline статус
  isDataAvailable: boolean;
  canUseApp: boolean;
}

const OfflineDataContext = createContext<OfflineDataContextType | undefined>(undefined);

interface OfflineDataProviderProps {
  children: ReactNode;
}

export function OfflineDataProvider({ children }: OfflineDataProviderProps) {
  const [phrases, setPhrases] = useState<Phrase[]>(defaultPhrases);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'cache' | 'local' | 'hybrid'>('local');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const offlineHook = useOffline();
  
  // Безопасная деструктуризация с fallback значениями
  const {
    isOnline = true,
    isDataCached = false,
    cacheStatus = 'initializing',
    getCachedData,
    refreshCache,
    getCacheInfo
  } = offlineHook || {};

  // Инициализация данных при запуске
  useEffect(() => {
    initializeData();
  }, []);

  // Автоматическое обновление при изменении статуса сети
  useEffect(() => {
    if (isOnline && cacheStatus === 'cached') {
      checkForUpdates();
    }
  }, [isOnline, cacheStatus]);

  const initializeData = async () => {
    try {
      setIsLoading(true);
      
      if (!getCachedData) {
        // Если хук недоступен, используем локальные данные
        setPhrases(defaultPhrases);
        setCategories(defaultCategories);
        setDataSource('local');
        setLastUpdate(new Date());
        return;
      }
      
      // Пытаемся загрузить кэшированные данные
      const cachedData = await getCachedData();
      
      if (cachedData.fromCache) {
        // Используем кэшированные данные
        setPhrases(cachedData.phrases);
        setCategories(cachedData.categories);
        setDataSource('cache');
        
        if (getCacheInfo) {
          const cacheInfo = await getCacheInfo();
          if (cacheInfo) {
            setLastUpdate(cacheInfo.lastUpdated);
          }
        }
        
      } else {
        // Используем локальные данные
        setPhrases(defaultPhrases);
        setCategories(defaultCategories);
        setDataSource('local');
        setLastUpdate(new Date());
      }

    } catch (error) {
      console.warn('Data initialization failed:', error);
      
      // В случае ошибки используем локальные данные
      setPhrases(defaultPhrases);
      setCategories(defaultCategories);
      setDataSource('local');
      setLastUpdate(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  // Проверка обновлений
  const checkForUpdates = async () => {
    if (!isOnline || !getCacheInfo) return;

    try {
      const cacheInfo = await getCacheInfo();
      
      if (cacheInfo) {
        const daysSinceUpdate = (Date.now() - cacheInfo.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
        
        // Если данные старше 3 дней, предлагаем обновить
        if (daysSinceUpdate > 3) {
          Alert.alert(
            '🔄 Обновление данных',
            'Доступны обновления фраз и категорий. Обновить сейчас?',
            [
              { text: 'Позже', style: 'cancel' },
              { 
                text: 'Обновить', 
                onPress: () => refreshData(),
                style: 'default'
              }
            ]
          );
        }
      }
    } catch (error) {
      console.warn('Check for updates failed:', error);
    }
  };

  // Обновление данных
  const refreshData = useCallback(async (): Promise<boolean> => {
    try {
      if (!refreshCache) {
        console.warn('Refresh cache not available');
        return false;
      }

      const success = await refreshCache();
      
      if (success) {
        // Перезагружаем данные после успешного обновления
        await initializeData();
        
        Alert.alert(
          '✅ Данные обновлены',
          'Фразы и категории были успешно обновлены'
        );
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.warn('Refresh data failed:', error);
      Alert.alert(
        '❌ Ошибка обновления',
        'Не удалось обновить данные. Попробуйте позже.'
      );
      return false;
    }
  }, [refreshCache]);

  // Поиск фразы по ID
  const getPhrase = useCallback((id: string): Phrase | undefined => {
    try {
      return phrases.find(phrase => phrase.id === id);
    } catch (error) {
      console.warn('Get phrase failed:', error);
      return undefined;
    }
  }, [phrases]);

  // Поиск категории по ID
  const getCategory = useCallback((id: string): Category | undefined => {
    try {
      return categories.find(category => category.id === id);
    } catch (error) {
      console.warn('Get category failed:', error);
      return undefined;
    }
  }, [categories]);

  // Получение фраз по категории
  const getPhrasesByCategory = useCallback((categoryId: string): Phrase[] => {
    try {
      return phrases.filter(phrase => phrase.categoryId === categoryId);
    } catch (error) {
      console.warn('Get phrases by category failed:', error);
      return [];
    }
  }, [phrases]);

  // Поиск фраз
  const searchPhrases = useCallback((query: string, categoryId?: string): Phrase[] => {
    try {
      if (!query.trim()) return [];

      let searchPool = phrases;
      
      if (categoryId) {
        searchPool = searchPool.filter(phrase => phrase.categoryId === categoryId);
      }

      const lowerQuery = query.toLowerCase();
      return searchPool.filter(phrase => 
        phrase.chinese?.toLowerCase().includes(lowerQuery) ||
        phrase.pinyin?.toLowerCase().includes(lowerQuery) ||
        phrase.russian?.toLowerCase().includes(lowerQuery) ||
        phrase.turkmen?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.warn('Search phrases failed:', error);
      return [];
    }
  }, [phrases]);

  const value: OfflineDataContextType = {
    phrases,
    categories,
    isLoading,
    isOfflineMode: !isOnline,
    dataSource,
    lastUpdate,
    refreshData,
    getPhrase,
    getCategory,
    getPhrasesByCategory,
    searchPhrases,
    isDataAvailable: phrases.length > 0 && categories.length > 0,
    canUseApp: (isOnline || isDataCached) && phrases.length > 0,
  };

  return (
    <OfflineDataContext.Provider value={value}>
      {children}
    </OfflineDataContext.Provider>
  );
}

export function useOfflineData(): OfflineDataContextType {
  const context = useContext(OfflineDataContext);
  if (context === undefined) {
    throw new Error('useOfflineData must be used within an OfflineDataProvider');
  }
  return context;
}

// HOC для автоматической обработки offline состояний
export function withOfflineData<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function OfflineWrappedComponent(props: P) {
    const { canUseApp, isLoading, isOfflineMode } = useOfflineData();
    
    if (isLoading) {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.background || '#FFFFFF',
        }}>
          <ActivityIndicator size="large" color={Colors.primary || '#DC2626'} />
          <Text style={{
            marginTop: 16,
            fontSize: 16,
            color: Colors.textLight || '#666666',
            textAlign: 'center',
          }}>
            Загрузка данных...
          </Text>
        </View>
      );
    }
    
    if (!canUseApp) {
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.background || '#FFFFFF',
          padding: 40,
        }}>
          <Text style={{ fontSize: 64, marginBottom: 20 }}>📡</Text>
          <Text style={{
            fontSize: 20,
            fontWeight: '600',
            color: Colors.text || '#000000',
            marginBottom: 12,
            textAlign: 'center',
          }}>
            Нет доступных данных
          </Text>
          <Text style={{
            fontSize: 16,
            color: Colors.textLight || '#666666',
            textAlign: 'center',
            lineHeight: 24,
          }}>
            {isOfflineMode 
              ? 'Приложение работает в офлайн режиме, но данные не кэшированы. Подключитесь к интернету для загрузки.'
              : 'Не удалось загрузить данные. Проверьте подключение к интернету и попробуйте снова.'
            }
          </Text>
        </View>
      );
    }
    
    return <Component {...props} />;
  };
}