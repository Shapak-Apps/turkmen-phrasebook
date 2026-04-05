// src/hooks/useAdvancedSearch.ts - Advanced Search Hook for Day 18 - ИСПРАВЛЕНО

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { SearchEngine, SearchResult, SearchOptions, SearchDifficulty, getPhraseDifficulty } from '../utils/SearchEngine';
import { usePhrases } from './usePhrases';
import { categories } from '../data/categories';
import { PhraseWithTranslation } from '../types';
import { useSearchHistory } from './useSearchHistory';
import { useHistory } from './useHistory';

export interface AdvancedSearchOptions extends SearchOptions {
  difficultyFilter?: SearchDifficulty;
  sortBy?: 'relevance' | 'difficulty' | 'frequency' | 'recent';
  includeRelated?: boolean;
}

export interface SearchSuggestion {
  text: string;
  type: 'completion' | 'correction' | 'related';
  score: number;
}

export interface SearchAnalytics {
  totalSearches: number;
  averageResultsPerSearch: number;
  popularQueries: Array<{ query: string; count: number }>;
  searchSuccessRate: number;
  performanceMetrics: {
    averageSearchTime: number;
    indexSize: number;
  };
}

export function useAdvancedSearch() {
  // Get phrases from usePhrases hook (with current language translations)
  const { phrases: phrasesWithTranslations } = usePhrases();

  // Core search engine instance (memoized for performance)
  // Note: SearchEngine still uses old Phrase type internally, but we convert later
  const searchEngine = useMemo(() => new SearchEngine(phrasesWithTranslations as any, categories), [phrasesWithTranslations]);
  
  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchOptions, setSearchOptions] = useState<AdvancedSearchOptions>({});
  
  // Performance tracking
  const searchTimeRef = useRef<number>(0);
  const [searchAnalytics, setSearchAnalytics] = useState<SearchAnalytics>({
    totalSearches: 0,
    averageResultsPerSearch: 0,
    popularQueries: [],
    searchSuccessRate: 0,
    performanceMetrics: { averageSearchTime: 0, indexSize: 0 }
  });

  // Hooks integration - исправлено: используем только существующие методы
  const { addToSearchHistory, getPopularSearches } = useSearchHistory();
  const { addToHistory, getStats } = useHistory(); // заменил getHistory на getStats

  /**
   * Get user history data for personalization
   */
  const getUserHistoryData = useCallback(async () => {
    try {
      // Используем getStats вместо getHistory
      const stats = getStats();
      // Преобразуем статистику в формат истории для персонализации
      const historyData = [];
      
      // Добавляем информацию из статистики если доступна
      if (stats.totalViews > 0) {
        // Создаем базовые данные для персонализации на основе статистики
        historyData.push({
          phraseId: 'recent',
          categoryId: 'general',
          timestamp: Date.now(),
          count: stats.totalViews
        });
      }
      
      return historyData;
    } catch (error) {
      console.error('Failed to get user history:', error);
      return [];
    }
  }, [getStats]);

  /**
   * Perform advanced search with all options
   * Senior Developer Teaching: Debouncing prevents excessive API calls
   */
  const performSearch = useCallback(async (
    query: string, 
    options: AdvancedSearchOptions = {}
  ): Promise<SearchResult[]> => {
    if (!query.trim()) {
      setSearchResults([]);
      return [];
    }

    setIsSearching(true);
    const startTime = Date.now();

    try {
      // Enhanced search with new Day 18 features
      const searchOptions = {
        fuzzyThreshold: options.fuzzyThreshold || 0.7,
        categoryFilter: options.categoryFilter,
        languageBoost: options.languageBoost,
        includePhonetic: options.includePhonetic ?? true,
        maxResults: options.maxResults || 50,
        semanticBoost: true, // Enable semantic matching
        personalizedBoost: options.personalizedBoost ?? true,
        contextualSearch: true, // Use context for better results
      };

      // Get personalized data for boosting
      const userHistory = await getUserHistoryData();
      
      // Perform search with personalization (убираем personalizedData из searchOptions)
      const results = searchEngine.search(query, searchOptions);

      // Apply additional filtering based on advanced options
      let filteredResults = results;

      if (options.difficultyFilter) {
        filteredResults = filteredResults.filter(result => 
          getPhraseDifficulty(result.phrase, categories) === options.difficultyFilter
        );
      }

      // Apply sorting
      if (options.sortBy) {
        filteredResults = sortSearchResults(filteredResults, options.sortBy);
      }

      // Update search analytics
      const searchTime = Date.now() - startTime;
      updateSearchAnalytics(query, filteredResults.length, searchTime);

      // Save to search history
      addToSearchHistory(query, filteredResults.length);

      setSearchResults(filteredResults);
      return filteredResults;

    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, [searchEngine, getUserHistoryData, addToSearchHistory]);

  /**
   * Sort search results based on criteria
   */
  const sortSearchResults = useCallback((
    results: SearchResult[], 
    sortBy: AdvancedSearchOptions['sortBy']
  ): SearchResult[] => {
    switch (sortBy) {
      case 'difficulty':
        return [...results].sort((a, b) => {
          const diffA = getPhraseDifficulty(a.phrase, categories);
          const diffB = getPhraseDifficulty(b.phrase, categories);
          const order = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
          return order[diffA] - order[diffB];
        });
      
      case 'frequency':
        // Sort by phrase usage frequency (mock implementation)
        return [...results].sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      case 'recent':
        // Sort by recently added phrases (mock implementation)
        return [...results].sort((a, b) => 
          new Date(b.phrase.id).getTime() - new Date(a.phrase.id).getTime()
        );
      
      case 'relevance':
      default:
        return results; // Already sorted by relevance
    }
  }, []);

  /**
   * Generate intelligent search suggestions
   */
  const generateSuggestions = useCallback((partialQuery: string): SearchSuggestion[] => {
    if (!partialQuery || partialQuery.length < 2) {
      return [];
    }

    const suggestions: SearchSuggestion[] = [];

    // 1. Auto-completion suggestions
    const completionMatches = searchEngine.search(partialQuery, { 
      maxResults: 3, 
      fuzzyThreshold: 0.8 
    });
    completionMatches.forEach(match => {
      // Extract potential completions from matched phrases
      const words = [match.phrase.chinese, match.phrase.russian, match.phrase.turkmen]
        .join(' ').toLowerCase().split(/\s+/);
      
      words.forEach(word => {
        if (word.startsWith(partialQuery.toLowerCase()) && word !== partialQuery.toLowerCase()) {
          suggestions.push({
            text: word,
            type: 'completion',
            score: match.relevanceScore
          });
        }
      });
    });

    // 2. Fuzzy correction suggestions
    const fuzzyMatches = searchEngine.search(partialQuery, { 
      fuzzyThreshold: 0.6, 
      maxResults: 2 
    });
    fuzzyMatches.forEach(match => {
      // Extract the best matching word from the phrase
      // Note: Type assertion used as SearchEngine returns Phrase, needs PhraseWithTranslation
      const bestMatch = extractBestMatch(partialQuery, match.phrase as any as PhraseWithTranslation);
      if (bestMatch && bestMatch !== partialQuery) {
        suggestions.push({
          text: bestMatch,
          type: 'correction',
          score: match.relevanceScore
        });
      }
    });

    // 3. Related query suggestions from history
    const popularQueries = getPopularSearches(5);
    popularQueries.forEach(item => {
      if (item.query.toLowerCase().includes(partialQuery.toLowerCase()) && 
          item.query !== partialQuery) {
        suggestions.push({
          text: item.query,
          type: 'related',
          score: item.resultsCount * 10 // Use resultsCount instead of count
        });
      }
    });

    // Remove duplicates and sort by score
    const uniqueSuggestions = suggestions.reduce((acc, current) => {
      const existing = acc.find(s => s.text === current.text);
      if (!existing) {
        acc.push(current);
      }
      return acc;
    }, [] as SearchSuggestion[]);

    return uniqueSuggestions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [searchEngine, getPopularSearches]);

  /**
   * Extract the best matching word from a phrase for suggestions
   */
  const extractBestMatch = (query: string, phrase: PhraseWithTranslation): string | null => {
    const allText = [
      phrase.translation.text,
      phrase.translation.transcription || '',
      phrase.turkmen
    ].join(' ');
    const words = allText.toLowerCase().split(/\s+/);
    
    let bestMatch = '';
    let bestScore = 0;

    words.forEach(word => {
      const similarity = calculateWordSimilarity(query.toLowerCase(), word);
      if (similarity > bestScore && similarity > 0.5) {
        bestScore = similarity;
        bestMatch = word;
      }
    });

    return bestMatch || null;
  };

  /**
   * Calculate word similarity for suggestions
   */
  const calculateWordSimilarity = (word1: string, word2: string): number => {
    // Simple Levenshtein distance-based similarity
    const distance = levenshteinDistance(word1, word2);
    const maxLen = Math.max(word1.length, word2.length);
    return maxLen === 0 ? 1 : 1 - distance / maxLen;
  };

  /**
   * Calculate Levenshtein distance
   */
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  };

  /**
   * Update search analytics
   */
  const updateSearchAnalytics = useCallback((
    query: string, 
    resultsCount: number, 
    searchTime: number
  ) => {
    setSearchAnalytics(prev => ({
      totalSearches: prev.totalSearches + 1,
      averageResultsPerSearch: (prev.averageResultsPerSearch * prev.totalSearches + resultsCount) / (prev.totalSearches + 1),
      popularQueries: updatePopularQueries(prev.popularQueries, query),
      searchSuccessRate: resultsCount > 0 ? 
        (prev.searchSuccessRate * prev.totalSearches + 1) / (prev.totalSearches + 1) :
        prev.searchSuccessRate,
      performanceMetrics: {
        averageSearchTime: (prev.performanceMetrics.averageSearchTime * prev.totalSearches + searchTime) / (prev.totalSearches + 1),
        indexSize: prev.performanceMetrics.indexSize
      }
    }));
  }, []);

  /**
   * Update popular queries list
   */
  const updatePopularQueries = (
    currentQueries: Array<{ query: string; count: number }>, 
    newQuery: string
  ): Array<{ query: string; count: number }> => {
    const existing = currentQueries.find(q => q.query === newQuery);
    
    if (existing) {
      return currentQueries.map(q => 
        q.query === newQuery ? { ...q, count: q.count + 1 } : q
      ).sort((a, b) => b.count - a.count);
    }
    
    const updated = [...currentQueries, { query: newQuery, count: 1 }]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Keep top 10
    
    return updated;
  };

  /**
   * Get personalized recommendations
   */
  const getPersonalizedRecommendations = useCallback(async (maxResults: number = 5): Promise<PhraseWithTranslation[]> => {
    try {
      const userHistory = await getUserHistoryData();
      // Note: Type assertion used as SearchEngine returns Phrase[], needs PhraseWithTranslation[]
      return searchEngine.getPersonalizedRecommendations(userHistory, maxResults) as any as PhraseWithTranslation[];
    } catch (error) {
      console.error('Failed to get personalized recommendations:', error);
      return [];
    }
  }, [searchEngine, getUserHistoryData]);

  /**
   * Update search options
   */
  const updateSearchOptions = useCallback((newOptions: Partial<AdvancedSearchOptions>) => {
    setSearchOptions(prev => ({ ...prev, ...newOptions }));
  }, []);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
  }, []);

  // Generate suggestions when search query changes
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const newSuggestions = generateSuggestions(searchQuery);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, generateSuggestions]);

  return {
    // Search state
    searchQuery,
    setSearchQuery,
    searchResults,
    suggestions,
    isSearching,
    searchOptions,

    // Search actions
    performSearch,
    clearSearch,
    updateSearchOptions,

    // Advanced features
    getPersonalizedRecommendations,
    searchAnalytics,
    
    // Utilities
    generateSuggestions,
  };
}

/**
 * Hook for managing search filters
 */
export function useSearchFilters() {
  const [activeFilters, setActiveFilters] = useState<{
    difficulty?: SearchDifficulty;
    category?: string;
    sortBy?: 'relevance' | 'difficulty' | 'frequency' | 'recent';
  }>({});

  const applyFilter = useCallback((filterType: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  const removeFilter = useCallback((filterType: string) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterType as keyof typeof newFilters];
      return newFilters;
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setActiveFilters({});
  }, []);

  const hasActiveFilters = useMemo(() => {
    return Object.keys(activeFilters).length > 0;
  }, [activeFilters]);

  return {
    activeFilters,
    applyFilter,
    removeFilter,
    clearAllFilters,
    hasActiveFilters,
  };
}