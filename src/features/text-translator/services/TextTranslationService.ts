// src/features/text-translator/services/TextTranslationService.ts
// Сервис для текстового перевода с историей

import AsyncStorage from '@react-native-async-storage/async-storage';
import TranslationService from '../../../services/TranslationService';
import {
  TextTranslationResult,
  TranslationHistory,
  TextTranslatorSettings
} from '../types/text-translator.types';

const HISTORY_STORAGE_KEY = '@turkmen_phrasebook:text_translator_history';
const SETTINGS_STORAGE_KEY = '@turkmen_phrasebook:text_translator_settings';
const DEFAULT_HISTORY_SIZE = 50;

class TextTranslationService {
  private history: TextTranslationResult[] = [];
  private settings: TextTranslatorSettings = {
    defaultSourceLanguage: 'auto',
    defaultTargetLanguage: 'en',
    autoDetectLanguage: true,
    saveHistory: true,
    historySize: DEFAULT_HISTORY_SIZE,
  };

  /**
   * Инициализация сервиса (загрузка истории и настроек)
   */
  async initialize(): Promise<void> {
    try {
      // Загружаем историю
      await this.loadHistory();

      // Загружаем настройки
      await this.loadSettings();
    } catch (error) {
      console.error('[TextTranslationService] Initialization error:', error);
    }
  }

  /**
   * Переводит текст и сохраняет в историю
   */
  async translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<TextTranslationResult> {
    try {
      // Валидация
      if (!text || text.trim().length === 0) {
        throw new Error('Text is required');
      }

      if (text.length > 5000) {
        throw new Error('Text is too long (max 5000 characters)');
      }

      // Используем общий TranslationService
      const translatedText = await TranslationService.translate(
        text,
        sourceLanguage,
        targetLanguage
      );

      // Создаем результат
      const result: TextTranslationResult = {
        id: this.generateId(),
        originalText: text,
        translatedText,
        sourceLanguage,
        targetLanguage,
        timestamp: Date.now(),
        isFavorite: false,
      };

      // Сохраняем в историю
      if (this.settings.saveHistory) {
        await this.addToHistory(result);
      }

      return result;
    } catch (error) {
      console.error('[TextTranslationService] Translation error:', error);
      throw error;
    }
  }

  /**
   * Добавляет перевод в историю
   */
  async addToHistory(translation: TextTranslationResult): Promise<void> {
    try {
      // Добавляем в начало массива
      this.history.unshift(translation);

      // Ограничиваем размер истории
      if (this.history.length > this.settings.historySize) {
        this.history = this.history.slice(0, this.settings.historySize);
      }

      // Сохраняем в AsyncStorage
      await this.saveHistory();
    } catch (error) {
      console.error('[TextTranslationService] Add to history error:', error);
    }
  }

  /**
   * Получить всю историю переводов
   */
  getHistory(): TextTranslationResult[] {
    return this.history;
  }

  /**
   * Получить последние N переводов
   */
  getRecentTranslations(count: number = 10): TextTranslationResult[] {
    return this.history.slice(0, count);
  }

  /**
   * Очистить историю
   */
  async clearHistory(): Promise<void> {
    try {
      this.history = [];
      await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error('[TextTranslationService] Clear history error:', error);
      throw error;
    }
  }

  /**
   * Удалить конкретный перевод из истории
   */
  async deleteFromHistory(id: string): Promise<void> {
    try {
      this.history = this.history.filter(t => t.id !== id);
      await this.saveHistory();
    } catch (error) {
      console.error('[TextTranslationService] Delete from history error:', error);
      throw error;
    }
  }

  /**
   * Переключить избранное
   */
  async toggleFavorite(id: string): Promise<void> {
    try {
      const translation = this.history.find(t => t.id === id);
      if (translation) {
        translation.isFavorite = !translation.isFavorite;
        await this.saveHistory();
      }
    } catch (error) {
      console.error('[TextTranslationService] Toggle favorite error:', error);
      throw error;
    }
  }

  /**
   * Получить избранные переводы
   */
  getFavorites(): TextTranslationResult[] {
    return this.history.filter(t => t.isFavorite);
  }

  /**
   * Загрузить историю из AsyncStorage
   */
  private async loadHistory(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (data) {
        this.history = JSON.parse(data);
      }
    } catch (error) {
      console.error('[TextTranslationService] Load history error:', error);
      this.history = [];
    }
  }

  /**
   * Сохранить историю в AsyncStorage
   */
  private async saveHistory(): Promise<void> {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(this.history));
    } catch (error) {
      console.error('[TextTranslationService] Save history error:', error);
      throw error;
    }
  }

  /**
   * Загрузить настройки из AsyncStorage
   */
  private async loadSettings(): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (data) {
        this.settings = JSON.parse(data);
      }
    } catch (error) {
      console.error('[TextTranslationService] Load settings error:', error);
    }
  }

  /**
   * Сохранить настройки в AsyncStorage
   */
  async saveSettings(settings: Partial<TextTranslatorSettings>): Promise<void> {
    try {
      this.settings = { ...this.settings, ...settings };
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error('[TextTranslationService] Save settings error:', error);
      throw error;
    }
  }

  /**
   * Получить текущие настройки
   */
  getSettings(): TextTranslatorSettings {
    return this.settings;
  }

  /**
   * Проверить доступность Translation API
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const availability = await TranslationService.checkAvailability();
      return availability.myMemory || availability.libreTranslate;
    } catch (error) {
      console.error('[TextTranslationService] Availability check error:', error);
      return false;
    }
  }

  /**
   * Получить статистику
   */
  getStats(): {
    totalTranslations: number;
    favoriteCount: number;
    mostUsedSourceLanguage: string;
    mostUsedTargetLanguage: string;
  } {
    const sourceCounts: Record<string, number> = {};
    const targetCounts: Record<string, number> = {};

    this.history.forEach(t => {
      sourceCounts[t.sourceLanguage] = (sourceCounts[t.sourceLanguage] || 0) + 1;
      targetCounts[t.targetLanguage] = (targetCounts[t.targetLanguage] || 0) + 1;
    });

    const mostUsedSource = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'en';
    const mostUsedTarget = Object.entries(targetCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'en';

    return {
      totalTranslations: this.history.length,
      favoriteCount: this.getFavorites().length,
      mostUsedSourceLanguage: mostUsedSource,
      mostUsedTargetLanguage: mostUsedTarget,
    };
  }

  /**
   * Генерирует уникальный ID
   */
  private generateId(): string {
    return `translation_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

// Экспортируем singleton
export default new TextTranslationService();
