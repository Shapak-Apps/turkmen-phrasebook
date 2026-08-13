// src/features/scenarios/screens/ScenarioPhraseScreen.tsx
// Карточка одной фразы: сама фраза, кнопка «покажи экран», ожидаемые ответы
// и остальные фразы этого же шага.
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  getAvailableReplies,
  getAvailableScenarios,
  getPhraseText,
  phrases,
  survivalCore,
} from '../../../data/scenarios';
import type { ContentLang, Wing } from '../../../data/scenarios';
import type { RootStackParamList } from '../../../types';
import { useSafeArea } from '../../../hooks/useSafeArea';
import { useTargetLang } from '../TargetLangContext';
import { ScenarioColors, titleOf, uiLabels } from '../ui-labels';
import { ScreenHeader } from '../components/ScreenHeader';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type PhraseRoute = RouteProp<RootStackParamList, 'ScenarioPhrase'>;

const WINGS: Wing[] = ['travel', 'host'];

export interface PhraseContext {
  stepId: string;
  stepEmoji: string;
  /** Номер фразы в шаге, с единицы */
  position: number;
  total: number;
  /** Остальные доступные фразы того же шага */
  siblings: string[];
}

/** Где фраза живёт: в каком шаге, какая по счёту и с кем рядом. null — фраза из survival-ядра. */
export const findPhraseContext = (phraseId: string, lang: ContentLang): PhraseContext | null => {
  for (const wing of WINGS) {
    for (const scenario of getAvailableScenarios(wing, lang)) {
      for (const step of scenario.steps) {
        const index = step.phrases.indexOf(phraseId);
        if (index !== -1) {
          return {
            stepId: step.id,
            stepEmoji: step.emoji,
            position: index + 1,
            total: step.phrases.length,
            siblings: step.phrases.filter((id) => id !== phraseId),
          };
        }
      }
    }
  }
  return null;
};

export default function ScenarioPhraseScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { params } = useRoute<PhraseRoute>();
  const { targetLang } = useTargetLang();
  const { bottom } = useSafeArea();

  const phrase = phrases[params.phraseId];
  const context = findPhraseContext(params.phraseId, targetLang);
  const isSurvival = survivalCore.includes(params.phraseId);
  const target = getPhraseText(params.phraseId, targetLang);
  const tk = getPhraseText(params.phraseId, 'tk');
  const replies = getAvailableReplies(params.phraseId, targetLang);
  // У фразы выживания нет «этого же шага» — секцию соседей не показываем.
  // Ответы уже показаны выше своей секцией: во второй раз они только шумят.
  const siblings =
    isSurvival || !context ? [] : context.siblings.filter((id) => !replies.includes(id));

  const renderRow = (id: string) => (
    <TouchableOpacity
      key={id}
      style={styles.row}
      onPress={() => navigation.push('ScenarioPhrase', { phraseId: id })}
      accessibilityRole="button"
    >
      <Text style={styles.rowEmoji}>{phrases[id]?.emoji ?? '•'}</Text>
      <View style={styles.rowBody}>
        <Text style={styles.rowTarget}>{getPhraseText(id, targetLang)?.text}</Text>
        <Text style={styles.rowTk}>{getPhraseText(id, 'tk')?.text}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader
        emoji={context?.stepEmoji ?? phrase?.emoji}
        // У фразы выживания шага нет: в заголовке раздел, в подзаголовке — полка.
        title={context && !isSurvival ? titleOf(context.stepId) : uiLabels.homeTitle}
        subtitle={
          context && !isSurvival
            ? `${uiLabels.phraseWordCap} ${context.position}/${context.total}`
            : uiLabels.survivalHeader
        }
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.tk}>
            {phrase?.emoji ? `${phrase.emoji} ` : ''}
            {tk?.text}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.target}>{target?.text}</Text>
          {target?.translit ? <Text style={styles.translit}>{target.translit}</Text> : null}
        </View>

        <TouchableOpacity
          style={styles.showButton}
          onPress={() => navigation.navigate('ShowScreen', { phraseId: params.phraseId })}
          accessibilityRole="button"
        >
          <Text style={styles.showButtonText}>{uiLabels.showScreenButton}</Text>
        </TouchableOpacity>

        {replies.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>{uiLabels.repliesSection}</Text>
            {replies.map(renderRow)}
          </>
        ) : null}

        {siblings.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>{uiLabels.usefulSection}</Text>
            {siblings.map(renderRow)}
          </>
        ) : null}
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
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ScenarioColors.line,
    backgroundColor: ScenarioColors.surface,
  },
  tk: {
    fontSize: 20,
    fontWeight: '700',
    color: ScenarioColors.text,
  },
  divider: {
    height: 1,
    marginVertical: 12,
    backgroundColor: ScenarioColors.line,
  },
  target: {
    fontSize: 18,
    color: ScenarioColors.text,
  },
  translit: {
    marginTop: 4,
    fontSize: 14,
    fontStyle: 'italic',
    color: ScenarioColors.muted,
  },
  showButton: {
    marginTop: 16,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: ScenarioColors.brand,
  },
  showButtonText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ScenarioColors.line,
    backgroundColor: ScenarioColors.surface,
  },
  rowEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  rowBody: {
    flex: 1,
  },
  rowTarget: {
    fontSize: 16,
    fontWeight: '700',
    color: ScenarioColors.text,
  },
  rowTk: {
    marginTop: 2,
    fontSize: 13,
    color: ScenarioColors.muted,
  },
});
