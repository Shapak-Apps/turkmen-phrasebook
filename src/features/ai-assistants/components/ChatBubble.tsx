/**
 * Chat Bubble — Lingify style
 * Blue bubbles = user (white text), grey bubbles = AI (black text)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatBubbleProps, MessageRole } from '../types/ai-assistant.types';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLastMessage }) => {
  const isUser = message.role === MessageRole.USER;

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.assistantContainer,
        isLastMessage && styles.lastMessage,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text
          style={[
            styles.text,
            isUser ? styles.userText : styles.assistantText,
          ]}
        >
          {message.content}
        </Text>

        <Text style={[styles.timestamp, isUser && styles.timestampUser]}>
          {new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginVertical: verticalScale(4),
    paddingHorizontal: scale(16),
  },

  userContainer: {
    justifyContent: 'flex-end',
  },

  assistantContainer: {
    justifyContent: 'flex-start',
  },

  lastMessage: {
    marginBottom: verticalScale(16),
  },

  bubble: {
    borderRadius: scale(16),
    maxWidth: '80%',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },

  // User — blue bubble, white text
  userBubble: {
    backgroundColor: '#2D8CFF',
    borderBottomRightRadius: scale(4),
  },

  // AI — light grey bubble, dark text
  assistantBubble: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: scale(4),
  },

  text: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(4),
  },

  userText: {
    color: '#FFFFFF',
  },

  assistantText: {
    color: '#1A1A1A',
  },

  timestamp: {
    alignSelf: 'flex-end',
    color: 'rgba(0, 0, 0, 0.35)',
    fontSize: moderateScale(11),
  },

  timestampUser: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default ChatBubble;
