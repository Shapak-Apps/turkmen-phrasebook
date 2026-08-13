// src/features/scenarios/components/ScreenHeader.tsx
// Общая шапка экранов сценарного разговорника: стрелка назад, заголовок, подзаголовок.
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeArea } from '../../../hooks/useSafeArea';
import { ScenarioColors } from '../ui-labels';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, subtitle, emoji }) => {
  const navigation = useNavigation();
  const { top } = useSafeArea();

  return (
    <View style={[styles.header, { paddingTop: top + 10 }]}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.back}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityRole="button"
      >
        <Ionicons name="arrow-back" size={22} color={ScenarioColors.surface} />
      </TouchableOpacity>

      <View style={styles.titles}>
        <Text style={styles.title} numberOfLines={1}>
          {emoji ? `${emoji} ` : ''}
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingBottom: 14,
    backgroundColor: ScenarioColors.brand,
  },
  back: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginRight: 10,
  },
  titles: {
    flex: 1,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: ScenarioColors.surface,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
});
