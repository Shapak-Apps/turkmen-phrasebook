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
import { useAudio } from '../hooks/useAudio';
import { SubCategoriesGrid } from '../components/SubCategoryCard';

type CategoryScreenRouteProp = RouteProp<HomeStackParamList, 'CategoryScreen'>;
type CategoryScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

const getAudioLanguage = (langCode: string): string => {
  const languageMap: { [key: string]: string } = {
    'tk': 'turkmen', 'zh': 'chinese', 'ru': 'russian', 'en': 'english',
    'ja': 'japanese', 'ko': 'korean', 'th': 'thai', 'vi': 'vietnamese',
    'id': 'indonesian', 'ms': 'malay', 'hi': 'hindi', 'ur': 'urdu',
    'fa': 'persian', 'ps': 'pashto', 'de': 'german', 'fr': 'french',
    'es': 'spanish', 'it': 'italian', 'tr': 'turkish', 'pl': 'polish',
    'uk': 'ukrainian', 'pt': 'portuguese', 'nl': 'dutch', 'uz': 'uzbek',
    'kk': 'kazakh', 'az': 'azerbaijani', 'ky': 'kyrgyz', 'tg': 'tajik',
    'hy': 'armenian', 'ka': 'georgian', 'ar': 'arabic',
  };
  return languageMap[langCode] || 'english';
};

// Lingify-стиль: чистая строка фразы
const PhraseItem = React.memo<{
  phrase: PhraseWithTranslation;
  onPress: (phrase: PhraseWithTranslation) => void;
  config: any;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
  onPlayAudio: (phraseId: string, type: 'translation' | 'turkmen', text: string, language: string, audioPath?: string) => void;
  playingPhraseId: string | null;
  playingType: 'translation' | 'turkmen' | null;
  audioIsPlaying: boolean;
  audioIsLoading: boolean;
  isLast: boolean;
}>(({ phrase, onPress, config, isFavorite, toggleFavorite, onPlayAudio, playingPhraseId, playingType, audioIsPlaying, audioIsLoading, isLast }) => {
  const isThisPlaying = playingPhraseId === phrase.id;
  const thisIsLoading = isThisPlaying && audioIsLoading;
  const thisIsPlaying = isThisPlaying && audioIsPlaying;

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(phrase.id);
  }, [phrase.id, toggleFavorite]);

  const handlePress = useCallback(() => {
    onPress(phrase);
  }, [phrase, onPress]);

  const handlePlayTranslation = useCallback(() => {
    onPlayAudio(phrase.id, 'translation', phrase.translation.text, phrase.translation.text, undefined);
  }, [phrase.id, phrase.translation.text, onPlayAudio]);

  const handlePlayTurkmen = useCallback(() => {
    onPlayAudio(phrase.id, 'turkmen', phrase.turkmen, 'turkmen', phrase.audioFileTurkmen);
  }, [phrase.id, phrase.turkmen, phrase.audioFileTurkmen, onPlayAudio]);

  const handleCopy = useCallback(async () => {
    const textToCopy = `${phrase.turkmen}\n${phrase.translation.text}`;
    await Clipboard.setStringAsync(textToCopy);
    Alert.alert('✓', 'Скопировано', [{ text: 'OK' }], { cancelable: true });
  }, [phrase]);

  return (
    <>
      <TouchableOpacity style={styles.phraseRow} onPress={handlePress} activeOpacity={0.6}>
        {/* Turkmen line: text + audio */}
        <View style={styles.textLine}>
          <Text style={styles.turkmenText} numberOfLines={2}>
            {phrase.turkmen}
          </Text>
          <TouchableOpacity
            style={styles.inlineAudioBtn}
            onPress={handlePlayTurkmen}
            activeOpacity={0.6}
            disabled={audioIsLoading}
          >
            {thisIsLoading && playingType === 'turkmen' ? (
              <ActivityIndicator size="small" color="#2D8CFF" />
            ) : (
              <Ionicons
                name={thisIsPlaying && playingType === 'turkmen' ? 'pause-circle' : 'volume-medium-outline'}
                size={moderateScale(18)}
                color="#2D8CFF"
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Translation line: text + audio */}
        <View style={styles.textLine}>
          <Text style={styles.translationText} numberOfLines={2}>
            {phrase.translation.text}
          </Text>
          <TouchableOpacity
            style={styles.inlineAudioBtn}
            onPress={handlePlayTranslation}
            activeOpacity={0.6}
            disabled={audioIsLoading}
          >
            {thisIsLoading && playingType === 'translation' ? (
              <ActivityIndicator size="small" color="#6B7280" />
            ) : (
              <Ionicons
                name={thisIsPlaying && playingType === 'translation' ? 'pause-circle' : 'volume-medium-outline'}
                size={moderateScale(16)}
                color="#6B7280"
              />
            )}
          </TouchableOpacity>
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
  const [playingPhraseId, setPlayingPhraseId] = useState<string | null>(null);
  const [playingType, setPlayingType] = useState<'translation' | 'turkmen' | null>(null);

  const { getPhrasesByCategory, getPhrasesBySubcategory } = usePhrases();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { playAudio, isPlaying: audioIsPlaying, isLoading: audioIsLoading } = useAudio();
  const { bottom: safeAreaBottom } = useSafeArea();
  const { category } = route.params;

  // Reset playing state when audio stops
  useEffect(() => {
    if (!audioIsPlaying && !audioIsLoading) {
      setPlayingPhraseId(null);
      setPlayingType(null);
    }
  }, [audioIsPlaying, audioIsLoading]);

  const handlePlayAudio = useCallback((phraseId: string, type: 'translation' | 'turkmen', text: string, language: string, audioPath?: string) => {
    setPlayingPhraseId(phraseId);
    setPlayingType(type);
    if (type === 'turkmen') {
      playAudio(text, 'turkmen', audioPath);
    } else {
      playAudio(text, getAudioLanguage(selectedLanguage));
    }
  }, [playAudio, selectedLanguage]);

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
    ? getSubcategoryNameByLanguage(selectedSubcategory, selectedLanguage)
    : null;

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
              {selectedSubcategoryName || getCategoryNameByLanguage(selectedLanguage)}
            </Text>
          </View>
          <Text style={styles.headerSubtitle}>
            {getLanguageFlag(selectedLanguage)} ↔ 🇹🇲 · {filteredPhrases.length} phrases
          </Text>
        </View>

        {selectedSubcategory && (
          <TouchableOpacity style={styles.backToCategoryButton} onPress={handleBackToCategory}>
            <Ionicons name="grid-outline" size={moderateScale(22)} color="#6B7280" />
          </TouchableOpacity>
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
            onPlayAudio={handlePlayAudio}
            playingPhraseId={playingPhraseId}
            playingType={playingType}
            audioIsPlaying={audioIsPlaying}
            audioIsLoading={audioIsLoading}
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
    marginLeft: scale(8),
  },

  headerTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(8),
  },

  headerEmoji: {
    fontSize: moderateScale(20),
  },

  headerTitle: {
    color: '#1A1A1A',
    fontSize: moderateScale(18),
    fontWeight: '600',
    flex: 1,
  },

  headerSubtitle: {
    color: '#6B7280',
    fontSize: moderateScale(13),
    marginTop: verticalScale(2),
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

  inlineAudioBtn: {
    padding: scale(4),
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
