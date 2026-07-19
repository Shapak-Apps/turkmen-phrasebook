// src/utils/SearchEngine.ts - Advanced Search Engine for Day 18

import { Phrase, Category } from '../types';

export interface SearchResult {
  phrase: Phrase;
  relevanceScore: number;
  matchedFields: string[];
  matchedText: string;
}

export interface SearchOptions {
  fuzzyThreshold?: number; // 0-1, how strict the fuzzy matching is
  categoryFilter?: string;
  languageBoost?: 'chinese' | 'russian' | 'turkmen';
  includePhonetic?: boolean;
  maxResults?: number;
  semanticBoost?: boolean; // Enable semantic similarity matching
  personalizedBoost?: boolean; // Use user history for personalization
  contextualSearch?: boolean; // Consider phrase context and usage scenarios
}

export interface SearchIndex {
  chinese: Map<string, Phrase[]>;
  pinyin: Map<string, Phrase[]>;
  russian: Map<string, Phrase[]>;
  turkmen: Map<string, Phrase[]>;
}

export class SearchEngine {
  private phrases: Phrase[];
  private categories: Category[];
  private searchIndex: SearchIndex;

  constructor(phrases: Phrase[], categories: Category[]) {
    this.phrases = phrases;
    this.categories = categories;
    this.searchIndex = this.buildSearchIndex();
  }

  /**
   * Builds an inverted index for fast searching
   * Senior Developer Teaching: Indexing is crucial for performance at scale
   */
  private buildSearchIndex(): SearchIndex {
    const index: SearchIndex = {
      chinese: new Map(),
      pinyin: new Map(),
      russian: new Map(),
      turkmen: new Map(),
    };

    this.phrases.forEach(phrase => {
      // Index Chinese characters and words
      this.indexText(phrase.chinese, phrase, index.chinese);
      
      // Index Pinyin syllables
      this.indexText(phrase.pinyin, phrase, index.pinyin);
      
      // Index Russian words
      this.indexText(phrase.russian, phrase, index.russian);
      
      // Index Turkmen words
      this.indexText(phrase.turkmen, phrase, index.turkmen);
    });

    return index;
  }

  /**
   * Indexes text by breaking it into searchable tokens
   */
  private indexText(text: string, phrase: Phrase, indexMap: Map<string, Phrase[]>) {
    // Normalize and tokenize
    const tokens = this.tokenizeText(text);
    
    tokens.forEach(token => {
      if (!indexMap.has(token)) {
        indexMap.set(token, []);
      }
      const phrases = indexMap.get(token)!;
      if (!phrases.includes(phrase)) {
        phrases.push(phrase);
      }
    });
  }

  /**
   * Tokenizes text into searchable units
   * Handles both word-based (Russian/Turkmen) and character-based (Chinese) indexing
   */
  private tokenizeText(text: string): string[] {
    const normalized = text.toLowerCase().trim();
    const tokens: string[] = [];

    // For Chinese text - index individual characters and 2-character combinations
    if (this.isChinese(text)) {
      for (let i = 0; i < normalized.length; i++) {
        tokens.push(normalized[i]);
        if (i < normalized.length - 1) {
          tokens.push(normalized.substring(i, i + 2));
        }
      }
    }

    // For all text - split by words and punctuation
    const words = normalized.split(/[\s\p{P}]+/u).filter(word => word.length > 0);
    tokens.push(...words);

    // Add full text for exact matching
    tokens.push(normalized);

    return tokens;
  }

  /**
   * Checks if text contains Chinese characters
   */
  private isChinese(text: string): boolean {
    return /[\u4e00-\u9fff]/.test(text);
  }

  /**
   * Main search function with fuzzy matching and relevance scoring
   */
  public search(query: string, options: SearchOptions = {}, userHistory?: any[]): SearchResult[] {
    if (!query.trim()) return [];

    const {
      fuzzyThreshold = 0.7,
      categoryFilter,
      languageBoost,
      includePhonetic = true,
      maxResults = 50,
      semanticBoost = false,
      personalizedBoost = false,
      contextualSearch = false
    } = options;

    const normalizedQuery = query.toLowerCase().trim();
    const results = new Map<string, SearchResult>();

    // 1. Exact matches (highest score)
    this.findExactMatches(normalizedQuery, results, languageBoost);

    // 2. Prefix matches (high score)
    this.findPrefixMatches(normalizedQuery, results, languageBoost);

    // 3. Fuzzy matches (medium score)
    this.findFuzzyMatches(normalizedQuery, results, fuzzyThreshold, languageBoost);

    // 4. Phonetic matches (if enabled)
    if (includePhonetic) {
      this.findPhoneticMatches(normalizedQuery, results);
    }

    // 5. Semantic matches (if enabled)
    if (semanticBoost) {
      this.findSemanticMatches(normalizedQuery, results);
    }

    // 6. Contextual matches (if enabled)
    if (contextualSearch) {
      this.findContextualMatches(normalizedQuery, results);
    }

    // Apply category filter
    let filteredResults = Array.from(results.values());
    if (categoryFilter) {
      filteredResults = filteredResults.filter(result => 
        result.phrase.categoryId === categoryFilter
      );
    }

    // Apply personalized boost based on user history
    if (personalizedBoost && userHistory) {
      this.applyPersonalizedBoost(filteredResults, userHistory);
    }

    // Sort by relevance score (descending) and limit results
    return filteredResults
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  }

  /**
   * Find exact matches across all fields
   */
  private findExactMatches(
    query: string, 
    results: Map<string, SearchResult>, 
    languageBoost?: string
  ) {
    this.phrases.forEach(phrase => {
      const fields = [
        { text: phrase.chinese, field: 'chinese', weight: this.getLanguageWeight('chinese', languageBoost) },
        { text: phrase.pinyin, field: 'pinyin', weight: this.getLanguageWeight('chinese', languageBoost) },
        { text: phrase.russian, field: 'russian', weight: this.getLanguageWeight('russian', languageBoost) },
        { text: phrase.turkmen, field: 'turkmen', weight: this.getLanguageWeight('turkmen', languageBoost) },
      ];

      fields.forEach(({ text, field, weight }) => {
        if (text.toLowerCase().includes(query)) {
          const exactMatch = text.toLowerCase() === query;
          const score = exactMatch ? 100 * weight : 80 * weight;
          
          this.addOrUpdateResult(results, phrase, score, [field], text, query);
        }
      });
    });
  }

  /**
   * Find prefix matches
   */
  private findPrefixMatches(
    query: string, 
    results: Map<string, SearchResult>, 
    languageBoost?: string
  ) {
    this.phrases.forEach(phrase => {
      const fields = [
        { text: phrase.chinese, field: 'chinese', weight: this.getLanguageWeight('chinese', languageBoost) },
        { text: phrase.pinyin, field: 'pinyin', weight: this.getLanguageWeight('chinese', languageBoost) },
        { text: phrase.russian, field: 'russian', weight: this.getLanguageWeight('russian', languageBoost) },
        { text: phrase.turkmen, field: 'turkmen', weight: this.getLanguageWeight('turkmen', languageBoost) },
      ];

      fields.forEach(({ text, field, weight }) => {
        const words = text.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.startsWith(query) && word !== query) {
            const score = 60 * weight;
            this.addOrUpdateResult(results, phrase, score, [field], text, query);
          }
        });
      });
    });
  }

  /**
   * Find fuzzy matches using Levenshtein distance
   */
  private findFuzzyMatches(
    query: string, 
    results: Map<string, SearchResult>, 
    threshold: number,
    languageBoost?: string
  ) {
    this.phrases.forEach(phrase => {
      const fields = [
        { text: phrase.chinese, field: 'chinese', weight: this.getLanguageWeight('chinese', languageBoost) },
        { text: phrase.pinyin, field: 'pinyin', weight: this.getLanguageWeight('chinese', languageBoost) },
        { text: phrase.russian, field: 'russian', weight: this.getLanguageWeight('russian', languageBoost) },
        { text: phrase.turkmen, field: 'turkmen', weight: this.getLanguageWeight('turkmen', languageBoost) },
      ];

      fields.forEach(({ text, field, weight }) => {
        const words = text.toLowerCase().split(/\s+/);
        words.forEach(word => {
          const similarity = this.calculateSimilarity(query, word);
          if (similarity >= threshold) {
            const score = 40 * similarity * weight;
            this.addOrUpdateResult(results, phrase, score, [field], text, query);
          }
        });
      });
    });
  }

  /**
   * Find phonetic matches for Chinese pinyin
   */
  private findPhoneticMatches(query: string, results: Map<string, SearchResult>) {
    // Simple phonetic matching for pinyin
    const phoneticVariants = this.generatePhoneticVariants(query);
    
    phoneticVariants.forEach(variant => {
      this.phrases.forEach(phrase => {
        if (phrase.pinyin.toLowerCase().includes(variant)) {
          const score = 30;
          this.addOrUpdateResult(results, phrase, score, ['pinyin'], phrase.pinyin, query);
        }
      });
    });
  }

  /**
   * Generate phonetic variants for common romanization differences
   */
  private generatePhoneticVariants(query: string): string[] {
    const variants = [query];
    
    // Common pinyin variations
    const replacements = [
      ['zh', 'z'], ['ch', 'c'], ['sh', 's'],
      ['j', 'zh'], ['q', 'ch'], ['x', 'sh'],
      ['u', 'ü'], ['v', 'ü'],
    ];

    replacements.forEach(([from, to]) => {
      if (query.includes(from)) {
        variants.push(query.replace(new RegExp(from, 'g'), to));
      }
      if (query.includes(to)) {
        variants.push(query.replace(new RegExp(to, 'g'), from));
      }
    });

    return variants;
  }

  /**
   * Calculate similarity between two strings using Levenshtein distance
   * Senior Developer Teaching: This is a classic algorithm for fuzzy matching
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const distance = this.levenshteinDistance(str1, str2);
    const maxLength = Math.max(str1.length, str2.length);
    return maxLength === 0 ? 1 : 1 - (distance / maxLength);
  }

  /**
   * Levenshtein distance algorithm
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Get language-specific weight multiplier
   */
  private getLanguageWeight(language: string, boost?: string): number {
    const baseWeight = 1.0;
    if (boost === language) {
      return baseWeight * 1.5; // 50% boost for preferred language
    }
    
    // Chinese and pinyin get slight boost as they're the primary learning target
    if (language === 'chinese') return baseWeight * 1.2;
    
    return baseWeight;
  }

  /**
   * Add or update search result with improved scoring
   */
  private addOrUpdateResult(
    results: Map<string, SearchResult>,
    phrase: Phrase,
    score: number,
    matchedFields: string[],
    matchedText: string,
    originalQuery: string
  ) {
    const key = phrase.id;
    const existing = results.get(key);

    if (existing) {
      // Combine scores and merge matched fields
      existing.relevanceScore = Math.max(existing.relevanceScore, score);
      existing.matchedFields = [...new Set([...existing.matchedFields, ...matchedFields])];
    } else {
      results.set(key, {
        phrase,
        relevanceScore: score,
        matchedFields,
        matchedText,
      });
    }
  }

  /**
   * Get search suggestions based on partial input
   */
  public getSuggestions(partialQuery: string, maxSuggestions: number = 5): string[] {
    if (partialQuery.length < 2) return [];

    const suggestions = new Set<string>();
    const query = partialQuery.toLowerCase();

    // Find words that start with the query
    this.phrases.forEach(phrase => {
      [phrase.chinese, phrase.pinyin, phrase.russian, phrase.turkmen].forEach(text => {
        const words = text.toLowerCase().split(/\s+/);
        words.forEach(word => {
          if (word.startsWith(query) && word.length > query.length) {
            suggestions.add(word);
          }
        });
      });
    });

    return Array.from(suggestions).slice(0, maxSuggestions);
  }

  /**
   * Get related phrases based on category and semantic similarity
   */
  public getRelatedPhrases(phrase: Phrase, maxResults: number = 3): Phrase[] {
    // Get phrases from the same category
    const categoryPhrases = this.phrases.filter(p => 
      p.categoryId === phrase.categoryId && p.id !== phrase.id
    );

    // Simple semantic similarity based on word overlap
    const scoredPhrases = categoryPhrases.map(p => ({
      phrase: p,
      score: this.calculateSemanticSimilarity(phrase, p)
    }));

    return scoredPhrases
      .sort((a, b) => b.score - a.score)
      .slice(0, maxResults)
      .map(item => item.phrase);
  }

  /**
   * Calculate semantic similarity between two phrases
   */
  private calculateSemanticSimilarity(phrase1: Phrase, phrase2: Phrase): number {
    const getWords = (p: Phrase) => [
      ...p.russian.toLowerCase().split(/\s+/),
      ...p.turkmen.toLowerCase().split(/\s+/),
      ...p.pinyin.toLowerCase().split(/\s+/)
    ];

    const words1 = new Set(getWords(phrase1));
    const words2 = new Set(getWords(phrase2));

    const intersection = new Set([...words1].filter(x => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size; // Jaccard similarity
  }

  /**
   * Get search analytics for performance monitoring
   */
  public getSearchAnalytics() {
    return {
      indexSize: {
        chinese: this.searchIndex.chinese.size,
        pinyin: this.searchIndex.pinyin.size,
        russian: this.searchIndex.russian.size,
        turkmen: this.searchIndex.turkmen.size,
      },
      totalPhrases: this.phrases.length,
      totalCategories: this.categories.length,
    };
  }

  /**
   * Update the search engine with new data
   */
  public updateData(phrases: Phrase[], categories: Category[]) {
    this.phrases = phrases;
    this.categories = categories;
    this.searchIndex = this.buildSearchIndex();
  }

  /**
   * Find semantic matches based on meaning and context
   * Senior Developer Teaching: Semantic search improves user experience
   */
  public findSemanticMatches(query: string, results: Map<string, SearchResult>): void {
    // Define semantic keyword groups for better contextual matching
    const semanticGroups = {
      greetings: ['hello', 'hi', 'goodbye', 'bye', 'привет', 'пока', 'salam', 'hoş'],
      food: ['eat', 'drink', 'hungry', 'thirsty', 'еда', 'пить', 'iýmek', 'içmek'],
      travel: ['go', 'come', 'direction', 'where', 'куда', 'где', 'git', 'gel'],
      shopping: ['buy', 'price', 'cost', 'expensive', 'покупать', 'цена', 'satyn', 'baha'],
      emergency: ['help', 'emergency', 'urgent', 'call', 'помощь', 'срочно', 'kömek', 'howpsuz'],
      numbers: ['one', 'two', 'number', 'count', 'один', 'два', 'число', 'bir', 'iki'],
      time: ['time', 'hour', 'minute', 'day', 'время', 'час', 'wagt', 'sagat'],
      transportation: ['car', 'bus', 'train', 'taxi', 'машина', 'автобус', 'maşyn', 'awtobus'],
      hotel: ['room', 'bed', 'shower', 'hotel', 'комната', 'отель', 'otag', 'myhmanhana'],
      health: ['doctor', 'medicine', 'sick', 'pain', 'врач', 'лекарство', 'lukman', 'derman'],
    };

    Object.entries(semanticGroups).forEach(([context, keywords]) => {
      if (keywords.some(keyword => query.includes(keyword.toLowerCase()))) {
        // Find phrases in related categories
        const relatedCategory = this.categories.find(cat => 
          cat.id.includes(context) || 
          cat.nameRu.toLowerCase().includes(context) ||
          cat.nameTk.toLowerCase().includes(context)
        );
        
        if (relatedCategory) {
          const contextPhrases = this.phrases.filter(p => p.categoryId === relatedCategory.id);
          contextPhrases.forEach(phrase => {
            this.addOrUpdateResult(
              results, 
              phrase, 
              25, // Medium-low score for semantic matches
              ['semantic'], 
              context, 
              query
            );
          });
        }
      }
    });
  }

  /**
   * Find contextual matches based on usage scenarios
   */
  public findContextualMatches(query: string, results: Map<string, SearchResult>): void {
    // Define contextual patterns and their associated phrases
    const contextualPatterns = [
      {
        patterns: ['how much', 'сколько', 'näçe', '多少'],
        categories: ['shopping', 'money', 'food'],
        boost: 1.3
      },
      {
        patterns: ['where is', 'где находится', 'nirede', '在哪里'],
        categories: ['directions', 'transport', 'hotel'],
        boost: 1.4
      },
      {
        patterns: ['i need', 'мне нужно', 'maňa gerek', '我需要'],
        categories: ['emergency', 'health', 'hotel'],
        boost: 1.5
      },
      {
        patterns: ['thank you', 'спасибо', 'sag bol', '谢谢'],
        categories: ['greetings'],
        boost: 1.2
      },
    ];

    contextualPatterns.forEach(({ patterns, categories: categoryIds, boost }) => {
      if (patterns.some(pattern => query.includes(pattern))) {
        categoryIds.forEach(categoryId => {
          const contextPhrases = this.phrases.filter(p => 
            p.categoryId.includes(categoryId) ||
            this.categories.find(cat => 
              cat.id === p.categoryId && 
              (cat.nameRu.toLowerCase().includes(categoryId) ||
               cat.nameTk.toLowerCase().includes(categoryId))
            )
          );
          
          contextPhrases.forEach(phrase => {
            this.addOrUpdateResult(
              results,
              phrase,
              35 * boost, // Contextual boost
              ['contextual'],
              'contextual match',
              query
            );
          });
        });
      }
    });
  }

  /**
   * Apply personalized boost based on user history
   */
  public applyPersonalizedBoost(results: SearchResult[], userHistory: any[]): void {
    if (!userHistory || userHistory.length === 0) return;

    // Create frequency map from user history
    const phraseFrequency = new Map<string, number>();
    const categoryFrequency = new Map<string, number>();
    
    userHistory.forEach(entry => {
      if (entry.phraseId) {
        phraseFrequency.set(entry.phraseId, (phraseFrequency.get(entry.phraseId) || 0) + 1);
      }
      if (entry.categoryId) {
        categoryFrequency.set(entry.categoryId, (categoryFrequency.get(entry.categoryId) || 0) + 1);
      }
    });

    // Apply personalized boost
    results.forEach(result => {
      const phraseUsage = phraseFrequency.get(result.phrase.id) || 0;
      const categoryUsage = categoryFrequency.get(result.phrase.categoryId) || 0;
      
      // Boost based on personal usage patterns
      const personalBoost = 1 + (phraseUsage * 0.1) + (categoryUsage * 0.05);
      result.relevanceScore *= personalBoost;
      
      if (phraseUsage > 0) {
        result.matchedFields.push('personal');
      }
    });
  }

  /**
   * Get personalized recommendations
   */
  public getPersonalizedRecommendations(userHistory: any[] = [], maxResults: number = 5): Phrase[] {
    if (!userHistory || userHistory.length === 0) {
      // Return popular phrases from each category
      return this.getPopularPhrases(maxResults);
    }

    // Analyze user preferences
    const categoryUsage = new Map<string, number>();
    const phraseUsage = new Map<string, number>();
    const languageUsage = new Map<string, number>();
    
    userHistory.forEach(entry => {
      if (entry.categoryId) {
        categoryUsage.set(entry.categoryId, (categoryUsage.get(entry.categoryId) || 0) + 1);
      }
      if (entry.phraseId) {
        phraseUsage.set(entry.phraseId, (phraseUsage.get(entry.phraseId) || 0) + 1);
      }
      if (entry.language) {
        languageUsage.set(entry.language, (languageUsage.get(entry.language) || 0) + 1);
      }
    });

    // Get user's preferred categories
    const preferredCategories = Array.from(categoryUsage.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([categoryId]) => categoryId);

    // Find recommended phrases
    const recommendations: Phrase[] = [];
    
    preferredCategories.forEach(categoryId => {
      const categoryPhrases = this.phrases.filter(p => p.categoryId === categoryId);
      const unviewedPhrases = categoryPhrases.filter(p => !phraseUsage.has(p.id));
      
      // Add unviewed phrases from preferred categories
      recommendations.push(...unviewedPhrases.slice(0, 2));
    });

    // Add some variety from other categories
    const otherPhrases = this.phrases.filter(p => 
      !preferredCategories.includes(p.categoryId) && !phraseUsage.has(p.id)
    );
    recommendations.push(...otherPhrases.slice(0, 2));

    return recommendations.slice(0, maxResults);
  }

  /**
   * Get popular phrases from categories
   */
  public getPopularPhrases(maxResults: number = 5): Phrase[] {
    // Return a mix of common phrases from different categories
    const popularByCategory = this.categories.map(category => {
      const categoryPhrases = this.phrases.filter(p => p.categoryId === category.id);
      return categoryPhrases[0]; // First phrase is often most common
    }).filter(Boolean);

    return popularByCategory.slice(0, maxResults);
  }
}

/**
 * Utility function to create search engine instance
 */
export function createSearchEngine(phrases: Phrase[], categories: Category[]): SearchEngine {
  return new SearchEngine(phrases, categories);
}

/**
 * Search difficulty levels for filtering
 */
export enum SearchDifficulty {
  BEGINNER = 'beginner',    // Basic greetings, numbers, common words
  INTERMEDIATE = 'intermediate', // Conversations, directions, transactions
  ADVANCED = 'advanced',    // Complex situations, formal language
}

/**
 * Map phrase categories to difficulty levels
 */
export function getPhraseDifficulty(phrase: Phrase, categories: Category[]): SearchDifficulty {
  const category = categories.find(c => c.id === phrase.categoryId);
  if (!category) return SearchDifficulty.INTERMEDIATE;

  // Define difficulty mapping based on category
  const difficultyMap: Record<string, SearchDifficulty> = {
    'greetings': SearchDifficulty.BEGINNER,
    'numbers': SearchDifficulty.BEGINNER,
    'emergency': SearchDifficulty.ADVANCED,
    'hotel': SearchDifficulty.INTERMEDIATE,
    'food': SearchDifficulty.BEGINNER,
    'shopping': SearchDifficulty.INTERMEDIATE,
    'transport': SearchDifficulty.INTERMEDIATE,
    'directions': SearchDifficulty.INTERMEDIATE,
    'health': SearchDifficulty.ADVANCED,
    'money': SearchDifficulty.INTERMEDIATE,
    'communication': SearchDifficulty.ADVANCED,
    'entertainment': SearchDifficulty.BEGINNER,
    'time': SearchDifficulty.BEGINNER,
    'weather': SearchDifficulty.BEGINNER,
  };

  // Use category name to determine difficulty (fallback to category id)
  const categoryKey = category.nameRu.toLowerCase();
  for (const [key, difficulty] of Object.entries(difficultyMap)) {
    if (categoryKey.includes(key) || category.id.includes(key)) {
      return difficulty;
    }
  }

  return SearchDifficulty.INTERMEDIATE;
}
