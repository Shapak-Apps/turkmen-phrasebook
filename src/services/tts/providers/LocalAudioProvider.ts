// src/services/tts/providers/LocalAudioProvider.ts
// Провайдер для локальных MP3 файлов (туркменский)

import { Audio } from 'expo-av';
import { getAudioSource } from '../../../data/audioMapping';
import {
  ITTSProvider,
  TTSProviderType,
  TTSPlayOptions,
  TTSPlayResult,
  TTSProviderStatus,
} from '../types';

export class LocalAudioProvider implements ITTSProvider {
  readonly type: TTSProviderType = 'local_mp3';
  readonly supportedLanguages = ['turkmen'];

  private currentSound: Audio.Sound | null = null;
  private isInitialized = false;

  async checkAvailability(): Promise<TTSProviderStatus> {
    return {
      isAvailable: true,
      isOnline: false, // Работает офлайн
      supportedLanguages: this.supportedLanguages,
    };
  }

  supportsLanguage(language: string): boolean {
    return this.supportedLanguages.includes(language);
  }

  async play(options: TTSPlayOptions): Promise<TTSPlayResult> {
    const { text, language, audioPath, volume = 1.0, rate = 1.0 } = options;

    // Проверяем что это туркменский и есть путь к файлу
    if (language !== 'turkmen' || !audioPath) {
      return {
        success: false,
        provider: this.type,
        language,
        usedFallback: false,
        error: 'LocalAudioProvider only supports turkmen with audioPath',
      };
    }

    try {
      // Инициализация аудио режима
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

      // Останавливаем предыдущее воспроизведение
      await this.stop();

      // Получаем аудио файл
      const audioSource = getAudioSource(audioPath);

      if (!audioSource) {
        return {
          success: false,
          provider: this.type,
          language,
          usedFallback: false,
          error: `Audio file not found: ${audioPath}`,
        };
      }

      // Создаем и воспроизводим звук
      const { sound } = await Audio.Sound.createAsync(audioSource, {
        shouldPlay: true,
        volume,
        rate,
      });

      this.currentSound = sound;

      // Ждем завершения воспроизведения
      return new Promise((resolve) => {
        sound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.isLoaded && status.didJustFinish) {
            this.cleanup();
            resolve({
              success: true,
              provider: this.type,
              language,
              usedFallback: false,
            });
          }
        });
      });
    } catch (error) {
      console.error('[LocalAudioProvider] Play error:', error);
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
    if (this.currentSound) {
      try {
        await this.currentSound.stopAsync();
        await this.currentSound.unloadAsync();
      } catch (error) {
        console.warn('[LocalAudioProvider] Stop error:', error);
      }
      this.currentSound = null;
    }
  }

  private cleanup(): void {
    if (this.currentSound) {
      this.currentSound.unloadAsync().catch(console.warn);
      this.currentSound = null;
    }
  }
}
