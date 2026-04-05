// src/features/text-translator/screens/TextTranslatorScreen.tsx
// Lingify-стиль: чистый текстовый переводчик

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Clipboard,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../../types';
import TextTranslationService from '../services/TextTranslationService';
import LanguagePicker from '../components/LanguagePicker';
import {
  getSourceLanguages,
  getTargetLanguages,
  getLanguageByCode,
  type TextTranslationResult,
} from '../types/text-translator.types';
import { useAppLanguage } from '../../../contexts/LanguageContext';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';

type TextTranslatorNavigationProp = StackNavigationProp<RootStackParamList, 'TextTranslator'>;

export default function TextTranslatorScreen() {
  const navigation = useNavigation<TextTranslatorNavigationProp>();
  const { getTexts } = useAppLanguage();
  const texts = getTexts();

  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [currentResult, setCurrentResult] = useState<TextTranslationResult | null>(null);

  useEffect(() => {
    TextTranslationService.initialize();
  }, []);

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert(texts.ttErrorTitle, texts.ttErrorEmptyText);
      return;
    }

    setIsTranslating(true);
    setOutputText('');
    setCurrentResult(null);

    try {
      const result = await TextTranslationService.translate(inputText, sourceLanguage, targetLanguage);
      setOutputText(result.translatedText);
      setCurrentResult(result);
    } catch (error) {
      console.error('Translation error:', error);
      let errorMessage = texts.ttErrorTranslationFailed;
      if (error instanceof Error) {
        if (error.message.includes('internet') || error.message.includes('connection')) {
          errorMessage = texts.ttErrorNoInternet;
        } else if (error.message.includes('too long')) {
          errorMessage = texts.ttErrorTextTooLong;
        }
      }
      Alert.alert(texts.ttErrorTitle, errorMessage);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setCurrentResult(null);
  };

  const handleSpeak = async () => {
    if (!outputText) return;
    try {
      if (isSpeaking) {
        await Speech.stop();
        setIsSpeaking(false);
        return;
      }
      setIsSpeaking(true);
      const isRussian = targetLanguage === 'ru-RU' || targetLanguage === 'ru';
      await Speech.speak(outputText, {
        language: targetLanguage,
        pitch: isRussian ? 0.95 : 1.0,
        rate: isRussian ? 0.92 : 0.9,
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.error('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    Clipboard.setString(outputText);
    Alert.alert(texts.ttCopiedTitle, texts.ttCopiedMessage);
  };

  const handleSwapLanguages = () => {
    if (sourceLanguage === 'auto') {
      Alert.alert(texts.ttInfoTitle, texts.ttInfoCannotSwap);
      return;
    }
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);
    const tempText = inputText;
    setInputText(outputText);
    setOutputText(tempText);
  };

  const sourceLang = getLanguageByCode(sourceLanguage);
  const targetLang = getLanguageByCode(targetLanguage);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />

      {/* Header — clean */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{texts.ttHeaderTitle}</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Source language selector */}
          <TouchableOpacity
            style={styles.languageSelector}
            onPress={() => setShowSourcePicker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.languageFlag}>{sourceLang?.flag || '🌐'}</Text>
            <Text style={styles.languageName}>{sourceLang?.name || texts.ttSelectLanguage}</Text>
            <Ionicons name="chevron-down" size={moderateScale(18)} color="#6B7280" />
          </TouchableOpacity>

          {/* Source text input */}
          <View style={styles.inputCard}>
            <TextInput
              style={styles.input}
              placeholder={texts.ttPlaceholder}
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={setInputText}
              multiline
              textAlignVertical="top"
              maxLength={5000}
            />
            <View style={styles.inputFooter}>
              <Text style={styles.charCount}>{inputText.length}/5000</Text>
              {inputText.length > 0 && (
                <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={moderateScale(20)} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Swap + Translate */}
          <View style={styles.middleRow}>
            <TouchableOpacity style={styles.swapButton} onPress={handleSwapLanguages} activeOpacity={0.7}>
              <Ionicons name="swap-vertical" size={moderateScale(22)} color="#2D8CFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.translateButton, (!inputText.trim() || isTranslating) && styles.translateButtonDisabled]}
              onPress={handleTranslate}
              disabled={!inputText.trim() || isTranslating}
              activeOpacity={0.8}
            >
              {isTranslating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.translateButtonText}>{texts.ttTranslate}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Target language selector */}
          <TouchableOpacity
            style={styles.languageSelector}
            onPress={() => setShowTargetPicker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.languageFlag}>{targetLang?.flag || '🌍'}</Text>
            <Text style={styles.languageName}>{targetLang?.name || texts.ttSelectLanguage}</Text>
            <Ionicons name="chevron-down" size={moderateScale(18)} color="#6B7280" />
          </TouchableOpacity>

          {/* Output */}
          <View style={styles.outputCard}>
            {outputText ? (
              <>
                <Text style={styles.outputText}>{outputText}</Text>

                {/* Action buttons under translation */}
                <View style={styles.outputActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={handleSpeak} activeOpacity={0.7}>
                    <Ionicons
                      name={isSpeaking ? 'stop' : 'volume-high-outline'}
                      size={moderateScale(20)}
                      color="#2D8CFF"
                    />
                    <Text style={styles.actionText}>
                      {isSpeaking ? texts.ttStop : texts.ttPlay}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionBtn} onPress={handleCopy} activeOpacity={0.7}>
                    <Ionicons name="copy-outline" size={moderateScale(20)} color="#2D8CFF" />
                    <Text style={styles.actionText}>{texts.ttCopy}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.emptyOutput}>
                <Ionicons name="document-text-outline" size={moderateScale(40)} color="#D1D5DB" />
                <Text style={styles.emptyText}>{texts.ttEmptyOutput}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Language Pickers */}
      <LanguagePicker
        visible={showSourcePicker}
        languages={getSourceLanguages()}
        selectedLanguage={sourceLanguage}
        onSelect={setSourceLanguage}
        onClose={() => setShowSourcePicker(false)}
        title={texts.ttSourceLanguage}
      />
      <LanguagePicker
        visible={showTargetPicker}
        languages={getTargetLanguages()}
        selectedLanguage={targetLanguage}
        onSelect={setTargetLanguage}
        onClose={() => setShowTargetPicker(false)}
        title={texts.ttTargetLanguage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  // Header — no shadow
  header: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
  },

  backButton: {
    alignItems: 'center',
    height: scale(40),
    justifyContent: 'center',
    width: scale(40),
  },

  headerTitle: {
    color: '#1A1A1A',
    fontSize: moderateScale(18),
    fontWeight: '600',
  },

  placeholder: {
    width: scale(40),
  },

  content: {
    flex: 1,
  },

  scrollContent: {
    padding: scale(20),
  },

  // Language selector — dropdown style with flag
  languageSelector: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    borderWidth: 1,
    flexDirection: 'row',
    gap: scale(10),
    marginBottom: verticalScale(8),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },

  languageFlag: {
    fontSize: moderateScale(22),
  },

  languageName: {
    color: '#1A1A1A',
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '500',
  },

  // Input
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    borderWidth: 1,
    marginBottom: verticalScale(4),
    padding: scale(16),
  },

  input: {
    color: '#1A1A1A',
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    minHeight: verticalScale(100),
    textAlignVertical: 'top',
  },

  inputFooter: {
    alignItems: 'center',
    borderTopColor: '#F3F4F6',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: verticalScale(8),
    paddingTop: verticalScale(8),
  },

  charCount: {
    color: '#9CA3AF',
    fontSize: moderateScale(12),
  },

  // Middle row: swap + translate
  middleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(12),
    marginVertical: verticalScale(12),
  },

  swapButton: {
    alignItems: 'center',
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    borderWidth: 1,
    height: scale(48),
    justifyContent: 'center',
    width: scale(48),
  },

  translateButton: {
    alignItems: 'center',
    backgroundColor: '#2D8CFF',
    borderRadius: scale(12),
    flex: 1,
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
  },

  translateButtonDisabled: {
    backgroundColor: '#93C5FD',
  },

  translateButtonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },

  // Output
  outputCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    borderWidth: 1,
    marginTop: verticalScale(4),
    minHeight: verticalScale(140),
    padding: scale(16),
  },

  outputText: {
    color: '#1A1A1A',
    fontSize: moderateScale(18),
    fontWeight: '500',
    lineHeight: moderateScale(28),
    marginBottom: verticalScale(16),
  },

  outputActions: {
    borderTopColor: '#F3F4F6',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: scale(12),
    paddingTop: verticalScale(12),
  },

  actionBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(6),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(8),
  },

  actionText: {
    color: '#2D8CFF',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },

  emptyOutput: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(100),
  },

  emptyText: {
    color: '#9CA3AF',
    fontSize: moderateScale(14),
    marginTop: verticalScale(8),
  },
});
