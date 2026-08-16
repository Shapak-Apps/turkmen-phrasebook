// src/features/scenarios/screens/ScenarioHomeScreen.tsx
// Главный экран сценарного разговорника: язык собеседника, полка выживания, список сцен.
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  getAvailableScenarios,
  getPhraseText,
  isPhraseAvailable,
  phrases,
  survivalCore,
} from '../../../data/scenarios';
import type { Wing } from '../../../data/scenarios';
import type { RootStackParamList } from '../../../types';
import { useSafeArea } from '../../../hooks/useSafeArea';
import { useTargetLang } from '../TargetLangContext';
import { ScenarioColors, TARGET_LANGS, targetLangMeta, titleOf, uiLabels } from '../ui-labels';
import { ScreenHeader } from '../components/ScreenHeader';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const WINGS: { wing: Wing; label: string }[] = [
  { wing: 'travel', label: uiLabels.wingTravel },
  { wing: 'host', label: uiLabels.wingHost },
];

export default function ScenarioHomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { targetLang, setTargetLang } = useTargetLang();
  const { bottom } = useSafeArea();

  const meta = targetLangMeta[targetLang];
  const survival = survivalCore.filter((id) => isPhraseAvailable(id, targetLang));
  const [wing, setWing] = useState<Wing>('travel');
  const scenarios = getAvailableScenarios(wing, targetLang);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={uiLabels.homeTitle}
        subtitle={`${uiLabels.ownFlag} → ${meta.flag} ${meta.nameTk}`}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Язык собеседника */}
        <View style={styles.chipRow}>
          {TARGET_LANGS.map((lang) => {
            const active = lang === targetLang;
            return (
              <TouchableOpacity
                key={lang}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setTargetLang(lang)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {targetLangMeta[lang].chip}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Полка выживания */}
        <Text style={styles.sectionTitle}>{uiLabels.survivalSection}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pillRow}
        >
          {survival.map((id) => (
            <TouchableOpacity
              key={id}
              style={styles.pill}
              onPress={() => navigation.navigate('ScenarioPhrase', { phraseId: id })}
              accessibilityRole="button"
            >
              <Text style={styles.pillEmoji}>{phrases[id]?.emoji}</Text>
              <Text style={styles.pillText} numberOfLines={2}>
                {getPhraseText(id, 'tk')?.text}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Крылья */}
        <View style={styles.wingRow}>
          {WINGS.map((item) => {
            const active = item.wing === wing;
            return (
              <TouchableOpacity
                key={item.wing}
                style={[styles.wingTab, active && styles.wingTabActive]}
                onPress={() => setWing(item.wing)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.wingText, active && styles.wingTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Сцены */}
        <Text style={styles.sectionTitle}>{uiLabels.scenariosSection}</Text>
        {scenarios.map((scenario) => {
          const phraseCount = scenario.steps.reduce((sum, step) => sum + step.phrases.length, 0);
          return (
            <TouchableOpacity
              key={scenario.id}
              style={styles.card}
              onPress={() => navigation.navigate('ScenarioFlow', { scenarioId: scenario.id })}
              accessibilityRole="button"
            >
              <View style={styles.cardIcon}>
                <Text style={styles.cardEmoji}>{scenario.emoji}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{titleOf(scenario.id)}</Text>
                <Text style={styles.cardMeta}>
                  {scenario.steps.length} {uiLabels.stepWord} · {phraseCount} {uiLabels.phraseWord}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={ScenarioColors.muted} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ScenarioColors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  chipRow: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: ScenarioColors.line,
    backgroundColor: ScenarioColors.surface,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: ScenarioColors.brand,
    borderColor: ScenarioColors.brand,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: ScenarioColors.text,
  },
  chipTextActive: {
    color: ScenarioColors.surface,
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    color: ScenarioColors.muted,
  },
  pillRow: {
    paddingRight: 16,
  },
  pill: {
    width: 90,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginRight: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ScenarioColors.line,
    backgroundColor: ScenarioColors.surface,
    alignItems: 'center',
  },
  pillEmoji: {
    fontSize: 26,
    marginBottom: 6,
  },
  pillText: {
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
    color: ScenarioColors.text,
  },
  wingRow: {
    flexDirection: 'row',
    marginTop: 22,
  },
  wingTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ScenarioColors.line,
    backgroundColor: ScenarioColors.surface,
    marginRight: 8,
  },
  wingTabActive: {
    backgroundColor: ScenarioColors.mine,
    borderColor: ScenarioColors.mineBorder,
  },
  wingText: {
    fontSize: 14,
    fontWeight: '600',
    color: ScenarioColors.text,
  },
  wingTextActive: {
    color: ScenarioColors.brand,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: ScenarioColors.line,
    backgroundColor: ScenarioColors.surface,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ScenarioColors.mine,
    marginRight: 12,
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ScenarioColors.text,
  },
  cardMeta: {
    marginTop: 3,
    fontSize: 13,
    color: ScenarioColors.muted,
  },
});
