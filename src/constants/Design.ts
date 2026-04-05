// src/constants/Design.ts
// ДИЗАЙН-СИСТЕМА — стиль Lingify

import { TextStyle, ViewStyle, Platform } from 'react-native';

/**
 * ЦВЕТОВАЯ ПАЛИТРА — Lingify
 */
export const DesignColors = {
  // Основной акцент — синий
  primary: '#2D8CFF',
  primaryLight: '#5AA3FF',
  primaryDark: '#1A6FD6',

  // Фоновые цвета
  background: '#FFFFFF',
  backgroundGray: '#F9FAFB',
  backgroundDark: '#F3F4F6',

  // Текстовые цвета
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textWhite: '#FFFFFF',

  // Границы и разделители
  border: '#E5E7EB',
  divider: '#E5E7EB',

  // Карточки
  card: '#FFFFFF',
  cardBorder: '#E5E7EB',

  // Статус-цвета
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#2D8CFF',

  // Акцентные цвета для модулей — один синий
  modulePhrasebook: '#2D8CFF',
  moduleVisual: '#2D8CFF',
  moduleText: '#2D8CFF',
  moduleDictionary: '#2D8CFF',
  moduleAI: '#2D8CFF',
  moduleFavorites: '#2D8CFF',
} as const;

/**
 * ОТСТУПЫ — 4px grid
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Специфичные отступы — больше воздуха
  screenPadding: 20,
  cardPadding: 16,
  sectionGap: 28,
  itemGap: 16,
} as const;

/**
 * ТИПОГРАФИКА
 */
export const Typography = {
  // Размеры
  h1: 28,
  h2: 24,
  h3: 20,
  h4: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,

  // Веса
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,

  // Семейства шрифтов
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
} as const;

/**
 * ТЕНИ — минимальные (Lingify: без теней)
 */
export const Shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 0,
  },

  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;

/**
 * РАДИУСЫ СКРУГЛЕНИЯ — Lingify: 12-16px
 */
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 9999,
} as const;

/**
 * ГОТОВЫЕ КОМПОНЕНТЫ-СТИЛИ
 */
export const Components = {
  // Header
  header: {
    height: 56,
    backgroundColor: DesignColors.background,
    borderBottomWidth: 1,
    borderBottomColor: DesignColors.border,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },

  headerTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.semibold,
    color: DesignColors.text,
    fontFamily: Typography.fontFamily,
  },

  // Модуль — простой список без тяжёлых карточек
  moduleCard: {
    backgroundColor: DesignColors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: DesignColors.cardBorder,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.none,
  },

  moduleTitle: {
    fontSize: Typography.h4,
    fontWeight: Typography.semibold,
    color: DesignColors.text,
    marginBottom: Spacing.xs,
    fontFamily: Typography.fontFamily,
  },

  moduleSubtitle: {
    fontSize: Typography.bodySmall,
    fontWeight: Typography.regular,
    color: DesignColors.textSecondary,
    fontFamily: Typography.fontFamily,
  },

  // Кнопка primary — синий filled
  button: {
    backgroundColor: DesignColors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    ...Shadows.none,
  },

  buttonText: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: DesignColors.textWhite,
    fontFamily: Typography.fontFamily,
  },

  // Кнопка secondary — outline
  buttonSecondary: {
    backgroundColor: DesignColors.background,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: DesignColors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  buttonSecondaryText: {
    fontSize: Typography.body,
    fontWeight: Typography.semibold,
    color: DesignColors.primary,
    fontFamily: Typography.fontFamily,
  },

  // Контейнер экрана
  screenContainer: {
    flex: 1,
    backgroundColor: DesignColors.background,
  },

  screenContent: {
    flex: 1,
    paddingHorizontal: Spacing.screenPadding,
  },

  // Секция
  section: {
    marginBottom: Spacing.sectionGap,
  },

  sectionTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.semibold,
    color: DesignColors.text,
    marginBottom: Spacing.md,
    fontFamily: Typography.fontFamily,
  },

  // Разделитель — тонкий 1px
  divider: {
    height: 1,
    backgroundColor: DesignColors.divider,
    marginVertical: Spacing.sm,
  },
} as const;

/**
 * КОНСТАНТЫ РАЗМЕРОВ
 */
export const Sizes = {
  headerHeight: 56,
  tabBarHeight: 60,
  buttonHeight: 48,
  inputHeight: 48,
  iconSmall: 20,
  iconMedium: 24,
  iconLarge: 32,
} as const;

export default {
  Colors: DesignColors,
  Spacing,
  Typography,
  Shadows,
  BorderRadius,
  Components,
  Sizes,
};
