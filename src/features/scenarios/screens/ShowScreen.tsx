// src/features/scenarios/screens/ShowScreen.tsx
// «Покажи экран»: телефон разворачивают к собеседнику. Фраза гигантским кеглем,
// собеседник тапает свой ответ — и владелец видит его по-туркменски.
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { getAvailableReplies, getPhraseText } from '../../../data/scenarios';
import type { RootStackParamList } from '../../../types';
import { useSafeArea } from '../../../hooks/useSafeArea';
import { useTargetLang } from '../TargetLangContext';
import { ScenarioColors, showScreenPrompt, uiLabels } from '../ui-labels';

type ShowRoute = RouteProp<RootStackParamList, 'ShowScreen'>;

/** Кегль по длине строки: короткое приветствие должно бить в глаза, длинный вопрос — влезать. */
const fontSizeFor = (text: string): number => {
  if (text.length <= 8) return 56;
  if (text.length <= 20) return 44;
  if (text.length <= 40) return 34;
  return 28;
};

export default function ShowScreen() {
  const navigation = useNavigation();
  const { params } = useRoute<ShowRoute>();
  const { targetLang } = useTargetLang();
  const { top, bottom } = useSafeArea();
  const [openReply, setOpenReply] = useState<string | null>(null);

  const target = getPhraseText(params.phraseId, targetLang);
  const tk = getPhraseText(params.phraseId, 'tk');
  const replies = getAvailableReplies(params.phraseId, targetLang);

  const replyTarget = openReply ? getPhraseText(openReply, targetLang) : null;
  const replyTk = openReply ? getPhraseText(openReply, 'tk') : null;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.close, { top: top + 8 }]}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 14, bottom: 14, left: 14, right: 14 }}
        accessibilityRole="button"
      >
        <Ionicons name="close" size={22} color={ScenarioColors.muted} />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: top + 56, paddingBottom: bottom + 28 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stage}>
          <Text style={[styles.target, { fontSize: fontSizeFor(target?.text ?? '') }]}>
            {target?.text}
          </Text>
          <Text style={styles.tk}>{tk?.text}</Text>
        </View>

        {replies.length > 0 ? (
          <View style={styles.repliesBlock}>
            <View style={styles.separator} />
            <Text style={styles.prompt}>{showScreenPrompt[targetLang]}</Text>

            {replies.map((id) => (
              <TouchableOpacity
                key={id}
                style={styles.replyButton}
                onPress={() => setOpenReply(id)}
                accessibilityRole="button"
              >
                <Text style={styles.replyText}>{getPhraseText(id, targetLang)?.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </ScrollView>

      {/* Собеседник вернул телефон: его ответ крупно по-туркменски */}
      <Modal
        visible={openReply !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenReply(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpenReply(null)}>
          <Pressable style={[styles.sheet, { paddingBottom: bottom + 20 }]} onPress={() => {}}>
            <View style={styles.grabber} />
            <Text style={styles.sheetTarget}>{replyTarget?.text}</Text>
            <Text style={styles.sheetTk}>{replyTk?.text}</Text>
            <TouchableOpacity
              style={styles.sheetButton}
              onPress={() => setOpenReply(null)}
              accessibilityRole="button"
            >
              <Text style={styles.sheetButtonText}>{uiLabels.sheetDone}</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ScenarioColors.surface,
  },
  close: {
    position: 'absolute',
    right: 16,
    zIndex: 2,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ScenarioColors.background,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
  },
  stage: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  target: {
    fontWeight: '700',
    textAlign: 'center',
    color: ScenarioColors.text,
  },
  tk: {
    marginTop: 18,
    fontSize: 14,
    textAlign: 'center',
    color: ScenarioColors.muted,
  },
  repliesBlock: {
    marginTop: 8,
  },
  separator: {
    height: 1,
    marginBottom: 18,
    backgroundColor: ScenarioColors.line,
  },
  prompt: {
    marginBottom: 14,
    fontSize: 15,
    textAlign: 'center',
    color: ScenarioColors.muted,
  },
  replyButton: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: ScenarioColors.mineBorder,
    backgroundColor: ScenarioColors.mine,
  },
  replyText: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    color: ScenarioColors.text,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(23,36,47,0.45)',
  },
  sheet: {
    paddingHorizontal: 22,
    paddingTop: 10,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: ScenarioColors.surface,
  },
  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    marginBottom: 18,
    backgroundColor: ScenarioColors.line,
  },
  sheetTarget: {
    fontSize: 16,
    textAlign: 'center',
    color: ScenarioColors.muted,
  },
  sheetTk: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: ScenarioColors.text,
  },
  sheetButton: {
    marginTop: 22,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: ScenarioColors.brand,
  },
  sheetButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: ScenarioColors.surface,
  },
});
