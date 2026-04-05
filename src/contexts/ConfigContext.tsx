// src/contexts/ConfigContext.tsx
// Новый контекст для мультиязычной системы (Phase 2, обновлен Phase 5)
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLanguageByCode } from '../config/languages.config';
import { LanguageAnalyticsService } from '../services/LanguageAnalytics';
import { TranslationVersioningService } from '../services/TranslationVersioning';

interface ConfigContextType {
  selectedLanguage: string;      // Код выбранного языка (zh, ru, en, ja...)
  setSelectedLanguage: (code: string) => Promise<void>;
  turkmenLanguage: string;       // Всегда 'tk' (фиксированный)
  isLoading: boolean;
  isFirstLaunch: boolean;
  onboardingCompleted: boolean;
  setOnboardingCompleted: (completed: boolean) => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const STORAGE_KEY_LANGUAGE = '@turkmen_phrasebook:selected_language';
const STORAGE_KEY_FIRST_LAUNCH = '@turkmen_phrasebook:first_launch';
const STORAGE_KEY_ONBOARDING = '@onboarding_completed';

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguageState] = useState<string>('tk'); // Default туркменский
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  // Загрузка сохранённого языка при запуске
  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const [savedLanguage, firstLaunch, onboardingStatus] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEY_FIRST_LAUNCH),
        AsyncStorage.getItem(STORAGE_KEY_ONBOARDING)
      ]);

      // Проверяем статус onboarding
      setOnboardingCompleted(onboardingStatus === 'true');

      if (savedLanguage) {
        // Проверяем что язык доступен
        const language = getLanguageByCode(savedLanguage);
        if (language?.isAvailable) {
          setSelectedLanguageState(savedLanguage);
          setIsFirstLaunch(false);

          // ✅ Phase 5: Начинаем сессию аналитики
          await LanguageAnalyticsService.startSession(savedLanguage);
        } else {
          // Если сохранённый язык недоступен, используем туркменский по умолчанию
          console.warn(`Saved language ${savedLanguage} is not available, using default`);
          setSelectedLanguageState('tk');
          await LanguageAnalyticsService.startSession('tk');
        }
      } else {
        // Первый запуск - проверяем флаг
        setIsFirstLaunch(firstLaunch === null);
      }
    } catch (error) {
      console.error('Failed to load config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setSelectedLanguage = async (code: string) => {
    try {
      // Проверяем что язык существует и доступен
      const language = getLanguageByCode(code);
      if (!language) {
        throw new Error(`Language ${code} not found in configuration`);
      }

      if (!language.isAvailable) {
        throw new Error(`Language ${code} is not available yet (coming soon)`);
      }

      // ✅ Phase 5: Завершаем предыдущую сессию и начинаем новую
      const previousLanguage = selectedLanguage;
      if (previousLanguage !== code) {
        await LanguageAnalyticsService.endSession(code);
        await LanguageAnalyticsService.startSession(code);
      }

      // ✅ Phase 5: Обновляем версию перевода
      await TranslationVersioningService.setLanguageVersion(code, '1.0.0', 305);
      await TranslationVersioningService.addDownloadHistory(code, '1.0.0', true);

      // Обновляем состояние
      setSelectedLanguageState(code);

      // Сохраняем в AsyncStorage
      await AsyncStorage.multiSet([
        [STORAGE_KEY_LANGUAGE, code],
        [STORAGE_KEY_FIRST_LAUNCH, 'false']
      ]);

      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Failed to save language:', error);
      throw error; // Пробрасываем ошибку для обработки в UI
    }
  };

  const setOnboardingCompletedFunc = async (completed: boolean) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_ONBOARDING, completed ? 'true' : 'false');
      setOnboardingCompleted(completed);
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
      throw error;
    }
  };

  const contextValue: ConfigContextType = {
    selectedLanguage,
    setSelectedLanguage,
    turkmenLanguage: 'tk', // Всегда туркменский
    isLoading,
    isFirstLaunch,
    onboardingCompleted,
    setOnboardingCompleted: setOnboardingCompletedFunc
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
};

/**
 * Hook для использования конфигурации языка
 * @throws Error если используется вне ConfigProvider
 */
export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};
