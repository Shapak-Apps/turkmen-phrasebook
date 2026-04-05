// src/components/Screen.tsx
// ОБНОВЛЕНО - Исправлена проблема с отступами на Android

import React from 'react';
import { View, StyleSheet, ViewStyle, Platform, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { DesignColors } from '../constants/Design';

interface ScreenProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: Edge[]; // Какие края защищать: 'top', 'bottom', 'left', 'right'
  backgroundColor?: string;
  withoutSafeArea?: boolean; // Для специальных случаев
}

/**
 * Универсальный Screen компонент
 *
 * ИСПРАВЛЕНИЕ: На Android используем обычный View с правильным padding вместо SafeAreaView,
 * чтобы избежать проблем с отступами на устройствах типа Redmi Note 12 Pro+
 *
 * Использование:
 * <Screen edges={['top', 'bottom']}>
 *   <YourContent />
 * </Screen>
 */
export default function Screen({
  children,
  style,
  edges = ['top', 'bottom', 'left', 'right'], // По умолчанию защищаем все края
  backgroundColor = DesignColors.background,
  withoutSafeArea = false,
}: ScreenProps) {

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
  };

  // Для специальных экранов без safe area (например, splash screen)
  if (withoutSafeArea) {
    return (
      <View style={[containerStyle, style]}>
        {children}
      </View>
    );
  }

  // ✅ ИСПРАВЛЕНИЕ: На Android используем обычный View с paddingTop
  if (Platform.OS === 'android') {
    const androidStyle: ViewStyle = {
      ...containerStyle,
    };

    // Добавляем padding только если top edge включен
    if (edges.includes('top')) {
      androidStyle.paddingTop = RNStatusBar.currentHeight || 0;
    }

    return (
      <View style={[androidStyle, style]}>
        {children}
      </View>
    );
  }

  // iOS - используем SafeAreaView как обычно
  return (
    <SafeAreaView
      style={[containerStyle, style]}
      edges={edges}
    >
      {children}
    </SafeAreaView>
  );
}

/**
 * Вариант для модальных окон
 * Обычно модалкам не нужен safe area снизу
 */
export function ModalScreen({
  children,
  style,
  backgroundColor = DesignColors.background,
}: Omit<ScreenProps, 'edges' | 'withoutSafeArea'>) {
  return (
    <Screen
      edges={['top']} // Только сверху
      style={style}
      backgroundColor={backgroundColor}
    >
      {children}
    </Screen>
  );
}

/**
 * Вариант для экранов с TabBar внизу
 * TabBar сам управляет нижним отступом
 */
export function TabScreen({
  children,
  style,
  backgroundColor = DesignColors.background,
}: Omit<ScreenProps, 'edges' | 'withoutSafeArea'>) {
  return (
    <Screen
      edges={['top', 'left', 'right']} // Без bottom, т.к. TabBar сам управляет
      style={style}
      backgroundColor={backgroundColor}
    >
      {children}
    </Screen>
  );
}

/**
 * Получить высоту StatusBar для Android
 * Полезно для кастомных расчетов
 */
export function getStatusBarHeight(): number {
  if (Platform.OS === 'android') {
    return RNStatusBar.currentHeight || 0;
  }
  return 0; // iOS управляется через SafeAreaView
}

const styles = StyleSheet.create({
  // Можно добавить общие стили если нужно
});
