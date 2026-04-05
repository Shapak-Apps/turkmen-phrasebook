/**
 * useSafeArea Hook - Best Practice 2024-2025
 *
 * Централизованная работа с Safe Area Insets для:
 * - Dynamic Island (iPhone 14/15/16 Pro)
 * - Notch (iPhone X-13)
 * - Android navigation bar (gesture/buttons)
 * - Android status bar
 * - Camera cutouts (Android)
 */

import { useMemo } from 'react';
import { Platform, StatusBar } from 'react-native';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';

export interface SafeAreaValues extends EdgeInsets {
  // Оригинальные insets
  top: number;
  bottom: number;
  left: number;
  right: number;

  // Вычисленные значения
  statusBarHeight: number;
  paddingTop: number;
  paddingBottom: number;
  bottomButtonPadding: number;

  // Флаги
  hasNotch: boolean;
  hasDynamicIsland: boolean;
  hasGestureNavigation: boolean;
  hasHomeIndicator: boolean;
}

/**
 * 🎯 Hook для работы с Safe Areas
 *
 * @example
 * const { paddingTop, bottomButtonPadding, hasNotch } = useSafeArea();
 *
 * <View style={{ paddingTop }}>
 *   <Content />
 *   <Button style={{ marginBottom: bottomButtonPadding }} />
 * </View>
 */
export const useSafeArea = (): SafeAreaValues => {
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    // Android StatusBar height fallback
    const statusBarHeight = Platform.OS === 'android'
      ? StatusBar.currentHeight || 24
      : insets.top;

    // Определяем тип устройства по размеру top inset
    const hasNotch = insets.top > 24;
    const hasDynamicIsland = insets.top >= 59; // iPhone 14 Pro+ Dynamic Island
    const hasHomeIndicator = insets.bottom > 0 && Platform.OS === 'ios';
    const hasGestureNavigation = Platform.OS === 'android' && insets.bottom > 0;

    return {
      // Оригинальные insets
      top: insets.top,
      bottom: insets.bottom,
      left: insets.left,
      right: insets.right,

      // Вычисленные значения
      statusBarHeight,

      // Минимальные отступы для контента
      paddingTop: Math.max(insets.top, 20),
      paddingBottom: Math.max(insets.bottom, 16),

      // Для кнопок внизу экрана (над navigation bar / home indicator)
      bottomButtonPadding: insets.bottom > 0 ? insets.bottom + 8 : 16,

      // Флаги
      hasNotch,
      hasDynamicIsland,
      hasGestureNavigation,
      hasHomeIndicator,
    };
  }, [insets.top, insets.bottom, insets.left, insets.right]);
};

/**
 * Получить Safe Area стили для View
 *
 * @example
 * const safeAreaStyle = getSafeAreaStyle(insets, ['top', 'bottom']);
 * <View style={safeAreaStyle}>...</View>
 */
export const getSafeAreaStyle = (
  insets: EdgeInsets,
  edges: ('top' | 'bottom' | 'left' | 'right')[] = ['top', 'bottom']
) => ({
  paddingTop: edges.includes('top') ? insets.top : 0,
  paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
  paddingLeft: edges.includes('left') ? insets.left : 0,
  paddingRight: edges.includes('right') ? insets.right : 0,
});

export default useSafeArea;
