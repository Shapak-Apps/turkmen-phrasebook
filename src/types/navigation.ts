// src/types/navigation.ts — маршруты единого стека.
// Старый разговорник и его стеки снесены в ТЗ-05.

/**
 * ГЛАВНЫЙ СТЕК НАВИГАЦИИ (Hub Architecture)
 * После выбора языка пользователь попадает на MainHub,
 * откуда открывает сценарный разговорник и настройки.
 */
export type RootStackParamList = {
  // Main Hub - центральный экран со всеми модулями
  MainHub: undefined;

  // Выбор языка интерфейса (первый запуск и смена из хаба/настроек)
  LanguageSelection: undefined;

  // Заглушка для модулей, которых ещё нет
  ComingSoon: { feature: 'voice' | 'visual' | 'ai' | 'translator' };

  Settings: undefined;
  About: undefined;

  // Сценарный разговорник (ТЗ-02)
  ScenarioHome: undefined;
  ScenarioFlow: { scenarioId: string };
  ScenarioPhrase: { phraseId: string };
  ShowScreen: { phraseId: string };
};

// ===== ВСПОМОГАТЕЛЬНЫЕ ТИПЫ =====

interface NavigationState {
  index: number;
  routes: Array<{ name: string; params?: Record<string, unknown> }>;
}

/**
 * Типы для хуков навигации
 */
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
