/**
 * Universal AI Chat Screen
 * Single unified AI assistant for all language learning needs
 * Replaces the 5 separate assistant screens with one intelligent chat
 */

import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../types/navigation';
import ChatScreen from '../components/ChatScreen';
import { AssistantType } from '../types/ai-assistant.types';

type UniversalAIChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'UniversalAIChat'
>;

interface Props {
  navigation: UniversalAIChatScreenNavigationProp;
}

const UniversalAIChatScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ChatScreen
      assistantType={AssistantType.UNIVERSAL}
      onBack={() => navigation.goBack()}
    />
  );
};

export default UniversalAIChatScreen;
