/**
 * AI Assistants Types
 * Phase 4: AI Assistants
 */

// Assistant Types
export enum AssistantType {
  CONTEXTUAL_TIPS = 'contextual_tips',
  CONVERSATION_TRAINER = 'conversation_trainer',
  GRAMMAR_HELPER = 'grammar_helper',
  CULTURAL_ADVISOR = 'cultural_advisor',
  GENERAL_ASSISTANT = 'general_assistant',
  UNIVERSAL = 'universal', // Universal AI assistant (all-in-one)
}

// Message Types
export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  assistantType: AssistantType;
}

// Conversation Context
export interface ConversationContext {
  assistantType: AssistantType;
  language: string; // Target language (e.g., 'tk', 'en', 'zh', 'ru')
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  topic?: string;
}

// Chat History
export interface ChatHistory {
  id: string;
  assistantType: AssistantType;
  messages: ChatMessage[];
  context: ConversationContext;
  createdAt: Date;
  updatedAt: Date;
}

// Assistant Configuration
export interface AssistantConfig {
  type: AssistantType;
  name: string;
  description: string;
  icon: string; // Emoji (legacy)
  iconName: string; // Icon name
  iconLib?: 'Ionicons' | 'MaterialCommunityIcons'; // Icon library
  color: string; // Gradient start color
  systemPrompt: string;
  maxHistoryLength: number;
}

// API Request/Response
export interface AIRequest {
  prompt: string;
  context?: ConversationContext;
  history?: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  success: boolean;
  error?: string;
  metadata?: {
    model: string;
    tokensUsed?: number;
    processingTime?: number;
  };
}

// Service Types
export interface IAIAssistantService {
  sendMessage(
    assistantType: AssistantType,
    message: string,
    context: ConversationContext,
    history?: ChatMessage[]
  ): Promise<AIResponse>;

  getHistory(assistantType: AssistantType): Promise<ChatHistory[]>;

  saveHistory(history: ChatHistory): Promise<void>;

  clearHistory(assistantType: AssistantType): Promise<void>;

  getAssistantConfig(assistantType: AssistantType): AssistantConfig;
}

// UI Component Props
export interface ChatBubbleProps {
  message: ChatMessage;
  isLastMessage?: boolean;
}

export interface AssistantCardProps {
  config: AssistantConfig;
  onPress: () => void;
}

export interface FeedbackCardProps {
  feedback: string;
  type: 'tip' | 'correction' | 'suggestion' | 'praise';
  onDismiss?: () => void;
}

// Assistant-specific Types

// Contextual Tips
export interface ContextualTip {
  id: string;
  category: string;
  tip: string;
  example?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Conversation Trainer
export interface ConversationScenario {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  turns: number;
}

// Grammar Helper
export interface GrammarRule {
  id: string;
  title: string;
  explanation: string;
  examples: string[];
  relatedRules?: string[];
}

// Cultural Advisor
export interface CulturalInsight {
  id: string;
  topic: string;
  insight: string;
  doAndDont?: {
    do: string[];
    dont: string[];
  };
}

// Storage Keys
export const STORAGE_KEYS = {
  CHAT_HISTORY: '@ai_assistants:chat_history',
  USER_PREFERENCES: '@ai_assistants:user_preferences',
} as const;
