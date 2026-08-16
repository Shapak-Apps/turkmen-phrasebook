// src/navigation/AppNavigator.tsx — единый стек приложения.
// Старый разговорник (Home-стек, PhraseDetail, поиск, избранное, статистика,
// словарь, переводчик текста) снесён вместе со своими данными — ТЗ-05.

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import MainHubScreen from '../screens/MainHubScreen';
import ComingSoonScreen from '../screens/ComingSoonScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';

// Сценарный разговорник (ТЗ-02)
import ScenarioHomeScreen from '../features/scenarios/screens/ScenarioHomeScreen';
import ScenarioFlowScreen from '../features/scenarios/screens/ScenarioFlowScreen';
import ScenarioPhraseScreen from '../features/scenarios/screens/ScenarioPhraseScreen';
import ShowScreen from '../features/scenarios/screens/ShowScreen';

import { RootStackParamList } from '../types';
import { Colors } from '../constants/Colors';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useConfig } from '../contexts/ConfigContext';

const RootStack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { config } = useAppLanguage();
  const { isLoading: configLoading, isFirstLaunch } = useConfig();

  // Показываем лоадер пока загружаются настройки
  if (configLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const getInitialRouteName = () => (isFirstLaunch ? 'LanguageSelection' : 'MainHub');

  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName={getInitialRouteName()}>
        {/* Language Selection (первый запуск) */}
        <RootStack.Screen
          name="LanguageSelection"
          component={LanguageSelectionScreen}
          options={{ headerShown: false }}
        />

        {/* Main Hub - главный экран после выбора языка */}
        <RootStack.Screen
          name="MainHub"
          component={MainHubScreen}
          options={{ headerShown: false }}
        />

        {/* Coming Soon — заглушка для ещё не сделанных модулей */}
        <RootStack.Screen
          name="ComingSoon"
          component={ComingSoonScreen}
          options={{ headerShown: false }}
        />

        {/* Settings */}
        <RootStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title:
              config.mode === 'tk' ? 'Sazlamalar' : config.mode === 'zh' ? '设置' : 'Настройки',
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTintColor: Colors.textWhite,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />

        {/* About */}
        <RootStack.Screen
          name="About"
          component={AboutScreen}
          options={{ headerShown: false }}
        />

        {/* Сценарный разговорник (ТЗ-02) */}
        <RootStack.Screen
          name="ScenarioHome"
          component={ScenarioHomeScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="ScenarioFlow"
          component={ScenarioFlowScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="ScenarioPhrase"
          component={ScenarioPhraseScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="ShowScreen"
          component={ShowScreen}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
