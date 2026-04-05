// src/hooks/useFavorites.ts - ИСПРАВЛЕННАЯ ВЕРСИЯ
import { useState, useEffect, useCallback } from 'react';
import { PhraseWithTranslation } from '../types';
import { SafeStorage } from '../utils/SafeStorage';
import { useErrorHandler } from './useErrorHandler';

const FAVORITES_STORAGE_KEY = 'shapak_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError, showErrorAlert } = useErrorHandler();

  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const result = await SafeStorage.getItem<string[]>(FAVORITES_STORAGE_KEY, []);
      
      if (result.success) {
        setFavorites(result.data || []);
      } else {
        handleError(new Error(result.error), 'loading favorites');
        showErrorAlert('Ошибка загрузки', 'Не удалось загрузить избранные фразы');
      }
    } catch (error) {
      handleError(error, 'favorites initialization');
    } finally {
      setLoading(false);
    }
  }, [handleError, showErrorAlert]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const saveFavorites = useCallback(async (newFavorites: string[]) => {
    const result = await SafeStorage.setItem(FAVORITES_STORAGE_KEY, newFavorites);
    
    if (!result.success) {
      handleError(new Error(result.error), 'saving favorites');
      showErrorAlert('Ошибка сохранения', 'Не удалось сохранить изменения в избранном');
      return false;
    }
    
    return true;
  }, [handleError, showErrorAlert]);

  // ИСПРАВЛЕНО: Сначала объявляем isFavorite
  const isFavorite = useCallback((phraseId: string): boolean => {
    return favorites.includes(phraseId);
  }, [favorites]);

  const addToFavorites = useCallback(async (phraseId: string) => {
    if (favorites.includes(phraseId)) return;

    const newFavorites = [...favorites, phraseId];
    const saved = await saveFavorites(newFavorites);
    
    if (saved) {
      setFavorites(newFavorites);
    }
  }, [favorites, saveFavorites]);

  const removeFromFavorites = useCallback(async (phraseId: string) => {
    if (!favorites.includes(phraseId)) return;

    const newFavorites = favorites.filter(id => id !== phraseId);
    const saved = await saveFavorites(newFavorites);
    
    if (saved) {
      setFavorites(newFavorites);
    }
  }, [favorites, saveFavorites]);

  // ИСПРАВЛЕНО: Теперь toggleFavorite объявляется ПОСЛЕ isFavorite
  const toggleFavorite = useCallback(async (phraseId: string) => {
    if (isFavorite(phraseId)) {
      await removeFromFavorites(phraseId);
    } else {
      await addToFavorites(phraseId);
    }
  }, [isFavorite, removeFromFavorites, addToFavorites]);

  const getFavoritesPhrases = useCallback((allPhrases: PhraseWithTranslation[]): PhraseWithTranslation[] => {
    return allPhrases.filter(phrase => favorites.includes(phrase.id));
  }, [favorites]);

  const clearAllFavorites = useCallback(async () => {
    const result = await SafeStorage.removeItem(FAVORITES_STORAGE_KEY);
    
    if (result.success) {
      setFavorites([]);
    } else {
      handleError(new Error(result.error), 'clearing favorites');
      showErrorAlert('Ошибка очистки', 'Не удалось очистить избранное');
    }
  }, [handleError, showErrorAlert]);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesPhrases,
    clearAllFavorites,
    reloadFavorites: loadFavorites,
  };
}