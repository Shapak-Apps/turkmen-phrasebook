// src/features/scenarios/screens/ScenarioFlowScreen.tsx
// Сценарий целиком: таймлайн шагов, внутри раскрытого шага — диалог карточками.
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { getAvailableScenarios, getPhraseText, phrases } from '../../../data/scenarios';
import type { RootStackParamList } from '../../../types';
import { useSafeArea } from '../../../hooks/useSafeArea';
import { useTargetLang } from '../TargetLangContext';
import { ScenarioColors, titleOf, uiLabels } from '../ui-labels';
import { ScreenHeader } from '../components/ScreenHeader';

type NavigationProp = StackNavigationProp<RootStackParamList>;
type FlowRoute = RouteProp<RootStackParamList, 'ScenarioFlow'>;

export default function ScenarioFlowScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { params } = useRoute<FlowRoute>();
  const { targetLang } = useTargetLang();
  const { bottom } = useSafeArea();
  const [openStep, setOpenStep] = useState(0);

  const scenario = getAvailableScenarios('travel', targetLang).find(
    (item) => item.id === params.scenarioId
  );

  // Фраза, на которую кто-то ссылается как на ответ, — это реплика пользователя в диалоге.
  const replyIds = useMemo(
    () => new Set(Object.keys(phrases).flatMap((id) => phrases[id].replies ?? [])),
    []
  );

  if (!scenario) {
    return (
      <View style={styles.container}>
        <ScreenHeader title={titleOf(params.scenarioId)} subtitle={uiLabels.flowSubtitle} />
      </View>
    );
  }

  const renderPhrase = (id: string) => {
    const phrase = phrases[id];
    const target = getPhraseText(id, targetLang);
    const tk = getPhraseText(id, 'tk');
    const isThem = phrase.speaker === 'them';
    const withTag = isThem || replyIds.has(id);

    return (
      <TouchableOpacity
        key={id}
        style={[styles.bubble, isThem ? styles.bubbleThem : styles.bubbleMine]}
        onPress={() => navigation.navigate('ScenarioPhrase', { phraseId: id })}
        accessibilityRole="button"
      >
        {withTag ? (
          <Text style={[styles.tag, isThem ? styles.tagThem : styles.tagMine]}>
            {isThem ? uiLabels.tagThem : uiLabels.tagMine}
          </Text>
        ) : null}
        <Text style={styles.target}>
          {phrase.emoji ? `${phrase.emoji} ` : ''}
          {target?.text}
        </Text>
        {target?.translit ? <Text style={styles.translit}>{target.translit}</Text> : null}
        <Text style={styles.tk}>{tk?.text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        emoji={scenario.emoji}
        title={titleOf(scenario.id)}
        subtitle={uiLabels.flowSubtitle}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {scenario.steps.map((step, index) => {
          const expanded = index === openStep;
          const isLast = index === scenario.steps.length - 1;

          return (
            <View key={step.id} style={styles.stepRow}>
              <View style={styles.rail}>
                <View style={[styles.dot, expanded && styles.dotActive]}>
                  <Text style={styles.dotEmoji}>{step.emoji}</Text>
                </View>
                {!isLast ? <View style={styles.line} /> : null}
              </View>

              <View style={styles.stepBody}>
                <TouchableOpacity
                  style={styles.stepHeader}
                  onPress={() => setOpenStep(expanded ? -1 : index)}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                >
                  <Text style={[styles.stepTitle, expanded && styles.stepTitleActive]}>
                    {titleOf(step.id)}
                  </Text>
                  <Text style={styles.stepMeta}>
                    {' '}
                    · {step.phrases.length} {uiLabels.phraseWord}
                  </Text>
                  <View style={styles.chevron}>
                    <Ionicons
                      name={expanded ? 'chevron-up' : 'chevron-down'}
                      size={18}
                      color={ScenarioColors.muted}
                    />
                  </View>
                </TouchableOpacity>

                {expanded ? <View style={styles.dialog}>{step.phrases.map(renderPhrase)}</View> : null}
              </View>
            </View>
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
  stepRow: {
    flexDirection: 'row',
  },
  rail: {
    width: 34,
    alignItems: 'center',
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: ScenarioColors.line,
    backgroundColor: ScenarioColors.surface,
  },
  dotActive: {
    borderColor: ScenarioColors.brand,
    backgroundColor: ScenarioColors.mine,
  },
  dotEmoji: {
    fontSize: 14,
  },
  line: {
    flex: 1,
    width: 2,
    marginVertical: 4,
    backgroundColor: ScenarioColors.line,
  },
  stepBody: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 18,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ScenarioColors.text,
  },
  stepTitleActive: {
    color: ScenarioColors.brand,
  },
  stepMeta: {
    flex: 1,
    fontSize: 13,
    color: ScenarioColors.muted,
  },
  chevron: {
    paddingLeft: 6,
  },
  dialog: {
    marginTop: 10,
  },
  bubble: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  bubbleThem: {
    marginRight: 26,
    backgroundColor: ScenarioColors.surface,
    borderColor: ScenarioColors.line,
    borderTopLeftRadius: 4,
  },
  bubbleMine: {
    marginLeft: 26,
    backgroundColor: ScenarioColors.mine,
    borderColor: ScenarioColors.mineBorder,
    borderTopRightRadius: 4,
  },
  tag: {
    marginBottom: 6,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  tagThem: {
    color: ScenarioColors.them,
  },
  tagMine: {
    color: ScenarioColors.brand,
  },
  target: {
    fontSize: 17,
    fontWeight: '700',
    color: ScenarioColors.text,
  },
  translit: {
    marginTop: 2,
    fontSize: 13,
    fontStyle: 'italic',
    color: ScenarioColors.muted,
  },
  tk: {
    marginTop: 6,
    fontSize: 14,
    color: ScenarioColors.muted,
  },
});
