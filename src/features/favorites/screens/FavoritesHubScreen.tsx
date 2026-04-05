// src/features/favorites/screens/FavoritesHubScreen.tsx — Lingify style
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useSafeArea } from '../../../hooks/useSafeArea';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';
import { FavoritesService } from '../services/FavoritesService';
import { FavoriteTab, FavoriteTranslation } from '../types/favorites.types';
import { usePhrases } from '../../../hooks/usePhrases';
import { useAppLanguage } from '../../../contexts/LanguageContext';
import { PhraseWithTranslation } from '../../../types';
import { categories } from '../../../data/categories';
import { TextTranslationResult } from '../../text-translator/types/text-translator.types';

export default function FavoritesHubScreen() {
  const navigation = useNavigation<any>();
  const { phrases } = usePhrases();
  const { config } = useAppLanguage();
  const { bottom: safeAreaBottom } = useSafeArea();

  const [activeTab, setActiveTab] = useState<FavoriteTab>('phrases');
  const [isLoading, setIsLoading] = useState(true);

  const [favoritePhrases, setFavoritePhrases] = useState<PhraseWithTranslation[]>([]);
  const [favoriteTranslations, setFavoriteTranslations] = useState<FavoriteTranslation[]>([]);
  const [favoriteWords, setFavoriteWords] = useState<any[]>([]);

  useEffect(() => {
    initializeFavorites();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadFavoritesData();
    }, [phrases])
  );

  const initializeFavorites = async () => {
    setIsLoading(true);
    await FavoritesService.initialize();
    await loadFavoritesData();
    setIsLoading(false);
  };

  const loadFavoritesData = async () => {
    const phrasesData = FavoritesService.getFavoritePhrases(phrases);
    setFavoritePhrases(phrasesData);
    const translationsData = FavoritesService.getFavoriteTranslations();
    setFavoriteTranslations(translationsData);
    const wordsData = FavoritesService.getFavoriteWords();
    setFavoriteWords(wordsData);
  };

  const getText = (tk: string, zh: string, ru: string, en: string) => {
    return config.mode === 'tk' ? tk :
           config.mode === 'zh' ? zh :
           config.mode === 'en' ? en : ru;
  };

  const tabs: Array<{
    key: FavoriteTab;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    count: number;
  }> = [
    {
      key: 'phrases',
      title: getText('Sözlemler', '短语', 'Фразы', 'Phrases'),
      icon: 'book-outline',
      count: favoritePhrases.length,
    },
    {
      key: 'translations',
      title: getText('Terjimeler', '翻译', 'Переводы', 'Translations'),
      icon: 'language-outline',
      count: favoriteTranslations.length,
    },
    {
      key: 'words',
      title: getText('Sözler', '单词', 'Слова', 'Words'),
      icon: 'text-outline',
      count: favoriteWords.length,
    },
  ];

  const renderPhraseItem = ({ item, index }: { item: PhraseWithTranslation; index: number }) => {
    const category = categories.find(cat => cat.id === item.categoryId);
    const categoryName = category ? (
      config.mode === 'tk' ? category.nameTk :
      config.mode === 'zh' ? category.nameZh :
      category.nameRu
    ) : '';

    return (
      <>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('PhraseDetail', { phrase: item })}
          activeOpacity={0.6}
        >
          <View style={styles.rowContent}>
            <Text style={styles.primaryText} numberOfLines={1}>{item.translation.text}</Text>
            {item.translation.transcription && (
              <Text style={styles.transcription} numberOfLines={1}>{item.translation.transcription}</Text>
            )}
            <Text style={styles.secondaryText} numberOfLines={1}>{item.turkmen}</Text>
            {categoryName ? (
              <View style={styles.categoryRow}>
                {category && <Text style={styles.categoryIcon}>{category.icon}</Text>}
                <Text style={styles.categoryLabel}>{categoryName}</Text>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.heartButton}
            onPress={async () => {
              await FavoritesService.removePhrase(item.id);
              loadFavoritesData();
            }}
          >
            <Ionicons name="heart" size={moderateScale(22)} color="#EF4444" />
          </TouchableOpacity>
        </TouchableOpacity>
        {index < favoritePhrases.length - 1 && <View style={styles.divider} />}
      </>
    );
  };

  const renderTranslationItem = ({ item, index }: { item: FavoriteTranslation; index: number }) => {
    const data = item.data as TextTranslationResult;
    const isTextTranslation = item.translationType === 'text';

    return (
      <>
        <TouchableOpacity style={styles.row} activeOpacity={0.6}>
          <View style={styles.rowContent}>
            <View style={styles.typeBadge}>
              <Ionicons
                name={isTextTranslation ? 'text-outline' : 'camera-outline'}
                size={moderateScale(12)}
                color="#FFFFFF"
              />
              <Text style={styles.typeBadgeText}>
                {isTextTranslation ? 'Text' : 'Visual'}
              </Text>
            </View>
            <Text style={styles.primaryText} numberOfLines={2}>
              {data.originalText || 'N/A'}
            </Text>
            <Text style={styles.secondaryText} numberOfLines={2}>
              {data.translatedText || 'N/A'}
            </Text>
            <Text style={styles.dateText}>
              {new Date(data.timestamp).toLocaleDateString()}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.heartButton}
            onPress={async () => {
              await FavoritesService.removeTranslation(item.id);
              loadFavoritesData();
            }}
          >
            <Ionicons name="heart" size={moderateScale(22)} color="#EF4444" />
          </TouchableOpacity>
        </TouchableOpacity>
        {index < favoriteTranslations.length - 1 && <View style={styles.divider} />}
      </>
    );
  };

  const renderEmpty = (message: string) => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={moderateScale(56)} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>
        {getText('Heniz element ýok', '暂无内容', 'Пока пусто', 'Nothing here yet')}
      </Text>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );

  const renderWordsTab = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="book-outline" size={moderateScale(56)} color="#D1D5DB" />
      <Text style={styles.emptyTitle}>
        {getText('Sözlük häzire taýýar däl', '词典功能即将推出', 'Словарь скоро появится', 'Dictionary Coming Soon')}
      </Text>
      <Text style={styles.emptyText}>
        {getText(
          'Sözlük funksiýasy v2.0-da goşular',
          '词典功能将在v2.0版本中推出',
          'Функция словаря появится в версии 2.0',
          'Dictionary feature will be available in v2.0'
        )}
      </Text>
    </View>
  );

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {getText('Ýüklenýär...', '加载中...', 'Загрузка...', 'Loading...')}
          </Text>
        </View>
      );
    }

    switch (activeTab) {
      case 'phrases':
        return favoritePhrases.length === 0 ? (
          renderEmpty(getText(
            'Halanýan sözlem goşuň',
            '添加收藏的短语',
            'Добавьте фразы в избранное',
            'Add favorite phrases'
          ))
        ) : (
          <FlatList
            data={favoritePhrases}
            renderItem={renderPhraseItem}
            keyExtractor={item => item.id}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: Math.max(safeAreaBottom, verticalScale(24)) },
            ]}
            showsVerticalScrollIndicator={false}
          />
        );

      case 'translations':
        return favoriteTranslations.length === 0 ? (
          renderEmpty(getText(
            'Halanýan terjime goşuň',
            '添加收藏的翻译',
            'Добавьте переводы в избранное',
            'Add favorite translations'
          ))
        ) : (
          <FlatList
            data={favoriteTranslations}
            renderItem={renderTranslationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: Math.max(safeAreaBottom, verticalScale(24)) },
            ]}
            showsVerticalScrollIndicator={false}
          />
        );

      case 'words':
        return renderWordsTab();

      default:
        return null;
    }
  };

  const totalCount = favoritePhrases.length + favoriteTranslations.length + favoriteWords.length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <SafeAreaView edges={['top']} style={styles.headerArea}>
        {/* Header */}
        <View style={styles.header}>
          {navigation.canGoBack() && (
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={moderateScale(24)} color="#1A1A1A" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {getText('Halanýanlar', '收藏', 'Избранное', 'Favorites')}
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Subtitle */}
        <Text style={styles.headerSubtitle}>
          {getText(
            `Jemi ${totalCount} element`,
            `共 ${totalCount} 个收藏`,
            `Всего ${totalCount} элементов`,
            `${totalCount} items total`
          )}
        </Text>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.activeTab]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={tab.icon}
                  size={moderateScale(16)}
                  color={isActive ? '#2D8CFF' : '#9CA3AF'}
                />
                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                  {tab.title}
                </Text>
                {tab.count > 0 && (
                  <View style={[styles.tabBadge, isActive && styles.activeTabBadge]}>
                    <Text style={[styles.tabBadgeText, isActive && styles.activeTabBadgeText]}>
                      {tab.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>

      {/* Content */}
      <View style={styles.contentContainer}>
        {renderTabContent()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },

  headerArea: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
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

  headerSubtitle: {
    color: '#6B7280',
    fontSize: moderateScale(13),
    paddingBottom: verticalScale(12),
    paddingHorizontal: scale(20),
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    gap: scale(6),
    paddingBottom: verticalScale(12),
    paddingHorizontal: scale(16),
  },

  tab: {
    alignItems: 'center',
    borderColor: '#E5E7EB',
    borderRadius: scale(10),
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: scale(5),
    justifyContent: 'center',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(10),
  },

  activeTab: {
    backgroundColor: '#F0F7FF',
    borderColor: '#2D8CFF',
  },

  tabText: {
    color: '#9CA3AF',
    fontSize: moderateScale(12),
    fontWeight: '600',
  },

  activeTabText: {
    color: '#2D8CFF',
  },

  tabBadge: {
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: scale(8),
    justifyContent: 'center',
    minWidth: scale(20),
    paddingHorizontal: scale(5),
    paddingVertical: verticalScale(1),
  },

  activeTabBadge: {
    backgroundColor: '#2D8CFF',
  },

  tabBadgeText: {
    color: '#6B7280',
    fontSize: moderateScale(10),
    fontWeight: '700',
  },

  activeTabBadgeText: {
    color: '#FFFFFF',
  },

  // Content
  contentContainer: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
  },

  // Row items
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(12),
    paddingVertical: verticalScale(14),
  },

  rowContent: {
    flex: 1,
  },

  primaryText: {
    color: '#1A1A1A',
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },

  transcription: {
    color: '#6B7280',
    fontSize: moderateScale(13),
    fontStyle: 'italic',
    marginBottom: verticalScale(2),
  },

  secondaryText: {
    color: '#6B7280',
    fontSize: moderateScale(14),
  },

  categoryRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(4),
    marginTop: verticalScale(4),
  },

  categoryIcon: {
    fontSize: moderateScale(12),
  },

  categoryLabel: {
    color: '#9CA3AF',
    fontSize: moderateScale(12),
  },

  heartButton: {
    alignItems: 'center',
    height: scale(40),
    justifyContent: 'center',
    width: scale(40),
  },

  divider: {
    backgroundColor: '#E5E7EB',
    height: 1,
  },

  // Type badge (for translations)
  typeBadge: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#2D8CFF',
    borderRadius: scale(8),
    flexDirection: 'row',
    gap: scale(4),
    marginBottom: verticalScale(6),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
  },

  typeBadgeText: {
    color: '#FFFFFF',
    fontSize: moderateScale(11),
    fontWeight: '600',
  },

  dateText: {
    color: '#9CA3AF',
    fontSize: moderateScale(11),
    marginTop: verticalScale(4),
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: verticalScale(300),
    padding: scale(40),
  },

  emptyTitle: {
    color: '#1A1A1A',
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: verticalScale(6),
    marginTop: verticalScale(16),
    textAlign: 'center',
  },

  emptyText: {
    color: '#6B7280',
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
});
