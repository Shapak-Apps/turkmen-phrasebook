/**
 * AI Assistant Service
 * Google Gemini API Integration for AI Assistants
 *
 * NOTE: Infrastructure supports multiple AI providers (Groq, Together.ai, etc.)
 * Currently using only Gemini. To add more models:
 * 1. Create ai-models.types.ts with model definitions
 * 2. Add provider API calls (callGroqAPI, callTogetherAPI, etc.)
 * 3. Create ModelSelectionScreen for user choice
 * 4. Update navigation to show model selection
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';
import {
  AssistantType,
  ChatMessage,
  ChatHistory,
  ConversationContext,
  AIRequest,
  AIResponse,
  AssistantConfig,
  IAIAssistantService,
  MessageRole,
  STORAGE_KEYS,
} from '../types/ai-assistant.types';

// Initialize Gemini AI
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Model Selection (using Gemini models)
const MODELS = {
  DEFAULT: 'gemini-2.5-flash', // Latest fast and free model (2025)
  GRAMMAR: 'gemini-2.5-flash', // Good for grammar explanations
  TRANSLATION: 'gemini-2.5-flash', // For translation context
};

class AIAssistantService implements IAIAssistantService {
  // Assistant Configurations
  private assistantConfigs: Record<AssistantType, AssistantConfig> = {
    [AssistantType.CONTEXTUAL_TIPS]: {
      type: AssistantType.CONTEXTUAL_TIPS,
      name: 'Contextual Tips',
      description: 'Get smart tips based on your current learning context',
      icon: '💡',
      iconName: 'flash-outline',
      color: '#FFA500', // Orange
      systemPrompt: `You are a helpful language learning assistant specializing in Turkmen language.
Provide contextual tips, suggestions, and insights to help users learn more effectively.
Keep responses concise (2-3 sentences) and actionable.`,
      maxHistoryLength: 10,
    },
    [AssistantType.CONVERSATION_TRAINER]: {
      type: AssistantType.CONVERSATION_TRAINER,
      name: 'Conversation Trainer',
      description: 'Practice real conversations and improve your speaking skills',
      icon: '💬',
      iconName: 'chatbubbles-outline',
      color: '#00CED1', // Turquoise
      systemPrompt: `You are a conversation partner helping users practice Turkmen language.
Engage in natural dialogues, correct mistakes gently, and provide encouraging feedback.
Adapt to the user's level and keep the conversation flowing naturally.`,
      maxHistoryLength: 20,
    },
    [AssistantType.GRAMMAR_HELPER]: {
      type: AssistantType.GRAMMAR_HELPER,
      name: 'Grammar Helper',
      description: 'Get instant help with Turkmen grammar rules and structures',
      icon: '📖',
      iconName: 'document-text-outline',
      color: '#9370DB', // Purple
      systemPrompt: `You are a Turkmen grammar expert. Explain grammar rules clearly with examples.
Break down complex concepts into simple explanations.
Provide examples in Turkmen with translations.`,
      maxHistoryLength: 15,
    },
    [AssistantType.CULTURAL_ADVISOR]: {
      type: AssistantType.CULTURAL_ADVISOR,
      name: 'Cultural Advisor',
      description: 'Learn about Turkmen culture, customs, and etiquette',
      icon: '🏛️',
      iconName: 'globe-outline',
      color: '#FF6B6B', // Red
      systemPrompt: `You are a cultural advisor for Turkmen culture.
Share insights about customs, traditions, etiquette, and cultural nuances.
Help users understand the cultural context behind language use.`,
      maxHistoryLength: 15,
    },
    [AssistantType.GENERAL_ASSISTANT]: {
      type: AssistantType.GENERAL_ASSISTANT,
      name: 'General Assistant',
      description: 'Ask anything about learning Turkmen language',
      icon: '🤖',
      iconName: 'robot-outline',
      iconLib: 'MaterialCommunityIcons',
      color: '#4A90E2', // Blue
      systemPrompt: `You are a friendly AI assistant helping users learn Turkmen language.
Answer questions, provide explanations, and offer support.
Be encouraging and helpful with any language-related queries.`,
      maxHistoryLength: 20,
    },
    [AssistantType.UNIVERSAL]: {
      type: AssistantType.UNIVERSAL,
      name: 'AI Language Assistant',
      description: 'Your personal AI assistant for learning Turkmen',
      icon: '🤖',
      iconName: 'sparkles',
      color: '#7C3AED', // Purple (matching the theme)
      systemPrompt: `You are a comprehensive AI language learning assistant specializing in Turkmen language.

You can help users with:
- 💡 Contextual tips and learning strategies
- 💬 Conversation practice and dialogue training
- 📖 Grammar explanations with clear examples
- 🏛️ Cultural insights, customs, and etiquette
- 🗣️ Pronunciation guidance
- ✍️ Translation and writing help
- 📚 Vocabulary expansion

Guidelines:
- Understand the user's intent and respond appropriately
- Be encouraging and supportive
- Provide clear, practical examples
- Adapt to the user's proficiency level
- Keep responses concise but informative (2-5 sentences typically)
- Use Turkmen examples with translations when relevant
- If practicing conversations, engage naturally and provide gentle corrections
- For grammar questions, break down concepts into simple explanations
- For cultural questions, provide context and practical advice

Your goal is to make learning Turkmen enjoyable, effective, and culturally enriching.`,
      maxHistoryLength: 30,
    },
  };

  /**
   * Send a message to the AI assistant
   */
  async sendMessage(
    assistantType: AssistantType,
    message: string,
    context: ConversationContext,
    history?: ChatMessage[]
  ): Promise<AIResponse> {
    try {
      const config = this.getAssistantConfig(assistantType);

      // Build the prompt with context
      const prompt = this.buildPrompt(config, message, context, history);

      // Select model based on assistant type
      const model = this.selectModel(assistantType);

      // Call Gemini API
      const response = await this.callGeminiAPI(model, prompt);

      return {
        content: response,
        success: true,
        metadata: {
          model,
          processingTime: Date.now(),
        },
      };
    } catch (error) {
      console.error('AI Assistant Error:', error);

      // Fallback response
      return {
        content: this.getFallbackResponse(assistantType),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get chat history for a specific assistant
   */
  async getHistory(assistantType: AssistantType): Promise<ChatHistory[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (!stored) return [];

      const allHistory: ChatHistory[] = JSON.parse(stored);

      // Filter by assistant type
      return allHistory.filter((h) => h.assistantType === assistantType);
    } catch (error) {
      console.error('Error getting history:', error);
      return [];
    }
  }

  /**
   * Save chat history
   */
  async saveHistory(history: ChatHistory): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      const allHistory: ChatHistory[] = stored ? JSON.parse(stored) : [];

      // Add or update history
      const existingIndex = allHistory.findIndex((h) => h.id === history.id);
      if (existingIndex !== -1) {
        allHistory[existingIndex] = history;
      } else {
        allHistory.push(history);
      }

      // Keep only last 50 conversations per assistant
      const filteredHistory = this.trimHistory(allHistory);

      await AsyncStorage.setItem(
        STORAGE_KEYS.CHAT_HISTORY,
        JSON.stringify(filteredHistory)
      );
    } catch (error) {
      console.error('Error saving history:', error);
    }
  }

  /**
   * Clear history for a specific assistant
   */
  async clearHistory(assistantType: AssistantType): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      if (!stored) return;

      const allHistory: ChatHistory[] = JSON.parse(stored);

      // Remove history for this assistant
      const filteredHistory = allHistory.filter(
        (h) => h.assistantType !== assistantType
      );

      await AsyncStorage.setItem(
        STORAGE_KEYS.CHAT_HISTORY,
        JSON.stringify(filteredHistory)
      );
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  }

  /**
   * Get assistant configuration
   */
  getAssistantConfig(assistantType: AssistantType): AssistantConfig {
    return this.assistantConfigs[assistantType];
  }

  /**
   * Get all assistant configurations
   */
  getAllAssistantConfigs(): AssistantConfig[] {
    return Object.values(this.assistantConfigs);
  }

  // ===== PRIVATE METHODS =====

  /**
   * Build prompt with context and history
   */
  private buildPrompt(
    config: AssistantConfig,
    message: string,
    context: ConversationContext,
    history?: ChatMessage[]
  ): string {
    let prompt = `${config.systemPrompt}\n\n`;

    // Add context
    prompt += `Context: Learning ${context.language} language`;
    if (context.userLevel) {
      prompt += `, User level: ${context.userLevel}`;
    }
    if (context.topic) {
      prompt += `, Topic: ${context.topic}`;
    }
    prompt += '\n\n';

    // Add conversation history (last 3 messages)
    if (history && history.length > 0) {
      const recentHistory = history.slice(-3);
      prompt += 'Previous conversation:\n';
      recentHistory.forEach((msg) => {
        const role = msg.role === MessageRole.USER ? 'User' : 'Assistant';
        prompt += `${role}: ${msg.content}\n`;
      });
      prompt += '\n';
    }

    // Add current message
    prompt += `User: ${message}\nAssistant:`;

    return prompt;
  }

  /**
   * Select model based on assistant type
   */
  private selectModel(assistantType: AssistantType): string {
    switch (assistantType) {
      case AssistantType.GRAMMAR_HELPER:
        return MODELS.GRAMMAR;
      default:
        return MODELS.DEFAULT;
    }
  }

  /**
   * Call Gemini API
   */
  private async callGeminiAPI(
    model: string,
    prompt: string
  ): Promise<string> {
    if (!genAI) {
      throw new Error('Gemini API key not configured. Please add GEMINI_API_KEY to .env file.');
    }

    try {
      // Get the generative model
      const geminiModel = genAI.getGenerativeModel({ model });

      // Generate content
      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text || 'I apologize, I could not generate a response.';
    } catch (error) {
      console.error('❌ Gemini API Error:', error);
      throw error;
    }
  }

  /*
   * FUTURE: Add more AI providers here
   *
   * Example - Groq API (if available in region):
   *
   * private async callGroqAPI(model: string, prompt: string, systemPrompt: string): Promise<string> {
   *   const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
   *     method: 'POST',
   *     headers: {
   *       'Content-Type': 'application/json',
   *       'Authorization': `Bearer ${GROQ_API_KEY}`,
   *     },
   *     body: JSON.stringify({
   *       model: 'llama-3.1-70b-versatile',
   *       messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: prompt }],
   *       temperature: 0.7,
   *       max_tokens: 500,
   *     }),
   *   });
   *   const data = await response.json();
   *   return data.choices?.[0]?.message?.content || 'Error';
   * }
   *
   * Other options: Together.ai, Hugging Face, etc.
   */

  /**
   * Get fallback response when API fails
   */
  private getFallbackResponse(assistantType: AssistantType): string {
    const fallbacks: Record<AssistantType, string> = {
      [AssistantType.CONTEXTUAL_TIPS]:
        "I'm having trouble connecting right now. Try practicing regularly and reviewing phrases multiple times to improve retention!",
      [AssistantType.CONVERSATION_TRAINER]:
        "I can't connect at the moment, but here's a tip: practice speaking out loud, even when alone. It helps build confidence!",
      [AssistantType.GRAMMAR_HELPER]:
        "I'm offline right now. Remember: Turkmen grammar follows subject-object-verb order. Practice with simple sentences first!",
      [AssistantType.CULTURAL_ADVISOR]:
        "I'm having connection issues. Fun fact: Turkmen people are known for their hospitality. Always greet elders with respect!",
      [AssistantType.GENERAL_ASSISTANT]:
        "I'm having trouble connecting right now. Please try again in a moment. In the meantime, keep practicing!",
      [AssistantType.UNIVERSAL]:
        "I'm having connection issues. Please try again later. Keep learning in the meantime!",
    };

    return fallbacks[assistantType];
  }

  /**
   * Trim history to keep storage manageable
   */
  private trimHistory(history: ChatHistory[]): ChatHistory[] {
    const maxPerAssistant = 10;
    const grouped: Record<string, ChatHistory[]> = {};

    // Group by assistant type
    history.forEach((h) => {
      if (!grouped[h.assistantType]) {
        grouped[h.assistantType] = [];
      }
      grouped[h.assistantType].push(h);
    });

    // Keep only latest N per assistant
    const trimmed: ChatHistory[] = [];
    Object.values(grouped).forEach((group) => {
      const sorted = group.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      trimmed.push(...sorted.slice(0, maxPerAssistant));
    });

    return trimmed;
  }
}

// Export singleton instance
export default new AIAssistantService();
