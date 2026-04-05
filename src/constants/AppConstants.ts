// src/constants/AppConstants.ts - Application Constants for Clean Architecture

/**
 * ✅ STORAGE KEYS
 */
export const STORAGE_KEYS = {
  APP_LANGUAGE: 'shapak_app_language',
  FAVORITES: 'favorites',
  HISTORY: 'history',
  SETTINGS: 'settings',
  STATS: 'stats',
  STUDY_SESSIONS: 'study_sessions',
  SEARCH_HISTORY: 'search_history',
  OFFLINE_DATA: 'offline_data',
  LAST_SYNC: 'last_sync',
  FIRST_LAUNCH: 'first_launch',
} as const;

/**
 * ✅ API CONSTANTS
 */
export const API_CONFIG = {
  BASE_URL: 'https://api.example.com',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
} as const;

/**
 * ✅ APP CONFIGURATION
 */
export const APP_CONFIG = {
  VERSION: '2.0.0',
  BUILD_NUMBER: 1,
  LANGUAGE_VERSION: '1.0',
  MIN_SEARCH_QUERY_LENGTH: 2,
  MAX_SEARCH_HISTORY_ITEMS: 50,
  MAX_RECENT_CATEGORIES: 10,
  DAILY_GOAL_DEFAULT: 10,
  MAX_HISTORY_ITEMS: 1000,
} as const;

/**
 * ✅ ANIMATION CONSTANTS
 */
export const ANIMATIONS = {
  DURATION: {
    SHORT: 200,
    MEDIUM: 300,
    LONG: 500,
  },
  DELAY: {
    SHORT: 100,
    MEDIUM: 200,
    LONG: 300,
  },
  SPRING_CONFIG: {
    damping: 15,
    stiffness: 120,
    mass: 1,
  },
} as const;

/**
 * ✅ LAYOUT CONSTANTS
 */
export const LAYOUT = {
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
    XXL: 48,
  },
  BORDER_RADIUS: {
    SM: 4,
    MD: 8,
    LG: 12,
    XL: 16,
    ROUND: 50,
  },
  HEADER_HEIGHT: 64,
  TAB_BAR_HEIGHT: 80,
  CARD_MIN_HEIGHT: 120,
} as const;

/**
 * ✅ AUDIO CONSTANTS
 */
export const AUDIO_CONFIG = {
  DEFAULT_RATE: 0.8,
  MIN_RATE: 0.5,
  MAX_RATE: 1.5,
  DEFAULT_PITCH: 1.0,
  DEFAULT_VOLUME: 1.0,
} as const;

/**
 * ✅ VALIDATION RULES
 */
export const VALIDATION = {
  MIN_PHRASE_LENGTH: 1,
  MAX_PHRASE_LENGTH: 200,
  MIN_SEARCH_LENGTH: 1,
  MAX_SEARCH_LENGTH: 100,
} as const;

/**
 * ✅ ERROR MESSAGES
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Проблемы с сетью. Проверьте подключение к интернету.',
  STORAGE_ERROR: 'Ошибка при сохранении данных.',
  LOAD_ERROR: 'Не удалось загрузить данные.',
  AUDIO_ERROR: 'Ошибка воспроизведения аудио.',
  SEARCH_ERROR: 'Ошибка при поиске.',
  UNKNOWN_ERROR: 'Произошла неизвестная ошибка.',
} as const;

/**
 * ✅ SUCCESS MESSAGES
 */
export const SUCCESS_MESSAGES = {
  SAVED: 'Сохранено',
  ADDED_TO_FAVORITES: 'Добавлено в избранное',
  REMOVED_FROM_FAVORITES: 'Удалено из избранного',
  SETTINGS_UPDATED: 'Настройки обновлены',
  DATA_CLEARED: 'Данные очищены',
} as const;

/**
 * ✅ FEATURE FLAGS
 */
export const FEATURES = {
  OFFLINE_MODE: true,
  VOICE_SEARCH: true,
  DARK_MODE: false, // Для будущих версий
  ANALYTICS: false,
  PUSH_NOTIFICATIONS: false,
} as const;

/**
 * ✅ DEEP LINKING
 */
export const DEEP_LINKS = {
  SCHEME: 'shapak',
  CATEGORY: 'category',
  PHRASE: 'phrase',
  SEARCH: 'search',
} as const;

/**
 * ✅ SOCIAL SHARING
 */
export const SHARING = {
  APP_STORE_URL: 'https://apps.apple.com/app/shapak-translator',
  GOOGLE_PLAY_URL: 'https://play.google.com/store/apps/details?id=com.shapak.translator',
  WEBSITE_URL: 'https://shapak.app',
} as const;