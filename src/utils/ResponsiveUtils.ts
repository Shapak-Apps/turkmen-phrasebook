import { Dimensions, Platform, PixelRatio, useWindowDimensions } from 'react-native';
import { useMemo } from 'react';

// Базовые размеры для расчета (iPhone 14/15 стандарт - 2024)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

// Получаем размеры экрана (статичные - для обратной совместимости)
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================================================
// REACT HOOK - useResponsive (Best Practice 2024-2025)
// ============================================================================

/**
 * 🎯 Реактивный хук для адаптивных размеров
 * Автоматически обновляется при изменении размеров окна
 *
 * @example
 * const { scale, verticalScale, isSmallPhone } = useResponsive();
 * <View style={{ padding: scale(16) }} />
 */
export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const widthRatio = width / BASE_WIDTH;
    const heightRatio = height / BASE_HEIGHT;

    // Функции масштабирования
    const scale = (size: number): number =>
      Math.round(PixelRatio.roundToNearestPixel(size * widthRatio));

    const verticalScale = (size: number): number =>
      Math.round(PixelRatio.roundToNearestPixel(size * heightRatio));

    const moderateScale = (size: number, factor: number = 0.5): number =>
      Math.round(PixelRatio.roundToNearestPixel(size + (scale(size) - size) * factor));

    // Улучшенные breakpoints для телефонов (2024)
    const deviceType = {
      // Размеры телефонов
      isSmallPhone: width < 375,           // iPhone SE, бюджетные Android < 375
      isMediumPhone: width >= 375 && width < 414,  // iPhone 14/15, средние 375-413
      isLargePhone: width >= 414,          // iPhone Pro Max, флагманы >= 414

      // Дополнительная детализация
      isVerySmallPhone: width < 360,       // Очень маленькие (старые Android)
      isExtraLargePhone: width >= 430,     // iPhone 15 Pro Max, Samsung Ultra
    };

    // Процентные размеры
    const wp = (percentage: number): number => (width * percentage) / 100;
    const hp = (percentage: number): number => (height * percentage) / 100;

    return {
      // Размеры экрана
      width,
      height,

      // Функции масштабирования
      scale,
      verticalScale,
      moderateScale,

      // Процентные размеры
      wp,
      hp,

      // Device type
      ...deviceType,

      // Платформа
      isIOS: Platform.OS === 'ios',
      isAndroid: Platform.OS === 'android',

      // Полезные соотношения
      aspectRatio: height / width,
      pixelRatio: PixelRatio.get(),
      fontScale: PixelRatio.getFontScale(),
    };
  }, [width, height]);
};

// ============================================================================
// СТАТИЧНЫЕ ФУНКЦИИ (для обратной совместимости)
// ============================================================================

// Вычисляем соотношения
const widthRatio = SCREEN_WIDTH / BASE_WIDTH;
const heightRatio = SCREEN_HEIGHT / BASE_HEIGHT;

/**
 * 📐 Масштабирование размеров для адаптивности
 */

/**
 * Горизонтальное масштабирование (для ширины, padding, margin)
 * @param size - размер в пикселях для базового экрана (375px)
 */
export const scale = (size: number): number => {
  const newSize = size * widthRatio;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Вертикальное масштабирование (для высоты, padding-vertical)
 * @param size - размер в пикселях для базового экрана (812px)
 */
export const verticalScale = (size: number): number => {
  const newSize = size * heightRatio;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Умеренное масштабирование (для шрифтов, иконок)
 * @param size - размер в пикселях
 * @param factor - коэффициент масштабирования (0-1, default: 0.5)
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  const newSize = size + (scale(size) - size) * factor;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * 📱 Информация об устройстве (статичная - для обратной совместимости)
 * ⚠️ Рекомендуется использовать useResponsive() хук для реактивных значений
 */
export const DeviceInfo = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,

  // Улучшенные breakpoints для телефонов (2024)
  isVerySmallPhone: SCREEN_WIDTH < 360,    // Очень маленькие Android
  isSmallPhone: SCREEN_WIDTH < 375,        // iPhone SE, бюджетные Android
  isMediumPhone: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,  // iPhone 14/15
  isLargePhone: SCREEN_WIDTH >= 414,       // iPhone Pro Max, флагманы
  isExtraLargePhone: SCREEN_WIDTH >= 430,  // iPhone 15 Pro Max, Samsung Ultra

  // Breakpoints для разных устройств (обратная совместимость)
  isSmallDevice: SCREEN_WIDTH < 360,
  isMediumDevice: SCREEN_WIDTH >= 360 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414 && SCREEN_WIDTH < 768,
  isTablet: SCREEN_WIDTH >= 768,

  // Старые breakpoints (обратная совместимость)
  isSmallScreen: SCREEN_WIDTH < 375,
  isMediumScreen: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeScreen: SCREEN_WIDTH >= 414,

  // Соотношение сторон
  aspectRatio: SCREEN_HEIGHT / SCREEN_WIDTH,

  // Платформа
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',

  // Плотность пикселей
  pixelRatio: PixelRatio.get(),
  fontScale: PixelRatio.getFontScale(),
};

/**
 * 🎯 Responsive утилиты
 */
export const ResponsiveUtils = {
  /**
   * Получить значение в зависимости от размера экрана
   */
  getValue: (small: number, medium: number, large: number, tablet?: number) => {
    if (DeviceInfo.isTablet && tablet !== undefined) return tablet;
    if (DeviceInfo.isSmallDevice) return small;
    if (DeviceInfo.isMediumDevice) return medium;
    return large;
  },

  /**
   * Responsive шрифты
   */
  fontSize: {
    // Заголовки
    h1: moderateScale(28),
    h2: moderateScale(24),
    h3: moderateScale(20),
    h4: moderateScale(18),

    // Тело
    body: moderateScale(16),
    bodySmall: moderateScale(14),
    caption: moderateScale(12),

    // Специфичные (для обратной совместимости)
    chineseText: DeviceInfo.isSmallDevice ? moderateScale(18) : moderateScale(20),
    pinyinText: DeviceInfo.isSmallDevice ? moderateScale(12) : moderateScale(14),
  },

  /**
   * Responsive размеры
   */
  dimensions: {
    // Карточки
    categoryCardHeight: DeviceInfo.isSmallDevice ? verticalScale(100) : verticalScale(120),
    phraseCardHeight: DeviceInfo.isSmallDevice ? verticalScale(120) : verticalScale(140),
    moduleCardWidth: DeviceInfo.isTablet ? scale(200) : (SCREEN_WIDTH - scale(48)) / 2,

    // Иконки
    iconSmall: moderateScale(20),
    iconMedium: moderateScale(24),
    iconLarge: moderateScale(32),
    iconXLarge: moderateScale(48),

    // Header
    headerHeight: verticalScale(56),

    // Inputs
    inputHeight: verticalScale(48),
    inputPadding: scale(16),

    // Buttons
    buttonHeight: verticalScale(48),
    buttonPadding: scale(16),
  },

  /**
   * Responsive отступы
   */
  spacing: {
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
    xxl: scale(48),
  },

  /**
   * Responsive border radius
   */
  borderRadius: {
    sm: scale(4),
    md: scale(8),
    lg: scale(12),
    xl: scale(16),
    xxl: scale(24),
    round: 9999,
  },
};

/**
 * 📏 Экспорт для удобства
 */
export const wp = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

export const hp = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

/**
 * Лимиты для размеров (для очень больших экранов)
 */
export const maxWidth = (width: number, max: number = 600): number => {
  return Math.min(width, max);
};

// ============================================================================
// ACCESSIBILITY - Dynamic Type Support (Best Practice 2024-2025)
// ============================================================================

/**
 * Получить системный коэффициент масштабирования шрифта
 * iOS: Dynamic Type
 * Android: Font Scale в настройках доступности
 */
export const getFontScale = (): number => {
  return PixelRatio.getFontScale();
};

/**
 * 🎯 Масштабирование шрифта с учётом accessibility
 * Ограничивает слишком большое/маленькое масштабирование
 *
 * @param size - базовый размер шрифта
 * @param maxScale - максимальное увеличение (default: 1.35 = 135%)
 * @param minScale - минимальное уменьшение (default: 0.85 = 85%)
 *
 * @example
 * // Базовое использование
 * <Text style={{ fontSize: accessibleFontSize(16) }}>Hello</Text>
 *
 * // С кастомными лимитами
 * <Text style={{ fontSize: accessibleFontSize(14, 1.2, 0.9) }}>Small text</Text>
 */
export const accessibleFontSize = (
  size: number,
  maxScale: number = 1.35,
  minScale: number = 0.85
): number => {
  const fontScale = PixelRatio.getFontScale();
  const clampedScale = Math.min(Math.max(fontScale, minScale), maxScale);
  return Math.round(size * clampedScale);
};

/**
 * Проверка: использует ли пользователь увеличенный шрифт
 */
export const isLargeTextEnabled = (): boolean => {
  return PixelRatio.getFontScale() > 1.0;
};

/**
 * Проверка: использует ли пользователь уменьшенный шрифт
 */
export const isSmallTextEnabled = (): boolean => {
  return PixelRatio.getFontScale() < 1.0;
};

/**
 * 🎯 Hook для accessibility-aware шрифтов
 *
 * @example
 * const { fontSize, isLargeText } = useAccessibleFonts();
 * <Text style={{ fontSize: fontSize(16) }}>Dynamic text</Text>
 */
export const useAccessibleFonts = () => {
  const fontScale = PixelRatio.getFontScale();

  return useMemo(() => ({
    fontScale,
    isLargeText: fontScale > 1.0,
    isSmallText: fontScale < 1.0,

    /**
     * Масштабировать размер шрифта с учётом системных настроек
     */
    fontSize: (size: number, maxScale: number = 1.35): number => {
      const clampedScale = Math.min(Math.max(fontScale, 0.85), maxScale);
      return Math.round(size * clampedScale);
    },

    /**
     * Предустановленные размеры шрифтов
     */
    sizes: {
      xs: accessibleFontSize(10),
      sm: accessibleFontSize(12),
      base: accessibleFontSize(14),
      md: accessibleFontSize(16),
      lg: accessibleFontSize(18),
      xl: accessibleFontSize(20),
      '2xl': accessibleFontSize(24),
      '3xl': accessibleFontSize(28),
      '4xl': accessibleFontSize(32),
    },
  }), [fontScale]);
};

export default {
  // Хуки (рекомендуется)
  useResponsive,
  useAccessibleFonts,

  // Статичные функции (обратная совместимость)
  scale,
  verticalScale,
  moderateScale,
  DeviceInfo,
  ResponsiveUtils,
  wp,
  hp,
  maxWidth,

  // Accessibility
  getFontScale,
  accessibleFontSize,
  isLargeTextEnabled,
  isSmallTextEnabled,
};