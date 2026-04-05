// src/screens/HomeScreen.tsx — Lingify-стиль: чистый список категорий

import React, { useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';
import { useSafeArea } from '../hooks/useSafeArea';

import { Category, HomeStackParamList } from '../types';
import { Colors } from '../constants/Colors';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useConfig } from '../contexts/ConfigContext';
import { getLanguageByCode } from '../config/languages.config';
import { categories } from '../data/categories';
import CategoryCard from '../components/CategoryCard';
import ErrorBoundary from '../components/ErrorBoundary';
import { TabScreen } from '../components/Screen';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'CategoryScreen'>;

// Header
const MinimalHeader = React.memo<{
  onLanguagePress: () => void;
  onBackPress: () => void;
  selectedLanguageCode: string;
}>(
  ({ onLanguagePress, onBackPress, selectedLanguageCode }) => {
    const selectedLang = getLanguageByCode(selectedLanguageCode);
    const isTurkmenMode = selectedLanguageCode === 'tk';
    const secondLang = isTurkmenMode ? getLanguageByCode('en') : getLanguageByCode('tk');

    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBackPress} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={moderateScale(24)} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.languageInfo} onPress={onLanguagePress} activeOpacity={0.7}>
          <Text style={styles.flagIcon}>{selectedLang?.flag || '🌍'}</Text>
          <Ionicons name="swap-horizontal" size={moderateScale(18)} color="#9CA3AF" style={{ marginHorizontal: scale(6) }} />
          <Text style={styles.flagIcon}>{secondLang?.flag || '🇹🇲'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsButton} onPress={onLanguagePress} activeOpacity={0.7}>
          <Ionicons name="settings-outline" size={moderateScale(24)} color={Colors.text} />
        </TouchableOpacity>
      </View>
    );
  }
);

export default function HomeScreen() {
  const { config } = useAppLanguage();
  const { selectedLanguage } = useConfig();
  const navigation = useNavigation<any>();
  const { bottom: safeAreaBottom } = useSafeArea();
  const languageMode: string = selectedLanguage;

  const handleCategoryPress = useCallback((category: Category) => {
    navigation.navigate('CategoryScreen', { category });
  }, [navigation]);

  const handleLanguagePress = useCallback(() => {
    navigation.navigate('LanguagePairSelection');
  }, [navigation]);

  const handleBackPress = useCallback(() => {
    const parentNavigation = navigation.getParent();
    if (parentNavigation) {
      parentNavigation.navigate('MainHub');
    }
  }, [navigation]);

  const renderCategory = useCallback(
    ({ item, index }: { item: Category; index: number }) => (
      <CategoryCard
        category={item}
        onPress={handleCategoryPress}
        languageMode={languageMode}
        showDivider={index < categories.length - 1}
      />
    ),
    [handleCategoryPress, languageMode]
  );

  return (
    <ErrorBoundary>
      <TabScreen backgroundColor="#FFFFFF">
        <MinimalHeader
          onLanguagePress={handleLanguagePress}
          onBackPress={handleBackPress}
          selectedLanguageCode={selectedLanguage}
        />

        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: Math.max(safeAreaBottom, verticalScale(40)) },
          ]}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={8}
          initialNumToRender={10}
        />
      </TabScreen>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  // Header — clean, no shadow
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: verticalScale(56),
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
  },

  backButton: {
    alignItems: 'center',
    borderRadius: scale(20),
    height: verticalScale(40),
    justifyContent: 'center',
    width: scale(40),
  },

  languageInfo: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
  },

  flagIcon: {
    fontSize: moderateScale(24),
  },

  settingsButton: {
    alignItems: 'center',
    borderRadius: scale(20),
    height: verticalScale(40),
    justifyContent: 'center',
    width: scale(40),
  },

  // List
  listContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
  },
});
