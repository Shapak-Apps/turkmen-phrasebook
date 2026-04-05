// src/features/text-translator/types/text-translator.types.ts
// TypeScript типы для Text Translator модуля

/**
 * Результат перевода текста
 */
export interface TextTranslationResult {
  id: string;                      // Уникальный ID
  originalText: string;            // Исходный текст
  translatedText: string;          // Переведенный текст
  sourceLanguage: string;          // Исходный язык (ISO код)
  targetLanguage: string;          // Целевой язык (ISO код)
  timestamp: number;               // Время создания
  isFavorite?: boolean;            // Добавлено в избранное
}

/**
 * История переводов
 */
export interface TranslationHistory {
  translations: TextTranslationResult[];
  maxSize: number;                 // Максимальный размер истории
}

/**
 * Настройки Text Translator
 */
export interface TextTranslatorSettings {
  defaultSourceLanguage: string;   // Язык по умолчанию для исходного текста
  defaultTargetLanguage: string;   // Язык по умолчанию для перевода
  autoDetectLanguage: boolean;     // Автоопределение языка
  saveHistory: boolean;            // Сохранять историю
  historySize: number;             // Размер истории
}

/**
 * Состояние перевода
 */
export interface TranslationState {
  isTranslating: boolean;
  error: string | null;
  result: TextTranslationResult | null;
}

/**
 * Язык для выбора
 */
export interface TranslatorLanguage {
  code: string;                    // ISO код (en, zh, ru, tk)
  name: string;                    // Название языка
  nativeName: string;              // Название на родном языке
  flag: string;                    // Флаг (emoji)
  isSupported: boolean;            // Поддерживается ли API
}

/**
 * Доступные языки для Text Translator
 */
export const TRANSLATOR_LANGUAGES: TranslatorLanguage[] = [
  { code: 'auto', name: 'Auto Detect', nativeName: 'Auto', flag: '🌐', isSupported: true },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', isSupported: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isSupported: true },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', isSupported: true },
  { code: 'tk', name: 'Turkmen', nativeName: 'Türkmençe', flag: '🇹🇲', isSupported: true },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', isSupported: true },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', isSupported: true },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isSupported: true },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isSupported: true },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isSupported: true },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isSupported: true },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', isSupported: true },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', isSupported: true },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', isSupported: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', isSupported: true },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', isSupported: true },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭', isSupported: true },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳', isSupported: true },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱', isSupported: true },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦', isSupported: true },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', isSupported: true },
  { code: 'uz', name: 'Uzbek', nativeName: 'O\'zbek', flag: '🇺🇿', isSupported: true },
  { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', flag: '🇦🇿', isSupported: true },
  { code: 'kk', name: 'Kazakh', nativeName: 'Қазақ', flag: '🇰🇿', isSupported: true },
  { code: 'ky', name: 'Kyrgyz', nativeName: 'Кыргыз', flag: '🇰🇬', isSupported: true },
  { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', flag: '🇹🇯', isSupported: true },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', isSupported: true },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾', isSupported: true },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', isSupported: true },
  { code: 'ps', name: 'Pashto', nativeName: 'پښتو', flag: '🏳️', isSupported: true },
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն', flag: '🇦🇲', isSupported: true },
  { code: 'ka', name: 'Georgian', nativeName: 'ქართული', flag: '🇬🇪', isSupported: true },
];

/**
 * Получить язык по коду
 */
export function getLanguageByCode(code: string): TranslatorLanguage | undefined {
  return TRANSLATOR_LANGUAGES.find(lang => lang.code === code);
}

/**
 * Получить список языков для выбора источника (включая Auto Detect)
 */
export function getSourceLanguages(): TranslatorLanguage[] {
  return TRANSLATOR_LANGUAGES;
}

/**
 * Получить список языков для выбора цели (без Auto Detect)
 */
export function getTargetLanguages(): TranslatorLanguage[] {
  return TRANSLATOR_LANGUAGES.filter(lang => lang.code !== 'auto');
}
