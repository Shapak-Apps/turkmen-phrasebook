// src/types/navigation.ts - Обновленные типы навигации (Hub Architecture)
// ✅ Phase 1 & Phase 2 - Полностью обновлено

import type { Category, SubCategory, Phrase, PhraseWithTranslation } from './index';

/**
 * ГЛАВНЫЙ СТЕК НАВИГАЦИИ (Hub Architecture)
 * После выбора языка пользователь попадает на MainHub,
 * откуда может перейти в любой из модулей
 */
export type RootStackParamList = {
  // Main Hub - центральный экран со всеми модулями
  MainHub: undefined;

  // Language Selection - выбор языка интерфейса
  LanguageSelection: undefined;

  // Onboarding - первичная настройка приложения
  Onboarding: undefined;

  // Phrasebook Module (Phase 1 - Ready)
  Home: undefined;  // Phrasebook Home Stack
  PhraseDetail: { phrase: PhraseWithTranslation };

  // Visual Translator Module (Phase 2 - Coming in v1.5)
  VisualTranslator: undefined;

  // Text Translator Module (Phase 3 - Ready)
  TextTranslator: undefined;

  // Coming Soon Screen (for unreleased features)
  ComingSoon: { feature: 'voice' | 'visual' | 'ai' | 'translator' };

  // AI Assistants Module (Phase 4 - Ready)
  UniversalAIChat: undefined; // Universal AI assistant (replaces old separate assistants)

  // Dictionary Module (v2.0 - Coming Soon Placeholder)
  Dictionary: undefined;

  // Additional Features (Search, Favorites, Stats)
  AdditionalFeatures: undefined;

  // Settings
  Settings: undefined;
  // About
  About: undefined;
};

/**
 * PHRASEBOOK HOME STACK
 * Навигация внутри модуля Phrasebook
 */
export type HomeStackParamList = {
  LanguagePairSelection: undefined; // Выбор языковой пары при первом запуске
  HomeScreen: undefined;
  CategoryScreen: { category: Category };
  SubCategoryScreen?: {
    subcategory: SubCategory;
    parentCategory: Category;
  };
  PhraseDetail: { phrase: PhraseWithTranslation };
  AskAIScreen: { phrase: PhraseWithTranslation; categoryId: string };
};

/**
 * ADDITIONAL FEATURES STACK
 * Search, Favorites, Stats, Recent
 */
export type AdditionalFeaturesStackParamList = {
  AdditionalFeaturesMain: undefined;
  Search: undefined;
  Favorites: undefined;
  Stats: undefined;
  Recent?: undefined;
};

// Visual Translator removed - Coming in v1.5

// ===== DEPRECATED (Старые типы - оставлены для обратной совместимости) =====

/**
 * @deprecated Используйте RootStackParamList
 * Старые bottom tabs были заменены на Hub-архитектуру
 */
export type MainTabParamList = {
  Home: undefined;
  AdditionalFeatures: undefined;
  Settings: undefined;
  // About
  About: undefined;
};

// ===== ВСПОМОГАТЕЛЬНЫЕ ТИПЫ =====

/**
 * Типы для хуков навигации
 */
interface NavigationState {
  index: number;
  routes: Array<{ name: string; params?: Record<string, unknown> }>;
}

export type NavigationProp<T extends keyof RootStackParamList> = {
  navigate: (screen: T, params?: RootStackParamList[T]) => void;
  goBack: () => void;
  push: (screen: T, params?: RootStackParamList[T]) => void;
  replace: (screen: T, params?: RootStackParamList[T]) => void;
  reset: (state: NavigationState) => void;
};

/**
 * Типы для route параметров
 */
export type RouteProp<T extends keyof RootStackParamList> = {
  params: RootStackParamList[T];
  key: string;
  name: T;
};

// ===== ЭКСПОРТ =====

export type {
  Category,
  SubCategory,
  Phrase,
  PhraseWithTranslation,
};
