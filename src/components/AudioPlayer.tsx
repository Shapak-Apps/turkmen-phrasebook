// src/components/AudioPlayer.tsx
// ✅ УПРОЩЕНО: Кнопки всегда видны, работают с гибридной системой

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useAudio } from '../hooks/useAudio';
import { useAppLanguage } from '../contexts/LanguageContext';

interface AudioPlayerProps {
  text: string;                    // Текст для произношения (TTS)
  language: string;                // Любой язык (для всех 31 языков)
  audioPath?: string;              // Путь к MP3 (только для туркменского)
  label: string;
  style: 'primary' | 'secondary';
  size?: 'small' | 'large';
  disabled?: boolean;
}

export default function AudioPlayer({
  text,
  language,
  audioPath,
  label,
  style,
  size = 'large',
  disabled = false
}: AudioPlayerProps) {
  const { isPlaying, isLoading, playAudio, stopAudio } = useAudio();
  const { config } = useAppLanguage();

  const handlePress = async () => {
    if (isPlaying) {
      await stopAudio();
    } else {
      await playAudio(text, language, audioPath);
    }
  };

  const getButtonStyle = () => {
    const baseStyle = size === 'small' ? styles.buttonSmall : styles.buttonLarge;

    if (style === 'primary') {
      return [baseStyle, styles.primaryButton];
    } else {
      return [baseStyle, styles.secondaryButton];
    }
  };

  const getTextStyle = () => {
    return size === 'small' ? styles.labelSmall : styles.labelLarge;
  };

  const getIconSize = () => {
    return size === 'small' ? 20 : 24;
  };

  const getPlayingText = () => {
    if (config.mode === 'tk') return 'Çalýar...';
    if (config.mode === 'zh') return '播放中...';
    return 'Воспроизводится...';
  };

  return (
    <View>
      <TouchableOpacity
        style={[getButtonStyle(), (disabled || isLoading) && styles.disabled]}
        onPress={handlePress}
        disabled={disabled || isLoading}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          {isLoading ? (
            <ActivityIndicator
              size={size === 'small' ? 'small' : 'large'}
              color="#374151"
            />
          ) : (
            <Ionicons
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={getIconSize()}
              color="#374151"
            />
          )}
          {size === 'large' && (
            <Text style={[getTextStyle(), styles.buttonText]}>
              {isPlaying ? getPlayingText() : label}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonLarge: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderRadius: 12,
    borderWidth: 1.5,
    elevation: 1,
    minWidth: 160,
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  buttonSmall: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
    borderRadius: 10,
    borderWidth: 1.5,
    minWidth: 90,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#374151',
    fontWeight: '600',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  labelLarge: {
    fontSize: 15,
  },
  labelSmall: {
    fontSize: 13,
  },
  primaryButton: {
  },
  secondaryButton: {
  },
});
