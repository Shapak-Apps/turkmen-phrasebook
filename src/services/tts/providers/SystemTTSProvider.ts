// src/services/tts/providers/SystemTTSProvider.ts
// Провайдер для системного TTS (expo-speech)

import * as Speech from 'expo-speech';
import {
  ITTSProvider,
  TTSProviderType,
  TTSPlayOptions,
  TTSPlayResult,
  TTSProviderStatus,
  LANGUAGE_CONFIG,
  getTTSCode,
} from '../types';

export class SystemTTSProvider implements ITTSProvider {
  readonly type: TTSProviderType = 'expo_speech';
  readonly supportedLanguages: string[];

  private availableVoices: Speech.Voice[] = [];
  private voicesLoaded = false;

  constructor() {
    // Все языки, которые могут поддерживаться системным TTS
    this.supportedLanguages = Object.keys(LANGUAGE_CONFIG).filter(
      (lang) => lang !== 'turkmen' // Туркменский только через локальные файлы
    );
  }

  async checkAvailability(): Promise<TTSProviderStatus> {
    try {
      this.availableVoices = await Speech.getAvailableVoicesAsync();
      this.voicesLoaded = true;

      // Находим какие языки реально доступны
      const availableLanguages = this.supportedLanguages.filter((lang) => {
        const ttsCode = getTTSCode(lang);
        const prefix = ttsCode.split('-')[0].toLowerCase();
        return this.availableVoices.some((voice) =>
          voice.language.toLowerCase().startsWith(prefix)
        );
      });

      return {
        isAvailable: true,
        isOnline: false, // Системный TTS может работать офлайн
        supportedLanguages: availableLanguages,
      };
    } catch (error) {
      console.warn('[SystemTTSProvider] Check availability error:', error);
      return {
        isAvailable: false,
        isOnline: false,
        supportedLanguages: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  supportsLanguage(language: string): boolean {
    return this.supportedLanguages.includes(language);
  }

  /**
   * Проверить доступность голоса для конкретного языка
   */
  async hasVoiceForLanguage(language: string): Promise<boolean> {
    if (!this.voicesLoaded) {
      await this.checkAvailability();
    }

    const ttsCode = getTTSCode(language);
    const prefix = ttsCode.split('-')[0].toLowerCase();

    return this.availableVoices.some((voice) =>
      voice.language.toLowerCase().startsWith(prefix)
    );
  }

  async play(options: TTSPlayOptions): Promise<TTSPlayResult> {
    const {
      text,
      language,
      rate = 0.85,
      pitch = 1.0,
    } = options;

    const ttsCode = getTTSCode(language);
    let actualLanguageCode = ttsCode;
    let usedFallback = false;
    let fallbackLanguage: string | undefined;

    try {
      // Проверяем доступность голоса
      const hasVoice = await this.hasVoiceForLanguage(language);

      if (!hasVoice) {
        // Пробуем fallback язык
        const config = LANGUAGE_CONFIG[language];
        if (config?.fallbackLanguage) {
          const fallbackHasVoice = await this.hasVoiceForLanguage(config.fallbackLanguage);
          if (fallbackHasVoice) {
            actualLanguageCode = getTTSCode(config.fallbackLanguage);
            usedFallback = true;
            fallbackLanguage = config.fallbackLanguage;
          }
        }

        // Если всё ещё нет - используем английский
        if (!usedFallback) {
          actualLanguageCode = 'en-US';
          usedFallback = true;
          fallbackLanguage = 'english';
        }
      }

      // Оптимизированные параметры для каждой языковой группы
      let adjustedRate = rate;
      let adjustedPitch = pitch;

      const config = LANGUAGE_CONFIG[language];
      if (config) {
        switch (config.group) {
          case 'east_asian':
            adjustedRate = rate * 0.95; // Немного медленнее для тональных языков
            break;
          case 'middle_east':
            adjustedRate = rate * 0.92; // Арабский/персидский
            adjustedPitch = pitch * 0.98;
            break;
          case 'european':
            adjustedRate = rate * 1.0;
            break;
        }
      }

      // Воспроизводим
      return new Promise((resolve) => {
        Speech.speak(text, {
          language: actualLanguageCode,
          rate: adjustedRate,
          pitch: adjustedPitch,
          onDone: () => {
            resolve({
              success: true,
              provider: this.type,
              language,
              usedFallback,
              fallbackLanguage,
            });
          },
          onStopped: () => {
            resolve({
              success: true,
              provider: this.type,
              language,
              usedFallback,
              fallbackLanguage,
            });
          },
          onError: (error) => {
            console.warn('[SystemTTSProvider] Speech error:', error);
            resolve({
              success: false,
              provider: this.type,
              language,
              usedFallback,
              fallbackLanguage,
              error: 'Speech synthesis error',
            });
          },
        });
      });
    } catch (error) {
      console.error('[SystemTTSProvider] Play error:', error);
      return {
        success: false,
        provider: this.type,
        language,
        usedFallback: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async stop(): Promise<void> {
    try {
      Speech.stop();
    } catch (error) {
      console.warn('[SystemTTSProvider] Stop error:', error);
    }
  }

  /**
   * Получить список всех доступных голосов
   */
  async getAvailableVoices(): Promise<Speech.Voice[]> {
    if (!this.voicesLoaded) {
      await this.checkAvailability();
    }
    return this.availableVoices;
  }
}
