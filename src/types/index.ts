// src/types/index.ts
// Типы старого корпуса (фразы, категории, избранное, история, аудио) удалены
// вместе с самим корпусом — ТЗ-05. Сценарный разговорник держит свои типы
// в src/data/scenarios/types.ts.

/**
 * Язык из справочника языков (src/config/languages.config.ts)
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

// ===== НАВИГАЦИОННЫЕ ТИПЫ =====

// Re-export navigation types from navigation.ts (single source of truth)
export type { RootStackParamList, NavigationProp, RouteProp } from './navigation';
