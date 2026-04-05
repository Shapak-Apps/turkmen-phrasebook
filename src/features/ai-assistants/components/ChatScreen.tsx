/**
 * Base Chat Screen Component
 * Reusable chat interface for all AI assistants
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Modal,
  Alert,
  Share,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppLanguage, InterfaceTexts } from '../../../contexts/LanguageContext';
import AIAssistantService from '../services/AIAssistantService';
import ChatBubble from './ChatBubble';
import { useSafeArea } from '../../../hooks/useSafeArea';
import {
  AssistantType,
  ChatMessage,
  MessageRole,
  ConversationContext,
} from '../types/ai-assistant.types';
import { DesignColors } from '../../../constants/Design';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';

interface ChatScreenProps {
  assistantType: AssistantType;
  onBack: () => void;
}

// Helper function to get translated assistant name
const getTranslatedAssistantName = (type: AssistantType, texts: InterfaceTexts): string => {
  const nameMap: Record<AssistantType, string> = {
    [AssistantType.CONTEXTUAL_TIPS]: texts.aiContextualTipsName,
    [AssistantType.CONVERSATION_TRAINER]: texts.aiConversationTrainerName,
    [AssistantType.GRAMMAR_HELPER]: texts.aiGrammarHelperName,
    [AssistantType.CULTURAL_ADVISOR]: texts.aiCulturalAdvisorName,
    [AssistantType.GENERAL_ASSISTANT]: texts.aiGeneralAssistantName,
    [AssistantType.UNIVERSAL]: texts.aiHomeTitle, // Use the AI home title for universal
  };
  return nameMap[type];
};

const ChatScreen: React.FC<ChatScreenProps> = ({ assistantType, onBack }) => {
  const { config: languageConfig, getTexts } = useAppLanguage();
  const texts = getTexts();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  // Safe Area для корректной работы с home indicator/navigation bar
  const { bottom: safeAreaBottom, top: safeAreaTop } = useSafeArea();

  const assistantConfig = AIAssistantService.getAssistantConfig(assistantType);
  const translatedName = getTranslatedAssistantName(assistantType, texts);

  // Load chat history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const loadHistory = async () => {
    try {
      const history = await AIAssistantService.getHistory(assistantType);
      if (history.length > 0) {
        // Load the most recent conversation
        const latest = history[0];
        setMessages(latest.messages);
      } else {
        // Show welcome message
        addSystemMessage(getWelcomeMessage());
      }
    } catch (error) {
      console.error('Error loading history:', error);
      addSystemMessage(getWelcomeMessage());
    }
  };

  const getWelcomeMessage = (): string => {
    const welcomeMessages: Record<AssistantType, string> = {
      [AssistantType.CONTEXTUAL_TIPS]: texts.aiContextualTipsWelcome,
      [AssistantType.CONVERSATION_TRAINER]: texts.aiConversationTrainerWelcome,
      [AssistantType.GRAMMAR_HELPER]: texts.aiGrammarHelperWelcome,
      [AssistantType.CULTURAL_ADVISOR]: texts.aiCulturalAdvisorWelcome,
      [AssistantType.GENERAL_ASSISTANT]: texts.aiGeneralAssistantWelcome,
      [AssistantType.UNIVERSAL]: texts.aiGeneralAssistantWelcome, // Use general welcome for universal
    };

    return welcomeMessages[assistantType];
  };

  const addSystemMessage = (content: string) => {
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.SYSTEM,
      content,
      timestamp: new Date(),
      assistantType,
    };
    setMessages((prev) => [...prev, systemMessage]);
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    // Clear input immediately for better UX
    const messageToSend = inputText.trim();
    setInputText('');

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: messageToSend,
      timestamp: new Date(),
      assistantType,
    };

    // Add user message
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare context
      const context: ConversationContext = {
        assistantType,
        language: languageConfig.mode,
      };

      // Send to AI
      const response = await AIAssistantService.sendMessage(
        assistantType,
        userMessage.content,
        context,
        messages
      );

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.ASSISTANT,
        content: response.content,
        timestamp: new Date(),
        assistantType,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save history
      await AIAssistantService.saveHistory({
        id: Date.now().toString(),
        assistantType,
        messages: [...messages, userMessage, assistantMessage],
        context,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      addSystemMessage(texts.aiErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = async () => {
    setShowMenu(false);
    Alert.alert(
      texts.aiClearHistoryTitle || 'Clear History',
      texts.aiClearHistoryMessage || 'Are you sure you want to clear all messages?',
      [
        {
          text: texts.cancel || 'Cancel',
          style: 'cancel',
        },
        {
          text: texts.aiClear || 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AIAssistantService.clearHistory(assistantType);
            setMessages([]);
            addSystemMessage(getWelcomeMessage());
          },
        },
      ]
    );
  };

  const handleSelectModel = () => {
    setShowMenu(false);
    // Model selection feature - shows available AI models
    Alert.alert(
      texts.aiSelectModel || 'Select AI Model',
      texts.aiSelectModelMessage || 'Choose which AI model to use',
      [
        { text: 'Gemini 1.5 Flash', onPress: () => {} },
        { text: 'Gemini 1.5 Pro', onPress: () => {} },
        { text: texts.cancel || 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleExportChat = async () => {
    setShowMenu(false);
    if (messages.length === 0) {
      Alert.alert(texts.aiError || 'Error', texts.aiNoMessages || 'No messages to export');
      return;
    }

    try {
      const chatText = messages
        .map((msg) => {
          const role = msg.role === MessageRole.USER ? 'You' : translatedName;
          return `${role}: ${msg.content}`;
        })
        .join('\n\n');

      await Share.share({
        message: chatText,
        title: `${translatedName} - Chat Export`,
      });
    } catch (error) {
      console.error('Error sharing chat:', error);
    }
  };

  const handleCopyAll = async () => {
    setShowMenu(false);
    if (messages.length === 0) {
      Alert.alert(texts.aiError || 'Error', texts.aiNoMessages || 'No messages to copy');
      return;
    }

    const chatText = messages
      .map((msg) => {
        const role = msg.role === MessageRole.USER ? 'You' : translatedName;
        return `${role}: ${msg.content}`;
      })
      .join('\n\n');

    Clipboard.setString(chatText);
    Alert.alert(texts.success || 'Success', texts.aiCopied || 'All messages copied to clipboard');
  };

  const handleResponseSettings = () => {
    setShowMenu(false);
    // Response settings feature - adjust AI creativity/precision
    Alert.alert(
      texts.aiResponseSettings || 'Response Settings',
      texts.aiResponseSettingsMessage || 'Adjust how the AI responds',
      [
        { text: texts.aiCreativeMode || 'Creative Mode', onPress: () => {} },
        { text: texts.aiBalancedMode || 'Balanced Mode', onPress: () => {} },
        { text: texts.aiPreciseMode || 'Precise Mode', onPress: () => {} },
        { text: texts.cancel || 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleChangeLanguage = () => {
    setShowMenu(false);
    // Language selection feature - choose AI response language
    Alert.alert(
      texts.aiResponseLanguage || 'Response Language',
      texts.aiResponseLanguageMessage || 'Choose which language the AI should respond in',
      [
        { text: 'English', onPress: () => {} },
        { text: 'Türkmen', onPress: () => {} },
        { text: 'Русский', onPress: () => {} },
        { text: texts.cancel || 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={[styles.safeArea, { paddingTop: safeAreaTop }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={false}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? safeAreaTop : 0}
      >
        {/* Header - Clean minimal design like Claude/ChatGPT */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={moderateScale(24)} color="#1F2937" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{translatedName}</Text>
          </View>

          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowMenu(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-vertical" size={moderateScale(20)} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message, index) => (
            <ChatBubble
              key={message.id}
              message={message}
              isLastMessage={index === messages.length - 1}
            />
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2D8CFF" />
              <Text style={styles.loadingText}>{texts.aiThinking}</Text>
            </View>
          )}
        </ScrollView>

        {/* Input - с учётом SafeArea снизу */}
        <View style={[styles.inputContainer, { paddingBottom: Math.max(safeAreaBottom, verticalScale(16)) }]}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={texts.aiInputPlaceholder}
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!isLoading}
            returnKeyType="send"
            blurOnSubmit={false}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: '#2D8CFF' },
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendButtonText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContainer}>
            {/* Clear History */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleClearHistory}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={moderateScale(22)} color="#EF4444" />
              <Text style={[styles.menuText, { color: '#EF4444' }]}>
                {texts.aiClearHistory || 'Clear History'}
              </Text>
            </TouchableOpacity>

            {/* Select Model */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleSelectModel}
              activeOpacity={0.7}
            >
              <Ionicons name="hardware-chip-outline" size={moderateScale(22)} color="#1F2937" />
              <Text style={styles.menuText}>
                {texts.aiSelectModel || 'Select AI Model'}
              </Text>
            </TouchableOpacity>

            {/* Export Chat */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleExportChat}
              activeOpacity={0.7}
            >
              <Ionicons name="share-outline" size={moderateScale(22)} color="#1F2937" />
              <Text style={styles.menuText}>
                {texts.aiExportChat || 'Export Chat'}
              </Text>
            </TouchableOpacity>

            {/* Copy All */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleCopyAll}
              activeOpacity={0.7}
            >
              <Ionicons name="copy-outline" size={moderateScale(22)} color="#1F2937" />
              <Text style={styles.menuText}>
                {texts.aiCopyAll || 'Copy All'}
              </Text>
            </TouchableOpacity>

            {/* Response Settings */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleResponseSettings}
              activeOpacity={0.7}
            >
              <Ionicons name="options-outline" size={moderateScale(22)} color="#1F2937" />
              <Text style={styles.menuText}>
                {texts.aiResponseSettings || 'Response Settings'}
              </Text>
            </TouchableOpacity>

            {/* Change Language */}
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleChangeLanguage}
              activeOpacity={0.7}
            >
              <Ionicons name="language-outline" size={moderateScale(22)} color="#1F2937" />
              <Text style={styles.menuText}>
                {texts.aiResponseLanguage || 'Response Language'}
              </Text>
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              style={[styles.menuItem, styles.menuItemCancel]}
              onPress={() => setShowMenu(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.menuTextCancel}>
                {texts.cancel || 'Cancel'}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    // paddingTop теперь динамический через safeAreaTop
  },
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  // Header - Clean minimal design (Claude/ChatGPT style)
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
    borderRadius: scale(20),
    height: scale(40),
    justifyContent: 'center',
    width: scale(40),
  },
  headerContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#1F2937',
    fontSize: moderateScale(17),
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  menuButton: {
    alignItems: 'center',
    borderRadius: scale(20),
    height: scale(40),
    justifyContent: 'center',
    width: scale(40),
  },
  messagesContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  messagesContent: {
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(80), // Extra padding to prevent last message from being hidden
    paddingHorizontal: scale(4),
  },
  loadingContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(20),
  },
  loadingText: {
    color: '#6B7280',
    fontSize: moderateScale(15),
    fontStyle: 'italic',
    fontWeight: '500',
    marginLeft: scale(12),
  },
  // Input Container — no shadow
  inputContainer: {
    alignItems: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E5E7EB',
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
    borderRadius: scale(22),
    borderWidth: 1,
    color: '#1F2937',
    flex: 1,
    fontSize: moderateScale(16),
    marginRight: scale(12),
    maxHeight: verticalScale(120),
    minHeight: verticalScale(44),
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(12),
  },
  sendButton: {
    alignItems: 'center',
    borderRadius: scale(22),
    height: scale(44),
    justifyContent: 'center',
    width: scale(44),
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: moderateScale(22),
  },
  // Modal Menu Styles
  modalOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    paddingBottom: verticalScale(32),
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(8),
  },
  menuItem: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: scale(12),
    flexDirection: 'row',
    gap: scale(12),
    marginVertical: verticalScale(4),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(16),
  },
  menuItemCancel: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: verticalScale(8),
  },
  menuText: {
    color: '#1F2937',
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  menuTextCancel: {
    color: '#6B7280',
    fontSize: moderateScale(16),
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ChatScreen;
