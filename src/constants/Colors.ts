// src/constants/Colors.ts - Lingify-стиль палитра

export const Colors = {
  // Primary/Accent — единый синий
  primary: '#2D8CFF',
  primaryLight: '#5AA3FF',
  primaryDark: '#1A6FD6',

  // Background
  background: '#FFFFFF',
  backgroundLight: '#F9FAFB',
  backgroundDark: '#F3F4F6',

  // Card
  cardBackground: '#FFFFFF',
  cardBorder: '#E5E7EB',
  cardShadow: '#000000',

  // Text
  text: '#1A1A1A',
  textPrimary: '#1A1A1A',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textMuted: '#D1D5DB',
  textWhite: '#FFFFFF',

  // Language-specific (сохраняем для распознавания)
  chineseText: '#1A1A1A',
  turkmenText: '#1A1A1A',
  russianText: '#6B7280',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#2D8CFF',

  // UI elements
  shadowColor: '#000000',
  border: '#E5E7EB',
  borderColor: '#E5E7EB',
  divider: '#E5E7EB',
  overlay: '#000000',

  // Tab navigation
  tabActive: '#2D8CFF',
  tabInactive: '#9CA3AF',

  // Button
  buttonText: '#FFFFFF',
  buttonTextSecondary: '#1A1A1A',

  // Input
  inputText: '#1A1A1A',
  inputPlaceholder: '#9CA3AF',

  // Audio buttons — единый синий
  chineseAudio: '#2D8CFF',
  chineseAudioShadow: '#1A6FD6',
  turkmenAudio: '#2D8CFF',
  turkmenAudioShadow: '#1A6FD6',

  // Offline status
  offline: '#F59E0B',
  online: '#10B981',
  syncing: '#2D8CFF',

  // Chat bubbles (Lingify-стиль)
  userBubble: '#2D8CFF',
  aiBubble: '#F3F4F6',

  // Conversation screen
  conversationBackground: '#2D8CFF',
  conversationText: '#FFFFFF',

  // Убраны градиенты — плоские цвета
  gradientChineseStart: '#2D8CFF',
  gradientChineseEnd: '#1A6FD6',
  gradientTurkmenStart: '#2D8CFF',
  gradientTurkmenEnd: '#1A6FD6',
  gradientGoldStart: '#2D8CFF',
  gradientGoldEnd: '#1A6FD6',

  // Legacy — для обратной совместимости
  chineseRed: '#2D8CFF',
  chineseRedLight: '#5AA3FF',
  chineseRedDark: '#1A6FD6',
  chineseGold: '#F59E0B',
  turkmenGreen: '#2D8CFF',
  turkmenGreenLight: '#5AA3FF',
  turkmenGreenDark: '#1A6FD6',
  turkmenCarpet: '#6B7280',
  accent: '#2D8CFF',
  accentLight: '#5AA3FF',
  accentDark: '#1A6FD6',
} as const;

export type ColorKey = keyof typeof Colors;
