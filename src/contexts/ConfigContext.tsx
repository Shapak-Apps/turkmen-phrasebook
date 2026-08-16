// src/contexts/ConfigContext.tsx
// Состояние первого запуска. Языковая пара старого разговорника отсюда убрана
// вместе с самим разговорником: язык собеседника живёт в TargetLangContext,
// язык интерфейса — в LanguageContext.
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ConfigContextType {
  isLoading: boolean;
  isFirstLaunch: boolean;
  /** Отметить, что стартовый выбор языка сделан: экран выбора больше не покажется. */
  completeFirstLaunch: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY_FIRST_LAUNCH = '@turkmen_phrasebook:first_launch';

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const firstLaunch = await AsyncStorage.getItem(STORAGE_KEY_FIRST_LAUNCH);
      setIsFirstLaunch(firstLaunch === null);
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeFirstLaunch = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_FIRST_LAUNCH, 'false');
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Failed to save first launch flag:', error);
      throw error;
    }
  };

  const contextValue: ConfigContextType = {
    isLoading,
    isFirstLaunch,
    completeFirstLaunch,
  };

  return <ConfigContext.Provider value={contextValue}>{children}</ConfigContext.Provider>;
};

/**
 * Hook для состояния первого запуска
 * @throws Error если используется вне ConfigProvider
 */
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};
