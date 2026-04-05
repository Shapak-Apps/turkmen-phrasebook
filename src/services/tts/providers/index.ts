// src/services/tts/providers/index.ts
// Экспорт провайдеров

export { LocalAudioProvider } from './LocalAudioProvider';
export { SystemTTSProvider } from './SystemTTSProvider';
export { EdgeTTSProvider, EDGE_TTS_VOICES, EDGE_TTS_VOICES_MALE } from './EdgeTTSProvider';

// Будущие провайдеры:
// export { VoiceRSSProvider } from './VoiceRSSProvider';
// export { TurkicTTSProvider } from './TurkicTTSProvider';
