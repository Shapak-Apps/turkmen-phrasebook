// src/screens/ComingSoonScreen.tsx — Lingify style Coming Soon

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useAppLanguage } from '../contexts/LanguageContext';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';
import type { RootStackParamList } from '../types';

type ComingSoonRouteProp = RouteProp<RootStackParamList, 'ComingSoon'>;

const FEATURE_CONFIG = {
  voice: {
    version: '2.0',
    icon: 'mic-outline' as const,
  },
  visual: {
    version: '1.5',
    icon: 'camera-outline' as const,
  },
  ai: {
    version: '2.0',
    icon: 'sparkles-outline' as const,
  },
  translator: {
    version: '2.0',
    icon: 'text-outline' as const,
  },
};

export default function ComingSoonScreen() {
  const navigation = useNavigation();
  const route = useRoute<ComingSoonRouteProp>();
  const { getTexts } = useAppLanguage();
  const texts = getTexts();

  const feature = route.params?.feature || 'voice';
  const config = FEATURE_CONFIG[feature];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const getTitle = () => {
    if (feature === 'voice') return texts.voiceTranslatorTitle || 'Voice Translator';
    if (feature === 'ai') return texts.aiAssistantsTitle || 'AI Assistant';
    if (feature === 'translator') return texts.textTranslatorTitle || 'Text Translator';
    return texts.visualTranslatorTitle || 'Visual Translator';
  };

  const getComingSoonTitle = () => {
    if (feature === 'voice') return texts.voiceComingSoonTitle || 'Voice Translator is Coming!';
    if (feature === 'ai') return texts.aiComingSoonTitle || 'AI Assistant is Coming!';
    if (feature === 'translator') return 'Text Translator is Coming!';
    return texts.visualComingSoonTitle || 'Visual Translator is Coming!';
  };

  const getDescription = () => {
    if (feature === 'voice') return texts.voiceComingSoonDesc || 'We are working hard to bring you an amazing voice translation experience.';
    if (feature === 'ai') return texts.aiComingSoonDesc || 'We are working on an intelligent AI assistant to help you learn languages faster.';
    if (feature === 'translator') return 'We are building a powerful text translator to help you communicate in any language.';
    return texts.visualComingSoonDesc || 'Translate text from images instantly with AI-powered recognition.';
  };

  const getFeatures = () => {
    if (feature === 'voice') {
      return [
        { icon: 'mic-outline' as const, text: texts.voiceComingSoonFeature1 || 'Real-time voice recognition' },
        { icon: 'language-outline' as const, text: texts.voiceComingSoonFeature2 || 'Instant translation' },
        { icon: 'volume-high-outline' as const, text: texts.voiceComingSoonFeature3 || 'Text-to-speech playback' },
      ];
    }
    if (feature === 'ai') {
      return [
        { icon: 'sparkles-outline' as const, text: texts.aiComingSoonFeature1 || 'Smart phrase explanations' },
        { icon: 'chatbubble-outline' as const, text: texts.aiComingSoonFeature2 || 'Interactive conversations' },
        { icon: 'school-outline' as const, text: texts.aiComingSoonFeature3 || 'Personalized learning tips' },
      ];
    }
    if (feature === 'translator') {
      return [
        { icon: 'text-outline' as const, text: 'Translate text between 30+ languages' },
        { icon: 'swap-horizontal-outline' as const, text: 'Auto language detection' },
        { icon: 'copy-outline' as const, text: 'Copy & share translations' },
      ];
    }
    return [
      { icon: 'camera-outline' as const, text: texts.visualComingSoonFeature1 || 'OCR text recognition' },
      { icon: 'sparkles-outline' as const, text: texts.visualComingSoonFeature2 || 'AI-powered translation' },
      { icon: 'images-outline' as const, text: texts.visualComingSoonFeature3 || 'Gallery & camera support' },
    ];
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{getTitle()}</Text>
        <View style={styles.placeholder} />
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.topContent}>
          {/* Icon */}
          <View style={styles.iconCircle}>
            <Ionicons name={config.icon} size={moderateScale(48)} color="#2D8CFF" />
          </View>

          {/* Version badge */}
          <View style={styles.badge}>
            <Ionicons name="time-outline" size={moderateScale(14)} color="#FFFFFF" />
            <Text style={styles.badgeText}>Coming in v{config.version}</Text>
          </View>

          {/* Title & Description */}
          <Text style={styles.title}>{getComingSoonTitle()}</Text>
          <Text style={styles.description}>{getDescription()}</Text>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {getFeatures().map((item, index) => (
              <View key={index} style={styles.featureRow}>
                <View style={styles.featureIcon}>
                  <Ionicons name={item.icon} size={moderateScale(20)} color="#2D8CFF" />
                </View>
                <Text style={styles.featureText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Back button */}
        <TouchableOpacity style={styles.mainButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Text style={styles.mainButtonText}>{texts.voiceComingSoonButton || 'Back to Home'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },

  header: {
    alignItems: 'center',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
  },

  backButton: {
    alignItems: 'center',
    height: scale(40),
    justifyContent: 'center',
    width: scale(40),
  },

  headerTitle: {
    color: '#1A1A1A',
    flex: 1,
    fontSize: moderateScale(18),
    fontWeight: '600',
    textAlign: 'center',
  },

  placeholder: {
    width: scale(40),
  },

  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: verticalScale(24),
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(24),
  },

  topContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },

  // Icon — outlined circle
  iconCircle: {
    alignItems: 'center',
    borderColor: '#E5E7EB',
    borderRadius: scale(48),
    borderWidth: 2,
    height: scale(96),
    justifyContent: 'center',
    marginBottom: verticalScale(20),
    width: scale(96),
  },

  // Badge
  badge: {
    alignItems: 'center',
    backgroundColor: '#2D8CFF',
    borderRadius: scale(20),
    flexDirection: 'row',
    gap: scale(6),
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(6),
  },

  badgeText: {
    color: '#FFFFFF',
    fontSize: moderateScale(13),
    fontWeight: '600',
  },

  title: {
    color: '#1A1A1A',
    fontSize: moderateScale(22),
    fontWeight: '700',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },

  description: {
    color: '#6B7280',
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(28),
    textAlign: 'center',
  },

  // Features list
  featuresContainer: {
    gap: verticalScale(12),
    width: '100%',
  },

  featureRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(14),
    paddingVertical: verticalScale(10),
  },

  featureIcon: {
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    borderRadius: scale(12),
    height: scale(44),
    justifyContent: 'center',
    width: scale(44),
  },

  featureText: {
    color: '#374151',
    flex: 1,
    fontSize: moderateScale(15),
    fontWeight: '500',
  },

  // Main button
  mainButton: {
    alignItems: 'center',
    backgroundColor: '#2D8CFF',
    borderRadius: scale(12),
    paddingVertical: verticalScale(16),
    width: '100%',
  },

  mainButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
});
