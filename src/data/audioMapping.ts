// Аудио временно отключено. Все require() удалены, чтобы безопасно удалить файлы из assets/audio.
// Заглушка сохраняет API getAudioSource/hasAudioFile, чтобы не ломать импорты.

const TURKMEN_AUDIO: Record<string, any> = {};

export function getAudioSource(_path: string | undefined): any {
  return null;
}

export function hasAudioFile(_path: string | undefined): boolean {
  return false;
}

export default TURKMEN_AUDIO;
