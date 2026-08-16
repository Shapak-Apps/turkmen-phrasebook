// src/screens/SettingsScreen.tsx - ОБНОВЛЕНО для мультиязычности (Phase 4)

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../constants/Colors';
import { useAppLanguage } from '../contexts/LanguageContext';
import { getLanguageByCode } from '../config/languages.config';
import { RootStackParamList } from '../types';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';
import { useSafeArea } from '../hooks/useSafeArea';

// Semantic icon colors for different sections
const SETTINGS_ICON_COLORS = {
  language: '#2D8CFF',
  audio: '#2D8CFF',
  data: '#2D8CFF',
  info: '#2D8CFF',
};

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'LanguageSelection'>;

// Импортируем модальные компоненты

const SETTINGS_KEYS = {
  SOUND_ENABLED: 'settings_sound_enabled',
  SPEECH_RATE: 'settings_speech_rate',
  AUTO_PLAY: 'settings_auto_play',
  VOICE_GENDER: 'settings_voice_gender',
} as const;

interface AppPreferences {
  soundEnabled: boolean;
  speechRate: number;
  autoPlay: boolean;
  voiceGender: 'female' | 'male';
}

const DEFAULT_PREFERENCES: AppPreferences = {
  soundEnabled: true,
  speechRate: 0.75,
  autoPlay: false,
  voiceGender: 'female',
};

// Мемоизированные компоненты для производительности
const SettingsItem = React.memo(({
  icon,
  iconColor,
  title,
  subtitle,
  onPress,
  rightComponent
}: {
  icon: string;
  iconColor: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightComponent?: React.ReactNode;
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.settingLeft}>
      <Ionicons name={icon as any} size={24} color={iconColor} />
      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
    {rightComponent}
  </TouchableOpacity>
));

const SectionHeader = React.memo(({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
));

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [preferences, setPreferences] = useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Скрываем стандартный header навигации
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const { getTexts, config, switchMode, getLanguageName, resetLanguageSettings } = useAppLanguage();

  const texts = getTexts();

  // Safe Area для bottom padding (home indicator)
  const { bottom: safeAreaBottom } = useSafeArea();

  // Мемоизация тяжелых вычислений - используем texts из контекста
  const settingsTexts = useMemo(() => ({
    audioSettings: texts.audioSettings,
    interfaceSettings: texts.interfaceSettings,
    dataSettings: texts.dataSettings,
    appInfo: texts.appInfo,
  }), [texts]);

  // Оптимизированная загрузка настроек
  const loadPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      const promises = Object.entries(SETTINGS_KEYS).map(async ([key, storageKey]) => {
        const value = await AsyncStorage.getItem(storageKey);
        return [key.toLowerCase().replace('_', ''), value ? JSON.parse(value) : null];
      });

      const results = await Promise.all(promises);
      const savedPrefs = results.reduce((acc, [key, value]) => {
        if (value !== null) acc[key as keyof AppPreferences] = value;
        return acc;
      }, {} as Partial<AppPreferences>);

      setPreferences({ ...DEFAULT_PREFERENCES, ...savedPrefs });
    } catch (error) {
      console.warn('Ошибка загрузки настроек:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить настройки');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // Оптимизированное сохранение настроек
  const savePreference = useCallback(async (key: keyof AppPreferences, value: any) => {
    try {
      const storageKey = SETTINGS_KEYS[key.replace(/([A-Z])/g, '_$1').toUpperCase() as keyof typeof SETTINGS_KEYS];
      await AsyncStorage.setItem(storageKey, JSON.stringify(value));
      setPreferences(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      console.warn(`Ошибка сохранения настройки ${key}:`, error);
    }
  }, []);

  // Мемоизированные обработчики событий
  const handleLanguageToggle = useCallback(() => {
    // ОБНОВЛЕНО: Открываем экран выбора языка (Phase 4)
    navigation.navigate('LanguageSelection');
  }, [navigation]);

  const handleTogglePreference = useCallback(async (key: keyof AppPreferences) => {
    const newValue = !preferences[key];
    await savePreference(key, newValue);
  }, [preferences, savePreference]);

  const handleAbout = useCallback(() => {
    navigation.navigate('About' as any);
  }, [navigation]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2D8CFF" />
          <Text style={styles.loadingText}>
            {texts.settingsLoading ?? 'Loading settings...'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Back Button */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>{texts.settingsTitle}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Math.max(safeAreaBottom, verticalScale(20)) }}
      >
        <View style={styles.settingsContainer}>
          {/* Секция языка */}
          <View style={styles.section}>
            <SectionHeader title={texts.languageInterface} />

            {/* Interface Language */}
            <SettingsItem
              icon="language"
              iconColor={SETTINGS_ICON_COLORS.language}
              title={texts.switchLanguage}
              subtitle={`${texts.currentLanguage}${getLanguageByCode(config.mode)?.name || config.mode}`}
              onPress={handleLanguageToggle}
              rightComponent={<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
            />
          </View>

          {/* Секция данных */}
          <View style={styles.section}>
            <SectionHeader title={texts.settingsDataStorage ?? 'Data & Storage'} />

            <SettingsItem
              icon="refresh"
              iconColor={SETTINGS_ICON_COLORS.data}
              title={texts.settingsResetAll ?? 'Reset All Settings'}
              subtitle={texts.settingsResetAllDesc ?? 'Restore default settings'}
              onPress={() => {
                Alert.alert(
                  texts.settingsResetAll ?? 'Reset All Settings',
                  texts.settingsResetConfirm ?? 'Are you sure you want to reset?',
                  [
                    { text: texts.cancel, style: 'cancel' },
                    {
                      text: texts.delete ?? 'Reset',
                      style: 'destructive',
                      onPress: async () => {
                        // Reset preferences to defaults
                        setPreferences(DEFAULT_PREFERENCES);

                        // Clear all AsyncStorage settings
                        await Promise.all(
                          Object.values(SETTINGS_KEYS).map(key =>
                            AsyncStorage.removeItem(key)
                          )
                        );

                        Alert.alert('✅', texts.success ?? 'Settings reset successfully');
                      }
                    }
                  ]
                );
              }}
              rightComponent={<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
            />
          </View>

          {/* Секция приложения */}
          <View style={styles.section}>
            <SectionHeader title={settingsTexts.appInfo ?? 'App Info'} />

            <SettingsItem
              icon="information-circle"
              iconColor={SETTINGS_ICON_COLORS.info}
              title={texts.about}
              subtitle={texts.versionAndInfo}
              onPress={handleAbout}
              rightComponent={<Ionicons name="chevron-forward" size={20} color="#9CA3AF" />}
            />
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    borderRadius: scale(20),
    height: scale(40),
    justifyContent: 'center',
    width: scale(40),
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  headerBar: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  headerBarTitle: {
    color: '#1F2937',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  loadingContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'center',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: moderateScale(16),
    marginTop: verticalScale(12),
  },
  placeholder: {
    width: scale(40),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    color: '#6B7280',
    fontSize: moderateScale(13),
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: verticalScale(12),
    paddingLeft: scale(4),
    textTransform: 'uppercase',
  },
  settingItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(4),
    paddingVertical: verticalScale(16),
  },
  settingLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  settingSubtitle: {
    color: '#6B7280',
    fontSize: moderateScale(14),
  },
  settingText: {
    flex: 1,
    marginLeft: scale(16),
  },
  settingTitle: {
    color: '#1F2937',
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },
  settingsContainer: {
    flex: 1,
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
});