// src/components/AudioSourceBadge.tsx
// Индикатор источника аудио (локальный/кэш/онлайн)

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TTSProviderType } from '../services/tts';

interface AudioSourceBadgeProps {
  /** Тип провайдера */
  provider: TTSProviderType | null;
  /** Из кэша ли воспроизводится */
  fromCache?: boolean;
  /** Размер badge */
  size?: 'small' | 'medium';
  /** Показывать текст */
  showLabel?: boolean;
}

/**
 * Конфигурация для каждого провайдера
 */
const PROVIDER_CONFIG: Record<TTSProviderType, {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  bgColor: string;
}> = {
  local_mp3: {
    icon: 'musical-notes',
    label: 'Офлайн',
    color: '#059669',
    bgColor: '#D1FAE5',
  },
  expo_speech: {
    icon: 'volume-medium',
    label: 'Системный',
    color: '#6366F1',
    bgColor: '#E0E7FF',
  },
  edge_tts: {
    icon: 'cloud',
    label: 'Edge TTS',
    color: '#0EA5E9',
    bgColor: '#E0F2FE',
  },
  google_cloud: {
    icon: 'logo-google',
    label: 'Google',
    color: '#EA4335',
    bgColor: '#FEE2E2',
  },
  voicerss: {
    icon: 'mic',
    label: 'VoiceRSS',
    color: '#8B5CF6',
    bgColor: '#EDE9FE',
  },
  iflytek: {
    icon: 'language',
    label: 'iFLYTEK',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
  },
  turkic_tts: {
    icon: 'globe',
    label: 'TurkicTTS',
    color: '#10B981',
    bgColor: '#D1FAE5',
  },
};

/**
 * Badge показывающий источник аудио
 */
export function AudioSourceBadge({
  provider,
  fromCache = false,
  size = 'small',
  showLabel = true,
}: AudioSourceBadgeProps) {
  if (!provider) return null;

  const config = PROVIDER_CONFIG[provider];
  if (!config) return null;

  const isSmall = size === 'small';

  // Если из кэша - показываем специальный индикатор
  const displayIcon = fromCache ? 'download' : config.icon;
  const displayLabel = fromCache ? 'Кэш' : config.label;
  const displayColor = fromCache ? '#059669' : config.color;
  const displayBgColor = fromCache ? '#D1FAE5' : config.bgColor;

  return (
    <View style={[
      styles.container,
      { backgroundColor: displayBgColor },
      isSmall ? styles.containerSmall : styles.containerMedium,
    ]}>
      <Ionicons
        name={displayIcon}
        size={isSmall ? 12 : 16}
        color={displayColor}
      />
      {showLabel && (
        <Text style={[
          styles.label,
          { color: displayColor },
          isSmall ? styles.labelSmall : styles.labelMedium,
        ]}>
          {displayLabel}
        </Text>
      )}
    </View>
  );
}

/**
 * Badge для статуса загрузки
 */
export function AudioLoadingBadge({ size = 'small' }: { size?: 'small' | 'medium' }) {
  const isSmall = size === 'small';

  return (
    <View style={[
      styles.container,
      styles.loadingContainer,
      isSmall ? styles.containerSmall : styles.containerMedium,
    ]}>
      <Ionicons
        name="cloud-download"
        size={isSmall ? 12 : 16}
        color="#6B7280"
      />
      <Text style={[
        styles.label,
        styles.loadingLabel,
        isSmall ? styles.labelSmall : styles.labelMedium,
      ]}>
        Загрузка...
      </Text>
    </View>
  );
}

/**
 * Badge для ошибки
 */
export function AudioErrorBadge({
  message = 'Ошибка',
  size = 'small',
}: {
  message?: string;
  size?: 'small' | 'medium';
}) {
  const isSmall = size === 'small';

  return (
    <View style={[
      styles.container,
      styles.errorContainer,
      isSmall ? styles.containerSmall : styles.containerMedium,
    ]}>
      <Ionicons
        name="alert-circle"
        size={isSmall ? 12 : 16}
        color="#DC2626"
      />
      <Text style={[
        styles.label,
        styles.errorLabel,
        isSmall ? styles.labelSmall : styles.labelMedium,
      ]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 12,
    flexDirection: 'row',
  },
  containerMedium: {
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  containerSmall: {
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  errorContainer: {
    backgroundColor: '#FEE2E2',
  },
  errorLabel: {
    color: '#DC2626',
  },
  label: {
    fontWeight: '500',
  },
  labelMedium: {
    fontSize: 13,
  },
  labelSmall: {
    fontSize: 11,
  },
  loadingContainer: {
    backgroundColor: '#F3F4F6',
  },
  loadingLabel: {
    color: '#6B7280',
  },
});

export default AudioSourceBadge;
