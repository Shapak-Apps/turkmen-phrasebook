// src/hooks/useHistory.ts - Расширенная версия с аналитикой
import { useState, useEffect, useCallback, useMemo } from 'react';
import { PhraseWithTranslation, Category } from '../types';
import { SafeStorage } from '../utils/SafeStorage';
import { useErrorHandler } from './useErrorHandler';

const HISTORY_STORAGE_KEY = 'shapak_history_v2';
const STATS_STORAGE_KEY = 'shapak_stats_v2';
const SESSIONS_STORAGE_KEY = 'shapak_sessions_v2';
const MAX_HISTORY_ITEMS = 200; // Увеличиваем для статистики

interface HistoryItem {
  phraseId: string;
  categoryId: string;
  viewedAt: number;
  viewCount: number;
  sessionId: string;
  studyTime: number; // время на изучение фразы в секундах
}

interface StudySession {
  id: string;
  startTime: number;
  endTime?: number;
  phrasesCount: number;
  categoriesUsed: string[];
  totalTime: number; // в секундах
}

interface StudyStats {
  totalViews: number;
  uniquePhrases: number;
  totalStudyTime: number; // в минутах
  sessionsCount: number;
  averageSessionTime: number;
  streakDays: number;
  lastStudyDate: number;
  bestStreakDays: number;
  categoriesProgress: Record<string, {
    phrasesStudied: number;
    totalViews: number;
    lastStudied: number;
    averageTime: number;
  }>;
  weeklyStats: Array<{
    weekStart: number;
    phrasesStudied: number;
    timeSpent: number;
    sessionsCount: number;
  }>;
  dailyGoal: {
    phrasesPerDay: number;
    currentStreak: number;
    achieved: boolean;
    lastAchieved: number;
  };
}

const DEFAULT_STATS: StudyStats = {
  totalViews: 0,
  uniquePhrases: 0,
  totalStudyTime: 0,
  sessionsCount: 0,
  averageSessionTime: 0,
  streakDays: 0,
  lastStudyDate: 0,
  bestStreakDays: 0,
  categoriesProgress: {},
  weeklyStats: [],
  dailyGoal: {
    phrasesPerDay: 10,
    currentStreak: 0,
    achieved: false,
    lastAchieved: 0,
  }
};

// Генерация уникального ID сессии
const generateSessionId = () => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Вспомогательные функции для дат
const getWeekStart = (date: number) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff)).setHours(0, 0, 0, 0);
};

const getDayStart = (date: number) => {
  return new Date(date).setHours(0, 0, 0, 0);
};

const isSameDay = (date1: number, date2: number) => {
  return getDayStart(date1) === getDayStart(date2);
};

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<StudyStats>(DEFAULT_STATS);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [loading, setLoading] = useState(true);
  const [phraseStartTime, setPhraseStartTime] = useState<number | null>(null);
  
  const { handleError } = useErrorHandler();

  // Загрузка всех данных при инициализации
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Параллельная загрузка всех данных
      const [historyResult, statsResult, sessionsResult] = await Promise.all([
        SafeStorage.getItem<HistoryItem[]>(HISTORY_STORAGE_KEY, []),
        SafeStorage.getItem<StudyStats>(STATS_STORAGE_KEY, DEFAULT_STATS),
        SafeStorage.getItem<StudySession[]>(SESSIONS_STORAGE_KEY, [])
      ]);

      if (historyResult.success) {
        setHistory(historyResult.data || []);
      } else {
        handleError(new Error(historyResult.error), 'loading history');
      }

      if (statsResult.success) {
        setStats(prevStats => ({ ...DEFAULT_STATS, ...statsResult.data }));
      } else {
        handleError(new Error(statsResult.error), 'loading stats');
      }

      if (sessionsResult.success) {
        setSessions(sessionsResult.data || []);
      } else {
        handleError(new Error(sessionsResult.error), 'loading sessions');
      }

    } catch (error) {
      handleError(error, 'loading study data');
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Сохранение истории
  const saveHistory = useCallback(async (newHistory: HistoryItem[]) => {
    const result = await SafeStorage.setItem(HISTORY_STORAGE_KEY, newHistory);
    if (!result.success) {
      handleError(new Error(result.error), 'saving history');
    }
  }, [handleError]);

  // Сохранение статистики
  const saveStats = useCallback(async (newStats: StudyStats) => {
    const result = await SafeStorage.setItem(STATS_STORAGE_KEY, newStats);
    if (!result.success) {
      handleError(new Error(result.error), 'saving stats');
    }
  }, [handleError]);

  // Сохранение сессий
  const saveSessions = useCallback(async (newSessions: StudySession[]) => {
    const result = await SafeStorage.setItem(SESSIONS_STORAGE_KEY, newSessions);
    if (!result.success) {
      handleError(new Error(result.error), 'saving sessions');
    }
  }, [handleError]);

  // Начать новую сессию обучения
  const startStudySession = useCallback(() => {
    if (currentSession) return currentSession.id;

    const session: StudySession = {
      id: generateSessionId(),
      startTime: Date.now(),
      phrasesCount: 0,
      categoriesUsed: [],
      totalTime: 0,
    };

    setCurrentSession(session);
    return session.id;
  }, [currentSession]);

  // Завершить текущую сессию
  const endStudySession = useCallback(async () => {
    if (!currentSession) return;

    const endTime = Date.now();
    const totalTime = Math.round((endTime - currentSession.startTime) / 1000);
    
    const completedSession: StudySession = {
      ...currentSession,
      endTime,
      totalTime,
    };

    const newSessions = [...sessions, completedSession].slice(-50); // Храним только последние 50 сессий
    setSessions(newSessions);
    await saveSessions(newSessions);

    // Обновляем общую статистику
    const updatedStats = {
      ...stats,
      sessionsCount: stats.sessionsCount + 1,
      totalStudyTime: stats.totalStudyTime + Math.round(totalTime / 60),
      averageSessionTime: Math.round((stats.totalStudyTime * stats.sessionsCount + totalTime) / (stats.sessionsCount + 1) / 60),
    };

    setStats(updatedStats);
    await saveStats(updatedStats);
    
    setCurrentSession(null);
  }, [currentSession, sessions, stats, saveSessions, saveStats]);

  // Добавить фразу в историю с расширенной аналитикой
  const addToHistory = useCallback(async (phraseId: string, categoryId?: string) => {
    const now = Date.now();
    let sessionId = currentSession?.id;
    
    // Автоматически начинаем сессию если её нет
    if (!sessionId) {
      sessionId = startStudySession();
    }

    // Вычисляем время изучения фразы
    const studyTime = phraseStartTime ? Math.round((now - phraseStartTime) / 1000) : 1;
    setPhraseStartTime(now); // Начинаем отсчет для следующей фразы

    const existingIndex = history.findIndex(item => item.phraseId === phraseId);
    
    let newHistory: HistoryItem[];
    let isNewPhrase = false;

    if (existingIndex >= 0) {
      // Обновляем существующую запись
      newHistory = [...history];
      const existingItem = newHistory[existingIndex];
      newHistory[existingIndex] = {
        ...existingItem,
        viewedAt: now,
        viewCount: existingItem.viewCount + 1,
        sessionId: sessionId || existingItem.sessionId,
        studyTime: existingItem.studyTime + studyTime,
      };
      
      // Перемещаем в начало
      const updatedItem = newHistory.splice(existingIndex, 1)[0];
      newHistory.unshift(updatedItem);
    } else {
      // Новая фраза
      isNewPhrase = true;
      newHistory = [{
        phraseId,
        categoryId: categoryId || 'unknown',
        viewedAt: now,
        viewCount: 1,
        sessionId: sessionId || 'unknown',
        studyTime,
      }, ...history];
    }

    // Ограничиваем размер истории
    if (newHistory.length > MAX_HISTORY_ITEMS) {
      newHistory = newHistory.slice(0, MAX_HISTORY_ITEMS);
    }

    setHistory(newHistory);
    await saveHistory(newHistory);

    // Обновляем текущую сессию
    if (currentSession && categoryId) {
      const updatedSession = {
        ...currentSession,
        phrasesCount: isNewPhrase ? currentSession.phrasesCount + 1 : currentSession.phrasesCount,
        categoriesUsed: currentSession.categoriesUsed.includes(categoryId) 
          ? currentSession.categoriesUsed 
          : [...currentSession.categoriesUsed, categoryId],
      };
      setCurrentSession(updatedSession);
    }

    // Обновляем статистику
    await updateStats(newHistory, categoryId, now, studyTime, isNewPhrase);
  }, [history, currentSession, phraseStartTime, startStudySession, saveHistory]);

  // Обновление статистики
  const updateStats = useCallback(async (
    newHistory: HistoryItem[], 
    categoryId: string | undefined, 
    now: number, 
    studyTime: number,
    isNewPhrase: boolean
  ) => {
    const updatedStats = { ...stats };
    
    // Основные метрики
    updatedStats.totalViews += 1;
    if (isNewPhrase) {
      updatedStats.uniquePhrases += 1;
    }
    updatedStats.totalStudyTime += Math.round(studyTime / 60);
    updatedStats.lastStudyDate = now;

    // Стрик дней
    const today = getDayStart(now);
    const lastStudy = getDayStart(stats.lastStudyDate);
    const yesterday = getDayStart(now - 24 * 60 * 60 * 1000);

    if (lastStudy === today) {
      // Сегодня уже учились, стрик не меняется
    } else if (lastStudy === yesterday) {
      // Вчера учились, продолжаем стрик
      updatedStats.streakDays += 1;
    } else if (lastStudy < yesterday) {
      // Пропуск, стрик сбрасывается
      updatedStats.streakDays = 1;
    }

    // Лучший стрик
    if (updatedStats.streakDays > updatedStats.bestStreakDays) {
      updatedStats.bestStreakDays = updatedStats.streakDays;
    }

    // Прогресс по категориям
    if (categoryId && categoryId !== 'unknown') {
      if (!updatedStats.categoriesProgress[categoryId]) {
        updatedStats.categoriesProgress[categoryId] = {
          phrasesStudied: 0,
          totalViews: 0,
          lastStudied: now,
          averageTime: 0,
        };
      }
      
      const categoryProgress = updatedStats.categoriesProgress[categoryId];
      if (isNewPhrase) {
        categoryProgress.phrasesStudied += 1;
      }
      categoryProgress.totalViews += 1;
      categoryProgress.lastStudied = now;
      categoryProgress.averageTime = Math.round(
        (categoryProgress.averageTime * (categoryProgress.totalViews - 1) + studyTime) / categoryProgress.totalViews
      );
    }

    // Недельная статистика
    const weekStart = getWeekStart(now);
    const existingWeekIndex = updatedStats.weeklyStats.findIndex(week => week.weekStart === weekStart);
    
    if (existingWeekIndex >= 0) {
      const weekStat = updatedStats.weeklyStats[existingWeekIndex];
      if (isNewPhrase) {
        weekStat.phrasesStudied += 1;
      }
      weekStat.timeSpent += Math.round(studyTime / 60);
    } else {
      updatedStats.weeklyStats.push({
        weekStart,
        phrasesStudied: isNewPhrase ? 1 : 0,
        timeSpent: Math.round(studyTime / 60),
        sessionsCount: 0,
      });
      
      // Храним только последние 12 недель
      updatedStats.weeklyStats = updatedStats.weeklyStats.slice(-12);
    }

    // Дневная цель
    const todaysPhrases = newHistory.filter(item => 
      isSameDay(item.viewedAt, now)
    ).length;
    
    updatedStats.dailyGoal.achieved = todaysPhrases >= updatedStats.dailyGoal.phrasesPerDay;
    if (updatedStats.dailyGoal.achieved && !isSameDay(updatedStats.dailyGoal.lastAchieved, now)) {
      updatedStats.dailyGoal.currentStreak += 1;
      updatedStats.dailyGoal.lastAchieved = now;
    }

    setStats(updatedStats);
    await saveStats(updatedStats);
  }, [stats, saveStats]);

  // Получить недавние фразы
  const getRecentPhrases = useCallback((allPhrases: PhraseWithTranslation[], limit: number = 10): PhraseWithTranslation[] => {
    return history
      .slice(0, limit)
      .map(historyItem =>
        allPhrases.find(phrase => phrase.id === historyItem.phraseId)
      )
      .filter(phrase => phrase !== undefined) as PhraseWithTranslation[];
  }, [history]);

  // Получить статистику по категориям
  const getCategoryStats = useCallback((categories: Category[]) => {
    return categories.map(category => {
      const categoryData = stats.categoriesProgress[category.id];
      const categoryHistory = history.filter(item => item.categoryId === category.id);
      
      return {
        category,
        phrasesStudied: categoryData?.phrasesStudied || 0,
        totalViews: categoryData?.totalViews || 0,
        lastStudied: categoryData?.lastStudied || 0,
        averageTime: categoryData?.averageTime || 0,
        recentActivity: categoryHistory.slice(0, 3),
        progressPercentage: 0, // Будет вычислено на основе общего количества фраз в категории
      };
    });
  }, [stats.categoriesProgress, history]);

  // Получить тренды обучения
  const getLearningTrends = useCallback(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = Date.now() - (6 - i) * 24 * 60 * 60 * 1000;
      const dayStart = getDayStart(date);
      const dayEnd = dayStart + 24 * 60 * 60 * 1000 - 1;
      
      const dayHistory = history.filter(item => 
        item.viewedAt >= dayStart && item.viewedAt <= dayEnd
      );
      
      return {
        date: dayStart,
        phrasesStudied: dayHistory.length,
        uniquePhrases: new Set(dayHistory.map(item => item.phraseId)).size,
        timeSpent: Math.round(dayHistory.reduce((sum, item) => sum + item.studyTime, 0) / 60),
      };
    });

    return last7Days;
  }, [history]);

  // Очистить историю
  const clearHistory = useCallback(async () => {
    setHistory([]);
    setStats(DEFAULT_STATS);
    setSessions([]);
    setCurrentSession(null);
    
    await Promise.all([
      SafeStorage.removeItem(HISTORY_STORAGE_KEY),
      SafeStorage.removeItem(STATS_STORAGE_KEY),
      SafeStorage.removeItem(SESSIONS_STORAGE_KEY),
    ]);
  }, []);

  // Установить дневную цель
  const setDailyGoal = useCallback(async (phrasesPerDay: number) => {
    const updatedStats = {
      ...stats,
      dailyGoal: {
        ...stats.dailyGoal,
        phrasesPerDay,
      }
    };
    
    setStats(updatedStats);
    await saveStats(updatedStats);
  }, [stats, saveStats]);

  // Мемоизированная общая статистика для производительности
  const memoizedStats = useMemo(() => ({
    ...stats,
    todaysPhrases: history.filter(item => isSameDay(item.viewedAt, Date.now())).length,
    thisWeekPhrases: history.filter(item => 
      item.viewedAt >= getWeekStart(Date.now())
    ).length,
  }), [stats, history]);

  return {
    // Состояние
    history,
    stats: memoizedStats,
    sessions,
    currentSession,
    loading,
    
    // Основные функции
    addToHistory,
    clearHistory,
    
    // Сессии
    startStudySession,
    endStudySession,
    
    // Получение данных
    getRecentPhrases,
    getCategoryStats,
    getLearningTrends,
    
    // Настройки
    setDailyGoal,
    
    // Устаревшие методы для совместимости
    getHistoryPhrases: (allPhrases: PhraseWithTranslation[]) => getRecentPhrases(allPhrases, history.length),
    getStats: () => memoizedStats,
  };
}