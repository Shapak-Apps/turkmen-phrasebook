// src/hooks/useSearchHistory.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_HISTORY_KEY = 'shapak_search_history';
const MAX_HISTORY_ITEMS = 20; // Максимум 20 поисковых запросов

interface SearchHistoryItem {
  query: string;
  timestamp: number;
  resultsCount: number;
}

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем историю при инициализации
  useEffect(() => {
    loadSearchHistory();
  }, []);

  // Загрузка истории из AsyncStorage
  const loadSearchHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setSearchHistory(parsedHistory);
      }
    } catch (error) {
      console.warn('Ошибка загрузки истории поиска:', error);
    } finally {
      setLoading(false);
    }
  };

  // Сохранение истории в AsyncStorage
  const saveSearchHistory = async (newHistory: SearchHistoryItem[]) => {
    try {
      await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.warn('Ошибка сохранения истории поиска:', error);
    }
  };

  // Добавить поисковый запрос в историю
  const addToSearchHistory = (query: string, resultsCount: number = 0) => {
    if (!query.trim() || query.length < 2) return;

    const normalizedQuery = query.trim().toLowerCase();
    
    // Проверяем, есть ли уже такой запрос
    const existingIndex = searchHistory.findIndex(
      item => item.query.toLowerCase() === normalizedQuery
    );

    let newHistory: SearchHistoryItem[];

    if (existingIndex >= 0) {
      // Обновляем существующий запрос и перемещаем в начало
      const existingItem = searchHistory[existingIndex];
      newHistory = [
        { 
          query: query.trim(), // Сохраняем оригинальный регистр
          timestamp: Date.now(),
          resultsCount 
        },
        ...searchHistory.filter((_, index) => index !== existingIndex)
      ];
    } else {
      // Добавляем новый запрос в начало
      newHistory = [
        {
          query: query.trim(),
          timestamp: Date.now(),
          resultsCount
        },
        ...searchHistory
      ];
    }

    // Ограничиваем размер истории
    if (newHistory.length > MAX_HISTORY_ITEMS) {
      newHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);
    }

    setSearchHistory(newHistory);
    saveSearchHistory(newHistory);
  };

  // Удалить запрос из истории
  const removeFromSearchHistory = (query: string) => {
    const newHistory = searchHistory.filter(item => item.query !== query);
    setSearchHistory(newHistory);
    saveSearchHistory(newHistory);
  };

  // Очистить всю историю поиска
  const clearSearchHistory = async () => {
    setSearchHistory([]);
    try {
      await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
      console.warn('Ошибка очистки истории поиска:', error);
    }
  };

  // Получить популярные запросы (с наибольшим количеством результатов)
  const getPopularSearches = (limit: number = 5) => {
    return [...searchHistory]
      .sort((a, b) => b.resultsCount - a.resultsCount)
      .slice(0, limit);
  };

  // Получить недавние запросы
  const getRecentSearches = (limit: number = 10) => {
    return searchHistory.slice(0, limit);
  };

  return {
    searchHistory,
    loading,
    addToSearchHistory,
    removeFromSearchHistory,
    clearSearchHistory,
    getPopularSearches,
    getRecentSearches,
  };
}