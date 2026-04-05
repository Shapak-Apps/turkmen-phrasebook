/**
 * Dictionary Screen - Coming Soon Placeholder
 * Phase 5: Dictionary Placeholder
 * Will be implemented in v2.0
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useResponsive } from '../utils/ResponsiveUtils';

const STORAGE_KEY = '@dictionary:notification_email';

const DictionaryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { scale, verticalScale, moderateScale } = useResponsive();

  const handleNotifyMe = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address to get notified.');
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    try {
      // Save email to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, email);
      setIsSubmitted(true);

      Alert.alert(
        '✅ Success!',
        'Thank you! We\'ll notify you when the Dictionary feature is ready.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving email:', error);
      Alert.alert('Error', 'Failed to save your email. Please try again.');
    }
  };

  const styles = React.useMemo(() => StyleSheet.create({
    backButton: {
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: scale(20),
      elevation: 3,
      height: scale(40),
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      width: scale(40),
    },
    backToHomeButton: {
      paddingVertical: verticalScale(12),
    },
    backToHomeText: {
      color: '#6366F1',
      fontSize: moderateScale(16),
      fontWeight: '600',
    },
    badge: {
      backgroundColor: '#FEF3C7',
      borderColor: '#FCD34D',
      borderRadius: moderateScale(20),
      borderWidth: 1,
      marginBottom: verticalScale(16),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(8),
    },
    badgeText: {
      color: '#92400E',
      fontSize: moderateScale(12),
      fontWeight: '700',
      letterSpacing: 1,
    },
    container: {
      flex: 1,
    },
    content: {
      paddingBottom: verticalScale(32),
    },
    description: {
      color: '#666',
      fontSize: moderateScale(16),
      lineHeight: moderateScale(24),
      marginBottom: verticalScale(24),
      textAlign: 'center',
    },
    emailInput: {
      backgroundColor: '#F5F5F5',
      borderColor: '#E0E0E0',
      borderRadius: moderateScale(12),
      borderWidth: 1,
      fontSize: moderateScale(16),
      marginBottom: verticalScale(16),
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(14),
    },
    featureIcon: {
      fontSize: moderateScale(24),
      marginRight: scale(12),
    },
    featureItem: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: verticalScale(16),
    },
    featureText: {
      color: '#333',
      flex: 1,
      fontSize: moderateScale(16),
    },
    featuresList: {
      backgroundColor: '#FFFFFF',
      borderRadius: moderateScale(16),
      elevation: 2,
      marginBottom: verticalScale(24),
      padding: scale(20),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      width: '100%',
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(16),
    },
    headerTitle: {
      color: '#000',
      fontSize: moderateScale(24),
      fontWeight: '700',
    },
    icon: {
      fontSize: moderateScale(64),
    },
    iconContainer: {
      alignItems: 'center',
      borderRadius: scale(60),
      elevation: 8,
      height: scale(120),
      justifyContent: 'center',
      marginBottom: verticalScale(24),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      width: scale(120),
    },
    mainContent: {
      alignItems: 'center',
      paddingHorizontal: scale(24),
      paddingTop: verticalScale(20),
    },
    notificationSection: {
      backgroundColor: '#FFFFFF',
      borderRadius: moderateScale(16),
      elevation: 2,
      marginBottom: verticalScale(24),
      padding: scale(24),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      width: '100%',
    },
    notificationSubtitle: {
      color: '#666',
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
      marginBottom: verticalScale(20),
      textAlign: 'center',
    },
    notificationTitle: {
      color: '#000',
      fontSize: moderateScale(18),
      fontWeight: '700',
      marginBottom: verticalScale(8),
      textAlign: 'center',
    },
    notifyButton: {
      borderRadius: moderateScale(12),
      overflow: 'hidden',
    },
    notifyButtonGradient: {
      alignItems: 'center',
      paddingVertical: verticalScale(16),
    },
    notifyButtonText: {
      color: '#FFFFFF',
      fontSize: moderateScale(16),
      fontWeight: '700',
    },
    placeholder: {
      width: scale(40),
    },
    safeArea: {
      backgroundColor: '#F8F9FA',
      flex: 1,
    },
    successIcon: {
      fontSize: moderateScale(48),
      marginBottom: verticalScale(12),
    },
    successSection: {
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: moderateScale(16),
      elevation: 2,
      marginBottom: verticalScale(24),
      padding: scale(32),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      width: '100%',
    },
    successSubtext: {
      color: '#666',
      fontSize: moderateScale(14),
      textAlign: 'center',
    },
    successText: {
      color: '#10B981',
      fontSize: moderateScale(20),
      fontWeight: '700',
      marginBottom: verticalScale(8),
    },
    title: {
      color: '#000',
      fontSize: moderateScale(26),
      fontWeight: '700',
      marginBottom: verticalScale(12),
      textAlign: 'center',
    },
    versionBadge: {
      backgroundColor: '#E0E7FF',
      borderRadius: moderateScale(12),
      marginBottom: verticalScale(32),
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(10),
    },
    versionText: {
      color: '#4F46E5',
      fontSize: moderateScale(14),
      fontWeight: '600',
    },
  }), [scale, verticalScale, moderateScale]);

  const FeatureItem: React.FC<FeatureItemProps> = ({ icon, text }) => (
    <View style={styles.featureItem}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={moderateScale(24)} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dictionary</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Icon */}
          <LinearGradient
            colors={['#9CA3AF', '#6B7280']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}
          >
            <Text style={styles.icon}>📖</Text>
          </LinearGradient>

          {/* Coming Soon Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>COMING SOON</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Turkmen-Multilingual Dictionary</Text>

          {/* Description */}
          <Text style={styles.description}>
            We're working hard to bring you a comprehensive dictionary feature with:
          </Text>

          {/* Features List */}
          <View style={styles.featuresList}>
            <FeatureItem icon="✨" text="10,000+ words and definitions" />
            <FeatureItem icon="🔊" text="Audio pronunciations" />
            <FeatureItem icon="📝" text="Example sentences" />
            <FeatureItem icon="🔍" text="Advanced search & filters" />
            <FeatureItem icon="⭐" text="Save favorite words" />
            <FeatureItem icon="📚" text="Word of the day" />
          </View>

          {/* Version Badge */}
          <View style={styles.versionBadge}>
            <Text style={styles.versionText}>Planned for Version 2.0</Text>
          </View>

          {/* Notification Section */}
          {!isSubmitted ? (
            <View style={styles.notificationSection}>
              <Text style={styles.notificationTitle}>Get notified when it's ready!</Text>
              <Text style={styles.notificationSubtitle}>
                Enter your email and we'll let you know when the Dictionary is available.
              </Text>

              <TextInput
                style={styles.emailInput}
                placeholder="your.email@example.com"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TouchableOpacity
                style={styles.notifyButton}
                onPress={handleNotifyMe}
              >
                <LinearGradient
                  colors={['#6366F1', '#4F46E5']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.notifyButtonGradient}
                >
                  <Text style={styles.notifyButtonText}>Notify Me 🔔</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.successSection}>
              <Text style={styles.successIcon}>✅</Text>
              <Text style={styles.successText}>You're on the list!</Text>
              <Text style={styles.successSubtext}>
                We'll notify you at {email}
              </Text>
            </View>
          )}

          {/* Back to Home */}
          <TouchableOpacity
            style={styles.backToHomeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backToHomeText}>← Back to Main Hub</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Feature Item Component Props
interface FeatureItemProps {
  icon: string;
  text: string;
}

export default DictionaryScreen;
