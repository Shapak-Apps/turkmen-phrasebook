// src/services/LanguageAnalytics.ts
// Аналитика использования языков (Phase 5)
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  LANGUAGE_USAGE: '@turkmen_phrasebook:language_usage',
  LANGUAGE_SWITCHES: '@turkmen_phrasebook:language_switches',
  SESSION_START: '@turkmen_phrasebook:session_start',
} as const;

/**
 * Использование языка
 */
export interface LanguageUsage {
  languageCode: string;
  totalSessions: number;
  totalDuration: number; // в миллисекундах
  lastUsedAt: number;
  firstUsedAt: number;
  phrasesViewed: number;
  audioPlayed: number;
}

/**
 * Переключение языка
 */
export interface LanguageSwitch {
  fromLanguage: string;
  toLanguage: string;
  timestamp: number;
  sessionDuration: number; // сколько времени был выбран предыдущий язык
}

/**
 * Статистика по языкам
 */
export interface LanguageStats {
  mostUsedLanguage: string | null;
  totalLanguagesUsed: number;
  averageSessionDuration: number;
  totalSwitches: number;
  usageByLanguage: Record<string, LanguageUsage>;
}

/**
 * Сервис аналитики использования языков
 */
export class LanguageAnalyticsService {
  /**
   * Начать сессию с языком
   */
  static async startSession(languageCode: string): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SESSION_START,
        JSON.stringify({
          languageCode,
          startTime: Date.now(),
        })
      );
    } catch (error) {
      console.error('[LanguageAnalytics] Error starting session:', error);
    }
  }

  /**
   * Завершить сессию и записать использование
   */
  static async endSession(newLanguageCode?: string): Promise<void> {
    try {
      const sessionJson = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_START);
      if (!sessionJson) return;

      const session = JSON.parse(sessionJson);
      const duration = Date.now() - session.startTime;

      // Обновляем использование языка
      await this.updateLanguageUsage(session.languageCode, duration);

      // Если переключаемся на другой язык, записываем переключение
      if (newLanguageCode && newLanguageCode !== session.languageCode) {
        await this.recordLanguageSwitch(session.languageCode, newLanguageCode, duration);
      }

      // Очищаем текущую сессию
      await AsyncStorage.removeItem(STORAGE_KEYS.SESSION_START);
    } catch (error) {
      console.error('[LanguageAnalytics] Error ending session:', error);
    }
  }

  /**
   * Обновить использование языка
   */
  private static async updateLanguageUsage(
    languageCode: string,
    sessionDuration: number
  ): Promise<void> {
    try {
      const usageJson = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_USAGE);
      const usage: Record<string, LanguageUsage> = usageJson ? JSON.parse(usageJson) : {};

      if (!usage[languageCode]) {
        usage[languageCode] = {
          languageCode,
          totalSessions: 0,
          totalDuration: 0,
          lastUsedAt: Date.now(),
          firstUsedAt: Date.now(),
          phrasesViewed: 0,
          audioPlayed: 0,
        };
      }

      usage[languageCode].totalSessions += 1;
      usage[languageCode].totalDuration += sessionDuration;
      usage[languageCode].lastUsedAt = Date.now();

      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE_USAGE, JSON.stringify(usage));
    } catch (error) {
      console.error('[LanguageAnalytics] Error updating language usage:', error);
    }
  }

  /**
   * Записать переключение языка
   */
  private static async recordLanguageSwitch(
    fromLanguage: string,
    toLanguage: string,
    sessionDuration: number
  ): Promise<void> {
    try {
      const switchesJson = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_SWITCHES);
      const switches: LanguageSwitch[] = switchesJson ? JSON.parse(switchesJson) : [];

      switches.unshift({
        fromLanguage,
        toLanguage,
        timestamp: Date.now(),
        sessionDuration,
      });

      // Храним только последние 100 переключений
      const trimmedSwitches = switches.slice(0, 100);

      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE_SWITCHES, JSON.stringify(trimmedSwitches));
    } catch (error) {
      console.error('[LanguageAnalytics] Error recording language switch:', error);
    }
  }

  /**
   * Инкрементировать счетчик просмотренных фраз
   */
  static async incrementPhrasesViewed(languageCode: string, count: number = 1): Promise<void> {
    try {
      const usageJson = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_USAGE);
      const usage: Record<string, LanguageUsage> = usageJson ? JSON.parse(usageJson) : {};

      if (usage[languageCode]) {
        usage[languageCode].phrasesViewed += count;
        await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE_USAGE, JSON.stringify(usage));
      }
    } catch (error) {
      console.error('[LanguageAnalytics] Error incrementing phrases viewed:', error);
    }
  }

  /**
   * Инкрементировать счетчик воспроизведений аудио
   */
  static async incrementAudioPlayed(languageCode: string, count: number = 1): Promise<void> {
    try {
      const usageJson = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_USAGE);
      const usage: Record<string, LanguageUsage> = usageJson ? JSON.parse(usageJson) : {};

      if (usage[languageCode]) {
        usage[languageCode].audioPlayed += count;
        await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE_USAGE, JSON.stringify(usage));
      }
    } catch (error) {
      console.error('[LanguageAnalytics] Error incrementing audio played:', error);
    }
  }

  /**
   * Получить статистику по всем языкам
   */
  static async getStats(): Promise<LanguageStats> {
    try {
      const usageJson = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_USAGE);
      const switchesJson = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_SWITCHES);

      const usage: Record<string, LanguageUsage> = usageJson ? JSON.parse(usageJson) : {};
      const switches: LanguageSwitch[] = switchesJson ? JSON.parse(switchesJson) : [];

      const languages = Object.values(usage);
      const totalLanguagesUsed = languages.length;

      // Находим самый используемый язык
      let mostUsedLanguage: string | null = null;
      let maxDuration = 0;

      for (const lang of languages) {
        if (lang.totalDuration > maxDuration) {
          maxDuration = lang.totalDuration;
          mostUsedLanguage = lang.languageCode;
        }
      }

      // Средняя длительность сессии
      const totalDuration = languages.reduce((sum, lang) => sum + lang.totalDuration, 0);
      const totalSessions = languages.reduce((sum, lang) => sum + lang.totalSessions, 0);
      const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

      return {
        mostUsedLanguage,
        totalLanguagesUsed,
        averageSessionDuration,
        totalSwitches: switches.length,
        usageByLanguage: usage,
      };
    } catch (error) {
      console.error('[LanguageAnalytics] Error getting stats:', error);
      return {
        mostUsedLanguage: null,
        totalLanguagesUsed: 0,
        averageSessionDuration: 0,
        totalSwitches: 0,
        usageByLanguage: {},
      };
    }
  }

  /**
   * Получить историю переключений
   */
  static async getSwitchHistory(limit: number = 20): Promise<LanguageSwitch[]> {
    try {
      const switchesJson = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_SWITCHES);
      const switches: LanguageSwitch[] = switchesJson ? JSON.parse(switchesJson) : [];
      return switches.slice(0, limit);
    } catch (error) {
      console.error('[LanguageAnalytics] Error getting switch history:', error);
      return [];
    }
  }

  /**
   * Очистить всю аналитику (для тестирования)
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.LANGUAGE_USAGE,
        STORAGE_KEYS.LANGUAGE_SWITCHES,
        STORAGE_KEYS.SESSION_START,
      ]);
    } catch (error) {
      console.error('[LanguageAnalytics] Error clearing analytics:', error);
    }
  }

  /**
   * Экспорт данных для отладки
   */
  static async exportData(): Promise<{
    usage: Record<string, LanguageUsage>;
    switches: LanguageSwitch[];
    stats: LanguageStats;
  }> {
    const usageJson = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_USAGE);
    const switchesJson = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_SWITCHES);

    const usage: Record<string, LanguageUsage> = usageJson ? JSON.parse(usageJson) : {};
    const switches: LanguageSwitch[] = switchesJson ? JSON.parse(switchesJson) : [];
    const stats = await this.getStats();

    return { usage, switches, stats };
  }
}
