// src/navigation/AppNavigator.tsx - ОБНОВЛЕНО для Hub-архитектуры (Phase 1)

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Импортируем компоненты
// import OfflineIndicator from '../components/OfflineIndicator'; // Отключен по запросу пользователя
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import MainHubScreen from '../screens/MainHubScreen';

// Импортируем экраны
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import AskAIScreen from '../screens/AskAIScreen';
import AdvancedSearchScreen from '../screens/AdvancedSearchScreen';
import FavoritesHubScreen from '../features/favorites/screens/FavoritesHubScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StatsScreen from '../screens/StatsScreen';
import AdditionalFeaturesScreen from '../screens/AdditionalFeaturesScreen';
import PhraseDetailScreen from '../screens/PhraseDetailScreen';

// Text Translator screens (Phase 3)
import TextTranslatorScreen from '../features/text-translator/screens/TextTranslatorScreen';

// Coming Soon screen (for Visual Translator v1.5 & Voice Translator v2.0)
import ComingSoonScreen from '../screens/ComingSoonScreen';

// AI Assistants screens (Phase 4)
import UniversalAIChatScreen from '../features/ai-assistants/screens/UniversalAIChatScreen';

// Dictionary screen (Phase 5)
import DictionaryScreen from '../screens/DictionaryScreen';

// Language Pair Selection screen
import LanguagePairSelectionScreen from '../screens/LanguagePairSelectionScreen';
// About screen
import AboutScreen from '../screens/AboutScreen';

// Импортируем типы
import { RootStackParamList, HomeStackParamList } from '../types';
import { Colors } from '../constants/Colors';
import { useAppLanguage, AppLanguageMode } from '../contexts/LanguageContext';
import { useConfig } from '../contexts/ConfigContext';

const RootStack = createStackNavigator<RootStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const AdditionalFeaturesStack = createStackNavigator();

// Стек для Phrasebook (категории фраз)
function HomeStackNavigator() {
  const { selectedLanguage, isLoading } = useConfig();

  // Show loading while checking config
  if (isLoading) {
    return null;
  }

  // Check if user has selected a language pair
  // Default is 'zh', so if it's anything valid, they've made a choice
  const hasLanguagePair = selectedLanguage && ['zh', 'ru', 'en'].includes(selectedLanguage);

  return (
    <HomeStack.Navigator initialRouteName={hasLanguagePair ? 'HomeScreen' : 'LanguagePairSelection'}>
      <HomeStack.Screen
        name="LanguagePairSelection"
        component={LanguagePairSelectionScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="AskAIScreen"
        component={AskAIScreen}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
  );
}

// Стек для дополнительных возможностей (Search, Favorites, Stats)
function AdditionalFeaturesStackNavigator() {
  const { config } = useAppLanguage();

  return (
    <AdditionalFeaturesStack.Navigator>
      <AdditionalFeaturesStack.Screen
        name="AdditionalFeaturesMain"
        component={AdditionalFeaturesScreen}
        options={{ headerShown: false }}
      />
      <AdditionalFeaturesStack.Screen
        name="Search"
        component={AdvancedSearchScreen}
        options={{
          title: config.mode === 'tk' ? 'Gözleg' :
                 config.mode === 'zh' ? '搜索' : 'Поиск',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.textWhite,
        }}
      />
      <AdditionalFeaturesStack.Screen
        name="Favorites"
        component={FavoritesHubScreen}
        options={{
          headerShown: false,
        }}
      />
      <AdditionalFeaturesStack.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          title: config.mode === 'tk' ? 'Statistika' :
                 config.mode === 'zh' ? '统计' : 'Статистика',
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.textWhite,
        }}
      />
    </AdditionalFeaturesStack.Navigator>
  );
}

// Главный навигатор
export default function AppNavigator() {
  const { config } = useAppLanguage();
  const { isLoading: configLoading, isFirstLaunch, onboardingCompleted } = useConfig();

  // Показываем лоадер пока загружаются настройки
  if (configLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
      }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // Определяем начальный экран
  const getInitialRouteName = () => {
    if (isFirstLaunch) {
      return 'LanguageSelection';
    }
    if (!onboardingCompleted) {
      return 'Onboarding';
    }
    return 'MainHub';
  };

  // Единая навигация для всех сценариев
  return (
    <NavigationContainer>
      {/* <OfflineIndicator /> */}
      <RootStack.Navigator initialRouteName={getInitialRouteName()}>
        {/* Language Selection (первый запуск) */}
        <RootStack.Screen
          name="LanguageSelection"
          component={LanguageSelectionScreen}
          options={{ headerShown: false }}
        />

        {/* Onboarding (после выбора языка, если первый запуск) */}
        <RootStack.Screen
          name="Onboarding"
          component={OnboardingScreen as any}
          options={{ headerShown: false }}
        />

        {/* Main Hub - главный экран после выбора языка */}
        <RootStack.Screen
          name="MainHub"
          component={MainHubScreen}
          options={{ headerShown: false }}
        />

        {/* Phrasebook Stack */}
        <RootStack.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{ headerShown: false }}
        />

        {/* Text Translator (Phase 3) */}
        <RootStack.Screen
          name="TextTranslator"
          component={TextTranslatorScreen}
          options={{ headerShown: false }}
        />

        {/* Coming Soon Screen (Visual Translator v1.5 & Voice Translator v2.0) */}
        <RootStack.Screen
          name="ComingSoon"
          component={ComingSoonScreen}
          options={{ headerShown: false }}
        />

        {/* AI Assistants (Phase 4) */}
        <RootStack.Screen
          name="UniversalAIChat"
          component={UniversalAIChatScreen}
          options={{ headerShown: false }}
        />

        {/* Dictionary (Phase 5 - Coming Soon) */}
        <RootStack.Screen
          name="Dictionary"
          component={DictionaryScreen}
          options={{ headerShown: false }}
        />

        {/* Settings */}
        <RootStack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: config.mode === 'tk' ? 'Sazlamalar' :
                   config.mode === 'zh' ? '设置' : 'Настройки',
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

        {/* Additional Features (Search, Favorites, Stats) */}
        <RootStack.Screen
          name="AdditionalFeatures"
          component={AdditionalFeaturesStackNavigator}
          options={{ headerShown: false }}
        />

        {/* Phrase Detail */}
        <RootStack.Screen
          name="PhraseDetail"
          component={PhraseDetailScreen}
          options={{
            headerShown: false, // ✅ МИНИМАЛИЗМ (Phase 12) - скрыт navigation header, используем кастомный
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
