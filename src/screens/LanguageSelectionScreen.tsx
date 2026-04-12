// src/screens/LanguageSelectionScreen.tsx — Lingify style
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LANGUAGES } from '../config/languages.config';
import { useConfig } from '../contexts/ConfigContext';
import { useAppLanguage, AppLanguageMode } from '../contexts/LanguageContext';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';
import { useSafeArea } from '../hooks/useSafeArea';

interface LanguageSelectionScreenProps {
  navigation?: any;
  onLanguageSelect?: (language: AppLanguageMode, shouldSave: boolean) => void;
}

export default function LanguageSelectionScreen({ navigation, onLanguageSelect }: LanguageSelectionScreenProps) {
  const { setSelectedLanguage, selectedLanguage } = useConfig();
  const { setLanguageMode, config } = useAppLanguage();
  const [isChanging, setIsChanging] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { bottom: safeAreaBottom } = useSafeArea();

  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageSelect = async (code: string, isAvailable: boolean) => {
    if (!isAvailable) {
      Alert.alert('Coming Soon', 'This language will be available soon!', [{ text: 'OK' }]);
      return;
    }

    if (code === config.mode) {
      if (navigation && navigation.canGoBack()) {
        navigation.goBack();
      } else if (navigation) {
        try {
          await setLanguageMode(code as any, true);
          if (code !== 'tk') await setSelectedLanguage(code);
        } catch (error) {
          console.warn('Failed to save language on first launch:', error);
        }
        navigation.replace('MainHub');
      }
      return;
    }

    try {
      setIsChanging(true);

      if (onLanguageSelect) {
        const validLanguages: AppLanguageMode[] = ['tk', 'zh', 'ru', 'en', 'tr', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'uk', 'ja', 'ko', 'th', 'vi', 'id', 'ms', 'hi', 'ur', 'fa', 'ps', 'uz', 'kk', 'az', 'ky', 'tg', 'hy', 'ka', 'ar'];
        if (validLanguages.includes(code as AppLanguageMode)) {
          onLanguageSelect(code as AppLanguageMode, true);
        }
        return;
      }

      await setLanguageMode(code as any, true);
      if (code !== 'tk') await setSelectedLanguage(code);

      if (navigation) {
        navigation.replace('MainHub');
      }
    } catch (error) {
      console.error('Failed to select language:', error);
      Alert.alert('Error', 'Failed to change language. Please try again.', [{ text: 'OK' }]);
    } finally {
      setIsChanging(false);
    }
  };

  const renderLanguageItem = ({ item, index }: { item: typeof LANGUAGES[0]; index: number }) => {
    const isAvailable = item.isAvailable;
    const isSelected = item.code === config.mode;

    return (
      <>
        <TouchableOpacity
          style={[
            styles.languageRow,
            !isAvailable && styles.languageRowDisabled,
          ]}
          onPress={() => handleLanguageSelect(item.code, isAvailable)}
          activeOpacity={isAvailable ? 0.6 : 1}
          disabled={isChanging}
        >
          <Text style={styles.flag}>{item.flag}</Text>

          <View style={styles.languageInfo}>
            <Text style={[
              styles.languageName,
              !isAvailable && styles.textDisabled,
            ]}>
              {item.name}
            </Text>
            <Text style={[
              styles.languageNameEn,
              !isAvailable && styles.textDisabled,
            ]}>
              {item.nameEn}
            </Text>
          </View>

          {isSelected ? (
            <Ionicons name="checkmark-circle" size={moderateScale(24)} color="#2D8CFF" />
          ) : !isAvailable ? (
            <Ionicons name="lock-closed-outline" size={moderateScale(20)} color="#D1D5DB" />
          ) : (
            <Ionicons name="chevron-forward" size={moderateScale(20)} color="#9CA3AF" />
          )}
        </TouchableOpacity>

        {index < filteredLanguages.length - 1 && <View style={styles.divider} />}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <SafeAreaView edges={['top']} style={styles.headerArea}>
        {/* Header */}
        <View style={styles.header}>
          {navigation && navigation.canGoBack() && (
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={moderateScale(24)} color="#1A1A1A" />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>Choose Language</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={moderateScale(18)} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search languages..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={moderateScale(20)} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>

      <FlatList
        data={filteredLanguages}
        renderItem={renderLanguageItem}
        keyExtractor={item => item.code}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: Math.max(safeAreaBottom, verticalScale(24)) },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },

  headerArea: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },

  backButton: {
    alignItems: 'center',
    height: scale(40),
    justifyContent: 'center',
    width: scale(40),
  },

  title: {
    color: '#1A1A1A',
    fontSize: moderateScale(18),
    fontWeight: '600',
  },

  placeholder: {
    width: scale(40),
  },

  // Search
  searchContainer: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    borderWidth: 1,
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(12),
    marginHorizontal: scale(20),
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(10),
  },

  searchInput: {
    color: '#1A1A1A',
    flex: 1,
    fontSize: moderateScale(15),
    padding: 0,
  },

  // List
  listContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(8),
  },

  // Language row — clean list
  languageRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(14),
    paddingVertical: verticalScale(14),
  },

  languageRowDisabled: {
    opacity: 0.5,
  },

  flag: {
    fontSize: moderateScale(32),
  },

  languageInfo: {
    flex: 1,
  },

  languageName: {
    color: '#1A1A1A',
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },

  languageNameEn: {
    color: '#6B7280',
    fontSize: moderateScale(13),
  },

  textDisabled: {
    color: '#9CA3AF',
  },

  // Divider
  divider: {
    backgroundColor: '#E5E7EB',
    height: 1,
    marginLeft: scale(46), // after flag
  },
});
