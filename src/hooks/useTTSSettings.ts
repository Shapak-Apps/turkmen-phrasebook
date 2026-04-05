// src/hooks/useTTSSettings.ts
// Хук для управления настройками TTS

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Тип голоса
 */
export type VoiceGender = 'female' | 'male';

/**
 * Настройки TTS
 */
export interface TTSSettings {
  /** Скорость речи (0.5 - 2.0) */
  rate: number;
  /** Высота голоса (0.5 - 2.0) */
  pitch: number;
  /** Предпочитаемый пол голоса */
  voiceGender: VoiceGender;
  /** Включен ли кэш */
  cacheEnabled: boolean;
  /** Максимальный размер кэша в MB */
  cacheMaxSizeMB: number;
}

const DEFAULT_SETTINGS: TTSSettings = {
  rate: 1.0,
  pitch: 1.0,
  voiceGender: 'female',
  cacheEnabled: true,
  cacheMaxSizeMB: 100,
};

const STORAGE_KEY = '@tts_settings';

/**
 * Хук для управления настройками TTS
 */
export function useTTSSettings() {
  const [settings, setSettings] = useState<TTSSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка настроек при монтировании
  useEffect(() => {
    loadSettings();
  }, []);

  /**
   * Загрузить настройки из хранилища
   */
  const loadSettings = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.warn('[useTTSSettings] Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Сохранить настройки
   */
  const saveSettings = useCallback(async (newSettings: Partial<TTSSettings>) => {
    try {
      const updated = { ...settings, ...newSettings };
      setSettings(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.warn('[useTTSSettings] Save error:', error);
    }
  }, [settings]);

  /**
   * Установить скорость речи
   */
  const setRate = useCallback((rate: number) => {
    const clampedRate = Math.max(0.5, Math.min(2.0, rate));
    saveSettings({ rate: clampedRate });
  }, [saveSettings]);

  /**
   * Установить высоту голоса
   */
  const setPitch = useCallback((pitch: number) => {
    const clampedPitch = Math.max(0.5, Math.min(2.0, pitch));
    saveSettings({ pitch: clampedPitch });
  }, [saveSettings]);

  /**
   * Установить пол голоса
   */
  const setVoiceGender = useCallback((gender: VoiceGender) => {
    saveSettings({ voiceGender: gender });
  }, [saveSettings]);

  /**
   * Включить/выключить кэш
   */
  const setCacheEnabled = useCallback((enabled: boolean) => {
    saveSettings({ cacheEnabled: enabled });
  }, [saveSettings]);

  /**
   * Установить максимальный размер кэша
   */
  const setCacheMaxSize = useCallback((sizeMB: number) => {
    const clampedSize = Math.max(10, Math.min(500, sizeMB));
    saveSettings({ cacheMaxSizeMB: clampedSize });
  }, [saveSettings]);

  /**
   * Сбросить настройки по умолчанию
   */
  const resetSettings = useCallback(async () => {
    try {
      setSettings(DEFAULT_SETTINGS);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('[useTTSSettings] Reset error:', error);
    }
  }, []);

  return {
    settings,
    isLoading,
    setRate,
    setPitch,
    setVoiceGender,
    setCacheEnabled,
    setCacheMaxSize,
    resetSettings,
    saveSettings,
  };
}

export default useTTSSettings;
