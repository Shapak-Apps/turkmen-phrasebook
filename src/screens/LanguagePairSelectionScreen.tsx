/**
 * Language Pair Selection Screen
 * Shown when user enters Phrasebook for the first time
 * Allows selection of language pair (e.g., Chinese-Turkmen, Russian-Turkmen, etc.)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useConfig } from '../contexts/ConfigContext';
import type { HomeStackParamList } from '../types';
import { useResponsive } from '../utils/ResponsiveUtils';

interface LanguagePair {
  id: string;
  code: string; // Language code (zh, ru, en)
  name: string; // Native name
  nameEn: string; // English name
  flag: string;
  gradient: [string, string];
  isAvailable?: boolean;
}

const AVAILABLE_CODES = ['zh', 'ru', 'en', 'tr'];

type LanguagePairNavigationProp = StackNavigationProp<HomeStackParamList, 'LanguagePairSelection'>;

const LanguagePairSelectionScreen: React.FC = () => {
  const navigation = useNavigation<LanguagePairNavigationProp>();
  const { getTexts, config } = useAppLanguage();
  const { setSelectedLanguage } = useConfig();
  const texts = getTexts();
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { scale, verticalScale, moderateScale } = useResponsive();
  const insets = useSafeAreaInsets();

  // Available language pairs (30 languages paired with Turkmen)
  const availablePairs: LanguagePair[] = [
    {
      id: 'zh-tk',
      code: 'zh',
      name: '中文',
      nameEn: 'Chinese',
      flag: '🇨🇳',
      gradient: ['#EF4444', '#DC2626'],
    },
    {
      id: 'ru-tk',
      code: 'ru',
      name: 'Русский',
      nameEn: 'Russian',
      flag: '🇷🇺',
      gradient: ['#3B82F6', '#2563EB'],
    },
    {
      id: 'en-tk',
      code: 'en',
      name: 'English',
      nameEn: 'English',
      flag: '🇬🇧',
      gradient: ['#8B5CF6', '#7C3AED'],
    },
    {
      id: 'tr-tk',
      code: 'tr',
      name: 'Türkçe',
      nameEn: 'Turkish',
      flag: '🇹🇷',
      gradient: ['#EF4444', '#DC2626'],
    },
    {
      id: 'uz-tk',
      code: 'uz',
      name: 'O\'zbek',
      nameEn: 'Uzbek',
      flag: '🇺🇿',
      gradient: ['#06B6D4', '#0891B2'],
    },
    {
      id: 'de-tk',
      code: 'de',
      name: 'Deutsch',
      nameEn: 'German',
      flag: '🇩🇪',
      gradient: ['#000000', '#DD0000'],
    },
    {
      id: 'fr-tk',
      code: 'fr',
      name: 'Français',
      nameEn: 'French',
      flag: '🇫🇷',
      gradient: ['#0055A4', '#EF4135'],
    },
    {
      id: 'es-tk',
      code: 'es',
      name: 'Español',
      nameEn: 'Spanish',
      flag: '🇪🇸',
      gradient: ['#AA151B', '#F1BF00'],
    },
    {
      id: 'it-tk',
      code: 'it',
      name: 'Italiano',
      nameEn: 'Italian',
      flag: '🇮🇹',
      gradient: ['#009246', '#CE2B37'],
    },
    {
      id: 'ja-tk',
      code: 'ja',
      name: '日本語',
      nameEn: 'Japanese',
      flag: '🇯🇵',
      gradient: ['#BC002D', '#FFFFFF'],
    },
    {
      id: 'ko-tk',
      code: 'ko',
      name: '한국어',
      nameEn: 'Korean',
      flag: '🇰🇷',
      gradient: ['#003478', '#CD2E3A'],
    },
    {
      id: 'pl-tk',
      code: 'pl',
      name: 'Polski',
      nameEn: 'Polish',
      flag: '🇵🇱',
      gradient: ['#FFFFFF', '#DC143C'],
    },
    {
      id: 'pt-tk',
      code: 'pt',
      name: 'Português',
      nameEn: 'Portuguese',
      flag: '🇵🇹',
      gradient: ['#006600', '#FF0000'],
    },
    {
      id: 'nl-tk',
      code: 'nl',
      name: 'Nederlands',
      nameEn: 'Dutch',
      flag: '🇳🇱',
      gradient: ['#21468B', '#AE1C28'],
    },
    {
      id: 'az-tk',
      code: 'az',
      name: 'Azərbaycan',
      nameEn: 'Azerbaijani',
      flag: '🇦🇿',
      gradient: ['#0098C3', '#EF3340'],
    },
    {
      id: 'kk-tk',
      code: 'kk',
      name: 'Қазақ',
      nameEn: 'Kazakh',
      flag: '🇰🇿',
      gradient: ['#00AFCA', '#FEC50C'],
    },
    {
      id: 'ky-tk',
      code: 'ky',
      name: 'Кыргыз',
      nameEn: 'Kyrgyz',
      flag: '🇰🇬',
      gradient: ['#E8112D', '#FFEF00'],
    },
    {
      id: 'tg-tk',
      code: 'tg',
      name: 'Тоҷикӣ',
      nameEn: 'Tajik',
      flag: '🇹🇯',
      gradient: ['#006600', '#FFFFFF'],
    },
    {
      id: 'uk-tk',
      code: 'uk',
      name: 'Українська',
      nameEn: 'Ukrainian',
      flag: '🇺🇦',
      gradient: ['#0057B7', '#FFD700'],
    },
    {
      id: 'th-tk',
      code: 'th',
      name: 'ไทย',
      nameEn: 'Thai',
      flag: '🇹🇭',
      gradient: ['#ED1C24', '#FFFFFF'],
    },
    {
      id: 'vi-tk',
      code: 'vi',
      name: 'Tiếng Việt',
      nameEn: 'Vietnamese',
      flag: '🇻🇳',
      gradient: ['#DA251D', '#FFCD00'],
    },
    {
      id: 'id-tk',
      code: 'id',
      name: 'Bahasa Indonesia',
      nameEn: 'Indonesian',
      flag: '🇮🇩',
      gradient: ['#FF0000', '#FFFFFF'],
    },
    {
      id: 'hi-tk',
      code: 'hi',
      name: 'हिन्दी',
      nameEn: 'Hindi',
      flag: '🇮🇳',
      gradient: ['#FF9933', '#138808'],
    },
    {
      id: 'ar-tk',
      code: 'ar',
      name: 'العربية',
      nameEn: 'Arabic',
      flag: '🇸🇦',
      gradient: ['#006C35', '#FFFFFF'],
    },
    {
      id: 'fa-tk',
      code: 'fa',
      name: 'فارسی',
      nameEn: 'Persian',
      flag: '🇮🇷',
      gradient: ['#239F40', '#DA0000'],
    },
    {
      id: 'ms-tk',
      code: 'ms',
      name: 'Bahasa Melayu',
      nameEn: 'Malay',
      flag: '🇲🇾',
      gradient: ['#010066', '#CC0001'],
    },
    {
      id: 'ur-tk',
      code: 'ur',
      name: 'اردو',
      nameEn: 'Urdu',
      flag: '🇵🇰',
      gradient: ['#01411C', '#115740'],
    },
    {
      id: 'ps-tk',
      code: 'ps',
      name: 'پښتو',
      nameEn: 'Pashto',
      flag: '🏳️',
      gradient: ['#000000', '#D32011'],
    },
    {
      id: 'hy-tk',
      code: 'hy',
      name: 'Հայերեն',
      nameEn: 'Armenian',
      flag: '🇦🇲',
      gradient: ['#D90012', '#0033A0'],
    },
    {
      id: 'ka-tk',
      code: 'ka',
      name: 'ქართული',
      nameEn: 'Georgian',
      flag: '🇬🇪',
      gradient: ['#FFFFFF', '#FF0000'],
    },
  ];

  // Mark pairs as available or not
  const pairsWithAvailability = availablePairs.map(pair => ({
    ...pair,
    isAvailable: AVAILABLE_CODES.includes(pair.code),
  }));

  // Sort: available first, then unavailable
  const sortedPairs = [
    ...pairsWithAvailability.filter(p => p.isAvailable),
    ...pairsWithAvailability.filter(p => !p.isAvailable),
  ];

  const handleSelect = async (pair: LanguagePair) => {
    if (isLoading || !pair.isAvailable) return;

    setSelectedPair(pair.code);
    setIsLoading(true);

    try {
      // Save selection using ConfigContext
      await setSelectedLanguage(pair.code);

      // Navigate to HomeScreen after selection
      setTimeout(() => {
        navigation.navigate('HomeScreen');
      }, 300);
    } catch (error) {
      console.error('Failed to save language pair:', error);
      setIsLoading(false);
    }
  };

  // Get titles based on interface language
  const getTitle = () => {
    switch (config.mode) {
      case 'tk':
        return 'Gepleşik kitabynyň dilini saýlaň';
      case 'zh':
        return '选择会话手册语言';
      case 'ru':
        return 'Выберите язык разговорника';
      case 'tr':
        return 'Sözlük dilini seçin';
      case 'en':
        return 'Choose Phrasebook Language';
      default:
        return 'Choose Phrasebook Language';
    }
  };

  const getPairDescription = (pairCode: string): string => {
    // Имя языка на языке интерфейса (только для 4 доступных пар)
    const langNames: Record<string, Record<string, string>> = {
      tk: { zh: 'Hytaýça', ru: 'Rusça', en: 'Iňlisçe', tr: 'Türkçe' },
      ru: { zh: 'Китайский', ru: 'Русский', en: 'Английский', tr: 'Турецкий' },
      en: { zh: 'Chinese', ru: 'Russian', en: 'English', tr: 'Turkish' },
      zh: { zh: '中文', ru: '俄语', en: '英语', tr: '土耳其语' },
      tr: { zh: 'Çince', ru: 'Rusça', en: 'İngilizce', tr: 'Türkçe' },
    };
    const turkmenLabel: Record<string, string> = {
      tk: 'Türkmençe',
      ru: 'Туркменский',
      en: 'Turkmen',
      zh: '土库曼语',
      tr: 'Türkmence',
    };
    const interfaceLang = langNames[config.mode] ? config.mode : 'en';
    const name = langNames[interfaceLang][pairCode] || pairCode.toUpperCase();
    const tk = turkmenLabel[interfaceLang] || 'Turkmen';
    return `${name} - ${tk}`;
  };

  const getComingSoonLabel = (): string => {
    switch (config.mode) {
      case 'tk': return 'Ýakynda';
      case 'ru': return 'Скоро';
      case 'zh': return '即将推出';
      case 'tr': return 'Yakında';
      case 'en':
      default: return 'Coming Soon';
    }
  };

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: '#F8F9FA',
      flex: 1,
    },
    content: {
      padding: scale(24),
      paddingTop: verticalScale(60),
    },
    header: {
      alignItems: 'center',
      marginBottom: verticalScale(40),
    },
    icon: {
      fontSize: moderateScale(64),
      marginBottom: verticalScale(16),
    },
    infoCard: {
      backgroundColor: '#FFFFFF',
      borderColor: '#FF8008',
      borderRadius: scale(12),
      borderWidth: 1,
      elevation: 2,
      flexDirection: 'row',
      padding: scale(16),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    infoIcon: {
      fontSize: moderateScale(20),
      marginRight: scale(12),
    },
    infoText: {
      color: '#64748b',
      flex: 1,
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
    },
    pairArrow: {
      color: '#FF8008',
      fontSize: moderateScale(24),
      fontWeight: '700',
    },
    pairButton: {
      borderRadius: scale(16),
      elevation: 4,
      marginBottom: verticalScale(16),
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    pairButtonDisabled: {
      opacity: 0.6,
    },
    pairDescription: {
      color: '#64748b',
      fontSize: moderateScale(14),
    },
    pairDescriptionDisabled: {
      color: '#9CA3AF',
      fontStyle: 'italic',
    },
    pairFlag: {
      fontSize: moderateScale(40),
      marginRight: scale(16),
    },
    pairGradient: {
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      minHeight: verticalScale(100),
      padding: scale(20),
    },
    pairGradientDisabled: {
      backgroundColor: '#F3F4F6',
    },
    pairInfo: {
      flex: 1,
    },
    pairName: {
      color: '#1e293b',
      fontSize: moderateScale(22),
      fontWeight: '700',
      marginBottom: verticalScale(4),
    },
    pairNameDisabled: {
      color: '#9CA3AF',
    },
    pairSelected: {
      borderColor: '#FF8008',
      borderWidth: 3,
    },
    pairsContainer: {
      marginBottom: verticalScale(32),
    },
    subtitle: {
      color: '#666',
      fontSize: moderateScale(16),
      textAlign: 'center',
    },
    title: {
      color: '#000',
      fontSize: moderateScale(28),
      fontWeight: '700',
      marginBottom: verticalScale(8),
      textAlign: 'center',
    },
  }), [scale, verticalScale, moderateScale]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom + 20, 40) }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.icon}>📚</Text>
          <Text style={styles.title}>{getTitle()}</Text>
        </View>

        {/* Language Pairs */}
        <View style={styles.pairsContainer}>
          {sortedPairs.map((pair) => (
            <TouchableOpacity
              key={pair.id}
              onPress={() => handleSelect(pair)}
              activeOpacity={pair.isAvailable ? 0.8 : 1}
              disabled={!pair.isAvailable}
              style={[styles.pairButton, !pair.isAvailable && styles.pairButtonDisabled]}
            >
              <View
                style={[
                  styles.pairGradient,
                  selectedPair === pair.code && styles.pairSelected,
                  !pair.isAvailable && styles.pairGradientDisabled,
                ]}
              >
                {/* Flag */}
                <Text style={[styles.pairFlag, !pair.isAvailable && { opacity: 0.4 }]}>{pair.flag}</Text>

                {/* Names */}
                <View style={styles.pairInfo}>
                  <Text style={[styles.pairName, !pair.isAvailable && styles.pairNameDisabled]}>{pair.name}</Text>
                  <Text style={[styles.pairDescription, !pair.isAvailable && styles.pairDescriptionDisabled]}>
                    {pair.isAvailable ? getPairDescription(pair.code) : getComingSoonLabel()}
                  </Text>
                </View>

                {/* Arrow, Checkmark, or Lock */}
                <Text style={[styles.pairArrow, !pair.isAvailable && { opacity: 0.3 }]}>
                  {!pair.isAvailable ? '🔒' : selectedPair === pair.code ? '✓' : '→'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            {texts.languageChangeHint ?? 'You can change the language anytime in settings'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LanguagePairSelectionScreen;
