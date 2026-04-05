/**
 * PlatformStyles - Best Practice 2024-2025
 *
 * Утилиты для платформо-специфичных стилей iOS/Android.
 * Обеспечивает нативный look & feel на каждой платформе.
 */

import { Platform, StyleSheet, ViewStyle, TextStyle } from 'react-native';

// ============================================================================
// SHADOWS - Платформо-специфичные тени
// ============================================================================

/**
 * 🎯 Создать тень для разных платформ
 *
 * iOS использует shadowColor/shadowOffset/shadowOpacity/shadowRadius
 * Android использует elevation
 *
 * @param elevation - уровень тени (1-24)
 * @param color - цвет тени (только iOS)
 *
 * @example
 * <View style={platformShadow(4)} />
 * <View style={platformShadow(8, '#667eea')} />
 */
export const platformShadow = (
  elevation: number = 4,
  color: string = '#000'
): ViewStyle => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: color,
      shadowOffset: {
        width: 0,
        height: Math.round(elevation / 2),
      },
      shadowOpacity: 0.08 + elevation * 0.015,
      shadowRadius: elevation * 1.2,
    };
  }

  return {
    elevation,
  };
};

/**
 * Предустановленные уровни теней
 */
export const shadows = {
  none: platformShadow(0),
  sm: platformShadow(2),
  md: platformShadow(4),
  lg: platformShadow(8),
  xl: platformShadow(12),
  '2xl': platformShadow(16),
};

// ============================================================================
// PRESSABLE EFFECTS - Эффекты нажатия
// ============================================================================

/**
 * 🎯 Эффект нажатия для разных платформ
 *
 * Android: Material ripple effect
 * iOS: Opacity change
 *
 * @example
 * <Pressable {...platformPressProps()}>
 *   <Text>Press me</Text>
 * </Pressable>
 */
export const platformPressProps = (rippleColor: string = 'rgba(0, 0, 0, 0.1)') => {
  if (Platform.OS === 'android') {
    return {
      android_ripple: {
        color: rippleColor,
        borderless: false,
      },
    };
  }

  return {};
};

/**
 * ActiveOpacity для TouchableOpacity (iOS style)
 */
export const platformActiveOpacity = Platform.select({
  ios: 0.7,
  android: 0.8,
  default: 0.7,
});

// ============================================================================
// FONTS - Платформо-специфичные шрифты
// ============================================================================

type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

/**
 * 🎯 Получить шрифт для платформы
 *
 * @example
 * <Text style={platformFont('bold')}>Bold text</Text>
 */
export const platformFont = (weight: FontWeight = 'regular'): TextStyle => {
  const weights: Record<FontWeight, TextStyle> = {
    regular: Platform.select({
      ios: { fontWeight: '400' },
      android: { fontFamily: 'sans-serif', fontWeight: '400' },
      default: { fontWeight: '400' },
    })!,
    medium: Platform.select({
      ios: { fontWeight: '500' },
      android: { fontFamily: 'sans-serif-medium', fontWeight: '500' },
      default: { fontWeight: '500' },
    })!,
    semibold: Platform.select({
      ios: { fontWeight: '600' },
      android: { fontFamily: 'sans-serif-medium', fontWeight: '600' },
      default: { fontWeight: '600' },
    })!,
    bold: Platform.select({
      ios: { fontWeight: '700' },
      android: { fontFamily: 'sans-serif-bold', fontWeight: '700' },
      default: { fontWeight: '700' },
    })!,
  };

  return weights[weight];
};

// ============================================================================
// HITSLOP - Увеличение области нажатия
// ============================================================================

/**
 * 🎯 HitSlop для маленьких кнопок
 * Минимальная область нажатия: 44x44 (Apple HIG)
 *
 * @example
 * <TouchableOpacity hitSlop={hitSlop.medium}>
 *   <Icon size={20} />
 * </TouchableOpacity>
 */
export const hitSlop = {
  small: { top: 8, bottom: 8, left: 8, right: 8 },
  medium: { top: 12, bottom: 12, left: 12, right: 12 },
  large: { top: 16, bottom: 16, left: 16, right: 16 },
};

// ============================================================================
// PLATFORM SELECT - Выбор значений по платформе
// ============================================================================

/**
 * 🎯 Выбрать значение в зависимости от платформы
 *
 * @example
 * const padding = selectPlatform({ ios: 20, android: 16 });
 */
export const selectPlatform = <T>(options: { ios: T; android: T; default?: T }): T => {
  return Platform.select(options) || options.ios;
};

/**
 * Проверка платформы
 */
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// ============================================================================
// COMMON STYLES - Часто используемые стили
// ============================================================================

/**
 * 🎯 Общие платформо-специфичные стили
 */
export const platformStyles = StyleSheet.create({
  // Карточка с тенью
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    ...platformShadow(4),
  },

  // Кнопка
  button: {
    minHeight: 44, // Apple HIG minimum
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 16,
    ...platformShadow(2),
  },

  // Input field
  input: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    height: Platform.select({ ios: 44, android: 48 }),
    paddingHorizontal: 12,
  },

  // Header
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    height: Platform.select({ ios: 44, android: 56 }),
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    ...platformShadow(2),
  },

  // Divider
  divider: {
    backgroundColor: '#E5E7EB',
    height: StyleSheet.hairlineWidth,
  },

  // Centered container
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

// ============================================================================
// STATUS BAR - Утилиты для статус бара
// ============================================================================

/**
 * Высота статус бара по платформе
 */
export const statusBarHeight = Platform.select({
  ios: 0, // Используйте SafeAreaView для iOS
  android: 24, // Примерное значение, используйте StatusBar.currentHeight
  default: 0,
});

export default {
  platformShadow,
  shadows,
  platformPressProps,
  platformActiveOpacity,
  platformFont,
  hitSlop,
  selectPlatform,
  isIOS,
  isAndroid,
  platformStyles,
  statusBarHeight,
};
