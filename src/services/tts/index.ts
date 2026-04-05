// src/services/tts/index.ts
// Экспорт TTS модуля

export { TTSRouter } from './TTSRouter';
export { AudioCache } from './AudioCache';
export { LocalAudioProvider } from './providers/LocalAudioProvider';
export { SystemTTSProvider } from './providers/SystemTTSProvider';
export { EdgeTTSProvider, EDGE_TTS_VOICES, EDGE_TTS_VOICES_MALE } from './providers/EdgeTTSProvider';

export {
  // Типы
  type LanguageGroup,
  type TTSProviderType,
  type TTSPlayResult,
  type TTSPlayOptions,
  type TTSProviderStatus,
  type ITTSProvider,
  type LanguageConfig,

  // Конфигурация
  LANGUAGE_CONFIG,

  // Утилиты
  getLanguageConfig,
  getLanguageGroup,
  getTTSCode,
} from './types';
