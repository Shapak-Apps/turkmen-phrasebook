// src/screens/MainHubScreen.tsx
// Lingify-стиль: чистый список модулей

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useAppLanguage, InterfaceTexts } from '../contexts/LanguageContext';
import { getLanguageByCode } from '../config/languages.config';
import type { RootStackParamList } from '../types';
import { DesignColors, Spacing, Typography, BorderRadius } from '../constants/Design';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';
import { useSafeArea } from '../hooks/useSafeArea';

interface ModuleItem {
  id: string;
  title: string;
  subtitle: string;
  iconName: ComponentProps<typeof Ionicons>['name'];
  route: string;
  isComingSoon?: boolean;
}

const getModules = (texts: InterfaceTexts): ModuleItem[] => [
  {
    id: 'phrasebook',
    title: texts.phrasebookTitle,
    subtitle: texts.phrasebookSubtitle,
    iconName: 'book-outline',
    route: 'Phrasebook',
  },
  {
    id: 'text-translator',
    title: texts.textTranslatorTitle,
    subtitle: texts.textTranslatorSubtitle,
    iconName: 'text-outline',
    route: 'ComingSoon',
    isComingSoon: true,
  },
  {
    id: 'ai-assistants',
    title: texts.aiAssistantsTitle,
    subtitle: texts.aiAssistantsSubtitle,
    iconName: 'sparkles',
    route: 'ComingSoon',
    isComingSoon: true,
  },
  {
    id: 'visual-translator',
    title: texts.visualTranslatorTitle,
    subtitle: texts.visualTranslatorSubtitle,
    iconName: 'camera-outline',
    route: 'VisualTranslator',
    isComingSoon: true,
  },
  {
    id: 'voice-translator',
    title: texts.voiceTranslatorTitle,
    subtitle: texts.voiceTranslatorSubtitle,
    iconName: 'mic-outline',
    route: 'ComingSoon',
    isComingSoon: true,
  },
];

type MainHubScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function MainHubScreen() {
  const navigation = useNavigation<MainHubScreenNavigationProp>();
  const { config, getTexts } = useAppLanguage();
  const currentLanguage = getLanguageByCode(config.mode);
  const texts = getTexts();
  const modules = getModules(texts);

  const { top: safeAreaTop, bottom: safeAreaBottom } = useSafeArea();

  const handleModulePress = (module: ModuleItem) => {
    if (module.isComingSoon) {
      const feature = module.id === 'visual-translator' ? 'visual' : module.id === 'ai-assistants' ? 'ai' : module.id === 'text-translator' ? 'translator' : 'voice';
      navigation.navigate('ComingSoon', { feature });
      return;
    }

    if (module.id === 'phrasebook') {
      navigation.navigate('Home');
    } else if (module.id === 'text-translator') {
      navigation.navigate('TextTranslator');
    } else if (module.id === 'ai-assistants') {
      navigation.navigate('UniversalAIChat');
    } else if (module.id === 'dictionary') {
      navigation.navigate('Dictionary');
    } else if (module.id === 'favorites') {
      navigation.navigate('AdditionalFeatures');
    }
  };

  const handleLanguagePress = () => {
    navigation.navigate('LanguageSelection');
  };

  const handleSettingsPress = () => {
    navigation.navigate('Settings');
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: safeAreaTop }]}>
        <View style={styles.headerInner}>
          <TouchableOpacity
            style={styles.languageBadge}
            onPress={handleLanguagePress}
            activeOpacity={0.7}
          >
            <Text style={styles.languageFlag}>{currentLanguage?.flag || '🌍'}</Text>
            <Text style={styles.languageName}>{currentLanguage?.name || 'Language'}</Text>
            <Ionicons name="chevron-down" size={moderateScale(16)} color={DesignColors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleSettingsPress}
            activeOpacity={0.7}
          >
            <Ionicons name="settings-outline" size={moderateScale(24)} color={DesignColors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(safeAreaBottom, verticalScale(32)) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <View style={styles.welcome}>
          <Text style={styles.welcomeTitle} numberOfLines={1} adjustsFontSizeToFit>
            {texts.appTitle}
          </Text>
          <Text style={styles.welcomeSubtitle}>{texts.selectCategory}</Text>
        </View>

        {/* Module list */}
        <View style={styles.moduleList}>
          {modules.map((module, index) => (
            <React.Fragment key={module.id}>
              <TouchableOpacity
                style={[
                  styles.moduleRow,
                  module.isComingSoon && styles.moduleRowComingSoon,
                ]}
                onPress={() => handleModulePress(module)}
                activeOpacity={0.6}
              >
                {/* Icon in blue circle */}
                <View style={[
                  styles.moduleIcon,
                  module.isComingSoon && styles.moduleIconComingSoon,
                ]}>
                  <Ionicons
                    name={module.iconName}
                    size={moderateScale(22)}
                    color="#FFFFFF"
                  />
                </View>

                {/* Title + subtitle */}
                <View style={styles.moduleText}>
                  <View style={styles.moduleTitleRow}>
                    <Text style={[
                      styles.moduleTitle,
                      module.isComingSoon && styles.moduleTitleComingSoon,
                    ]} numberOfLines={1}>
                      {module.title}
                    </Text>
                    {module.isComingSoon && (
                      <View style={styles.comingSoonBadge}>
                        <Text style={styles.comingSoonText}>
                          {texts.vtComingSoon || 'Coming soon'}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={[
                    styles.moduleSubtitle,
                    module.isComingSoon && styles.moduleSubtitleComingSoon,
                  ]} numberOfLines={2}>
                    {module.subtitle}
                  </Text>
                </View>

                {/* Arrow */}
                <Ionicons
                  name="chevron-forward"
                  size={moderateScale(20)}
                  color={module.isComingSoon ? '#D1D5DB' : '#9CA3AF'}
                />
              </TouchableOpacity>

              {/* Divider (not after last item) */}
              {index < modules.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header — clean, no shadow
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(20),
    height: verticalScale(56),
  },

  languageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },

  languageFlag: {
    fontSize: moderateScale(20),
  },

  languageName: {
    color: DesignColors.text,
    fontFamily: Typography.fontFamily,
    fontSize: moderateScale(16),
    fontWeight: Typography.semibold,
  },

  settingsButton: {
    padding: scale(8),
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(24),
  },

  // Welcome
  welcome: {
    marginBottom: verticalScale(28),
  },

  welcomeTitle: {
    fontSize: moderateScale(26),
    fontWeight: '700',
    color: DesignColors.text,
    fontFamily: Typography.fontFamily,
    marginBottom: verticalScale(4),
  },

  welcomeSubtitle: {
    fontSize: moderateScale(15),
    color: DesignColors.textSecondary,
    fontFamily: Typography.fontFamily,
  },

  // Module list
  moduleList: {
    backgroundColor: '#FFFFFF',
  },

  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(14),
    gap: scale(14),
  },

  moduleRowComingSoon: {
    opacity: 0.55,
  },

  // Icon — blue circle
  moduleIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: '#2D8CFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  moduleIconComingSoon: {
    backgroundColor: '#9CA3AF',
  },

  // Text
  moduleText: {
    flex: 1,
  },

  moduleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(8),
  },

  moduleTitle: {
    fontSize: moderateScale(16),
    fontWeight: Typography.semibold,
    color: DesignColors.text,
    fontFamily: Typography.fontFamily,
  },

  moduleTitleComingSoon: {
    color: '#6B7280',
  },

  moduleSubtitle: {
    fontSize: moderateScale(13),
    color: DesignColors.textSecondary,
    fontFamily: Typography.fontFamily,
    marginTop: verticalScale(2),
    lineHeight: moderateScale(18),
  },

  moduleSubtitleComingSoon: {
    color: '#9CA3AF',
  },

  // Coming soon badge
  comingSoonBadge: {
    backgroundColor: '#F3F4F6',
    borderRadius: moderateScale(6),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
  },

  comingSoonText: {
    color: '#6B7280',
    fontSize: moderateScale(11),
    fontWeight: '500',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: scale(62), // align after icon
  },
});
