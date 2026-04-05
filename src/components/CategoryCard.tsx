// src/components/CategoryCard.tsx — Lingify-стиль: простая строка

import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Category } from '../types';
import { useAnimations } from '../hooks/useAnimations';
import { moderateScale, scale, verticalScale } from '../utils/ResponsiveUtils';

interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
  languageMode: string;
  showDivider?: boolean;
}

export default function CategoryCard({ category, onPress, languageMode, showDivider = true }: CategoryCardProps) {
  const { hapticFeedback } = useAnimations();
  const handlePress = useCallback(() => { hapticFeedback('light'); onPress(category); }, [category, onPress, hapticFeedback]);

  const getCategoryName = (langCode: string): string => {
    const fieldName = ('name' + langCode.charAt(0).toUpperCase() + langCode.slice(1)) as keyof Category;
    const name = category[fieldName];
    return (typeof name === 'string' ? name : category.nameEn);
  };

  const isRTL = (langCode: string): boolean => ['ar', 'fa', 'ur', 'ps'].includes(langCode);

  const getCategoryNames = () => {
    if (languageMode === 'tk') {
      return { primary: category.nameTk, secondary: category.nameEn, isRTLLanguage: false };
    } else {
      return { primary: getCategoryName(languageMode), secondary: category.nameTk, isRTLLanguage: isRTL(languageMode) };
    }
  };

  const names = getCategoryNames();

  return (
    <>
      <TouchableOpacity style={styles.row} onPress={handlePress} activeOpacity={0.6}>
        {/* Emoji */}
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{category.icon}</Text>
        </View>

        {/* Text */}
        <View style={styles.textContainer}>
          <Text
            style={[styles.primaryName, names.isRTLLanguage && styles.rtlText]}
            numberOfLines={1}
          >
            {names.primary}
          </Text>
          <Text
            style={[styles.secondaryName, names.isRTLLanguage && styles.rtlText]}
            numberOfLines={1}
          >
            {names.secondary}
          </Text>
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={moderateScale(20)} color="#9CA3AF" />
      </TouchableOpacity>

      {showDivider && <View style={styles.divider} />}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(4),
    gap: scale(14),
  },

  emojiContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(12),
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emoji: {
    fontSize: moderateScale(26),
  },

  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  primaryName: {
    color: '#1A1A1A',
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: verticalScale(2),
  },

  secondaryName: {
    color: '#6B7280',
    fontSize: moderateScale(13),
    fontWeight: '400',
  },

  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginLeft: scale(66), // after emoji
  },
});
