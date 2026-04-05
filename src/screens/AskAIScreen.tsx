import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../utils/ResponsiveUtils';
import { Colors } from '../constants/Colors';
import { askAI } from '../api/gemini';
import { PhraseWithTranslation, HomeStackParamList } from '../types';
import { getCategoryName, categories } from '../data/categories';
import { useConfig } from '../contexts/ConfigContext';
import { AppLanguageMode } from '../contexts/LanguageContext';

type AskAIScreenRouteProp = RouteProp<HomeStackParamList, 'AskAIScreen'>;
type AskAIScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'AskAIScreen'>;

export default function AskAIScreen() {
  const route = useRoute<AskAIScreenRouteProp>();
  const navigation = useNavigation<AskAIScreenNavigationProp>();
  const { selectedLanguage } = useConfig();
  const { scale, verticalScale, moderateScale } = useResponsive();

  const { phrase, categoryId } = route.params;

  const [aiResponse, setAiResponse] = useState<string>('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleAskQuestion = useCallback(async (questionType: string) => {
    setAiLoading(true);
    setAiResponse('');

    const category = categories.find(c => c.id === categoryId);
    const categoryName = category ? getCategoryName(category, selectedLanguage as AppLanguageMode) : 'Unknown';
    
    let prompt = '';
    switch (questionType) {
      case 'examples':
        prompt = `Фраза на туркменском: "${phrase.turkmen}"
Перевод на ${selectedLanguage}: "${phrase.translation.text}"
Категория: ${categoryName}

Дай 3-4 примера использования этой фразы в разных ситуациях. Ответ должен быть кратким и понятным.`;
        break;
      case 'pronunciation':
        prompt = `Фраза на туркменском: "${phrase.turkmen}"

Дай советы по произношению этой фразы на туркменском языке. Объясни как правильно произносить сложные звуки.`;
        break;
      case 'cultural':
        prompt = `Фраза на туркменском: "${phrase.turkmen}"
Перевод: "${phrase.translation.text}"

Расскажи о культурном контексте использования этой фразы в Туркменистане. Когда и как её используют местные жители?`;
        break;
      case 'similar':
        prompt = `Фраза на туркменском: "${phrase.turkmen}"
Перевод: "${phrase.translation.text}"

Дай список из 4-5 похожих фраз на туркменском языке с переводом, которые можно использовать в схожих ситуациях.`;
        break;
    }

    try {
      const response = await askAI(prompt);
      setAiResponse(response);
    } catch (error) {
      setAiResponse('Произошла ошибка при обращении к AI. Попробуйте еще раз.');
    } finally {
      setAiLoading(false);
    }
  }, [phrase, selectedLanguage, categoryId]);

  const styles = React.useMemo(() => StyleSheet.create({
    askAgainButton: {
      alignItems: 'center',
      backgroundColor: '#3B82F6',
      borderRadius: scale(12),
      flexDirection: 'row',
      gap: scale(8),
      justifyContent: 'center',
      padding: scale(14),
    },
    askAgainButtonText: {
      color: '#fff',
      fontSize: moderateScale(16),
      fontWeight: '600',
    },
    backButton: {
      padding: scale(8),
    },
    container: {
      backgroundColor: '#F9FAFB',
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: scale(16),
      paddingTop: verticalScale(16),
    },
    header: {
      alignItems: 'center',
      backgroundColor: '#fff',
      borderBottomColor: '#E5E7EB',
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
    },
    headerTitle: {
      color: '#1F2937',
      fontSize: moderateScale(18),
      fontWeight: '700',
    },
    loadingContainer: {
      alignItems: 'center',
      gap: verticalScale(16),
      paddingVertical: verticalScale(60),
    },
    loadingText: {
      color: '#6B7280',
      fontSize: moderateScale(16),
      fontWeight: '500',
    },
    phraseInfo: {
      backgroundColor: '#fff',
      borderRadius: scale(16),
      elevation: 2,
      marginBottom: verticalScale(20),
      padding: scale(16),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    phraseInfoText: {
      color: '#1F2937',
      fontSize: moderateScale(20),
      fontWeight: '700',
      marginBottom: verticalScale(6),
    },
    phraseInfoTextSecondary: {
      color: '#6B7280',
      fontSize: moderateScale(17),
      fontWeight: '500',
    },
    placeholder: {
      width: scale(40),
    },
    questionButton: {
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: scale(16),
      elevation: 2,
      flexDirection: 'row',
      gap: scale(12),
      padding: scale(16),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    questionButtonDesc: {
      color: '#6B7280',
      fontSize: moderateScale(13),
    },
    questionButtonTitle: {
      color: '#1F2937',
      fontSize: moderateScale(16),
      fontWeight: '600',
      marginBottom: verticalScale(2),
    },
    questionButtons: {
      gap: verticalScale(12),
    },
    questionPrompt: {
      color: '#374151',
      fontSize: moderateScale(16),
      fontWeight: '600',
      marginBottom: verticalScale(8),
    },
    questionTextContainer: {
      flex: 1,
    },
    responseContainer: {
      backgroundColor: '#fff',
      borderRadius: scale(16),
      elevation: 2,
      marginBottom: verticalScale(20),
      padding: scale(20),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
    },
    responseHeader: {
      alignItems: 'center',
      borderBottomColor: '#E5E7EB',
      borderBottomWidth: 1,
      flexDirection: 'row',
      gap: scale(8),
      marginBottom: verticalScale(16),
      paddingBottom: verticalScale(12),
    },
    responseHeaderText: {
      color: '#1F2937',
      fontSize: moderateScale(16),
      fontWeight: '700',
    },
    responseText: {
      color: '#374151',
      fontSize: moderateScale(15),
      lineHeight: moderateScale(24),
      marginBottom: verticalScale(20),
    },
  }), [scale, verticalScale, moderateScale]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={moderateScale(24)} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Спросить AI</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Phrase info */}
        <View style={styles.phraseInfo}>
          <Text style={styles.phraseInfoText}>{phrase.translation.text}</Text>
          <Text style={styles.phraseInfoTextSecondary}>{phrase.turkmen}</Text>
        </View>

        {/* Question buttons */}
        {!aiResponse && !aiLoading && (
          <View style={styles.questionButtons}>
            <Text style={styles.questionPrompt}>Что вы хотите узнать?</Text>
            
            <TouchableOpacity
              style={styles.questionButton}
              onPress={() => handleAskQuestion('examples')}
            >
              <Ionicons name="bulb-outline" size={moderateScale(22)} color="#3B82F6" />
              <View style={styles.questionTextContainer}>
                <Text style={styles.questionButtonTitle}>Примеры использования</Text>
                <Text style={styles.questionButtonDesc}>3-4 примера в разных ситуациях</Text>
              </View>
              <Ionicons name="chevron-forward" size={moderateScale(20)} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.questionButton}
              onPress={() => handleAskQuestion('pronunciation')}
            >
              <Ionicons name="volume-high-outline" size={moderateScale(22)} color="#10B981" />
              <View style={styles.questionTextContainer}>
                <Text style={styles.questionButtonTitle}>Советы по произношению</Text>
                <Text style={styles.questionButtonDesc}>Как правильно произносить</Text>
              </View>
              <Ionicons name="chevron-forward" size={moderateScale(20)} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.questionButton}
              onPress={() => handleAskQuestion('cultural')}
            >
              <Ionicons name="earth-outline" size={moderateScale(22)} color="#8B5CF6" />
              <View style={styles.questionTextContainer}>
                <Text style={styles.questionButtonTitle}>Культурный контекст</Text>
                <Text style={styles.questionButtonDesc}>Когда и как используют</Text>
              </View>
              <Ionicons name="chevron-forward" size={moderateScale(20)} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.questionButton}
              onPress={() => handleAskQuestion('similar')}
            >
              <Ionicons name="list-outline" size={moderateScale(22)} color="#F59E0B" />
              <View style={styles.questionTextContainer}>
                <Text style={styles.questionButtonTitle}>Похожие фразы</Text>
                <Text style={styles.questionButtonDesc}>4-5 альтернативных фраз</Text>
              </View>
              <Ionicons name="chevron-forward" size={moderateScale(20)} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Loading */}
        {aiLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text style={styles.loadingText}>AI думает...</Text>
          </View>
        )}

        {/* AI Response */}
        {aiResponse && !aiLoading && (
          <View style={styles.responseContainer}>
            <View style={styles.responseHeader}>
              <Ionicons name="sparkles" size={moderateScale(20)} color="#3B82F6" />
              <Text style={styles.responseHeaderText}>Ответ AI</Text>
            </View>
            <Text style={styles.responseText}>{aiResponse}</Text>
            <TouchableOpacity
              style={styles.askAgainButton}
              onPress={() => setAiResponse('')}
            >
              <Ionicons name="arrow-back" size={moderateScale(18)} color="#fff" />
              <Text style={styles.askAgainButtonText}>Задать другой вопрос</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
