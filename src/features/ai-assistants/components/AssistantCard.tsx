/**
 * Assistant Card Component
 * Displays an AI assistant card on the home screen
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AssistantCardProps } from '../types/ai-assistant.types';
import { scale, verticalScale, moderateScale } from '../../../utils/ResponsiveUtils';

const AssistantCard: React.FC<AssistantCardProps> = ({ config, onPress }) => {
  // Generate gradient colors (darker shade of main color)
  const getGradientColors = (color: string): [string, string] => {
    // Simple gradient: from color to slightly darker shade
    return [color, adjustColor(color, -20)];
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={getGradientColors(config.color)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Icon */}
        <View style={styles.iconContainer}>
          {config.iconLib === 'MaterialCommunityIcons' ? (
            <MaterialCommunityIcons name={config.iconName as any} size={32} color="#FFFFFF" />
          ) : (
            <Ionicons name={config.iconName as any} size={32} color="#FFFFFF" />
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.name}>{config.name}</Text>
          <Text style={styles.description}>{config.description}</Text>
        </View>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// Helper function to adjust color brightness
function adjustColor(color: string, amount: number): string {
  // Simple color adjustment (works for hex colors)
  const clamp = (num: number) => Math.min(255, Math.max(0, num));

  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Adjust and convert back to hex
  const newR = clamp(r + amount);
  const newG = clamp(g + amount);
  const newB = clamp(b + amount);

  return `#${newR.toString(16).padStart(2, '0')}${newG
    .toString(16)
    .padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  arrowContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: scale(18),
    height: scale(36),
    justifyContent: 'center',
    width: scale(36),
  },
  container: {
    borderRadius: scale(20),
    elevation: 8,
    marginHorizontal: scale(16),
    marginVertical: verticalScale(8),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(12),
  },
  content: {
    flex: 1,
    marginRight: scale(16),
  },
  description: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: moderateScale(14),
    fontWeight: '500',
    lineHeight: moderateScale(20),
  },
  gradient: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: verticalScale(110),
    padding: scale(20),
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: scale(32),
    height: scale(64),
    justifyContent: 'center',
    marginRight: scale(16),
    width: scale(64),
  },
  name: {
    color: '#FFFFFF',
    fontSize: moderateScale(19),
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: verticalScale(6),
  },
});

export default AssistantCard;
