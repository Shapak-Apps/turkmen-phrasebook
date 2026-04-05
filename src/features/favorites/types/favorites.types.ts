// src/features/favorites/types/favorites.types.ts
// Общие типы для Favorites Hub - объединяет все типы избранного

import { Phrase } from '../../../types';
import { TextTranslationResult } from '../../text-translator/types/text-translator.types';

// Visual Translator will be available in v1.5
// For now, only TextTranslationResult is used

/**
 * Типы элементов избранного
 */
export type FavoriteType = 'phrase' | 'translation' | 'word';

/**
 * Базовый интерфейс для избранного элемента
 */
export interface BaseFavoriteItem {
  id: string;
  type: FavoriteType;
  addedAt: number;  // Timestamp когда добавлено в избранное
}

/**
 * Избранная фраза из Phrasebook
 */
export interface FavoritePhrase extends BaseFavoriteItem {
  type: 'phrase';
  phraseId: string;  // ID фразы из phrasebook
}

/**
 * Избранный перевод из Text Translator
 * (Visual Translator будет добавлен в v1.5)
 */
export interface FavoriteTranslation extends BaseFavoriteItem {
  type: 'translation';
  translationType: 'text';
  data: TextTranslationResult;
}

/**
 * Избранное слово из Dictionary (для будущего использования)
 */
export interface FavoriteWord extends BaseFavoriteItem {
  type: 'word';
  word: string;
  translation: string;
  definition?: string;
  examples?: string[];
}

/**
 * Объединенный тип для всех избранных элементов
 */
export type FavoriteItem = FavoritePhrase | FavoriteTranslation | FavoriteWord;

/**
 * Хранилище избранного в AsyncStorage
 */
export interface FavoritesStorage {
  phrases: string[];                      // Массив phrase IDs
  translations: FavoriteTranslation[];    // Массив переводов
  words: FavoriteWord[];                  // Массив слов (пока пусто)
  version: number;                        // Версия схемы для миграций
}

/**
 * Фильтры для избранного
 */
export interface FavoritesFilter {
  type?: FavoriteType;
  searchQuery?: string;
  sortBy?: 'date' | 'alphabetical';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Статистика избранного
 */
export interface FavoritesStats {
  totalPhrases: number;
  totalTranslations: number;
  totalWords: number;
  totalItems: number;
  lastAddedAt?: number;
}

/**
 * Вкладки Favorites Hub
 */
export type FavoriteTab = 'phrases' | 'translations' | 'words';

/**
 * Конфигурация вкладки
 */
export interface FavoriteTabConfig {
  key: FavoriteTab;
  title: {
    tk: string;
    zh: string;
    ru: string;
    en: string;
  };
  icon: string;
  emptyMessage: {
    tk: string;
    zh: string;
    ru: string;
    en: string;
  };
}

/**
 * Константы для хранилища
 */
export const FAVORITES_STORAGE_KEYS = {
  PHRASES: 'turkmen_phrasebook_favorites_phrases',
  TRANSLATIONS: 'turkmen_phrasebook_favorites_translations',
  WORDS: 'turkmen_phrasebook_favorites_words',
  VERSION: 'turkmen_phrasebook_favorites_version',
} as const;

/**
 * Текущая версия схемы избранного
 */
export const FAVORITES_SCHEMA_VERSION = 1;
