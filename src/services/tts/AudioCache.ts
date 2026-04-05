// src/services/tts/AudioCache.ts
// Кэширование аудио файлов для офлайн доступа

import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Метаданные кэшированного файла
 */
interface CacheEntry {
  /** Путь к файлу */
  filePath: string;
  /** Хэш ключа (text + language + voice) */
  key: string;
  /** Размер файла в байтах */
  size: number;
  /** Время создания */
  createdAt: number;
  /** Последний доступ */
  lastAccessedAt: number;
  /** Язык */
  language: string;
  /** Голос */
  voice: string;
}

/**
 * Статистика кэша
 */
interface CacheStats {
  /** Общее количество файлов */
  totalFiles: number;
  /** Общий размер в байтах */
  totalSize: number;
  /** Размер в МБ */
  totalSizeMB: number;
  /** Самый старый файл */
  oldestEntry: number | null;
  /** Самый новый файл */
  newestEntry: number | null;
}

/**
 * Конфигурация кэша
 */
interface CacheConfig {
  /** Максимальный размер кэша в байтах (по умолчанию 100 МБ) */
  maxSize: number;
  /** Максимальный возраст файла в мс (по умолчанию 30 дней) */
  maxAge: number;
  /** Директория кэша */
  cacheDir: string;
}

const DEFAULT_CONFIG: CacheConfig = {
  maxSize: 100 * 1024 * 1024, // 100 MB
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
  cacheDir: `${FileSystem.cacheDirectory}tts_cache/`,
};

const CACHE_INDEX_KEY = '@tts_cache_index';

/**
 * Audio Cache - кэширование TTS аудио
 */
class AudioCacheImpl {
  private config: CacheConfig;
  private cacheIndex: Map<string, CacheEntry> = new Map();
  private isInitialized = false;

  constructor(config?: Partial<CacheConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Инициализация кэша
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Создаём директорию кэша
      const dirInfo = await FileSystem.getInfoAsync(this.config.cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.config.cacheDir, { intermediates: true });
      }

      // Загружаем индекс из AsyncStorage
      const indexJson = await AsyncStorage.getItem(CACHE_INDEX_KEY);
      if (indexJson) {
        const entries: CacheEntry[] = JSON.parse(indexJson);
        for (const entry of entries) {
          this.cacheIndex.set(entry.key, entry);
        }
      }

      // Проверяем актуальность файлов
      await this.validateCache();

      this.isInitialized = true;
      console.log(`[AudioCache] Initialized with ${this.cacheIndex.size} entries`);
    } catch (error) {
      console.warn('[AudioCache] Initialization error:', error);
      this.isInitialized = true; // Продолжаем работу даже при ошибке
    }
  }

  /**
   * Генерация ключа кэша
   */
  private generateKey(text: string, language: string, voice: string): string {
    // Простой хэш для ключа
    const input = `${text}|${language}|${voice}`;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `tts_${Math.abs(hash).toString(16)}`;
  }

  /**
   * Получить путь к файлу из кэша
   */
  async get(text: string, language: string, voice: string): Promise<string | null> {
    await this.initialize();

    const key = this.generateKey(text, language, voice);
    const entry = this.cacheIndex.get(key);

    if (!entry) {
      return null;
    }

    // Проверяем существует ли файл
    const fileInfo = await FileSystem.getInfoAsync(entry.filePath);
    if (!fileInfo.exists) {
      // Файл удалён - удаляем из индекса
      this.cacheIndex.delete(key);
      await this.saveIndex();
      return null;
    }

    // Проверяем возраст файла
    const age = Date.now() - entry.createdAt;
    if (age > this.config.maxAge) {
      // Файл устарел - удаляем
      await this.removeEntry(key);
      return null;
    }

    // Обновляем время последнего доступа
    entry.lastAccessedAt = Date.now();
    await this.saveIndex();

    console.log(`[AudioCache] HIT: ${key} (${language})`);
    return entry.filePath;
  }

  /**
   * Сохранить аудио в кэш
   */
  async put(
    text: string,
    language: string,
    voice: string,
    audioData: string, // Base64 encoded
  ): Promise<string> {
    await this.initialize();

    const key = this.generateKey(text, language, voice);
    const filePath = `${this.config.cacheDir}${key}.mp3`;

    try {
      // Проверяем размер кэша перед добавлением
      await this.ensureSpace(audioData.length);

      // Сохраняем файл
      await FileSystem.writeAsStringAsync(filePath, audioData, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Получаем информацию о файле
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      const size = (fileInfo as any).size || audioData.length;

      // Добавляем в индекс
      const entry: CacheEntry = {
        filePath,
        key,
        size,
        createdAt: Date.now(),
        lastAccessedAt: Date.now(),
        language,
        voice,
      };

      this.cacheIndex.set(key, entry);
      await this.saveIndex();

      console.log(`[AudioCache] STORED: ${key} (${language}, ${Math.round(size / 1024)}KB)`);
      return filePath;
    } catch (error) {
      console.error('[AudioCache] Put error:', error);
      throw error;
    }
  }

  /**
   * Проверить есть ли в кэше
   */
  async has(text: string, language: string, voice: string): Promise<boolean> {
    const path = await this.get(text, language, voice);
    return path !== null;
  }

  /**
   * Удалить запись из кэша
   */
  private async removeEntry(key: string): Promise<void> {
    const entry = this.cacheIndex.get(key);
    if (!entry) return;

    try {
      await FileSystem.deleteAsync(entry.filePath, { idempotent: true });
    } catch (error) {
      console.warn(`[AudioCache] Delete error for ${key}:`, error);
    }

    this.cacheIndex.delete(key);
  }

  /**
   * Обеспечить место для нового файла
   */
  private async ensureSpace(neededBytes: number): Promise<void> {
    const stats = await this.getStats();
    const targetSize = this.config.maxSize - neededBytes;

    if (stats.totalSize <= targetSize) {
      return; // Достаточно места
    }

    // Сортируем по времени последнего доступа (старые первыми)
    const entries = Array.from(this.cacheIndex.values())
      .sort((a, b) => a.lastAccessedAt - b.lastAccessedAt);

    let freedSpace = 0;
    const neededSpace = stats.totalSize - targetSize;

    for (const entry of entries) {
      if (freedSpace >= neededSpace) break;

      await this.removeEntry(entry.key);
      freedSpace += entry.size;
      console.log(`[AudioCache] Evicted: ${entry.key} (freed ${Math.round(entry.size / 1024)}KB)`);
    }

    await this.saveIndex();
  }

  /**
   * Проверить актуальность кэша
   */
  private async validateCache(): Promise<void> {
    const keysToRemove: string[] = [];

    for (const [key, entry] of this.cacheIndex) {
      // Проверяем существование файла
      const fileInfo = await FileSystem.getInfoAsync(entry.filePath);
      if (!fileInfo.exists) {
        keysToRemove.push(key);
        continue;
      }

      // Проверяем возраст
      const age = Date.now() - entry.createdAt;
      if (age > this.config.maxAge) {
        keysToRemove.push(key);
      }
    }

    // Удаляем невалидные записи
    for (const key of keysToRemove) {
      await this.removeEntry(key);
    }

    if (keysToRemove.length > 0) {
      await this.saveIndex();
      console.log(`[AudioCache] Cleaned ${keysToRemove.length} invalid entries`);
    }
  }

  /**
   * Сохранить индекс
   */
  private async saveIndex(): Promise<void> {
    const entries = Array.from(this.cacheIndex.values());
    await AsyncStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(entries));
  }

  /**
   * Получить статистику кэша
   */
  async getStats(): Promise<CacheStats> {
    await this.initialize();

    let totalSize = 0;
    let oldestEntry: number | null = null;
    let newestEntry: number | null = null;

    for (const entry of this.cacheIndex.values()) {
      totalSize += entry.size;

      if (oldestEntry === null || entry.createdAt < oldestEntry) {
        oldestEntry = entry.createdAt;
      }
      if (newestEntry === null || entry.createdAt > newestEntry) {
        newestEntry = entry.createdAt;
      }
    }

    return {
      totalFiles: this.cacheIndex.size,
      totalSize,
      totalSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
      oldestEntry,
      newestEntry,
    };
  }

  /**
   * Очистить весь кэш
   */
  async clear(): Promise<void> {
    await this.initialize();

    try {
      // Удаляем директорию кэша
      await FileSystem.deleteAsync(this.config.cacheDir, { idempotent: true });
      // Создаём заново
      await FileSystem.makeDirectoryAsync(this.config.cacheDir, { intermediates: true });

      // Очищаем индекс
      this.cacheIndex.clear();
      await AsyncStorage.removeItem(CACHE_INDEX_KEY);

      console.log('[AudioCache] Cache cleared');
    } catch (error) {
      console.error('[AudioCache] Clear error:', error);
    }
  }

  /**
   * Очистить кэш для конкретного языка
   */
  async clearLanguage(language: string): Promise<number> {
    await this.initialize();

    const keysToRemove: string[] = [];

    for (const [key, entry] of this.cacheIndex) {
      if (entry.language === language) {
        keysToRemove.push(key);
      }
    }

    for (const key of keysToRemove) {
      await this.removeEntry(key);
    }

    await this.saveIndex();
    console.log(`[AudioCache] Cleared ${keysToRemove.length} entries for ${language}`);

    return keysToRemove.length;
  }

  /**
   * Установить максимальный размер кэша
   */
  setMaxSize(maxSizeMB: number): void {
    this.config.maxSize = maxSizeMB * 1024 * 1024;
  }

  /**
   * Установить максимальный возраст файлов
   */
  setMaxAge(maxAgeDays: number): void {
    this.config.maxAge = maxAgeDays * 24 * 60 * 60 * 1000;
  }
}

// Singleton экспорт
export const AudioCache = new AudioCacheImpl();
export default AudioCache;
