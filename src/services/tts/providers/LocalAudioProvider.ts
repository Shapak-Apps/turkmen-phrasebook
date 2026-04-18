// src/services/tts/providers/LocalAudioProvider.ts
// Провайдер для локальных MP3 файлов (туркменский)

import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
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

  private currentPlayer: AudioPlayer | null = null;
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
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          interruptionMode: 'duckOthers',
          shouldRouteThroughEarpiece: false,
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
      const player = createAudioPlayer(audioSource);
      player.volume = volume;
      player.setPlaybackRate(rate);
      this.currentPlayer = player;

      // Ждем завершения воспроизведения
      return new Promise((resolve) => {
        player.addListener('playbackStatusUpdate', (status: any) => {
          if (status.didJustFinish) {
            this.cleanup();
            resolve({
              success: true,
              provider: this.type,
              language,
              usedFallback: false,
            });
          }
        });
        player.play();
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
    if (this.currentPlayer) {
      try {
        this.currentPlayer.pause();
        this.currentPlayer.remove();
      } catch (error) {
        console.warn('[LocalAudioProvider] Stop error:', error);
      }
      this.currentPlayer = null;
    }
  }

  private cleanup(): void {
    if (this.currentPlayer) {
      try {
        this.currentPlayer.remove();
      } catch (error) {
        console.warn('[LocalAudioProvider] Cleanup error:', error);
      }
      this.currentPlayer = null;
    }
  }
}
