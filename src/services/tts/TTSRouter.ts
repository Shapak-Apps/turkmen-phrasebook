// src/services/tts/TTSRouter.ts
// Роутер TTS по языковым группам

import {
  ITTSProvider,
  TTSProviderType,
  TTSPlayOptions,
  TTSPlayResult,
  LanguageGroup,
  getLanguageGroup,
  getLanguageConfig,
} from './types';
import { LocalAudioProvider } from './providers/LocalAudioProvider';
import { SystemTTSProvider } from './providers/SystemTTSProvider';
import { EdgeTTSProvider } from './providers/EdgeTTSProvider';

/**
 * Конфигурация провайдеров для каждой языковой группы
 */
interface ProviderConfig {
  primary: TTSProviderType;
  fallback: TTSProviderType;
}

const GROUP_PROVIDERS: Record<LanguageGroup, ProviderConfig> = {
  local: {
    primary: 'local_mp3',
    fallback: 'expo_speech',
  },
  turkic: {
    primary: 'edge_tts',        // Edge TTS поддерживает турецкий, азербайджанский, казахский, узбекский
    fallback: 'expo_speech',
  },
  east_asian: {
    primary: 'edge_tts',        // Edge TTS для китайского, японского, корейского
    fallback: 'expo_speech',
  },
  south_asian: {
    primary: 'edge_tts',        // Edge TTS для хинди, урду
    fallback: 'expo_speech',
  },
  middle_east: {
    primary: 'edge_tts',        // Edge TTS для арабского, персидского
    fallback: 'expo_speech',
  },
  european: {
    primary: 'edge_tts',        // Edge TTS для европейских языков
    fallback: 'expo_speech',
  },
  caucasian: {
    primary: 'edge_tts',        // Edge TTS для армянского, грузинского
    fallback: 'expo_speech',
  },
  system: {
    primary: 'expo_speech',
    fallback: 'expo_speech',
  },
};

/**
 * Конфигурация TTS Router
 */
interface TTSRouterConfig {
  /** URL Edge TTS API сервера */
  edgeTtsApiUrl?: string;
  /** API ключ для Edge TTS (опционально) */
  edgeTtsApiKey?: string;
}

/**
 * TTS Router - направляет запросы к нужному провайдеру
 */
class TTSRouterImpl {
  private providers: Map<TTSProviderType, ITTSProvider> = new Map();
  private currentProvider: ITTSProvider | null = null;
  private isInitialized = false;
  private config: TTSRouterConfig = {};

  constructor() {
    this.initializeProviders();
  }

  /**
   * Инициализация провайдеров
   */
  private initializeProviders(): void {
    // Регистрируем базовые провайдеры
    this.registerProvider(new LocalAudioProvider());
    this.registerProvider(new SystemTTSProvider());

    // Edge TTS провайдер (бесплатный Microsoft TTS)
    this.registerProvider(new EdgeTTSProvider({
      apiUrl: this.config.edgeTtsApiUrl,
      apiKey: this.config.edgeTtsApiKey,
    }));

    this.isInitialized = true;
  }

  /**
   * Настроить Edge TTS API
   * @param apiUrl URL сервера openai-edge-tts (например http://localhost:5050/v1/audio/speech)
   * @param apiKey API ключ (опционально)
   */
  configureEdgeTTS(apiUrl: string, apiKey?: string): void {
    this.config.edgeTtsApiUrl = apiUrl;
    this.config.edgeTtsApiKey = apiKey;

    // Перерегистрируем провайдер с новой конфигурацией
    const edgeProvider = new EdgeTTSProvider({ apiUrl, apiKey });
    this.registerProvider(edgeProvider);

    console.log(`[TTSRouter] Edge TTS configured with URL: ${apiUrl}`);
  }

  /**
   * Установить предпочитаемый пол голоса для Edge TTS
   */
  setVoiceGender(preferMale: boolean): void {
    const edgeProvider = this.providers.get('edge_tts') as EdgeTTSProvider | undefined;
    if (edgeProvider) {
      edgeProvider.setPreferMaleVoice(preferMale);
      console.log(`[TTSRouter] Voice gender set to: ${preferMale ? 'male' : 'female'}`);
    }
  }

  /**
   * Включить/выключить кэширование
   */
  setCacheEnabled(enabled: boolean): void {
    const edgeProvider = this.providers.get('edge_tts') as EdgeTTSProvider | undefined;
    if (edgeProvider) {
      edgeProvider.setCacheEnabled(enabled);
      console.log(`[TTSRouter] Cache ${enabled ? 'enabled' : 'disabled'}`);
    }
  }

  /**
   * Зарегистрировать провайдер
   */
  registerProvider(provider: ITTSProvider): void {
    this.providers.set(provider.type, provider);
    console.log(`[TTSRouter] Registered provider: ${provider.type}`);
  }

  /**
   * Получить провайдер по типу
   */
  getProvider(type: TTSProviderType): ITTSProvider | undefined {
    return this.providers.get(type);
  }

  /**
   * Получить провайдер для языка
   */
  getProviderForLanguage(language: string): ITTSProvider {
    const group = getLanguageGroup(language);
    const config = GROUP_PROVIDERS[group];

    // Пробуем primary провайдер
    let provider = this.providers.get(config.primary);

    // Если не найден - fallback
    if (!provider) {
      provider = this.providers.get(config.fallback);
    }

    // Последняя надежда - системный TTS
    if (!provider) {
      provider = this.providers.get('expo_speech');
    }

    return provider!;
  }

  /**
   * Воспроизвести текст
   */
  async play(options: TTSPlayOptions): Promise<TTSPlayResult> {
    const { language } = options;

    // Останавливаем текущее воспроизведение
    await this.stop();

    // Получаем провайдер для языка
    const provider = this.getProviderForLanguage(language);
    this.currentProvider = provider;

    console.log(`[TTSRouter] Playing "${language}" with provider: ${provider.type}`);

    // Специальная логика для туркменского
    if (language === 'turkmen' && options.audioPath) {
      const localProvider = this.providers.get('local_mp3');
      if (localProvider) {
        const result = await localProvider.play(options);
        if (result.success) {
          return result;
        }
        // Если локальный файл не сработал - fallback на системный TTS
        console.warn('[TTSRouter] Local audio failed, falling back to system TTS');
      }
    }

    // Воспроизводим через выбранный провайдер
    const result = await provider.play(options);

    // Если не успешно - пробуем fallback
    if (!result.success && provider.type !== 'expo_speech') {
      console.warn(`[TTSRouter] Provider ${provider.type} failed, trying fallback`);
      const fallbackProvider = this.providers.get('expo_speech');
      if (fallbackProvider) {
        this.currentProvider = fallbackProvider;
        return fallbackProvider.play(options);
      }
    }

    return result;
  }

  /**
   * Остановить воспроизведение
   */
  async stop(): Promise<void> {
    // Останавливаем все провайдеры
    for (const provider of this.providers.values()) {
      try {
        await provider.stop();
      } catch (error) {
        console.warn(`[TTSRouter] Stop error for ${provider.type}:`, error);
      }
    }
    this.currentProvider = null;
  }

  /**
   * Получить информацию о доступности для языка
   */
  async getLanguageInfo(language: string): Promise<{
    provider: TTSProviderType;
    group: LanguageGroup;
    isAvailable: boolean;
    needsFallback: boolean;
  }> {
    const group = getLanguageGroup(language);
    const provider = this.getProviderForLanguage(language);
    const status = await provider.checkAvailability();

    // Проверяем поддерживает ли провайдер этот язык напрямую
    const supportsDirectly = provider.supportsLanguage(language);
    const hasVoice = status.supportedLanguages.includes(language);

    return {
      provider: provider.type,
      group,
      isAvailable: status.isAvailable,
      needsFallback: !supportsDirectly || !hasVoice,
    };
  }

  /**
   * Получить статистику провайдеров
   */
  getProvidersStatus(): { type: TTSProviderType; languages: string[] }[] {
    return Array.from(this.providers.values()).map((provider) => ({
      type: provider.type,
      languages: provider.supportedLanguages,
    }));
  }

  /**
   * Обновить конфигурацию провайдера для группы
   * (будет использоваться когда добавим новые API провайдеры)
   */
  setGroupProvider(group: LanguageGroup, primary: TTSProviderType, fallback?: TTSProviderType): void {
    GROUP_PROVIDERS[group] = {
      primary,
      fallback: fallback || 'expo_speech',
    };
    console.log(`[TTSRouter] Updated ${group} provider to: ${primary}`);
  }
}

// Singleton экспорт
export const TTSRouter = new TTSRouterImpl();
export default TTSRouter;
