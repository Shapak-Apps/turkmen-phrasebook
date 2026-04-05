// src/services/TranslationVersioning.ts
// Система версионирования переводов для OTA обновлений (Phase 5)
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const STORAGE_KEYS = {
  TRANSLATIONS_VERSION: '@turkmen_phrasebook:translations_version',
  DOWNLOAD_HISTORY: '@turkmen_phrasebook:download_history',
  LANGUAGE_VERSIONS: '@turkmen_phrasebook:language_versions',
} as const;

/**
 * Версия перевода для конкретного языка
 */
export interface LanguageVersion {
  languageCode: string;
  version: string;
  downloadedAt: number;
  phrasesCount: number;
  lastCheckedAt: number;
}

/**
 * История загрузки языка
 */
export interface DownloadHistory {
  languageCode: string;
  downloadedAt: number;
  version: string;
  success: boolean;
}

/**
 * Сервис для управления версиями переводов
 */
export class TranslationVersioningService {
  /**
   * Получить текущую версию переводов из app.json
   */
  static getAppTranslationsVersion(): string {
    return Constants.expoConfig?.extra?.translationsVersion || '1.0.0';
  }

  /**
   * Получить список поддерживаемых языков из app.json
   */
  static getSupportedLanguages(): string[] {
    return Constants.expoConfig?.extra?.supportedLanguages || ['zh', 'ru', 'en'];
  }

  /**
   * Получить версию перевода для языка
   */
  static async getLanguageVersion(languageCode: string): Promise<LanguageVersion | null> {
    try {
      const versionsJson = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_VERSIONS);
      if (!versionsJson) return null;

      const versions: Record<string, LanguageVersion> = JSON.parse(versionsJson);
      return versions[languageCode] || null;
    } catch (error) {
      console.error('[TranslationVersioning] Error getting language version:', error);
      return null;
    }
  }

  /**
   * Сохранить версию перевода для языка
   */
  static async setLanguageVersion(
    languageCode: string,
    version: string,
    phrasesCount: number
  ): Promise<void> {
    try {
      const versionsJson = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_VERSIONS);
      const versions: Record<string, LanguageVersion> = versionsJson
        ? JSON.parse(versionsJson)
        : {};

      versions[languageCode] = {
        languageCode,
        version,
        downloadedAt: Date.now(),
        phrasesCount,
        lastCheckedAt: Date.now(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE_VERSIONS, JSON.stringify(versions));
    } catch (error) {
      console.error('[TranslationVersioning] Error setting language version:', error);
    }
  }

  /**
   * Проверить нужно ли обновление перевода
   */
  static async needsUpdate(languageCode: string): Promise<boolean> {
    try {
      const currentVersion = await this.getLanguageVersion(languageCode);
      const appVersion = this.getAppTranslationsVersion();

      if (!currentVersion) {
        // Язык не загружен
        return true;
      }

      // Сравниваем версии
      return this.compareVersions(currentVersion.version, appVersion) < 0;
    } catch (error) {
      console.error('[TranslationVersioning] Error checking update:', error);
      return false;
    }
  }

  /**
   * Добавить запись в историю загрузок
   */
  static async addDownloadHistory(
    languageCode: string,
    version: string,
    success: boolean
  ): Promise<void> {
    try {
      const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.DOWNLOAD_HISTORY);
      const history: DownloadHistory[] = historyJson ? JSON.parse(historyJson) : [];

      history.unshift({
        languageCode,
        downloadedAt: Date.now(),
        version,
        success,
      });

      // Храним только последние 50 записей
      const trimmedHistory = history.slice(0, 50);

      await AsyncStorage.setItem(STORAGE_KEYS.DOWNLOAD_HISTORY, JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('[TranslationVersioning] Error adding download history:', error);
    }
  }

  /**
   * Получить историю загрузок
   */
  static async getDownloadHistory(): Promise<DownloadHistory[]> {
    try {
      const historyJson = await AsyncStorage.getItem(STORAGE_KEYS.DOWNLOAD_HISTORY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error('[TranslationVersioning] Error getting download history:', error);
      return [];
    }
  }

  /**
   * Получить статистику по языкам
   */
  static async getLanguagesStats(): Promise<{
    total: number;
    downloaded: number;
    languages: LanguageVersion[];
  }> {
    try {
      const versionsJson = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_VERSIONS);
      const versions: Record<string, LanguageVersion> = versionsJson
        ? JSON.parse(versionsJson)
        : {};

      const languages = Object.values(versions);
      const supportedLanguages = this.getSupportedLanguages();

      return {
        total: supportedLanguages.length,
        downloaded: languages.length,
        languages,
      };
    } catch (error) {
      console.error('[TranslationVersioning] Error getting languages stats:', error);
      return { total: 0, downloaded: 0, languages: [] };
    }
  }

  /**
   * Сравнить две версии (semver)
   * @returns -1 если v1 < v2, 0 если v1 === v2, 1 если v1 > v2
   */
  static compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;

      if (part1 < part2) return -1;
      if (part1 > part2) return 1;
    }

    return 0;
  }

  /**
   * Очистить все версии (для тестирования)
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TRANSLATIONS_VERSION,
        STORAGE_KEYS.DOWNLOAD_HISTORY,
        STORAGE_KEYS.LANGUAGE_VERSIONS,
      ]);
    } catch (error) {
      console.error('[TranslationVersioning] Error clearing data:', error);
    }
  }
}
