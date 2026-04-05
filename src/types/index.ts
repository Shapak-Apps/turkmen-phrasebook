// src/types/index.ts
// ✅ ОБНОВЛЕНО: Добавлены поля для аудио файлов + навигационные типы + мультиязычность

// ====================================
// НОВЫЕ ТИПЫ ДЛЯ МУЛЬТИЯЗЫЧНОСТИ
// ====================================

/**
 * Базовая фраза (туркменская версия)
 */
export interface BasePhrase {
  id: string;                    // phrase_001, phrase_002...
  categoryId: string;            // greetings, food, hotel...
  subcategoryId?: string;        // greetings_basic, food_drinks...
  turkmen: string;               // Туркменский текст
  audioFileTurkmen?: string;     // Путь к MP3
  order: number;                 // Порядковый номер
}

/**
 * Перевод фразы на конкретный язык
 */
export interface LanguageTranslation {
  phraseId: string;              // Ссылка на BasePhrase.id
  text: string;                  // Переведенный текст
  transcription?: string;        // Транскрипция (pinyin, romaji, etc.)
}

/**
 * Конфигурация языка
 */
export interface LanguageConfig {
  code: string;                  // ISO 639-1 (zh, ja, en...)
  name: string;                  // Название на родном языке
  nameEn: string;                // Название на английском
  nameTk: string;                // Название на туркменском
  flag: string;                  // Emoji флаг
  isAvailable: boolean;          // Доступен ли язык
  hasTranscription: boolean;     // Есть ли транскрипция
  ttsCode: string;               // Код для TTS
  direction: 'ltr' | 'rtl';      // Направление письма
}

// ====================================
// СТАРЫЕ ТИПЫ (сохранены для совместимости)
// ====================================

/**
 * Старый формат фразы - сохранен для обратной совместимости
 * В Phase 2 будет заменен на PhraseWithTranslation
 */
export interface Phrase {
  id: string;
  categoryId: string;
  subcategoryId?: string;
  chinese: string;
  pinyin: string;
  russian: string;
  turkmen: string;

  // ✅ ДОПОЛНИТЕЛЬНЫЕ ЯЗЫКИ (optional)
  vietnamese?: string;   // vi
  indonesian?: string;   // id (в данных используется как 'id:', но это конфликт)
  arabic?: string;       // ar
  ukrainian?: string;    // uk
  urdu?: string;         // ur
  hindi?: string;        // hi
  thai?: string;         // th
  japanese?: string;     // ja
  uzbek?: string;        // uz
  kazakh?: string;       // kk
  azerbaijani?: string;  // az
  malay?: string;        // ms
  persian?: string;      // fa
  kyrgyz?: string;       // ky
  tajik?: string;        // tg
  armenian?: string;     // hy
  georgian?: string;     // ka
  pashto?: string;       // ps
  korean?: string;       // ko
  turkish?: string;      // tr
  german?: string;       // de
  french?: string;       // fr
  spanish?: string;      // es
  italian?: string;      // it
  portuguese?: string;   // pt
  polish?: string;       // pl
  dutch?: string;        // nl

  // ✅ НОВЫЕ ПОЛЯ: отдельные пути к аудио для каждого языка
  audioFileChinese?: string;  // Путь к китайскому MP3 или undefined
  audioFileTurkmen?: string;  // Путь к туркменскому MP3 или undefined

  // ⚠️ DEPRECATED: старое поле, оставлено для совместимости
  audioFile?: string;
}

/**
 * Полная фраза с переводом (для нового UI)
 * Используется в новых компонентах - объединяет BasePhrase + перевод на выбранный язык
 */
export interface PhraseWithTranslation extends BasePhrase {
  translation: {
    text: string;
    transcription?: string;
  };
}

export interface Category {
  id: string;
  icon: string;
  color: string;
  // ✅ ОБНОВЛЕНО: Названия на всех 31 языках
  nameTk: string;   // Turkmen
  nameZh: string;   // Chinese
  nameRu: string;   // Russian
  nameEn: string;   // English
  nameJa: string;   // Japanese
  nameKo: string;   // Korean
  nameTh: string;   // Thai
  nameVi: string;   // Vietnamese
  nameId: string;   // Indonesian
  nameMs: string;   // Malay
  nameHi: string;   // Hindi
  nameUr: string;   // Urdu
  nameFa: string;   // Persian
  namePs: string;   // Pashto
  nameDe: string;   // German
  nameFr: string;   // French
  nameEs: string;   // Spanish
  nameIt: string;   // Italian
  nameTr: string;   // Turkish
  namePl: string;   // Polish
  nameUk: string;   // Ukrainian
  nameHy: string;   // Armenian
  nameKa: string;   // Georgian
  nameAr: string;   // Arabic
  nameUz: string;   // Uzbek
  nameKk: string;   // Kazakh
  nameAz: string;   // Azerbaijani
  nameKy: string;   // Kyrgyz
  nameTg: string;   // Tajik
  namePt: string;   // Portuguese
  nameNl: string;   // Dutch
  hasSubcategories?: boolean;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  parentId: string;
  // ✅ ОБНОВЛЕНО: Названия на всех 31 языках (новые поля optional для обратной совместимости)
  nameTk: string;    // Turkmen
  nameZh: string;    // Chinese
  nameRu: string;    // Russian
  nameEn: string;    // English
  nameJa?: string;   // Japanese - optional
  nameKo?: string;   // Korean - optional
  nameTh?: string;   // Thai - optional
  nameVi?: string;   // Vietnamese - optional
  nameId?: string;   // Indonesian - optional
  nameMs?: string;   // Malay - optional
  nameHi?: string;   // Hindi - optional
  nameUr?: string;   // Urdu - optional
  nameFa?: string;   // Persian - optional
  namePs?: string;   // Pashto - optional
  nameDe?: string;   // German - optional
  nameFr?: string;   // French - optional
  nameEs?: string;   // Spanish - optional
  nameIt?: string;   // Italian - optional
  nameTr?: string;   // Turkish - optional
  namePl?: string;   // Polish - optional
  nameUk?: string;   // Ukrainian - optional
  nameHy?: string;   // Armenian - optional
  nameKa?: string;   // Georgian - optional
  nameAr?: string;   // Arabic - optional
  nameUz?: string;   // Uzbek - optional
  nameKk?: string;   // Kazakh - optional
  nameAz?: string;   // Azerbaijani - optional
  nameKy?: string;   // Kyrgyz - optional
  nameTg?: string;   // Tajik - optional
  namePt?: string;   // Portuguese - optional
  nameNl?: string;   // Dutch - optional
  icon: string;
  color: string;
}

// ===== НАВИГАЦИОННЫЕ ТИПЫ =====

// Re-export navigation types from navigation.ts (single source of truth)
export type {
  RootStackParamList,
  HomeStackParamList,
  AdditionalFeaturesStackParamList,
  MainTabParamList,
  NavigationProp,
  RouteProp,
} from './navigation';

// ===== ОСТАЛЬНЫЕ ТИПЫ =====

export interface AppLanguageConfig {
  mode: 'ru' | 'tk' | 'zh';
  displayName: string;
}

export interface FavoritePhrase {
  phraseId: string;
  timestamp: number;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  currentPhraseId?: string;
  currentLanguage?: 'chinese' | 'turkmen';
}

export interface HistoryItem {
  phraseId: string;
  categoryId: string;
  subcategoryId?: string;
  viewedAt: number;
  viewCount: number;
}

export type AppLanguage = 'ru' | 'tk' | 'zh';

export interface AppSettings {
  language: AppLanguage;
  soundEnabled: boolean;
  fontSize: number;
  darkMode: boolean;
  hapticFeedback: boolean;
  autoPlay: boolean;
  speechRate: number;
}

export interface AppLanguageConfig {
  mode: 'ru' | 'tk' | 'zh';
  displayName: string;
}

export interface FavoritePhrase {
  phraseId: string;
  timestamp: number;
}

export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

export interface AudioPlaybackState {
  isPlaying: boolean;
  isLoading: boolean;
  currentPhraseId?: string;
  currentLanguage?: 'chinese' | 'turkmen';
}