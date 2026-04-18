// src/hooks/useAudio.ts
// ✅ ГИБРИДНАЯ СИСТЕМА: MP3 (туркменский) + TTS (поддерживаемые языки)

import { useState, useCallback, useEffect, useRef } from 'react';
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { Alert } from 'react-native';
import { getAudioSource } from '../data/audioMapping';

/**
 * Языки без поддержки TTS (будут добавлены в v2.1)
 * Для этих языков показываем Alert вместо воспроизведения
 */
const UNSUPPORTED_TTS_LANGUAGES = [
  'uzbek',
  'kazakh',
  'kyrgyz',
  'tajik',
  'azerbaijani',
  'pashto',
  'armenian',
  'georgian',
  'persian',
  'urdu',
];

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);
  const playerRef = useRef<AudioPlayer | null>(null);
  const isPlayingRef = useRef(false);
  const isLoadingRef = useRef(false);

  /**
   * Проверить поддерживается ли язык TTS
   */
  const isLanguageSupported = useCallback((language: string): boolean => {
    return !UNSUPPORTED_TTS_LANGUAGES.includes(language);
  }, []);

  /**
   * Показать Alert что TTS недоступен для языка
   */
  const showUnsupportedAlert = useCallback((language: string) => {
    const languageNames: { [key: string]: string } = {
      'uzbek': 'Uzbek',
      'kazakh': 'Kazakh',
      'kyrgyz': 'Kyrgyz',
      'tajik': 'Tajik',
      'azerbaijani': 'Azerbaijani',
      'pashto': 'Pashto',
      'armenian': 'Armenian',
      'georgian': 'Georgian',
      'persian': 'Persian',
      'urdu': 'Urdu',
    };

    const langName = languageNames[language] || language;

    Alert.alert(
      '🔊 TTS Not Available',
      `Text-to-speech for ${langName} is not yet available. Coming in version 2.1!`,
      [{ text: 'OK', style: 'default' }]
    );
  }, []);

  // Инициализация аудио режима
  useEffect(() => {
    const initAudio = async () => {
      try {
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          interruptionMode: 'duckOthers',
          shouldRouteThroughEarpiece: false,
        });
      } catch (error) {
        console.warn('Audio initialization failed:', error);
      }
    };
    initAudio();
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.remove();
        } catch (error) {
          console.warn('[useAudio] Cleanup error:', error);
        }
        playerRef.current = null;
      }
      Speech.stop();
    };
  }, []);

  /**
   * Маппинг языковых кодов на TTS коды
   */
  const getLanguageCode = (language: string): string => {
    const languageMap: { [key: string]: string } = {
      // Основные языки
      'turkmen': 'en-US',  // MP3 только, но fallback на английский
      'chinese': 'zh-CN',
      'russian': 'ru-RU',
      'english': 'en-US',

      // Азиатские языки
      'japanese': 'ja-JP',
      'korean': 'ko-KR',
      'thai': 'th-TH',
      'vietnamese': 'vi-VN',
      'indonesian': 'id-ID',
      'malay': 'ms-MY',
      'hindi': 'hi-IN',
      'urdu': 'ur-PK',
      'persian': 'fa-IR',
      'pashto': 'ps-AF',

      // Европейские языки
      'german': 'de-DE',
      'french': 'fr-FR',
      'spanish': 'es-ES',
      'italian': 'it-IT',
      'turkish': 'tr-TR',
      'polish': 'pl-PL',
      'ukrainian': 'uk-UA',
      'portuguese': 'pt-PT',
      'dutch': 'nl-NL',

      // Центральноазиатские
      'uzbek': 'uz-UZ',
      'kazakh': 'kk-KZ',
      'azerbaijani': 'az-AZ',
      'kyrgyz': 'ky-KG',
      'tajik': 'tg-TJ',

      // Кавказские
      'armenian': 'hy-AM',
      'georgian': 'ka-GE',

      // Другие
      'arabic': 'ar-SA',
    };

    return languageMap[language] || 'en-US';
  };

  /**
   * Воспроизведение аудио (гибрид MP3 + TTS)
   * @param text - текст для произношения
   * @param language - любой язык (строка)
   * @param audioPath - путь к MP3 (только для туркменского!)
   * @returns используемый код языка (для badge)
   */
  const setPlayingState = useCallback((value: boolean) => {
    isPlayingRef.current = value;
    setIsPlaying(value);
  }, []);

  const setLoadingState = useCallback((value: boolean) => {
    isLoadingRef.current = value;
    setIsLoading(value);
  }, []);

  const playAudio = useCallback(async (text: string, language: string, audioPath?: string): Promise<string> => {
    if (isPlayingRef.current || isLoadingRef.current) return language;

    try {
      setLoadingState(true);

      // Останавливаем предыдущее воспроизведение
      if (playerRef.current) {
        try {
          playerRef.current.remove();
        } catch (error) {
          console.warn('[useAudio] Remove previous player error:', error);
        }
        playerRef.current = null;
      }
      Speech.stop();

      // ✅ ТУРКМЕНСКИЙ - используем MP3
      if (language === 'turkmen' && audioPath) {
        const audioSource = getAudioSource(audioPath);

        if (audioSource) {
          const player = createAudioPlayer(audioSource);
          playerRef.current = player;

          // Callback на завершение
          player.addListener('playbackStatusUpdate', (status: any) => {
            if (status.didJustFinish) {
              setPlayingState(false);
              setLoadingState(false);
            }
          });

          player.volume = 1.0;
          player.setPlaybackRate(1.0);
          player.play();

          setPlayingState(true);
          setLoadingState(false);
          setCurrentLanguage('turkmen');
          return 'turkmen';
        }
      }

      // ❌ ПРОВЕРКА: язык не поддерживается TTS
      if (!isLanguageSupported(language)) {
        setLoadingState(false);
        showUnsupportedAlert(language);
        return language;
      }

      // ✅ ПОДДЕРЖИВАЕМЫЕ ЯЗЫКИ - используем TTS
      const languageCode = getLanguageCode(language);

      setPlayingState(true);
      setLoadingState(false);
      setCurrentLanguage(languageCode);

      await Speech.speak(text, {
        language: languageCode,
        rate: 0.85,
        pitch: 1.0,
        onDone: () => {
          setPlayingState(false);
        },
        onStopped: () => {
          setPlayingState(false);
        },
        onError: (error) => {
          setPlayingState(false);
          console.warn(`TTS error for ${language}:`, error);
        },
      });

      return languageCode;

    } catch (error) {
      console.error('[useAudio] Playback error:', error);
      setPlayingState(false);
      setLoadingState(false);
      return language;
    }
  }, [isLanguageSupported, showUnsupportedAlert, setPlayingState, setLoadingState]);

  /**
   * Остановка воспроизведения
   */
  const stopAudio = useCallback(async () => {
    try {
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.remove();
        playerRef.current = null;
      }
      Speech.stop();
      setPlayingState(false);
      setLoadingState(false);
    } catch (error) {
      console.warn('[useAudio] Stop error:', error);
    }
  }, [setPlayingState, setLoadingState]);

  return {
    isPlaying,
    isLoading,
    playAudio,
    stopAudio,
    currentLanguage, // Для показа badge с используемым языком
  };
}