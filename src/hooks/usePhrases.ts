// src/hooks/usePhrases.ts
// Hook для работы с фразами в мультиязычной системе
import { useMemo } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { basePhrases } from '../data/languages/base';
import { getTranslationsForLanguage } from '../data/languages';
import { PhraseWithTranslation } from '../types';

/**
 * Hook для получения фраз с переводами на выбранный язык
 * Автоматически пересчитывается при смене языка
 */
export const usePhrases = () => {
  const { selectedLanguage } = useConfig();

  /**
   * Объединяем базовые фразы с переводами
   * Используем useMemo для оптимизации - пересчёт только при смене языка
   */
  const phrases = useMemo(() => {
    const translations = getTranslationsForLanguage(selectedLanguage);

    return basePhrases.map(basePhrase => {
      // Ищем перевод для текущей фразы
      const translation = translations.find(t => t.phraseId === basePhrase.id);

      return {
        ...basePhrase,
        translation: translation || {
          // Fallback: если перевод не найден, показываем туркменский
          text: basePhrase.turkmen,
          transcription: undefined
        }
      } as PhraseWithTranslation;
    });
  }, [selectedLanguage]);

  /**
   * Получить фразы по категории
   */
  const getPhrasesByCategory = (categoryId: string): PhraseWithTranslation[] => {
    return phrases.filter(phrase => phrase.categoryId === categoryId);
  };

  /**
   * Получить фразы по подкатегории
   */
  const getPhrasesBySubcategory = (subcategoryId: string): PhraseWithTranslation[] => {
    return phrases.filter(phrase => phrase.subcategoryId === subcategoryId);
  };

  /**
   * Получить фразу по ID
   */
  const getPhraseById = (id: string): PhraseWithTranslation | undefined => {
    return phrases.find(phrase => phrase.id === id);
  };

  /**
   * Поиск фраз (ищет в туркменском тексте и переводе)
   */
  const searchPhrases = (query: string): PhraseWithTranslation[] => {
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      return [];
    }

    return phrases.filter(phrase => {
      // Ищем в туркменском тексте
      const inTurkmen = phrase.turkmen.toLowerCase().includes(lowerQuery);

      // Ищем в переводе
      const inTranslation = phrase.translation.text.toLowerCase().includes(lowerQuery);

      // Ищем в транскрипции (если есть)
      const inTranscription = phrase.translation.transcription
        ? phrase.translation.transcription.toLowerCase().includes(lowerQuery)
        : false;

      return inTurkmen || inTranslation || inTranscription;
    });
  };

  /**
   * Получить статистику по фразам
   */
  const getStatistics = () => {
    const totalPhrases = phrases.length;
    const categories = new Set(phrases.map(p => p.categoryId)).size;
    const withSubcategories = phrases.filter(p => p.subcategoryId).length;
    const withAudio = phrases.filter(p => p.audioFileTurkmen).length;
    const withTranscription = phrases.filter(p => p.translation.transcription).length;

    return {
      totalPhrases,
      categories,
      withSubcategories,
      withAudio,
      withTranscription,
      audioPercentage: Math.round((withAudio / totalPhrases) * 100),
      transcriptionPercentage: Math.round((withTranscription / totalPhrases) * 100)
    };
  };

  return {
    phrases,                    // Все фразы с переводами
    getPhrasesByCategory,       // Фильтр по категории
    getPhrasesBySubcategory,    // Фильтр по подкатегории
    getPhraseById,              // Получить одну фразу
    searchPhrases,              // Поиск
    getStatistics,              // Статистика
  };
};
