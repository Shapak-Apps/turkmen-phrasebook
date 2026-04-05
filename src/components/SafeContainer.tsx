/**
 * SafeContainer Component - Best Practice 2024-2025
 *
 * Переиспользуемый контейнер с автоматической обработкой Safe Areas.
 * Заменяет SafeAreaView для более гибкого контроля.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBar, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Edge = 'top' | 'bottom' | 'left' | 'right';

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  /**
   * Какие края учитывать для Safe Area
   * @default ['top', 'bottom']
   */
  edges?: Edge[];
  /**
   * Цвет фона контейнера
   * @default '#FFFFFF'
   */
  backgroundColor?: string;
  /**
   * Использовать padding или margin для Safe Area
   * @default 'padding'
   */
  mode?: 'padding' | 'margin';
  /**
   * Стиль StatusBar для iOS
   * @default 'dark-content'
   */
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  /**
   * Показывать StatusBar
   * @default true
   */
  showStatusBar?: boolean;
}

/**
 * 🎯 Контейнер с автоматической обработкой Safe Areas
 *
 * @example
 * // Базовое использование
 * <SafeContainer>
 *   <Content />
 * </SafeContainer>
 *
 * @example
 * // Только верхний отступ (для модальных окон)
 * <SafeContainer edges={['top']} backgroundColor="#F8F9FA">
 *   <ModalContent />
 * </SafeContainer>
 *
 * @example
 * // С кастомным стилем
 * <SafeContainer style={{ paddingHorizontal: 16 }}>
 *   <Content />
 * </SafeContainer>
 */
export const SafeContainer: React.FC<SafeContainerProps> = ({
  children,
  style,
  edges = ['top', 'bottom'],
  backgroundColor = '#FFFFFF',
  mode = 'padding',
  statusBarStyle = 'dark-content',
  showStatusBar = true,
}) => {
  const insets = useSafeAreaInsets();

  const safeAreaStyles: ViewStyle = {
    ...(mode === 'padding'
      ? {
          paddingTop: edges.includes('top') ? insets.top : 0,
          paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
          paddingLeft: edges.includes('left') ? insets.left : 0,
          paddingRight: edges.includes('right') ? insets.right : 0,
        }
      : {
          marginTop: edges.includes('top') ? insets.top : 0,
          marginBottom: edges.includes('bottom') ? insets.bottom : 0,
          marginLeft: edges.includes('left') ? insets.left : 0,
          marginRight: edges.includes('right') ? insets.right : 0,
        }),
  };

  return (
    <View style={[styles.container, { backgroundColor }, safeAreaStyles, style]}>
      {showStatusBar && (
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={Platform.OS === 'android' ? backgroundColor : 'transparent'}
          translucent={Platform.OS === 'android'}
        />
      )}
      {children}
    </View>
  );
};

/**
 * 🎯 Контейнер для контента внизу экрана (кнопки, табы)
 * Автоматически добавляет отступ для home indicator / navigation bar
 */
export const SafeBottomContainer: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  minPadding?: number;
}> = ({ children, style, backgroundColor = '#FFFFFF', minPadding = 16 }) => {
  const insets = useSafeAreaInsets();

  const bottomPadding = Math.max(insets.bottom, minPadding);

  return (
    <View style={[{ backgroundColor, paddingBottom: bottomPadding }, style]}>
      {children}
    </View>
  );
};

/**
 * 🎯 Контейнер для Header с учётом Dynamic Island / Notch
 */
export const SafeHeaderContainer: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
}> = ({ children, style, backgroundColor = '#FFFFFF' }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[{ backgroundColor, paddingTop: insets.top }, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SafeContainer;
