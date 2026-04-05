// src/hooks/useAppLanguage.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_LANGUAGE_KEY = 'shapak_app_language';
const LANGUAGE_VERSION = '1.0'; // Версия языковых настроек для миграций

export type AppLanguageMode = 'tk' | 'zh';

export interface AppLanguageConfig {
  mode: AppLanguageMode;
  primaryLanguage: 'tk' | 'zh';    // Язык интерфейса
  learningLanguage: 'zh' | 'tk';   // Изучаемый язык
  helperLanguage: 'ru';            // Всегда русский
  version: string;                 // Версия настроек
}

// Переводы интерфейса
export interface InterfaceTexts {
  // Общие
  home: string;
  search: string;
  favorites: string;
  settings: string;
  
  // Главный экран
  appTitle: string;
  selectCategory: string;
  recentlyStudied: string;
  
  // Детальный экран
  pronunciation: string;
  addToFavorites: string;
  inFavorites: string;
  share: string;
  
  // Настройки
  settingsTitle: string;
  languageInterface: string;
  switchLanguage: string;
  audio: string;
  soundEffects: string;
  data: string;
  clearHistory: string;
  offlineMode: string;
  about: string;
  feedback: string;
  
  // Поиск
  searchPlaceholder: string;
  noResults: string;
  searchHistory: string;
  
  // Общие действия
  cancel: string;
  save: string;
  delete: string;
  confirm: string;
  loading: string;
  error: string;
  success: string;
}

const INTERFACE_TEXTS: Record<AppLanguageMode, InterfaceTexts> = {
  tk: {
    // Туркменский интерфейс
    home: 'Baş sahypa',
    search: 'Gözleg',
    favorites: 'Halanýanlar',
    settings: 'Sazlamalar',
    
    appTitle: 'Hytaý sözlem kitaby',
    selectCategory: 'Kategoriýa saýlaň',
    recentlyStudied: '📚 Soňky öwrenilen',
    
    pronunciation: 'Aýdylyş',
    addToFavorites: 'Halanýanlara goş',
    inFavorites: 'Halanýanlarda',
    share: 'Paýlaş',
    
    settingsTitle: '⚙️ Sazlamalar',
    languageInterface: 'Interfeýs dili',
    switchLanguage: 'Dil çalyş',
    audio: 'Audio',
    soundEffects: 'Ses effektleri',
    data: 'Maglumatlar',
    clearHistory: 'Taryhy arassala',
    offlineMode: 'Oflaýn режim',
    about: 'Programma hakda',
    feedback: 'Pikir alyşmak',
    
    searchPlaceholder: 'Islendik dilde sözlem giriziň...',
    noResults: 'Hiç zat tapylmady',
    searchHistory: 'Gözleg taryhy',
    
    cancel: 'Ýatyr',
    save: 'Ýatda sakla',
    delete: 'Arassala',
    confirm: 'Tassykla',
    loading: 'Ýüklenýär...',
    error: 'Ýalňyş',
    success: 'Üstünlik',
  },
  
  zh: {
    // Китайский интерфейс
    home: '主页',
    search: '搜索',
    favorites: '收藏',
    settings: '设置',
    
    appTitle: '土库曼语会话手册',
    selectCategory: '选择类别',
    recentlyStudied: '📚 最近学习的',
    
    pronunciation: '发音',
    addToFavorites: '添加到收藏',
    inFavorites: '已收藏',
    share: '分享',
    
    settingsTitle: '⚙️ 设置',
    languageInterface: '界面语言',
    switchLanguage: '切换语言',
    audio: '音频',
    soundEffects: '音效',
    data: '数据',
    clearHistory: '清除历史',
    offlineMode: '离线模式',
    about: '关于应用',
    feedback: '反馈',
    
    searchPlaceholder: '输入任何语言的短语...',
    noResults: '未找到结果',
    searchHistory: '搜索历史',
    
    cancel: '取消',
    save: '保存',
    delete: '删除',
    confirm: '确认',
    loading: '加载中...',
    error: '错误',
    success: '成功',
  }
};

// Валидация конфигурации
const validateConfig = (config: any): config is AppLanguageConfig => {
  return (
    config &&
    typeof config === 'object' &&
    ['tk', 'zh'].includes(config.mode) &&
    ['tk', 'zh'].includes(config.primaryLanguage) &&
    ['tk', 'zh'].includes(config.learningLanguage) &&
    config.helperLanguage === 'ru' &&
    config.primaryLanguage !== config.learningLanguage
  );
};

// Создание корректной конфигурации
const createConfig = (mode: AppLanguageMode): AppLanguageConfig => ({
  mode,
  primaryLanguage: mode,
  learningLanguage: mode === 'tk' ? 'zh' : 'tk',
  helperLanguage: 'ru',
  version: LANGUAGE_VERSION,
});

export function useAppLanguage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [config, setConfig] = useState<AppLanguageConfig>(createConfig('tk'));
  const [error, setError] = useState<string | null>(null);

  // Загрузка сохраненного языка при инициализации
  useEffect(() => {
    loadLanguageConfig();
  }, []);

  const loadLanguageConfig = async () => {
    try {
      setError(null);
      const savedConfig = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
      
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        
        // Валидация загруженной конфигурации
        if (validateConfig(parsedConfig)) {
          // Проверяем версию для миграций
          if (parsedConfig.version !== LANGUAGE_VERSION) {
            // Migration from older version
            const migratedConfig = createConfig(parsedConfig.mode || 'tk');
            await saveConfig(migratedConfig);
            setConfig(migratedConfig);
          } else {
            setConfig(parsedConfig);
          }
          setIsFirstLaunch(false);
        } else {
          console.warn('Некорректная конфигурация языка, сброс настроек');
          throw new Error('Invalid language configuration');
        }
      } else {
        // Первый запуск - показываем экран выбора языка
        setIsFirstLaunch(true);
      }
    } catch (error) {
      console.warn('Ошибка загрузки языковой конфигурации:', error);
      setError('Не удалось загрузить языковые настройки');
      setIsFirstLaunch(true);
      // Устанавливаем конфигурацию по умолчанию
      setConfig(createConfig('tk'));
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async (newConfig: AppLanguageConfig): Promise<boolean> => {
    try {
      if (!validateConfig(newConfig)) {
        throw new Error('Invalid configuration');
      }
      
      await AsyncStorage.setItem(APP_LANGUAGE_KEY, JSON.stringify(newConfig));
      return true;
    } catch (error) {
      console.warn('Ошибка сохранения языковой конфигурации:', error);
      setError('Не удалось сохранить настройки языка');
      return false;
    }
  };

  const setLanguageMode = async (mode: AppLanguageMode, shouldSave: boolean = true) => {
    try {
      // Валидация режима
      if (!['tk', 'zh'].includes(mode)) {
        throw new Error(`Invalid language mode: ${mode}`);
      }

      const newConfig = createConfig(mode);
      
      if (shouldSave) {
        const saved = await saveConfig(newConfig);
        if (saved) {
          setIsFirstLaunch(false);
          setError(null);
        }
      }

      setConfig(newConfig);
    } catch (error) {
      console.warn('Ошибка установки языкового режима:', error);
      setError('Не удалось изменить язык');
    }
  };

  // Переключение режима (для настроек)
  const switchMode = async (): Promise<boolean> => {
    try {
      const newMode: AppLanguageMode = config.mode === 'tk' ? 'zh' : 'tk';
      await setLanguageMode(newMode, true);
      return true;
    } catch (error) {
      console.warn('Ошибка переключения режима:', error);
      return false;
    }
  };

  // Получить тексты интерфейса для текущего языка
  const getTexts = (): InterfaceTexts => {
    try {
      return INTERFACE_TEXTS[config.primaryLanguage as AppLanguageMode] || INTERFACE_TEXTS.tk;
    } catch (error) {
      console.warn('Ошибка получения текстов интерфейса:', error);
      return INTERFACE_TEXTS.tk; // Fallback к туркменскому
    }
  };

  // Получить название языка на родном языке
  const getLanguageName = (lang: 'tk' | 'zh' | 'ru'): string => {
    const names = {
      tk: config.primaryLanguage === 'tk' ? 'Türkmençe' : '土库曼语',
      zh: config.primaryLanguage === 'tk' ? 'Hytaýça' : '中文',
      ru: config.primaryLanguage === 'tk' ? 'Rusça' : '俄语'
    };
    return names[lang] || lang;
  };

  // Получить текст фразы в правильном порядке
 // src/hooks/useAppLanguage.ts - только измененная функция getPhraseTexts

// Получить текст фразы в правильном порядке
const getPhraseTexts = (phrase: { chinese: string; turkmen: string; russian: string }) => {
  try {
    if (config.mode === 'tk') {
      // Туркмен: понимает туркменский, изучает китайский
      return {
        primary: phrase.chinese,     // Китайский - то что должен сказать (основной для изучения)
        learning: phrase.turkmen,    // Туркменский - то что понимает (вспомогательный)
        helper: phrase.russian       // Русский - дополнительная помощь
      };
    } else {
      // Китаец: понимает китайский, изучает туркменский
      return {
        primary: phrase.turkmen,     // Туркменский - то что должен сказать (основной для изучения)
        learning: phrase.chinese,    // Китайский - то что понимает (вспомогательный)
        helper: phrase.russian       // Русский - дополнительная помощь
      };
    }
  } catch (error) {
    console.warn('Ошибка получения текстов фразы:', error);
    // Fallback
    return {
      primary: phrase.chinese,
      learning: phrase.turkmen,
      helper: phrase.russian
    };
  }
};

  // Проверка корректности текущей конфигурации
  const validateCurrentConfig = (): boolean => {
    return validateConfig(config);
  };

  // Сброс настроек языка (для тестирования и восстановления)
  const resetLanguageSettings = async (): Promise<boolean> => {
    try {
      await AsyncStorage.removeItem(APP_LANGUAGE_KEY);
      setIsFirstLaunch(true);
      setError(null);
      setConfig(createConfig('tk'));
      return true;
    } catch (error) {
      console.warn('Ошибка сброса языковых настроек:', error);
      setError('Не удалось сбросить настройки');
      return false;
    }
  };

  // Получить информацию о текущей конфигурации (для диагностики)
  const getConfigInfo = () => {
    return {
      isValid: validateConfig(config),
      config: config,
      version: LANGUAGE_VERSION,
      error: error,
      isFirstLaunch: isFirstLaunch,
      isLoading: isLoading,
    };
  };

  // Принудительное обновление конфигурации (для миграций)
  const updateConfig = async (updates: Partial<AppLanguageConfig>): Promise<boolean> => {
    try {
      const newConfig = { ...config, ...updates, version: LANGUAGE_VERSION };
      
      if (!validateConfig(newConfig)) {
        throw new Error('Updated configuration is invalid');
      }
      
      const saved = await saveConfig(newConfig);
      if (saved) {
        setConfig(newConfig);
        setError(null);
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Ошибка обновления конфигурации:', error);
      setError('Не удалось обновить конфигурацию');
      return false;
    }
  };

  return {
    // Состояние
    isLoading,
    isFirstLaunch,
    config,
    error,
    
    // Основные функции
    setLanguageMode,
    switchMode,
    getTexts,
    getLanguageName,
    getPhraseTexts,
    
    // Утилиты и диагностика
    validateCurrentConfig,
    getConfigInfo,
    resetLanguageSettings,
    updateConfig,
  };
}