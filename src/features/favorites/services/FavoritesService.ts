// src/features/favorites/services/FavoritesService.ts
// Централизованный сервис для работы со всеми типами избранного

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FavoritePhrase,
  FavoriteTranslation,
  FavoriteWord,
  FavoritesStorage,
  FavoritesStats,
  FAVORITES_STORAGE_KEYS,
  FAVORITES_SCHEMA_VERSION,
} from '../types/favorites.types';
import { Phrase } from '../../../types';
import { TextTranslationResult } from '../../text-translator/types/text-translator.types';
// Visual Translator will be available in v1.5

/**
 * FavoritesService - Управление всеми типами избранного
 */
class FavoritesServiceClass {
  private cachedPhrases: string[] = [];
  private cachedTranslations: FavoriteTranslation[] = [];
  private cachedWords: FavoriteWord[] = [];
  private isInitialized = false;

  /**
   * Инициализация сервиса (загрузка данных из storage)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Загружаем все типы избранного параллельно
      const [phrases, translations, words] = await Promise.all([
        this.loadPhrases(),
        this.loadTranslations(),
        this.loadWords(),
      ]);

      this.cachedPhrases = phrases;
      this.cachedTranslations = translations;
      this.cachedWords = words;
      this.isInitialized = true;

      // Проверяем версию схемы
      await this.checkAndMigrateSchema();
    } catch (error) {
      console.error('[FavoritesService] Initialization error:', error);
      // Инициализируем пустыми массивами в случае ошибки
      this.cachedPhrases = [];
      this.cachedTranslations = [];
      this.cachedWords = [];
      this.isInitialized = true;
    }
  }

  /**
   * Проверка и миграция схемы данных
   */
  private async checkAndMigrateSchema(): Promise<void> {
    try {
      const versionStr = await AsyncStorage.getItem(FAVORITES_STORAGE_KEYS.VERSION);
      const currentVersion = versionStr ? parseInt(versionStr, 10) : 0;

      if (currentVersion < FAVORITES_SCHEMA_VERSION) {
        // Здесь можно добавить миграции для старых версий
        await AsyncStorage.setItem(
          FAVORITES_STORAGE_KEYS.VERSION,
          FAVORITES_SCHEMA_VERSION.toString()
        );
      }
    } catch (error) {
      console.error('[FavoritesService] Schema migration error:', error);
    }
  }

  // ===========================================
  // PHRASES (Phrasebook)
  // ===========================================

  /**
   * Загрузить избранные фразы
   */
  private async loadPhrases(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_STORAGE_KEYS.PHRASES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[FavoritesService] Load phrases error:', error);
      return [];
    }
  }

  /**
   * Сохранить избранные фразы
   */
  private async savePhrases(phrases: string[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEYS.PHRASES,
        JSON.stringify(phrases)
      );
      this.cachedPhrases = phrases;
      return true;
    } catch (error) {
      console.error('[FavoritesService] Save phrases error:', error);
      return false;
    }
  }

  /**
   * Проверить, находится ли фраза в избранном
   */
  isPhraseInFavorites(phraseId: string): boolean {
    return this.cachedPhrases.includes(phraseId);
  }

  /**
   * Добавить фразу в избранное
   */
  async addPhrase(phraseId: string): Promise<boolean> {
    if (this.isPhraseInFavorites(phraseId)) return true;

    const newPhrases = [...this.cachedPhrases, phraseId];
    return await this.savePhrases(newPhrases);
  }

  /**
   * Удалить фразу из избранного
   */
  async removePhrase(phraseId: string): Promise<boolean> {
    if (!this.isPhraseInFavorites(phraseId)) return true;

    const newPhrases = this.cachedPhrases.filter(id => id !== phraseId);
    return await this.savePhrases(newPhrases);
  }

  /**
   * Переключить фразу в избранном
   */
  async togglePhrase(phraseId: string): Promise<boolean> {
    if (this.isPhraseInFavorites(phraseId)) {
      return await this.removePhrase(phraseId);
    } else {
      return await this.addPhrase(phraseId);
    }
  }

  /**
   * Получить все избранные фразы
   */
  getFavoritePhrases(allPhrases: any[]): any[] {
    return allPhrases.filter(phrase =>
      this.cachedPhrases.includes(phrase.id)
    );
  }

  /**
   * Получить ID всех избранных фраз
   */
  getFavoritePhraseIds(): string[] {
    return [...this.cachedPhrases];
  }

  // ===========================================
  // TRANSLATIONS (Text + Visual Translator)
  // ===========================================

  /**
   * Загрузить избранные переводы
   */
  private async loadTranslations(): Promise<FavoriteTranslation[]> {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_STORAGE_KEYS.TRANSLATIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[FavoritesService] Load translations error:', error);
      return [];
    }
  }

  /**
   * Сохранить избранные переводы
   */
  private async saveTranslations(translations: FavoriteTranslation[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEYS.TRANSLATIONS,
        JSON.stringify(translations)
      );
      this.cachedTranslations = translations;
      return true;
    } catch (error) {
      console.error('[FavoritesService] Save translations error:', error);
      return false;
    }
  }

  /**
   * Проверить, находится ли перевод в избранном
   */
  isTranslationInFavorites(translationId: string): boolean {
    return this.cachedTranslations.some(t => t.id === translationId);
  }

  /**
   * Добавить перевод в избранное (Text Translator)
   */
  async addTextTranslation(translation: TextTranslationResult): Promise<boolean> {
    if (this.isTranslationInFavorites(translation.id)) return true;

    const favoriteItem: FavoriteTranslation = {
      id: `text_${translation.id}`,
      type: 'translation',
      translationType: 'text',
      data: translation,
      addedAt: Date.now(),
    };

    const newTranslations = [...this.cachedTranslations, favoriteItem];
    return await this.saveTranslations(newTranslations);
  }

  // addVisualTranslation will be available in v1.5

  /**
   * Удалить перевод из избранного
   */
  async removeTranslation(translationId: string): Promise<boolean> {
    if (!this.isTranslationInFavorites(translationId)) return true;

    const newTranslations = this.cachedTranslations.filter(t =>
      t.id !== translationId &&
      t.id !== `text_${translationId}` &&
      t.id !== `visual_${translationId}`
    );
    return await this.saveTranslations(newTranslations);
  }

  /**
   * Получить все избранные переводы
   */
  getFavoriteTranslations(): FavoriteTranslation[] {
    return [...this.cachedTranslations];
  }

  /**
   * Получить избранные переводы по типу
   */
  getFavoriteTranslationsByType(type: 'text' | 'visual'): FavoriteTranslation[] {
    return this.cachedTranslations.filter(t => t.translationType === type);
  }

  // ===========================================
  // WORDS (Dictionary - для будущего)
  // ===========================================

  /**
   * Загрузить избранные слова
   */
  private async loadWords(): Promise<FavoriteWord[]> {
    try {
      const data = await AsyncStorage.getItem(FAVORITES_STORAGE_KEYS.WORDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('[FavoritesService] Load words error:', error);
      return [];
    }
  }

  /**
   * Сохранить избранные слова
   */
  private async saveWords(words: FavoriteWord[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEYS.WORDS,
        JSON.stringify(words)
      );
      this.cachedWords = words;
      return true;
    } catch (error) {
      console.error('[FavoritesService] Save words error:', error);
      return false;
    }
  }

  /**
   * Добавить слово в избранное (для будущего Dictionary)
   */
  async addWord(word: Omit<FavoriteWord, 'id' | 'type' | 'addedAt'>): Promise<boolean> {
    const favoriteWord: FavoriteWord = {
      id: `word_${Date.now()}_${Math.random()}`,
      type: 'word',
      ...word,
      addedAt: Date.now(),
    };

    const newWords = [...this.cachedWords, favoriteWord];
    return await this.saveWords(newWords);
  }

  /**
   * Удалить слово из избранного
   */
  async removeWord(wordId: string): Promise<boolean> {
    const newWords = this.cachedWords.filter(w => w.id !== wordId);
    return await this.saveWords(newWords);
  }

  /**
   * Получить все избранные слова
   */
  getFavoriteWords(): FavoriteWord[] {
    return [...this.cachedWords];
  }

  // ===========================================
  // ОБЩИЕ МЕТОДЫ
  // ===========================================

  /**
   * Получить статистику избранного
   */
  getStats(): FavoritesStats {
    const allAddedTimes = [
      ...this.cachedTranslations.map(t => t.addedAt),
      ...this.cachedWords.map(w => w.addedAt),
    ];

    return {
      totalPhrases: this.cachedPhrases.length,
      totalTranslations: this.cachedTranslations.length,
      totalWords: this.cachedWords.length,
      totalItems: this.cachedPhrases.length +
                  this.cachedTranslations.length +
                  this.cachedWords.length,
      lastAddedAt: allAddedTimes.length > 0
        ? Math.max(...allAddedTimes)
        : undefined,
    };
  }

  /**
   * Очистить все избранное
   */
  async clearAll(): Promise<boolean> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(FAVORITES_STORAGE_KEYS.PHRASES),
        AsyncStorage.removeItem(FAVORITES_STORAGE_KEYS.TRANSLATIONS),
        AsyncStorage.removeItem(FAVORITES_STORAGE_KEYS.WORDS),
      ]);

      this.cachedPhrases = [];
      this.cachedTranslations = [];
      this.cachedWords = [];

      return true;
    } catch (error) {
      console.error('[FavoritesService] Clear all error:', error);
      return false;
    }
  }

  /**
   * Очистить избранное по типу
   */
  async clearByType(type: 'phrases' | 'translations' | 'words'): Promise<boolean> {
    try {
      switch (type) {
        case 'phrases':
          await AsyncStorage.removeItem(FAVORITES_STORAGE_KEYS.PHRASES);
          this.cachedPhrases = [];
          break;
        case 'translations':
          await AsyncStorage.removeItem(FAVORITES_STORAGE_KEYS.TRANSLATIONS);
          this.cachedTranslations = [];
          break;
        case 'words':
          await AsyncStorage.removeItem(FAVORITES_STORAGE_KEYS.WORDS);
          this.cachedWords = [];
          break;
      }
      return true;
    } catch (error) {
      console.error(`[FavoritesService] Clear ${type} error:`, error);
      return false;
    }
  }

  /**
   * Поиск по избранному
   */
  search(query: string): {
    phrases: string[];
    translations: FavoriteTranslation[];
    words: FavoriteWord[];
  } {
    const lowerQuery = query.toLowerCase();

    const filteredTranslations = this.cachedTranslations.filter(t => {
      if (t.translationType === 'text') {
        const data = t.data as TextTranslationResult;
        return (
          data.originalText.toLowerCase().includes(lowerQuery) ||
          data.translatedText.toLowerCase().includes(lowerQuery)
        );
      }
      // Visual translations можно добавить позже
      return false;
    });

    const filteredWords = this.cachedWords.filter(w =>
      w.word.toLowerCase().includes(lowerQuery) ||
      w.translation.toLowerCase().includes(lowerQuery)
    );

    return {
      phrases: this.cachedPhrases, // Фразы фильтруются на уровне компонента
      translations: filteredTranslations,
      words: filteredWords,
    };
  }
}

// Экспортируем singleton instance
export const FavoritesService = new FavoritesServiceClass();
