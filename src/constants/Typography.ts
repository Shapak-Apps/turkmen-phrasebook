// src/constants/Typography.ts - ФИНАЛЬНОЕ ИСПРАВЛЕНИЕ

import { TextStyle, Platform } from 'react-native';

// Встроенные цвета — Lingify палитра
const Colors = {
  text: '#1A1A1A',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textMuted: '#D1D5DB',
  buttonText: '#FFFFFF',
  buttonTextSecondary: '#1A1A1A',
  primary: '#2D8CFF',
  inputText: '#1A1A1A',
  inputPlaceholder: '#9CA3AF',
};

/**
 * ✅ СЕМЕЙСТВА ШРИФТОВ
 */
export const FontFamilies = {
  primary: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto',
    default: 'System',
  }) as string,
  
  secondary: Platform.select({
    ios: 'SF Pro Text',
    android: 'Roboto',
    default: 'System',
  }) as string,
  
  chinese: Platform.select({
    ios: 'PingFang SC',
    android: 'Noto Sans CJK SC',
    default: 'System',
  }) as string,
  
  turkmen: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto',
    default: 'System',
  }) as string,
  
  russian: Platform.select({
    ios: 'SF Pro Display',
    android: 'Roboto',
    default: 'System',
  }) as string,
};

/**
 * ✅ РАЗМЕРЫ ШРИФТОВ
 */
export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  h6: 16,
  h5: 18,
  h4: 20,
  h3: 24,
  h2: 28,
  h1: 32,
  caption: 12,
  overline: 10,
  button: 16,
  input: 16,
} as const;

/**
 * ✅ ВЕСА ШРИФТОВ
 */
export const FontWeights = {
  thin: '100',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
} as const;

/**
 * ✅ ВЫСОТА СТРОК
 */
export const LineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
  h1: 1.1,
  h2: 1.15,
  h3: 1.2,
  h4: 1.25,
  h5: 1.3,
  h6: 1.35,
  body: 1.5,
  caption: 1.4,
} as const;

/**
 * ✅ МЕЖБУКВЕННЫЕ ИНТЕРВАЛЫ
 */
export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
  heading: -0.25,
  button: 0.5,
  caption: 0.25,
} as const;

/**
 * ✅ ОСНОВНЫЕ СТИЛИ ТЕКСТА
 */
export const TextStyles = {
  // ЗАГОЛОВКИ
  h1: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.h1,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.h1 * LineHeights.h1,
    letterSpacing: LetterSpacing.heading,
    color: Colors.text,
  } as TextStyle,
  
  h2: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.h2,
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes.h2 * LineHeights.h2,
    letterSpacing: LetterSpacing.heading,
    color: Colors.text,
  } as TextStyle,
  
  h3: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.h3 * LineHeights.h3,
    letterSpacing: LetterSpacing.heading,
    color: Colors.text,
  } as TextStyle,
  
  h4: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.h4,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.h4 * LineHeights.h4,
    letterSpacing: LetterSpacing.normal,
    color: Colors.text,
  } as TextStyle,
  
  h5: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.h5,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.h5 * LineHeights.h5,
    letterSpacing: LetterSpacing.normal,
    color: Colors.text,
  } as TextStyle,
  
  h6: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.h6,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.h6 * LineHeights.h6,
    letterSpacing: LetterSpacing.normal,
    color: Colors.text,
  } as TextStyle,
  
  // ОСНОВНОЙ ТЕКСТ
  title: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.lg * LineHeights.body,
    letterSpacing: LetterSpacing.normal,
    color: Colors.text,
  } as TextStyle,
  
  subtitle: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.base * LineHeights.body,
    letterSpacing: LetterSpacing.normal,
    color: Colors.textSecondary,
  } as TextStyle,
  
  body: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.base * LineHeights.body,
    letterSpacing: LetterSpacing.normal,
    color: Colors.text,
  } as TextStyle,
  
  bodyLarge: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.lg * LineHeights.body,
    letterSpacing: LetterSpacing.normal,
    color: Colors.text,
  } as TextStyle,
  
  bodySmall: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.sm * LineHeights.body,
    letterSpacing: LetterSpacing.normal,
    color: Colors.textSecondary,
  } as TextStyle,
  
  // ВСПОМОГАТЕЛЬНЫЙ ТЕКСТ
  caption: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.caption * LineHeights.caption,
    letterSpacing: LetterSpacing.caption,
    color: Colors.textLight,
  } as TextStyle,
  
  overline: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.overline,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.overline * LineHeights.normal,
    letterSpacing: LetterSpacing.wider,
    color: Colors.textMuted,
    textTransform: 'uppercase',
  } as TextStyle,
  
  // ИНТЕРАКТИВНЫЕ ЭЛЕМЕНТЫ
  button: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.button,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.button * LineHeights.normal,
    letterSpacing: LetterSpacing.button,
    color: Colors.buttonText,
  } as TextStyle,
  
  buttonSecondary: {
    fontFamily: FontFamilies.primary,
    fontSize: FontSizes.button,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.button * LineHeights.normal,
    letterSpacing: LetterSpacing.button,
    color: Colors.buttonTextSecondary,
  } as TextStyle,
  
  link: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.base * LineHeights.body,
    letterSpacing: LetterSpacing.normal,
    color: Colors.primary,
    textDecorationLine: 'underline',
  } as TextStyle,
  
  // ФОРМЫ
  input: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.input,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.input * LineHeights.normal,
    letterSpacing: LetterSpacing.normal,
    color: Colors.inputText,
  } as TextStyle,
  
  inputLabel: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.sm * LineHeights.normal,
    letterSpacing: LetterSpacing.normal,
    color: Colors.textSecondary,
  } as TextStyle,
  
  placeholder: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.input,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.input * LineHeights.normal,
    letterSpacing: LetterSpacing.normal,
    color: Colors.inputPlaceholder,
  } as TextStyle,
  
  // СПЕЦИАЛЬНЫЕ СТИЛИ ДЛЯ РАЗНЫХ ЯЗЫКОВ
  chinese: {
    fontFamily: FontFamilies.chinese,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.lg * 1.3,
    letterSpacing: LetterSpacing.normal,
    color: Colors.text,
  } as TextStyle,
  
  chineseLarge: {
    fontFamily: FontFamilies.chinese,
    fontSize: FontSizes.h3,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.h3 * 1.3,
    letterSpacing: LetterSpacing.normal,
    color: Colors.text,
  } as TextStyle,
  
  pinyin: {
    fontFamily: FontFamilies.secondary,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.sm * LineHeights.body,
    letterSpacing: LetterSpacing.wide,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  } as TextStyle,
  
  turkmen: {
    fontFamily: FontFamilies.turkmen,
    fontSize: FontSizes.base,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.base * LineHeights.body,
    letterSpacing: LetterSpacing.normal,
    color: Colors.text,
  } as TextStyle,
  
  russian: {
    fontFamily: FontFamilies.russian,
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.normal,
    lineHeight: FontSizes.sm * LineHeights.body,
    letterSpacing: LetterSpacing.normal,
    color: Colors.textLight,
  } as TextStyle,
};

/**
 * ✅ УТИЛИТЫ для работы с типографикой
 */
export const TypographyUtils = {
  /**
   * Получить стиль для заголовка определенного уровня
   */
  getHeadingStyle: (level: 1 | 2 | 3 | 4 | 5 | 6) => {
    const styleMap = {
      1: TextStyles.h1,
      2: TextStyles.h2,
      3: TextStyles.h3,
      4: TextStyles.h4,
      5: TextStyles.h5,
      6: TextStyles.h6,
    };
    return styleMap[level];
  },
  
  /**
   * Создать стиль с измененным размером шрифта
   */
  withFontSize: (baseStyle: any, fontSize: number) => ({
    ...baseStyle,
    fontSize,
    lineHeight: fontSize * 1.4,
  }),
  
  /**
   * Создать стиль с измененным цветом
   */
  withColor: (baseStyle: any, color: string) => ({
    ...baseStyle,
    color,
  }),
  
  /**
   * Создать стиль для языка
   */
  getLanguageStyle: (language: 'chinese' | 'pinyin' | 'turkmen' | 'russian') => {
    const styleMap = {
      chinese: TextStyles.chinese,
      pinyin: TextStyles.pinyin,
      turkmen: TextStyles.turkmen,
      russian: TextStyles.russian,
    };
    return styleMap[language] || TextStyles.body;
  },
  
  /**
   * Адаптивный размер шрифта
   */
  getResponsiveFontSize: (baseSize: number, screenWidth: number) => {
    if (screenWidth < 350) return baseSize * 0.9;
    if (screenWidth > 400) return baseSize * 1.1;
    return baseSize;
  },
  
  /**
   * Получить стиль текста для кнопки
   */
  getButtonTextStyle: (variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient' = 'primary') => {
    switch (variant) {
      case 'primary':
      case 'gradient':
        return TextStyles.button;
      case 'secondary':
      case 'outline':
      case 'ghost':
        return TextStyles.buttonSecondary;
      default:
        return TextStyles.button;
    }
  },
};

// ✅ ЭКСПОРТ
export default TextStyles;