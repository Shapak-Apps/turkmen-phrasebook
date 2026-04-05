// src/services/tts/types.ts
// Типы и интерфейсы для TTS системы

/**
 * Языковые группы для роутинга TTS
 */
export type LanguageGroup =
  | 'local'        // Туркменский - локальные MP3
  | 'turkic'       // Казахский, узбекский, киргизский, азербайджанский
  | 'east_asian'   // Китайский, японский, корейский
  | 'south_asian'  // Хинди, урду
  | 'middle_east'  // Арабский, персидский, пушту
  | 'european'     // Русский, немецкий, французский и др.
  | 'caucasian'    // Армянский, грузинский
  | 'system';      // Fallback на системный TTS

/**
 * Тип TTS провайдера
 */
export type TTSProviderType =
  | 'local_mp3'      // Локальные файлы
  | 'expo_speech'    // Системный TTS
  | 'edge_tts'       // Microsoft Edge TTS (бесплатный)
  | 'google_cloud'   // Google Cloud TTS
  | 'voicerss'       // VoiceRSS API
  | 'iflytek'        // iFLYTEK (китайский)
  | 'turkic_tts';    // TurkicTTS API

/**
 * Результат воспроизведения
 */
export interface TTSPlayResult {
  success: boolean;
  provider: TTSProviderType;
  language: string;
  usedFallback: boolean;
  fallbackLanguage?: string;
  error?: string;
}

/**
 * Опции воспроизведения
 */
export interface TTSPlayOptions {
  text: string;
  language: string;
  audioPath?: string;  // Для локальных файлов
  rate?: number;       // Скорость (0.5 - 2.0)
  pitch?: number;      // Высота (0.5 - 2.0)
  volume?: number;     // Громкость (0 - 1)
}

/**
 * Статус провайдера
 */
export interface TTSProviderStatus {
  isAvailable: boolean;
  isOnline: boolean;
  supportedLanguages: string[];
  quotaRemaining?: number;
  error?: string;
}

/**
 * Интерфейс TTS провайдера
 */
export interface ITTSProvider {
  /** Тип провайдера */
  readonly type: TTSProviderType;

  /** Поддерживаемые языки */
  readonly supportedLanguages: string[];

  /** Проверить доступность провайдера */
  checkAvailability(): Promise<TTSProviderStatus>;

  /** Воспроизвести текст */
  play(options: TTSPlayOptions): Promise<TTSPlayResult>;

  /** Остановить воспроизведение */
  stop(): Promise<void>;

  /** Проверить поддержку языка */
  supportsLanguage(language: string): boolean;
}

/**
 * Конфигурация языка
 */
export interface LanguageConfig {
  code: string;           // 'russian', 'chinese', etc.
  group: LanguageGroup;   // Языковая группа
  ttsCode: string;        // 'ru-RU', 'zh-CN', etc.
  name: string;           // Название на русском
  nativeName: string;     // Название на родном языке
  fallbackLanguage?: string; // Fallback язык
}

/**
 * Маппинг всех языков
 */
export const LANGUAGE_CONFIG: Record<string, LanguageConfig> = {
  // Локальный
  turkmen: {
    code: 'turkmen',
    group: 'local',
    ttsCode: 'tk-TM',
    name: 'Туркменский',
    nativeName: 'Türkmen',
  },

  // Тюркские
  turkish: {
    code: 'turkish',
    group: 'turkic',
    ttsCode: 'tr-TR',
    name: 'Турецкий',
    nativeName: 'Türkçe',
  },
  kazakh: {
    code: 'kazakh',
    group: 'turkic',
    ttsCode: 'kk-KZ',
    name: 'Казахский',
    nativeName: 'Қазақша',
    fallbackLanguage: 'turkish',
  },
  uzbek: {
    code: 'uzbek',
    group: 'turkic',
    ttsCode: 'uz-UZ',
    name: 'Узбекский',
    nativeName: 'O\'zbek',
    fallbackLanguage: 'turkish',
  },
  kyrgyz: {
    code: 'kyrgyz',
    group: 'turkic',
    ttsCode: 'ky-KG',
    name: 'Киргизский',
    nativeName: 'Кыргызча',
    fallbackLanguage: 'turkish',
  },
  azerbaijani: {
    code: 'azerbaijani',
    group: 'turkic',
    ttsCode: 'az-AZ',
    name: 'Азербайджанский',
    nativeName: 'Azərbaycan',
    fallbackLanguage: 'turkish',
  },

  // Восточная Азия
  chinese: {
    code: 'chinese',
    group: 'east_asian',
    ttsCode: 'zh-CN',
    name: 'Китайский',
    nativeName: '中文',
  },
  japanese: {
    code: 'japanese',
    group: 'east_asian',
    ttsCode: 'ja-JP',
    name: 'Японский',
    nativeName: '日本語',
  },
  korean: {
    code: 'korean',
    group: 'east_asian',
    ttsCode: 'ko-KR',
    name: 'Корейский',
    nativeName: '한국어',
  },

  // Южная Азия
  hindi: {
    code: 'hindi',
    group: 'south_asian',
    ttsCode: 'hi-IN',
    name: 'Хинди',
    nativeName: 'हिन्दी',
  },
  urdu: {
    code: 'urdu',
    group: 'south_asian',
    ttsCode: 'ur-PK',
    name: 'Урду',
    nativeName: 'اردو',
    fallbackLanguage: 'hindi',
  },

  // Ближний Восток
  arabic: {
    code: 'arabic',
    group: 'middle_east',
    ttsCode: 'ar-SA',
    name: 'Арабский',
    nativeName: 'العربية',
  },
  persian: {
    code: 'persian',
    group: 'middle_east',
    ttsCode: 'fa-IR',
    name: 'Персидский',
    nativeName: 'فارسی',
  },
  pashto: {
    code: 'pashto',
    group: 'middle_east',
    ttsCode: 'ps-AF',
    name: 'Пушту',
    nativeName: 'پښتو',
    fallbackLanguage: 'persian',
  },

  // Европейские
  russian: {
    code: 'russian',
    group: 'european',
    ttsCode: 'ru-RU',
    name: 'Русский',
    nativeName: 'Русский',
  },
  english: {
    code: 'english',
    group: 'european',
    ttsCode: 'en-US',
    name: 'Английский',
    nativeName: 'English',
  },
  german: {
    code: 'german',
    group: 'european',
    ttsCode: 'de-DE',
    name: 'Немецкий',
    nativeName: 'Deutsch',
  },
  french: {
    code: 'french',
    group: 'european',
    ttsCode: 'fr-FR',
    name: 'Французский',
    nativeName: 'Français',
  },
  spanish: {
    code: 'spanish',
    group: 'european',
    ttsCode: 'es-ES',
    name: 'Испанский',
    nativeName: 'Español',
  },
  italian: {
    code: 'italian',
    group: 'european',
    ttsCode: 'it-IT',
    name: 'Итальянский',
    nativeName: 'Italiano',
  },
  portuguese: {
    code: 'portuguese',
    group: 'european',
    ttsCode: 'pt-PT',
    name: 'Португальский',
    nativeName: 'Português',
  },
  dutch: {
    code: 'dutch',
    group: 'european',
    ttsCode: 'nl-NL',
    name: 'Голландский',
    nativeName: 'Nederlands',
  },
  polish: {
    code: 'polish',
    group: 'european',
    ttsCode: 'pl-PL',
    name: 'Польский',
    nativeName: 'Polski',
  },
  ukrainian: {
    code: 'ukrainian',
    group: 'european',
    ttsCode: 'uk-UA',
    name: 'Украинский',
    nativeName: 'Українська',
  },

  // Кавказские
  armenian: {
    code: 'armenian',
    group: 'caucasian',
    ttsCode: 'hy-AM',
    name: 'Армянский',
    nativeName: 'Հայերdelays',
    fallbackLanguage: 'russian',
  },
  georgian: {
    code: 'georgian',
    group: 'caucasian',
    ttsCode: 'ka-GE',
    name: 'Грузинский',
    nativeName: 'ქართული',
    fallbackLanguage: 'russian',
  },

  // Другие азиатские
  thai: {
    code: 'thai',
    group: 'east_asian',
    ttsCode: 'th-TH',
    name: 'Тайский',
    nativeName: 'ไทย',
  },
  vietnamese: {
    code: 'vietnamese',
    group: 'east_asian',
    ttsCode: 'vi-VN',
    name: 'Вьетнамский',
    nativeName: 'Tiếng Việt',
  },
  indonesian: {
    code: 'indonesian',
    group: 'east_asian',
    ttsCode: 'id-ID',
    name: 'Индонезийский',
    nativeName: 'Bahasa Indonesia',
  },
  malay: {
    code: 'malay',
    group: 'east_asian',
    ttsCode: 'ms-MY',
    name: 'Малайский',
    nativeName: 'Bahasa Melayu',
  },

  // Таджикский
  tajik: {
    code: 'tajik',
    group: 'turkic',
    ttsCode: 'tg-TJ',
    name: 'Таджикский',
    nativeName: 'Тоҷикӣ',
    fallbackLanguage: 'persian',
  },
};

/**
 * Получить конфигурацию языка
 */
export function getLanguageConfig(language: string): LanguageConfig | undefined {
  return LANGUAGE_CONFIG[language];
}

/**
 * Получить группу языка
 */
export function getLanguageGroup(language: string): LanguageGroup {
  const config = LANGUAGE_CONFIG[language];
  return config?.group || 'system';
}

/**
 * Получить TTS код для языка
 */
export function getTTSCode(language: string): string {
  const config = LANGUAGE_CONFIG[language];
  return config?.ttsCode || 'en-US';
}
