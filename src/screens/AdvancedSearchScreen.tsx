// src/screens/AdvancedSearchScreen.tsx — Lingify style
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { PhraseWithTranslation, RootStackParamList } from '../types';
import { useAppLanguage, AppLanguageMode } from '../contexts/LanguageContext';
import { useAdvancedSearch } from '../hooks/useAdvancedSearch';
import { categories } from '../data/categories';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';

// Highlighted text component
const HighlightedText: React.FC<{ text: string; highlight: string; style?: any }> = ({
  text,
  highlight,
  style,
}) => {
  if (!highlight.trim()) {
    return <Text style={style}>{text}</Text>;
  }
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <Text style={style}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <Text key={index} style={{ backgroundColor: '#2D8CFF30', color: '#2D8CFF', fontWeight: '700' }}>
            {part}
          </Text>
        ) : (
          <Text key={index}>{part}</Text>
        )
      )}
    </Text>
  );
};

type SearchScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PhraseDetail'>;

export default function AdvancedSearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const { config } = useAppLanguage();

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestions,
    isSearching,
    performSearch,
    clearSearch,
  } = useAdvancedSearch();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  type TextKey = 'searchPlaceholder' | 'noResults' | 'noResultsSub' | 'startSearch' | 'startSearchSub';

  const getText = useCallback((key: TextKey) => {
    const texts: Partial<Record<AppLanguageMode, Record<TextKey, string>>> = {
      tk: {
        searchPlaceholder: 'Gözleg...',
        noResults: 'Netije tapylmady',
        noResultsSub: 'Gözleg sözüni üýtgediň',
        startSearch: 'Gözleg sözlemini giriziň',
        startSearchSub: 'Zerur sözlemi tapyň',
      },
      zh: {
        searchPlaceholder: '搜索...',
        noResults: '未找到结果',
        noResultsSub: '尝试更改查询',
        startSearch: '输入搜索查询',
        startSearchSub: '查找所需短语',
      },
      ru: {
        searchPlaceholder: 'Поиск...',
        noResults: 'Результатов не найдено',
        noResultsSub: 'Попробуйте изменить запрос',
        startSearch: 'Введите поисковый запрос',
        startSearchSub: 'Найдите нужные фразы',
      },
      en: {
        searchPlaceholder: 'Search...',
        noResults: 'No results found',
        noResultsSub: 'Try a different query',
        startSearch: 'Enter a search query',
        startSearchSub: 'Find the phrases you need',
      },
    };
    return texts[config.mode]?.[key] || texts.en?.[key] || key;
  }, [config.mode]);

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = setTimeout(() => {
      if (text.trim().length >= 2) {
        performSearch(text, {});
      } else if (text.trim().length === 0) {
        clearSearch();
      }
    }, 300);
  }, [performSearch, clearSearch, setSearchQuery]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    clearSearch();
    setShowSuggestions(false);
    searchInputRef.current?.focus();
  }, [setSearchQuery, clearSearch]);

  const handleSuggestionPress = useCallback((suggestion: string) => {
    setSearchQuery(suggestion);
    performSearch(suggestion, {});
    setShowSuggestions(false);
    Keyboard.dismiss();
  }, [performSearch, setSearchQuery]);

  const handlePhrasePress = useCallback((phrase: PhraseWithTranslation) => {
    navigation.navigate('PhraseDetail', { phrase });
  }, [navigation]);

  useEffect(() => {
    return () => { if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current); };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const renderSearchResult = useCallback(({ item, index }: { item: PhraseWithTranslation; index: number }) => {
    const category = categories.find(c => c.id === item.categoryId);
    const categoryName = category ? (
      config.mode === 'tk' ? category.nameTk :
      config.mode === 'zh' ? category.nameZh :
      category.nameRu
    ) : '';

    return (
      <>
        <TouchableOpacity
          style={styles.resultRow}
          onPress={() => handlePhrasePress(item)}
          activeOpacity={0.6}
        >
          <View style={styles.resultContent}>
            <HighlightedText
              text={item.translation.text}
              highlight={searchQuery}
              style={styles.primaryText}
            />
            {item.translation.transcription && (
              <Text style={styles.transcription}>{item.translation.transcription}</Text>
            )}
            <HighlightedText
              text={item.turkmen}
              highlight={searchQuery}
              style={styles.secondaryText}
            />
            {categoryName ? (
              <View style={styles.categoryRow}>
                {category && <Text style={styles.categoryEmoji}>{category.icon}</Text>}
                <Text style={styles.categoryLabel}>{categoryName}</Text>
              </View>
            ) : null}
          </View>
          <Ionicons name="chevron-forward" size={moderateScale(18)} color="#9CA3AF" />
        </TouchableOpacity>
        {index < searchResults.length - 1 && <View style={styles.divider} />}
      </>
    );
  }, [searchQuery, handlePhrasePress, config.mode, searchResults.length]);

  const renderEmptyState = useCallback(() => {
    if (isSearching) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#2D8CFF" />
        </View>
      );
    }
    if (searchQuery.trim() && searchResults.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={moderateScale(56)} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>{getText('noResults')}</Text>
          <Text style={styles.emptySubtext}>{getText('noResultsSub')}</Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyState}>
        <Ionicons name="search-outline" size={moderateScale(56)} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>{getText('startSearch')}</Text>
        <Text style={styles.emptySubtext}>{getText('startSearchSub')}</Text>
      </View>
    );
  }, [isSearching, searchQuery, searchResults.length, getText]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView edges={['top']} style={styles.headerArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={moderateScale(24)} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={moderateScale(18)} color="#9CA3AF" />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              placeholder={getText('searchPlaceholder')}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              onSubmitEditing={() => searchQuery && performSearch(searchQuery, {})}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch}>
                <Ionicons name="close-circle" size={moderateScale(20)} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && searchQuery.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {suggestions.slice(0, 5).map((s, i) => {
              const text = typeof s === 'string' ? s : (s as any).text || String(s);
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.suggestionRow}
                  onPress={() => handleSuggestionPress(text)}
                >
                  <Ionicons name="search-outline" size={moderateScale(16)} color="#9CA3AF" />
                  <Text style={styles.suggestionText}>{text}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </SafeAreaView>

      {/* Results */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults.map(result => (result.phrase || result) as any as PhraseWithTranslation)}
            renderItem={renderSearchResult}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          />
        ) : (
          renderEmptyState()
        )}
      </KeyboardAvoidingView>
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
    gap: scale(10),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
  },

  backButton: {
    alignItems: 'center',
    height: scale(40),
    justifyContent: 'center',
    width: scale(40),
  },

  searchContainer: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: scale(8),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(10),
  },

  searchInput: {
    color: '#1A1A1A',
    flex: 1,
    fontSize: moderateScale(15),
    padding: 0,
  },

  // Suggestions
  suggestionsContainer: {
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
  },

  suggestionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(10),
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
  },

  suggestionText: {
    color: '#1A1A1A',
    fontSize: moderateScale(15),
  },

  // Content
  content: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
  },

  // Result rows
  resultRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(12),
    paddingVertical: verticalScale(14),
  },

  resultContent: {
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

  categoryEmoji: {
    fontSize: moderateScale(12),
  },

  categoryLabel: {
    color: '#9CA3AF',
    fontSize: moderateScale(12),
  },

  divider: {
    backgroundColor: '#E5E7EB',
    height: 1,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: scale(40),
  },

  emptyTitle: {
    color: '#1A1A1A',
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginTop: verticalScale(16),
    textAlign: 'center',
  },

  emptySubtext: {
    color: '#6B7280',
    fontSize: moderateScale(14),
    marginTop: verticalScale(6),
    textAlign: 'center',
  },
});
