// src/services/tts/providers/EdgeTTSProvider.ts
// Провайдер для Microsoft Edge TTS (бесплатный, высокое качество)
// Работает через HTTP API (openai-edge-tts или Edge TTS Worker)
// С поддержкой кэширования аудио

import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import {
  ITTSProvider,
  TTSProviderType,
  TTSPlayOptions,
  TTSPlayResult,
  TTSProviderStatus,
} from '../types';
import { AudioCache } from '../AudioCache';

/**
 * Голоса Edge TTS для разных языков
 * Формат: ShortName из Microsoft Edge TTS
 */
export const EDGE_TTS_VOICES: Record<string, string> = {
  // Восточная Азия
  chinese: 'zh-CN-XiaoxiaoNeural',      // Женский, естественный
  japanese: 'ja-JP-NanamiNeural',        // Женский
  korean: 'ko-KR-SunHiNeural',           // Женский

  // Европейские
  russian: 'ru-RU-SvetlanaNeural',       // Женский
  english: 'en-US-JennyNeural',          // Женский
  german: 'de-DE-KatjaNeural',           // Женский
  french: 'fr-FR-DeniseNeural',          // Женский
  spanish: 'es-ES-ElviraNeural',         // Женский
  italian: 'it-IT-ElsaNeural',           // Женский
  portuguese: 'pt-PT-RaquelNeural',      // Женский
  dutch: 'nl-NL-ColetteNeural',          // Женский
  polish: 'pl-PL-ZofiaNeural',           // Женский
  ukrainian: 'uk-UA-PolinaNeural',       // Женский

  // Турецкий и тюркские (fallback)
  turkish: 'tr-TR-EmelNeural',           // Женский
  azerbaijani: 'az-AZ-BanuNeural',       // Женский
  kazakh: 'kk-KZ-AigulNeural',           // Женский
  uzbek: 'uz-UZ-MadinaNeural',           // Женский

  // Южная Азия
  hindi: 'hi-IN-SwaraNeural',            // Женский
  urdu: 'ur-PK-UzmaNeural',              // Женский

  // Ближний Восток
  arabic: 'ar-SA-ZariyahNeural',         // Женский
  persian: 'fa-IR-DilaraNeural',         // Женский

  // Юго-Восточная Азия
  vietnamese: 'vi-VN-HoaiMyNeural',      // Женский
  thai: 'th-TH-PremwadeeNeural',         // Женский
  indonesian: 'id-ID-GadisNeural',       // Женский
  malay: 'ms-MY-YasminNeural',           // Женский

  // Кавказские
  armenian: 'hy-AM-AnahitNeural',        // Женский
  georgian: 'ka-GE-EkaNeural',           // Женский
};

/**
 * Мужские голоса (альтернатива)
 */
export const EDGE_TTS_VOICES_MALE: Record<string, string> = {
  chinese: 'zh-CN-YunxiNeural',
  japanese: 'ja-JP-KeitaNeural',
  korean: 'ko-KR-InJoonNeural',
  russian: 'ru-RU-DmitryNeural',
  english: 'en-US-GuyNeural',
  german: 'de-DE-ConradNeural',
  turkish: 'tr-TR-AhmetNeural',
  arabic: 'ar-SA-HamedNeural',
  hindi: 'hi-IN-MadhurNeural',
};

interface EdgeTTSConfig {
  /** URL API endpoint (openai-edge-tts или Edge TTS Worker) */
  apiUrl: string;
  /** API ключ (опционально, для Edge TTS Worker) */
  apiKey?: string;
  /** Таймаут запроса в мс */
  timeout?: number;
  /** Использовать кэширование */
  enableCache?: boolean;
  /** Предпочитаемый пол голоса */
  preferMaleVoice?: boolean;
}

/**
 * Edge TTS Provider
 * Использует Microsoft Edge TTS через HTTP API
 */
export class EdgeTTSProvider implements ITTSProvider {
  readonly type: TTSProviderType = 'edge_tts';
  readonly supportedLanguages: string[];

  private config: EdgeTTSConfig;
  private currentSound: Audio.Sound | null = null;
  private isInitialized = false;

  constructor(config?: Partial<EdgeTTSConfig>) {
    this.config = {
      // По умолчанию - локальный сервер openai-edge-tts
      // Пользователь может изменить на свой endpoint
      apiUrl: config?.apiUrl || 'http://localhost:5050/v1/audio/speech',
      apiKey: config?.apiKey || 'not-required',
      timeout: config?.timeout || 30000,
      enableCache: config?.enableCache ?? true, // Кэш включен по умолчанию
      preferMaleVoice: config?.preferMaleVoice ?? false, // Женский голос по умолчанию
    };

    this.supportedLanguages = Object.keys(EDGE_TTS_VOICES);
  }

  /**
   * Включить/выключить кэширование
   */
  setCacheEnabled(enabled: boolean): void {
    this.config.enableCache = enabled;
  }

  /**
   * Установить предпочитаемый пол голоса
   */
  setPreferMaleVoice(preferMale: boolean): void {
    this.config.preferMaleVoice = preferMale;
  }

  /**
   * Обновить конфигурацию
   */
  setConfig(config: Partial<EdgeTTSConfig>): void {
    this.config = { ...this.config, ...config };
  }

  async checkAvailability(): Promise<TTSProviderStatus> {
    try {
      // Пробуем сделать тестовый запрос
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(this.config.apiUrl.replace('/v1/audio/speech', '/health'), {
        method: 'GET',
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);

      return {
        isAvailable: response?.ok || false,
        isOnline: true,
        supportedLanguages: this.supportedLanguages,
      };
    } catch (error) {
      return {
        isAvailable: false,
        isOnline: false,
        supportedLanguages: [],
        error: 'Edge TTS API недоступен',
      };
    }
  }

  supportsLanguage(language: string): boolean {
    return language in EDGE_TTS_VOICES;
  }

  /**
   * Получить голос для языка
   */
  private getVoice(language: string): string {
    // Используем настройку из конфига
    if (this.config.preferMaleVoice && language in EDGE_TTS_VOICES_MALE) {
      return EDGE_TTS_VOICES_MALE[language];
    }
    return EDGE_TTS_VOICES[language] || 'en-US-JennyNeural';
  }

  async play(options: TTSPlayOptions): Promise<TTSPlayResult> {
    const { text, language, rate = 1.0 } = options;

    if (!this.supportsLanguage(language)) {
      return {
        success: false,
        provider: this.type,
        language,
        usedFallback: false,
        error: `Language not supported: ${language}`,
      };
    }

    try {
      // Инициализация аудио
      if (!this.isInitialized) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        this.isInitialized = true;
      }

      await this.stop();

      const voice = this.getVoice(language);
      let audioFilePath: string;

      // ===== ПРОВЕРЯЕМ КЭШ =====
      if (this.config.enableCache) {
        const cachedPath = await AudioCache.get(text, language, voice);
        if (cachedPath) {
          console.log(`[EdgeTTSProvider] Cache HIT for ${language}`);
          audioFilePath = cachedPath;
          return this.playFromFile(audioFilePath, language, true);
        }
      }

      // ===== ЗАПРОС К API =====
      console.log(`[EdgeTTSProvider] Cache MISS - fetching from API for ${language}`);

      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: voice,
          speed: rate,
          response_format: 'mp3',
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Получаем аудио как blob
      const audioBlob = await response.blob();

      // Конвертируем в base64
      const reader = new FileReader();
      const base64Audio = await new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]); // Убираем data:audio/mp3;base64,
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      // ===== СОХРАНЯЕМ В КЭШ =====
      if (this.config.enableCache) {
        try {
          audioFilePath = await AudioCache.put(text, language, voice, base64Audio);
          console.log(`[EdgeTTSProvider] Cached audio for ${language}`);
        } catch (cacheError) {
          console.warn('[EdgeTTSProvider] Cache put error:', cacheError);
          // Fallback - сохраняем во временный файл
          audioFilePath = `${FileSystem.cacheDirectory}edge_tts_${Date.now()}.mp3`;
          await FileSystem.writeAsStringAsync(audioFilePath, base64Audio, {
            encoding: FileSystem.EncodingType.Base64,
          });
        }
      } else {
        // Кэш выключен - временный файл
        audioFilePath = `${FileSystem.cacheDirectory}edge_tts_${Date.now()}.mp3`;
        await FileSystem.writeAsStringAsync(audioFilePath, base64Audio, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      return this.playFromFile(audioFilePath, language, false);
    } catch (error) {
      console.error('[EdgeTTSProvider] Play error:', error);
      return {
        success: false,
        provider: this.type,
        language,
        usedFallback: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Воспроизвести аудио из файла
   */
  private async playFromFile(
    filePath: string,
    language: string,
    fromCache: boolean
  ): Promise<TTSPlayResult> {
    const { sound } = await Audio.Sound.createAsync(
      { uri: filePath },
      { shouldPlay: true }
    );

    this.currentSound = sound;

    return new Promise((resolve) => {
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded && status.didJustFinish) {
          this.cleanup();
          // НЕ удаляем файл если он из кэша
          if (!fromCache && !this.config.enableCache) {
            FileSystem.deleteAsync(filePath, { idempotent: true }).catch(() => {});
          }
          resolve({
            success: true,
            provider: this.type,
            language,
            usedFallback: false,
          });
        }
      });
    });
  }

  async stop(): Promise<void> {
    if (this.currentSound) {
      try {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
      } catch (error) {
        console.warn('[EdgeTTSProvider] Stop error:', error);
      }
      this.currentSound = null;
    }
  }

  private cleanup(): void {
    if (this.currentSound) {
      this.currentSound.unloadAsync().catch(() => {});
      this.currentSound = null;
    }
  }
}
