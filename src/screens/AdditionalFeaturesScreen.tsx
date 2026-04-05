// src/screens/AdditionalFeaturesScreen.tsx - ОБНОВЛЕННЫЙ с 6 категориями

import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '../constants/Colors';
import { TextStyles } from '../constants/Typography';
import { useAppLanguage } from '../contexts/LanguageContext';
import { useAnimations } from '../hooks/useAnimations';
import { useHistory } from '../hooks/useHistory';
import { usePhrases } from '../hooks/usePhrases';
import { scale, verticalScale, moderateScale, useResponsive } from '../utils/ResponsiveUtils';

// Статичные стили для FeatureCard (вне компонента)
const featureCardStyles = StyleSheet.create({
  cardSubtitle: {
    color: Colors.textSecondary,
    fontSize: moderateScale(12),
    fontWeight: '500',
    lineHeight: moderateScale(16),
    minHeight: moderateScale(16),
    textAlign: 'center',
  },
  cardTitle: {
    color: Colors.text,
    fontSize: moderateScale(14),
    fontWeight: '700',
    lineHeight: moderateScale(18),
    marginBottom: verticalScale(6),
    minHeight: moderateScale(18),
    textAlign: 'center',
  },
  featureCard: {
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: moderateScale(12),
    height: verticalScale(160),
    justifyContent: 'center',
    marginBottom: verticalScale(16),
    padding: scale(16),
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: scale(30),
    height: scale(60),
    justifyContent: 'center',
    marginBottom: verticalScale(16),
    width: scale(60),
  },
});

interface FeatureCardProps {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  onPress: () => void;
}

const FeatureCard = React.memo<FeatureCardProps>(({ title, subtitle, icon, color, onPress }) => {
  const { hapticFeedback } = useAnimations();

  const handlePress = useCallback(() => {
    hapticFeedback('light');
    onPress();
  }, [onPress, hapticFeedback]);

  return (
    <TouchableOpacity
      style={[featureCardStyles.featureCard, { backgroundColor: color + '15' }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={[featureCardStyles.iconContainer, { backgroundColor: color + '25' }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <Text style={featureCardStyles.cardTitle} numberOfLines={2}>
        {title}
      </Text>
      <Text style={featureCardStyles.cardSubtitle} numberOfLines={2}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  );
});

export default function AdditionalFeaturesScreen() {
  const navigation = useNavigation();
  const { config, getTexts } = useAppLanguage();
  const { getRecentPhrases, stats } = useHistory();
  const texts = getTexts();
  const { phrases } = usePhrases();
  const { scale: scaleFunc, verticalScale, moderateScale, width } = useResponsive();

  const cardWidth = (width - scaleFunc(60)) / 2; // 2 columns with margins

  // Get recent phrases for the recent feature
  const recentPhrases = getRecentPhrases(phrases, 10);

  const features = React.useMemo(() => [
    {
      id: 'search',
      title: config.mode === 'tk' ? 'Gözleg' : 
             config.mode === 'zh' ? '搜索' : 'Поиск',
      subtitle: config.mode === 'tk' ? 'Sözlemleri gözläň' :
                config.mode === 'zh' ? '搜索短语' : 'Поиск фраз',
      icon: 'search' as keyof typeof Ionicons.glyphMap,
      color: '#3B82F6',
      screen: 'Search',
    },
    {
      id: 'favorites',
      title: config.mode === 'tk' ? 'Halanýanlar' :
             config.mode === 'zh' ? '收藏' : 'Избранное',
      subtitle: config.mode === 'tk' ? 'Saýlanan sözlemler' :
                config.mode === 'zh' ? '收藏的短语' : 'Избранные фразы',
      icon: 'heart' as keyof typeof Ionicons.glyphMap,
      color: '#EF4444',
      screen: 'Favorites',
    },
    {
      id: 'statistics',
      title: config.mode === 'tk' ? 'Statistika' :
             config.mode === 'zh' ? '统计' : 'Статистика',
      subtitle: config.mode === 'tk' ? 'Öwreniş statistikasy' :
                config.mode === 'zh' ? '学习统计' : 'Статистика изучения',
      icon: 'analytics' as keyof typeof Ionicons.glyphMap,
      color: '#10B981',
      screen: 'Stats',
    },
    {
      id: 'recent',
      title: config.mode === 'tk' ? 'Soňky öwrenilen' :
             config.mode === 'zh' ? '最近学习的' : 'Недавние',
      subtitle: config.mode === 'tk' ? `${recentPhrases.length} sözlem` :
                config.mode === 'zh' ? `${recentPhrases.length} 短语` : 
                `${recentPhrases.length} фраз`,
      icon: 'time' as keyof typeof Ionicons.glyphMap,
      color: '#8B5CF6',
      screen: 'Recent',
    },
    // НОВАЯ КАТЕГОРИЯ 1: Интересные факты
    {
      id: 'interesting_facts',
      title: config.mode === 'tk' ? 'Gyzykly maglumatlar' :
             config.mode === 'zh' ? '有趣信息' : 'Интересное',
      subtitle: config.mode === 'tk' ? 'Gyzykly faktlar we maglumatlar' :
                config.mode === 'zh' ? '有趣的事实和信息' : 'Интересные факты и информация',
      icon: 'bulb' as keyof typeof Ionicons.glyphMap,
      color: '#F59E0B',
      screen: 'InterestingFacts',
    },
    // НОВАЯ КАТЕГОРИЯ 2: Случайные фразы
    {
      id: 'random_phrases',
      title: config.mode === 'tk' ? 'Tötänleýin sözler' :
             config.mode === 'zh' ? '随机短语' : 'Случайные фразы',
      subtitle: config.mode === 'tk' ? 'Şowly sözlemler' :
                config.mode === 'zh' ? '随机练习短语' : 'Случайные фразы для изучения',
      icon: 'shuffle' as keyof typeof Ionicons.glyphMap,
      color: '#EC4899',
      screen: 'RandomPhrases',
    },
  ], [config.mode, recentPhrases.length]);

  const styles = React.useMemo(() => StyleSheet.create({
    container: {
      backgroundColor: Colors.background,
      flex: 1,
    },
    featureCard: {
      width: cardWidth,
    },
    featuresGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: verticalScale(30),
    },
    header: {
      marginBottom: verticalScale(30),
    },
    scrollContent: {
      paddingHorizontal: scale(20),
      paddingVertical: verticalScale(20),
    },
    statItem: {
      alignItems: 'center',
    },
    statLabel: {
      color: Colors.textLight,
      fontSize: moderateScale(12),
      marginTop: verticalScale(4),
    },
    statNumber: {
      color: Colors.primary,
      fontSize: moderateScale(28),
      fontWeight: 'bold',
    },
    statsContainer: {
      backgroundColor: Colors.backgroundLight,
      borderRadius: moderateScale(16),
      padding: scale(20),
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statsTitle: {
      color: Colors.text,
      fontSize: moderateScale(18),
      fontWeight: '600',
      marginBottom: verticalScale(16),
      textAlign: 'center',
    },
    subtitle: {
      color: Colors.textLight,
      fontSize: moderateScale(16),
      textAlign: 'center',
    },
    title: {
      color: Colors.text,
      fontSize: moderateScale(24),
      fontWeight: '700',
      marginBottom: verticalScale(8),
      textAlign: 'center',
    },
  }), [scaleFunc, verticalScale, moderateScale, cardWidth]);

  const handleFeaturePress = useCallback((featureId: string) => {
    switch (featureId) {
      case 'search':
        navigation.navigate('Search' as never);
        break;
      case 'favorites':
        navigation.navigate('Favorites' as never);
        break;
      case 'statistics':
        navigation.navigate('Stats' as never);
        break;
      case 'recent':
        // For recent, navigate back to home tab
        if (recentPhrases.length > 0) {
          // Navigate to the main tabs and then to Home tab
          navigation.getParent()?.navigate('Home' as never);
        }
        break;
      case 'interesting_facts': {
        // Показываем alert с интересными фактами о китайском языке
        const factTitle = config.mode === 'tk' ? 'Gyzykly faktlar' :
                         config.mode === 'zh' ? '有趣的事实' : 'Интересные факты';

        const factContent = config.mode === 'tk' ?
          'Hytaý dili düýdän iň köp ulanylýan dildir. 1.4 milliard adam bu dilde gürleýär!' :
          config.mode === 'zh' ?
          '中文是世界上使用人数最多的语言。约有14亿人说中文！' :
          'Китайский язык - самый распространенный язык в мире. На нем говорят более 1.4 миллиарда человек!';

        Alert.alert(factTitle, factContent);
        break;
      }
      case 'random_phrases': {
        // Показываем случайную фразу
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        const randomTitle = config.mode === 'tk' ? 'Tötänleýin sözlem' :
                           config.mode === 'zh' ? '随机短语' :
                           config.mode === 'ru' ? 'Случайная фраза' :
                           'Random Phrase';

        // Формируем контент с переводом и туркменским текстом
        const randomContent = `${randomPhrase.translation.text}\n${randomPhrase.translation.transcription ? randomPhrase.translation.transcription + '\n' : ''}\n${randomPhrase.turkmen}`;

        Alert.alert(randomTitle, randomContent);
        break;
      }
      default:
        break;
    }
  }, [navigation, recentPhrases.length, config.mode]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {config.mode === 'tk' ? 'Goşmaça mümkinçilikler' :
             config.mode === 'zh' ? '额外功能' : 'Дополнительные возможности'}
          </Text>
          <Text style={styles.subtitle}>
            {config.mode === 'tk' ? 'Programmanyň ähli mümkinçilikleri' :
             config.mode === 'zh' ? '应用的所有功能' : 'Все функции приложения'}
          </Text>
        </View>

        {/* Features Grid - теперь с 6 категориями */}
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.id}
              id={feature.id}
              title={feature.title}
              subtitle={feature.subtitle}
              icon={feature.icon}
              color={feature.color}
              onPress={() => handleFeaturePress(feature.id)}
            />
          ))}
        </View>

        {/* Stats Summary */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>
            {config.mode === 'tk' ? 'Gysgaça maglumaty' :
             config.mode === 'zh' ? '快速统计' : 'Краткая статистика'}
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.uniquePhrases || 0}</Text>
              <Text style={styles.statLabel}>
                {config.mode === 'tk' ? 'Öwrenilen' :
                 config.mode === 'zh' ? '已学习' : 'Изучено'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.streakDays || 0}</Text>
              <Text style={styles.statLabel}>
                {config.mode === 'tk' ? 'Gün yzygider' :
                 config.mode === 'zh' ? '连续天数' : 'Дней подряд'}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{recentPhrases.length}</Text>
              <Text style={styles.statLabel}>
                {config.mode === 'tk' ? 'Soňky' :
                 config.mode === 'zh' ? '最近' : 'Недавние'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}