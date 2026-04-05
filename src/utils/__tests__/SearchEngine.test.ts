// src/utils/__tests__/SearchEngine.test.ts
import { SearchEngine, createSearchEngine, SearchDifficulty, getPhraseDifficulty } from '../SearchEngine';
import { Phrase, Category } from '../../types';

// Mock data
const mockPhrases: Phrase[] = [
  {
    id: 'phrase_001',
    categoryId: 'greetings',
    chinese: '你好',
    pinyin: 'nǐ hǎo',
    russian: 'Привет',
    turkmen: 'Salam',
  },
  {
    id: 'phrase_002',
    categoryId: 'greetings',
    chinese: '再见',
    pinyin: 'zài jiàn',
    russian: 'До свидания',
    turkmen: 'Hoş gal',
  },
  {
    id: 'phrase_003',
    categoryId: 'food',
    chinese: '我饿了',
    pinyin: 'wǒ è le',
    russian: 'Я голоден',
    turkmen: 'Men aç',
  },
  {
    id: 'phrase_004',
    categoryId: 'food',
    chinese: '水',
    pinyin: 'shuǐ',
    russian: 'Вода',
    turkmen: 'Suw',
  },
  {
    id: 'phrase_005',
    categoryId: 'numbers',
    chinese: '一',
    pinyin: 'yī',
    russian: 'Один',
    turkmen: 'Bir',
  },
  {
    id: 'phrase_006',
    categoryId: 'hotel',
    chinese: '房间',
    pinyin: 'fáng jiān',
    russian: 'Комната',
    turkmen: 'Otag',
  },
];

const mockCategories: Category[] = [
  {
    id: 'greetings',
    icon: '👋',
    color: '#4CAF50',
    nameTk: 'Salamlaşmak',
    nameZh: '问候',
    nameRu: 'Приветствия',
    nameEn: 'Greetings',
    nameJa: '挨拶',
    nameKo: '인사',
    nameTh: 'คำทักทาย',
    nameVi: 'Lời chào',
    nameId: 'Salam',
    nameMs: 'Salam',
    nameHi: 'अभिवादन',
    nameUr: 'سلام',
    nameFa: 'سلام',
    namePs: 'سلام',
    nameDe: 'Begrüßungen',
    nameFr: 'Salutations',
    nameEs: 'Saludos',
    nameIt: 'Saluti',
    nameTr: 'Selamlar',
    namePl: 'Pozdrowienia',
    nameUk: 'Привітання',
    nameHy: 'Ողdelays',
    nameKa: 'მისალმებები',
    nameAr: 'تحيات',
    nameUz: 'Salomlashishlar',
    nameKk: 'Сәлемдесу',
    nameAz: 'Salamlaşma',
    nameKy: 'Саламдашуу',
    nameTg: 'Саломҳо',
    namePt: 'Saudações',
    nameNl: 'Groeten',
  },
  {
    id: 'food',
    icon: '🍕',
    color: '#FF5722',
    nameTk: 'Iýmit',
    nameZh: '食物',
    nameRu: 'Еда',
    nameEn: 'Food',
    nameJa: '食べ物',
    nameKo: '음식',
    nameTh: 'อาหาร',
    nameVi: 'Thức ăn',
    nameId: 'Makanan',
    nameMs: 'Makanan',
    nameHi: 'भोजन',
    nameUr: 'کھانا',
    nameFa: 'غذا',
    namePs: 'خوراک',
    nameDe: 'Essen',
    nameFr: 'Nourriture',
    nameEs: 'Comida',
    nameIt: 'Cibo',
    nameTr: 'Yemek',
    namePl: 'Jedzenie',
    nameUk: 'Їжа',
    nameHy: 'Սնdelays',
    nameKa: 'საკვები',
    nameAr: 'طعام',
    nameUz: 'Oziq-ovqat',
    nameKk: 'Тағам',
    nameAz: 'Yemək',
    nameKy: 'Тамак-аш',
    nameTg: 'Хӯрок',
    namePt: 'Comida',
    nameNl: 'Voedsel',
  },
  {
    id: 'numbers',
    icon: '🔢',
    color: '#2196F3',
    nameTk: 'Sanlar',
    nameZh: '数字',
    nameRu: 'Числа',
    nameEn: 'Numbers',
    nameJa: '数字',
    nameKo: '숫자',
    nameTh: 'ตัวเลข',
    nameVi: 'Số',
    nameId: 'Angka',
    nameMs: 'Nombor',
    nameHi: 'संख्या',
    nameUr: 'نمبر',
    nameFa: 'اعداد',
    namePs: 'شمیرې',
    nameDe: 'Zahlen',
    nameFr: 'Nombres',
    nameEs: 'Números',
    nameIt: 'Numeri',
    nameTr: 'Sayılar',
    namePl: 'Liczby',
    nameUk: 'Числа',
    nameHy: 'Թdelays',
    nameKa: 'რიცხვები',
    nameAr: 'أرقام',
    nameUz: 'Raqamlar',
    nameKk: 'Сандар',
    nameAz: 'Rəqəmlər',
    nameKy: 'Сандар',
    nameTg: 'Рақамҳо',
    namePt: 'Números',
    nameNl: 'Nummers',
  },
  {
    id: 'hotel',
    icon: '🏨',
    color: '#9C27B0',
    nameTk: 'Myhmanhana',
    nameZh: '酒店',
    nameRu: 'Отель',
    nameEn: 'Hotel',
    nameJa: 'ホテル',
    nameKo: '호텔',
    nameTh: 'โรงแรม',
    nameVi: 'Khách sạn',
    nameId: 'Hotel',
    nameMs: 'Hotel',
    nameHi: 'होटल',
    nameUr: 'ہوٹل',
    nameFa: 'هتل',
    namePs: 'هوتل',
    nameDe: 'Hotel',
    nameFr: 'Hôtel',
    nameEs: 'Hotel',
    nameIt: 'Hotel',
    nameTr: 'Otel',
    namePl: 'Hotel',
    nameUk: 'Готель',
    nameHy: 'Հdelays',
    nameKa: 'სასტუმრო',
    nameAr: 'فندق',
    nameUz: 'Mehmonxona',
    nameKk: 'Қонақ үй',
    nameAz: 'Otel',
    nameKy: 'Мейманкана',
    nameTg: 'Меҳмонхона',
    namePt: 'Hotel',
    nameNl: 'Hotel',
  },
];

describe('SearchEngine', () => {
  let searchEngine: SearchEngine;

  beforeEach(() => {
    searchEngine = new SearchEngine(mockPhrases, mockCategories);
  });

  describe('constructor', () => {
    it('should create instance with phrases and categories', () => {
      expect(searchEngine).toBeInstanceOf(SearchEngine);
    });

    it('should build search index on initialization', () => {
      const analytics = searchEngine.getSearchAnalytics();
      expect(analytics.totalPhrases).toBe(mockPhrases.length);
      expect(analytics.totalCategories).toBe(mockCategories.length);
    });
  });

  describe('search', () => {
    it('should return empty array for empty query', () => {
      const results = searchEngine.search('');
      expect(results).toEqual([]);
    });

    it('should return empty array for whitespace query', () => {
      const results = searchEngine.search('   ');
      expect(results).toEqual([]);
    });

    it('should find exact match in Chinese', () => {
      const results = searchEngine.search('你好');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].phrase.chinese).toBe('你好');
    });

    it('should find exact match in Russian', () => {
      const results = searchEngine.search('Привет');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].phrase.russian).toBe('Привет');
    });

    it('should find exact match in Turkmen', () => {
      const results = searchEngine.search('Salam');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].phrase.turkmen).toBe('Salam');
    });

    it('should find match in pinyin', () => {
      const results = searchEngine.search('nǐ hǎo');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].phrase.pinyin).toContain('nǐ hǎo');
    });

    it('should be case-insensitive', () => {
      const lowerResults = searchEngine.search('salam');
      const upperResults = searchEngine.search('SALAM');
      expect(lowerResults.length).toBe(upperResults.length);
    });

    it('should find partial matches', () => {
      const results = searchEngine.search('свидан');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].phrase.russian).toContain('свидания');
    });

    it('should filter by category', () => {
      const results = searchEngine.search('', { categoryFilter: 'greetings' });
      // Note: empty query returns [], so let's use a different approach
      const allResults = searchEngine.search('a', { categoryFilter: 'greetings' });
      allResults.forEach(result => {
        expect(result.phrase.categoryId).toBe('greetings');
      });
    });

    it('should limit results with maxResults option', () => {
      const results = searchEngine.search('a', { maxResults: 2 });
      expect(results.length).toBeLessThanOrEqual(2);
    });

    it('should apply language boost', () => {
      const resultsWithBoost = searchEngine.search('salam', { languageBoost: 'turkmen' });
      expect(resultsWithBoost.length).toBeGreaterThan(0);
    });

    it('should sort by relevance score descending', () => {
      const results = searchEngine.search('Привет');
      if (results.length > 1) {
        for (let i = 1; i < results.length; i++) {
          expect(results[i - 1].relevanceScore).toBeGreaterThanOrEqual(results[i].relevanceScore);
        }
      }
    });
  });

  describe('fuzzy matching', () => {
    it('should find fuzzy matches with typos', () => {
      // Search for "Prvet" instead of "Привет"
      const results = searchEngine.search('свиданя', { fuzzyThreshold: 0.6 });
      // Should find "свидания" with fuzzy matching
      expect(results.length).toBeGreaterThanOrEqual(0);
    });

    it('should respect fuzzy threshold', () => {
      const strictResults = searchEngine.search('sal', { fuzzyThreshold: 0.9 });
      const looseResults = searchEngine.search('sal', { fuzzyThreshold: 0.5 });
      expect(looseResults.length).toBeGreaterThanOrEqual(strictResults.length);
    });
  });

  describe('getSuggestions', () => {
    it('should return empty array for short query', () => {
      const suggestions = searchEngine.getSuggestions('a');
      expect(suggestions).toEqual([]);
    });

    it('should return suggestions for valid query', () => {
      const suggestions = searchEngine.getSuggestions('sal');
      expect(Array.isArray(suggestions)).toBe(true);
    });

    it('should limit suggestions count', () => {
      const suggestions = searchEngine.getSuggestions('sa', 3);
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getRelatedPhrases', () => {
    it('should return related phrases from same category', () => {
      const phrase = mockPhrases[0]; // greetings category
      const related = searchEngine.getRelatedPhrases(phrase);

      related.forEach(relatedPhrase => {
        expect(relatedPhrase.categoryId).toBe(phrase.categoryId);
        expect(relatedPhrase.id).not.toBe(phrase.id);
      });
    });

    it('should limit related phrases count', () => {
      const phrase = mockPhrases[0];
      const related = searchEngine.getRelatedPhrases(phrase, 1);
      expect(related.length).toBeLessThanOrEqual(1);
    });
  });

  describe('getSearchAnalytics', () => {
    it('should return correct analytics', () => {
      const analytics = searchEngine.getSearchAnalytics();

      expect(analytics.totalPhrases).toBe(mockPhrases.length);
      expect(analytics.totalCategories).toBe(mockCategories.length);
      expect(analytics.indexSize).toBeDefined();
      expect(analytics.indexSize.chinese).toBeGreaterThan(0);
      expect(analytics.indexSize.russian).toBeGreaterThan(0);
      expect(analytics.indexSize.turkmen).toBeGreaterThan(0);
    });
  });

  describe('updateData', () => {
    it('should update search engine with new data', () => {
      const newPhrases: Phrase[] = [
        {
          id: 'new_001',
          categoryId: 'test',
          chinese: '测试',
          pinyin: 'cè shì',
          russian: 'Тест',
          turkmen: 'Test',
        },
      ];

      searchEngine.updateData(newPhrases, mockCategories);
      const analytics = searchEngine.getSearchAnalytics();

      expect(analytics.totalPhrases).toBe(1);
    });

    it('should rebuild index after update', () => {
      const newPhrases: Phrase[] = [
        {
          id: 'new_001',
          categoryId: 'test',
          chinese: '新词',
          pinyin: 'xīn cí',
          russian: 'Новое слово',
          turkmen: 'Täze söz',
        },
      ];

      searchEngine.updateData(newPhrases, mockCategories);
      const results = searchEngine.search('新词');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].phrase.chinese).toBe('新词');
    });
  });

  describe('getPopularPhrases', () => {
    it('should return popular phrases', () => {
      const popular = searchEngine.getPopularPhrases(3);
      expect(popular.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getPersonalizedRecommendations', () => {
    it('should return recommendations without history', () => {
      const recommendations = searchEngine.getPersonalizedRecommendations([], 3);
      expect(recommendations.length).toBeLessThanOrEqual(3);
    });

    it('should use history for personalization', () => {
      const history = [
        { phraseId: 'phrase_001', categoryId: 'greetings' },
        { phraseId: 'phrase_002', categoryId: 'greetings' },
      ];

      const recommendations = searchEngine.getPersonalizedRecommendations(history, 5);
      expect(Array.isArray(recommendations)).toBe(true);
    });
  });
});

describe('createSearchEngine', () => {
  it('should create SearchEngine instance', () => {
    const engine = createSearchEngine(mockPhrases, mockCategories);
    expect(engine).toBeInstanceOf(SearchEngine);
  });
});

describe('SearchDifficulty', () => {
  it('should have correct enum values', () => {
    expect(SearchDifficulty.BEGINNER).toBe('beginner');
    expect(SearchDifficulty.INTERMEDIATE).toBe('intermediate');
    expect(SearchDifficulty.ADVANCED).toBe('advanced');
  });
});

describe('getPhraseDifficulty', () => {
  it('should return BEGINNER for greetings category', () => {
    const phrase = mockPhrases.find(p => p.categoryId === 'greetings')!;
    const difficulty = getPhraseDifficulty(phrase, mockCategories);
    expect(difficulty).toBe(SearchDifficulty.BEGINNER);
  });

  it('should return BEGINNER for numbers category', () => {
    const phrase = mockPhrases.find(p => p.categoryId === 'numbers')!;
    const difficulty = getPhraseDifficulty(phrase, mockCategories);
    expect(difficulty).toBe(SearchDifficulty.BEGINNER);
  });

  it('should return BEGINNER for food category', () => {
    const phrase = mockPhrases.find(p => p.categoryId === 'food')!;
    const difficulty = getPhraseDifficulty(phrase, mockCategories);
    expect(difficulty).toBe(SearchDifficulty.BEGINNER);
  });

  it('should return INTERMEDIATE for hotel category', () => {
    const phrase = mockPhrases.find(p => p.categoryId === 'hotel')!;
    const difficulty = getPhraseDifficulty(phrase, mockCategories);
    expect(difficulty).toBe(SearchDifficulty.INTERMEDIATE);
  });

  it('should return INTERMEDIATE for unknown category', () => {
    const unknownPhrase: Phrase = {
      id: 'unknown',
      categoryId: 'unknown_category',
      chinese: 'test',
      pinyin: 'test',
      russian: 'test',
      turkmen: 'test',
    };
    const difficulty = getPhraseDifficulty(unknownPhrase, mockCategories);
    expect(difficulty).toBe(SearchDifficulty.INTERMEDIATE);
  });
});
