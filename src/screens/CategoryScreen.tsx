import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';
import { useSafeArea } from '../hooks/useSafeArea';

import { Colors } from '../constants/Colors';
import { usePhrases } from '../hooks/usePhrases';
import { getSubcategoriesByParentId } from '../data/categories';
import {
  PhraseWithTranslation,
  HomeStackParamList,
  RootStackParamList,
  SubCategory
} from '../types';
import { useFavorites } from '../hooks/useFavorites';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useConfig } from '../contexts/ConfigContext';
import { SubCategoriesGrid } from '../components/SubCategoryCard';

type CategoryScreenRouteProp = RouteProp<HomeStackParamList, 'CategoryScreen'>;
type CategoryScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

// Lingify-стиль: чистая строка фразы
const PhraseItem = React.memo<{
  phrase: PhraseWithTranslation;
  onPress: (phrase: PhraseWithTranslation) => void;
  config: any;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  isLast: boolean;
}>(({ phrase, onPress, config, isFavorite, toggleFavorite, isLast }) => {
  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(phrase.id);
  }, [phrase.id, toggleFavorite]);

  const handlePress = useCallback(() => {
    onPress(phrase);
  }, [phrase, onPress]);

  const handleCopy = useCallback(async () => {
    const textToCopy = `${phrase.turkmen}\n${phrase.translation.text}`;
    await Clipboard.setStringAsync(textToCopy);
    Alert.alert('✓', 'Скопировано', [{ text: 'OK' }], { cancelable: true });
  }, [phrase]);

  return (
    <>
      <TouchableOpacity style={styles.phraseRow} onPress={handlePress} activeOpacity={0.6}>
        {/* Turkmen line */}
        <View style={styles.textLine}>
          <Text style={styles.turkmenText} numberOfLines={2}>
            {phrase.turkmen}
          </Text>
        </View>

        {/* Translation line */}
        <View style={styles.textLine}>
          <Text style={styles.translationText} numberOfLines={2}>
            {phrase.translation.text}
          </Text>
        </View>

        {/* Transcription */}
        {phrase.translation.transcription && (
          <Text style={styles.transcriptionText} numberOfLines={1}>
            {phrase.translation.transcription}
          </Text>
        )}

        {/* Action buttons row */}
        <View style={styles.bottomActions}>
          <TouchableOpacity onPress={handleCopy} activeOpacity={0.6} style={styles.actionBtn}>
            <Ionicons name="copy-outline" size={moderateScale(14)} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleToggleFavorite} activeOpacity={0.6} style={styles.actionBtn}>
            <Ionicons
              name={isFavorite(phrase.id) ? 'heart' : 'heart-outline'}
              size={moderateScale(14)}
              color={isFavorite(phrase.id) ? '#EF4444' : '#9CA3AF'}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Divider */}
      {!isLast && <View style={styles.divider} />}
    </>
  );
});

export default function CategoryScreen() {
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation<CategoryScreenNavigationProp>();
  const { config } = useAppLanguage();
  const { selectedLanguage } = useConfig();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubCategory | null>(null);

  const { getPhrasesByCategory, getPhrasesBySubcategory } = usePhrases();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { bottom: safeAreaBottom } = useSafeArea();
  const { category } = route.params;

  const subcategories = useMemo(() => {
    return getSubcategoriesByParentId(category.id);
  }, [category.id]);

  const filteredPhrases = useMemo(() => {
    if (selectedSubcategory) {
      return getPhrasesBySubcategory(selectedSubcategory.id);
    }
    return getPhrasesByCategory(category.id);
  }, [category.id, selectedSubcategory, getPhrasesByCategory, getPhrasesBySubcategory]);

  const getPhrasesCountForSubcategory = useCallback((subcategoryId: string) => {
    return getPhrasesBySubcategory(subcategoryId).length;
  }, [getPhrasesBySubcategory]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelectedSubcategory(null);
  }, [category.id]);

  const handlePhrasePress = useCallback((phrase: PhraseWithTranslation) => {
    navigation.navigate('PhraseDetail', { phrase });
  }, [navigation]);

  const handleSubcategoryPress = useCallback((subcategory: SubCategory) => {
    setSelectedSubcategory(subcategory);
  }, []);

  const handleBackToCategory = useCallback(() => {
    setSelectedSubcategory(null);
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (selectedSubcategory) {
        handleBackToCategory();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [selectedSubcategory, handleBackToCategory]);

  const getCategoryNameByLanguage = (langCode: string): string => {
    const fieldName = `name${langCode.charAt(0).toUpperCase() + langCode.slice(1)}` as keyof typeof category;
    const name = category[fieldName];
    return (typeof name === 'string' ? name : category.nameEn);
  };

  const getSubcategoryNameByLanguage = (subcategory: SubCategory, langCode: string): string => {
    const fieldName = `name${langCode.charAt(0).toUpperCase() + langCode.slice(1)}` as keyof SubCategory;
    const name = subcategory[fieldName];
    return (typeof name === 'string' ? name : subcategory.nameEn);
  };

  const selectedSubcategoryName = selectedSubcategory
    ? getSubcategoryNameByLanguage(selectedSubcategory, config.mode)
    : null;

  const phrasesLabel =
    config.mode === 'tk' ? 'sözlem' :
    config.mode === 'zh' ? '短语' :
    config.mode === 'tr' ? 'ifade' :
    config.mode === 'en' ? 'phrases' :
    'фраз';

  const getLanguageFlag = (langCode: string): string => {
    const flagMap: { [key: string]: string } = {
      'tk': '🇹🇲', 'zh': '🇨🇳', 'ru': '🇷🇺', 'en': '🇬🇧',
      'ja': '🇯🇵', 'ko': '🇰🇷', 'th': '🇹🇭', 'vi': '🇻🇳',
      'id': '🇮🇩', 'ms': '🇲🇾', 'hi': '🇮🇳', 'ur': '🇵🇰',
      'fa': '🇮🇷', 'ps': '🇦🇫', 'de': '🇩🇪', 'fr': '🇫🇷',
      'es': '🇪🇸', 'it': '🇮🇹', 'tr': '🇹🇷', 'pl': '🇵🇱',
      'uk': '🇺🇦', 'pt': '🇵🇹', 'nl': '🇳🇱', 'uz': '🇺🇿',
      'kk': '🇰🇿', 'az': '🇦🇿', 'ky': '🇰🇬', 'tg': '🇹🇯',
      'hy': '🇦🇲', 'ka': '🇬🇪', 'ar': '🇸🇦',
    };
    return flagMap[langCode] || '🇬🇧';
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D8CFF" />
        <Text style={styles.loadingText}>
          {config.mode === 'tk' ? 'Ýüklenýär...' :
           config.mode === 'zh' ? '加载中...' : 'Загрузка...'}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header — clean Lingify style */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (selectedSubcategory) {
              handleBackToCategory();
            } else if (navigation.canGoBack()) {
              navigation.goBack();
            }
          }}
        >
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#1A1A1A" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerEmoji}>{category.icon}</Text>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {selectedSubcategoryName || getCategoryNameByLanguage(config.mode)}
            </Text>
          </View>
          <Text style={styles.headerSubtitle}>
            🇹🇲 → {getLanguageFlag(selectedLanguage)} · {filteredPhrases.length} {phrasesLabel}
          </Text>
        </View>

        {selectedSubcategory ? (
          <TouchableOpacity style={styles.backToCategoryButton} onPress={handleBackToCategory}>
            <Ionicons name="grid-outline" size={moderateScale(22)} color="#6B7280" />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerRightPlaceholder} />
        )}
      </View>

      <FlatList
        data={filteredPhrases}
        renderItem={({ item, index }) => (
          <PhraseItem
            phrase={item}
            onPress={handlePhrasePress}
            config={config}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            isLast={index === filteredPhrases.length - 1}
          />
        )}
        keyExtractor={(item) => item.id}
        style={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        windowSize={10}
        maxToRenderPerBatch={10}
        removeClippedSubviews={true}
        initialNumToRender={15}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            {subcategories.length > 0 && !selectedSubcategory && (
              <View style={styles.subcategoriesSection}>
                <Text style={styles.sectionTitle}>
                  {config.mode === 'tk' ? 'Bölümler' :
                   config.mode === 'zh' ? '分类' : 'Разделы'}
                </Text>
                <SubCategoriesGrid
                  subcategories={subcategories}
                  onSubcategoryPress={handleSubcategoryPress}
                  getPhrasesCount={getPhrasesCountForSubcategory}
                />
              </View>
            )}
            {filteredPhrases.length > 0 && subcategories.length > 0 && !selectedSubcategory && (
              <Text style={styles.sectionTitle}>
                {config.mode === 'tk' ? 'Ähli sözlemler' :
                 config.mode === 'zh' ? '所有短语' : 'Все фразы'}
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={moderateScale(48)} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>
              {config.mode === 'tk' ? 'Sözlem tapylmady' :
               config.mode === 'zh' ? '未找到短语' : 'Фразы не найдены'}
            </Text>
            <Text style={styles.emptyText}>
              {selectedSubcategory
                ? (config.mode === 'tk' ? 'Bu bölümde heniz sözlem ýok' :
                   config.mode === 'zh' ? '此分类中暂无短语' : 'В этой подкатегории пока нет фраз')
                : (config.mode === 'tk' ? 'Bu kategoriýada heniz sözlem ýok' :
                   config.mode === 'zh' ? '此分类中暂无短语' : 'В этой категории пока нет фраз')
              }
            </Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: Math.max(safeAreaBottom, verticalScale(20)) }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },

  loadingContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
  },

  loadingText: {
    color: '#6B7280',
    fontSize: moderateScale(15),
    marginTop: verticalScale(12),
  },

  // Header — clean, no shadow
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingBottom: verticalScale(12),
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
  },

  backButton: {
    alignItems: 'center',
    height: verticalScale(40),
    justifyContent: 'center',
    width: scale(40),
  },

  headerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(8),
    justifyContent: 'center',
  },

  headerRightPlaceholder: {
    width: scale(40),
  },

  headerEmoji: {
    fontSize: moderateScale(20),
  },

  headerTitle: {
    color: '#1A1A1A',
    fontSize: moderateScale(18),
    fontWeight: '600',
    textAlign: 'center',
  },

  headerSubtitle: {
    color: '#6B7280',
    fontSize: moderateScale(13),
    marginTop: verticalScale(2),
    textAlign: 'center',
  },

  backToCategoryButton: {
    padding: scale(8),
  },

  content: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
  },

  // Phrase row — Lingify dictionary style
  phraseRow: {
    paddingVertical: verticalScale(14),
  },

  textLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(2),
  },

  turkmenText: {
    fontSize: moderateScale(17),
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
    lineHeight: moderateScale(22),
    marginRight: scale(8),
  },

  translationText: {
    fontSize: moderateScale(15),
    fontWeight: '400',
    color: '#374151',
    flex: 1,
    lineHeight: moderateScale(20),
    marginRight: scale(8),
  },

  transcriptionText: {
    fontSize: moderateScale(13),
    fontStyle: 'italic',
    color: '#9CA3AF',
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(2),
  },

  bottomActions: {
    flexDirection: 'row',
    gap: scale(12),
    marginTop: verticalScale(6),
  },

  actionBtn: {
    padding: scale(4),
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },

  // Subcategories
  subcategoriesSection: {
    paddingVertical: verticalScale(12),
  },

  sectionTitle: {
    color: '#1A1A1A',
    fontSize: moderateScale(17),
    fontWeight: '600',
    marginBottom: verticalScale(12),
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: verticalScale(60),
  },

  emptyTitle: {
    color: '#6B7280',
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginTop: verticalScale(16),
  },

  emptyText: {
    color: '#9CA3AF',
    fontSize: moderateScale(14),
    marginTop: verticalScale(8),
    textAlign: 'center',
  },
});
