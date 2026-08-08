// src/screens/PhraseDetailScreen.tsx
// Updated for multilingual system with PhraseWithTranslation

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';
import { useSafeArea } from '../hooks/useSafeArea';

// Import types and data
import { RootStackParamList } from '../types';
import { Colors } from '../constants/Colors';
import { categories } from '../data/categories';
import { useHistory } from '../hooks/useHistory';
import { useFavorites } from '../hooks/useFavorites';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useConfig } from '../contexts/ConfigContext';
import { getTranslationsForLanguage } from '../data/languages';

type PhraseDetailScreenRouteProp = RouteProp<RootStackParamList, 'PhraseDetail'>;

export default function PhraseDetailScreen() {
  const route = useRoute<PhraseDetailScreenRouteProp>();
  const navigation = useNavigation();
  const { phrase } = route.params;

  // Hooks
  const { addToHistory } = useHistory();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { getTexts, config: appConfig, getPhraseTexts } = useAppLanguage();
  const { selectedLanguage } = useConfig();

  // Safe Area для bottom padding (home indicator)
  const { bottom: safeAreaBottom } = useSafeArea();

  const texts = getTexts();

  // Add phrase to history when screen opens
  useEffect(() => {
    addToHistory(phrase.id);
  }, [phrase.id, addToHistory]);

  // ✅ ИСПРАВЛЕНО: Получаем перевод для ТЕКУЩЕГО выбранного языка
  const currentLanguageTranslation = phrase.translation; // Уже содержит перевод для выбранного языка

  // Find category
  const category = categories.find(cat => cat.id === phrase.categoryId);

  const handleToggleFavorite = () => {
    const wasInFavorites = isFavorite(phrase.id);
    toggleFavorite(phrase.id);

    const message = wasInFavorites
      ? (appConfig.mode === 'tk' ? 'Halanýanlardan aýryldy' : appConfig.mode === 'zh' ? '已从收藏中移除' : 'Удалено из избранного')
      : (appConfig.mode === 'tk' ? 'Halanýanlara goşuldy' : appConfig.mode === 'zh' ? '已添加到收藏' : 'Добавлено в избранное');

    const icon = wasInFavorites ? '💔' : '❤️';

    Alert.alert(icon + ' ' + texts.favorites, message);
  };

  const handleShare = () => {
    Alert.alert(
      '📤 ' + texts.share,
      appConfig.mode === 'tk' ? 'Bu funksiýa öňe gidişlikde!' :
        appConfig.mode === 'zh' ? '此功能正在开发中！' : 'Функция в разработке!'
    );
  };

  // ✅ УНИВЕРСАЛЬНАЯ логика для всех 31 языков
  const mainText = currentLanguageTranslation.text;
  const transcription = currentLanguageTranslation.transcription || '';

  // Get language label with flag
  const getLanguageLabel = (): string => {
    const labelMap: { [key: string]: string } = {
      'tk': '🇹🇲 Türkmençe', 'zh': '🇨🇳 中文', 'ru': '🇷🇺 Русский', 'en': '🇬🇧 English',
      'ja': '🇯🇵 日本語', 'ko': '🇰🇷 한국어', 'th': '🇹🇭 ไทย', 'vi': '🇻🇳 Tiếng Việt',
      'id': '🇮🇩 Bahasa Indonesia', 'ms': '🇲🇾 Bahasa Melayu', 'hi': '🇮🇳 हिन्दी',
      'ur': '🇵🇰 اردو', 'fa': '🇮🇷 فارسی', 'ps': '🇦🇫 پښتو', 'de': '🇩🇪 Deutsch',
      'fr': '🇫🇷 Français', 'es': '🇪🇸 Español', 'it': '🇮🇹 Italiano', 'tr': '🇹🇷 Türkçe',
      'pl': '🇵🇱 Polski', 'uk': '🇺🇦 Українська', 'pt': '🇵🇹 Português', 'nl': '🇳🇱 Nederlands',
      'uz': '🇺🇿 Oʻzbekcha', 'kk': '🇰🇿 Қазақша', 'az': '🇦🇿 Azərbaycan', 'ky': '🇰🇬 Кыргызча',
      'tg': '🇹🇯 Тоҷикӣ', 'hy': '🇦🇲 Հայերեն', 'ka': '🇬🇪 ქართული', 'ar': '🇸🇦 العربية',
    };
    return labelMap[selectedLanguage] || '🇬🇧 English';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button + Category Badge (Вариант 4) */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#111827" />
        </TouchableOpacity>

        {/* Category Badge Only */}
        <View style={styles.headerCenter}>
          {category && (
            <View style={styles.categoryBadgeHeader}>
              <Text style={styles.categoryIconHeader}>{category.icon}</Text>
              <Text style={styles.categoryNameHeader}>
                {appConfig.mode === 'tk' ? category.nameTk :
                  appConfig.mode === 'zh' ? category.nameZh :
                    category.nameRu}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(safeAreaBottom, verticalScale(20)) }}
      >

        {/* Phrase card */}
        <View style={styles.phraseCard}>
          {/* ✅ ЯЗЫКОВАЯ ПАРА - только выбранный язык + туркменский */}
          <View style={styles.mainContent}>
            {/* Выбранный язык - ГЛАВНЫЙ */}
            <Text style={styles.languageLabel}>{getLanguageLabel()}</Text>
            <Text style={styles.mainText}>{mainText}</Text>
            {transcription ? (
              <Text style={styles.transcriptionText}>{transcription}</Text>
            ) : null}
          </View>

          {/* Туркменский - ВТОРИЧНЫЙ */}
          <View style={styles.secondaryContent}>
            <Text style={styles.languageLabelSecondary}>🇹🇲 Türkmençe</Text>
            <Text style={styles.secondaryText}>{phrase.turkmen}</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.actionsContainer}>
          {/* Favorite button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.favoriteButton]}
            onPress={handleToggleFavorite}
          >
            <Ionicons
              name={isFavorite(phrase.id) ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite(phrase.id) ? Colors.error : Colors.textLight}
            />
            <Text style={[
              styles.actionButtonText,
              isFavorite(phrase.id) && styles.favoriteButtonTextActive
            ]}>
              {isFavorite(phrase.id) ? texts.inFavorites : texts.addToFavorites}
            </Text>
          </TouchableOpacity>

          {/* Share button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={24} color={Colors.textLight} />
            <Text style={styles.actionButtonText}>{texts.share}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundLight,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: scale(16),
  },
  // ✅ МИНИМАЛИЗМ (Phase 12)
  phraseCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: scale(16),          // ✅ Меньше скругление
    padding: scale(20),               // ✅ Меньше padding
    marginBottom: verticalScale(16),  // ✅ Компактнее
    elevation: 3,                     // ✅ Subtle тень
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: verticalScale(2),
    },
    shadowOpacity: 0.08,              // ✅ Очень subtle тень
    shadowRadius: scale(8),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: scale(10),     // ✅ МИНИМАЛИЗМ - немного меньше
    paddingVertical: verticalScale(5),
    borderRadius: scale(8),           // ✅ МИНИМАЛИЗМ - меньше скругление (Notion style)
    marginBottom: verticalScale(16),  // ✅ Компактнее
    backgroundColor: '#F3F4F6',       // ✅ МИНИМАЛИЗМ - светло-серый фон (Notion)
    borderWidth: 1,                   // ✅ Тонкий border
    borderColor: '#E5E7EB',           // ✅ Серый border
  },
  categoryIcon: {
    fontSize: moderateScale(14),      // ✅ Немного меньше
    marginRight: scale(6),
  },
  categoryName: {
    color: '#374151',                 // ✅ МИНИМАЛИЗМ - темно-серый текст
    fontWeight: '500',                // ✅ Меньше жирность
    fontSize: moderateScale(13),      // ✅ Немного меньше
  },
  mainContent: {
    alignItems: 'center',
    marginBottom: verticalScale(20),          // ✅ МИНИМАЛИЗМ - меньше отступ
    paddingBottom: verticalScale(16),
    borderBottomWidth: 1,                     // ✅ Тоньше линия
    borderBottomColor: '#E5E7EB',
  },
  languageLabel: {
    fontSize: moderateScale(13),              // ✅ Меньше
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  mainText: {
    fontSize: moderateScale(28),              // ✅ МИНИМАЛИЗМ - уменьшен с 54
    fontWeight: '700',
    color: '#1F2937',          // ✅ Темно-серый вместо синего
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  transcriptionText: {
    fontSize: moderateScale(16),              // ✅ МИНИМАЛИЗМ - уменьшен
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // ✅ МИНИМАЛИЗМ - туркменский
  secondaryContent: {
    alignItems: 'center',
    marginTop: verticalScale(8),
  },
  languageLabelSecondary: {
    fontSize: moderateScale(13),              // ✅ Меньше
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: verticalScale(8),
  },
  secondaryText: {
    fontSize: moderateScale(20),              // ✅ МИНИМАЛИЗМ - уменьшен с 32
    fontWeight: '600',
    color: '#4B5563',          // ✅ Темно-серый вместо зеленого
    textAlign: 'center',
  },
  // ✅ МИНИМАЛИЗМ - контейнер для аудио кнопок
  actionsContainer: {
    gap: verticalScale(8),
    marginBottom: verticalScale(16),
  },
  // ✅ МИНИМАЛИЗМ - кнопки действий
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(12),         // ✅ Меньше padding
    paddingHorizontal: scale(16),       // ✅ Меньше padding
    borderRadius: scale(12),            // ✅ Меньше скругление
    gap: scale(8),
    elevation: 1,                       // ✅ Минимальная тень
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(1) },
    shadowOpacity: 0.05,                // ✅ Очень subtle
    shadowRadius: scale(2),
  },
  favoriteButton: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1.5,            // ✅ МИНИМАЛИЗМ - тоньше border
    borderColor: '#D1D5DB',
  },
  shareButton: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1.5,            // ✅ МИНИМАЛИЗМ - тоньше border
    borderColor: '#D1D5DB',
  },
  actionButtonText: {
    color: '#374151',            // ✅ Темно-серый
    fontSize: moderateScale(15), // ✅ МИНИМАЛИЗМ - меньше
    fontWeight: '600',
  },
  favoriteButtonTextActive: {
    color: Colors.error,
    fontWeight: '700',
  },
  // Header with back button
  header: {
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: scale(20),
    elevation: 3,
    height: scale(40),
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: scale(40),
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: scale(8),
    justifyContent: 'center',
  },
  categoryBadgeHeader: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    borderRadius: scale(6),
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
  },
  categoryIconHeader: {
    fontSize: moderateScale(12),
    marginRight: scale(4),
  },
  categoryNameHeader: {
    color: '#374151',
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  headerDivider: {
    color: '#9CA3AF',
    fontSize: moderateScale(16),
    fontWeight: '300',
  },
  headerTitle: {
    color: Colors.text,
    fontSize: moderateScale(15),
    fontWeight: '600',
  },
  placeholder: {
    width: scale(40),
  },
});
