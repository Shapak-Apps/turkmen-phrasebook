// App.tsx - ОБНОВЛЕНО для мультиязычности (Phase 4)
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/contexts/LanguageContext';
import { ConfigProvider } from './src/contexts/ConfigContext';
import { OfflineDataProvider } from './src/contexts/OfflineDataContext';
import ErrorBoundary from './src/components/ErrorBoundary';
import { TargetLangProvider } from './src/features/scenarios/TargetLangContext';

// Предотвращаем автоматическое скрытие splash screen
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    // Скрываем splash когда приложение готово
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ConfigProvider>
          <LanguageProvider>
            <OfflineDataProvider>
              <TargetLangProvider>
                <AppNavigator />
                <StatusBar style="auto" />
              </TargetLangProvider>
            </OfflineDataProvider>
          </LanguageProvider>
        </ConfigProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
