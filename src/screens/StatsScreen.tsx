// src/screens/StatsScreen.tsx — Lingify style
import React, { useMemo, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { usePhrases } from '../hooks/usePhrases';
import { categories } from '../data/categories';
import { useHistory } from '../hooks/useHistory';
import { useAppLanguage } from '../contexts/LanguageContext';
import { LoadingSpinner, EmptyState } from '../components/LoadingStates';
import { SimpleBarChart, SimpleLineChart } from '../components/SimpleCharts';
import ErrorBoundary from '../components/ErrorBoundary';
import { scale, verticalScale, moderateScale, useResponsive } from '../utils/ResponsiveUtils';

// Stat row — clean list item
const StatRow = React.memo<{
  icon: string;
  title: string;
  value: string;
  subtitle?: string;
  onPress?: () => void;
  showDivider?: boolean;
}>(({ icon, title, value, subtitle, onPress, showDivider = true }) => (
  <>
    <TouchableOpacity
      style={styles.statRow}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.6 : 1}
    >
      <View style={styles.statIconCircle}>
        <Ionicons name={icon as any} size={moderateScale(20)} color="#2D8CFF" />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statTitle}>{title}</Text>
        {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {onPress && <Ionicons name="chevron-forward" size={moderateScale(18)} color="#9CA3AF" />}
    </TouchableOpacity>
    {showDivider && <View style={styles.divider} />}
  </>
));

const SectionTitle = React.memo<{ title: string; icon: string }>(({ title, icon }) => (
  <View style={styles.sectionHeader}>
    <Ionicons name={icon as any} size={moderateScale(20)} color="#2D8CFF" />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
));

const ProgressBar = React.memo<{
  progress: number;
  color?: string;
  height?: number;
}>(({ progress, color = '#2D8CFF', height = 6 }) => (
  <View style={[styles.progressBg, { height }]}>
    <View
      style={[
        styles.progressFill,
        {
          backgroundColor: color,
          width: `${Math.max(0, Math.min(100, progress * 100))}%`,
          height,
        },
      ]}
    />
  </View>
));

interface CategoryProgressProps {
  category: any;
  totalPhrasesInCategory: number;
  isLast: boolean;
}

const CategoryProgressItem = React.memo<CategoryProgressProps>(({ category, totalPhrasesInCategory, isLast }) => {
  const { config } = useAppLanguage();

  const categoryName = useMemo(() => {
    switch (config.mode) {
      case 'tk': return category.category.nameTk;
      case 'zh': return category.category.nameZh;
      default: return category.category.nameRu;
    }
  }, [category.category, config.mode]);

  const progress = totalPhrasesInCategory > 0 ? category.phrasesStudied / totalPhrasesInCategory : 0;

  return (
    <>
      <View style={styles.categoryItem}>
        <View style={styles.categoryTop}>
          <View style={styles.categoryLeft}>
            <Text style={styles.categoryEmoji}>{category.category.icon}</Text>
            <Text style={styles.categoryName}>{categoryName}</Text>
          </View>
          <Text style={styles.categoryCount}>
            {category.phrasesStudied}/{totalPhrasesInCategory}
          </Text>
        </View>
        <ProgressBar progress={progress} />
        <Text style={styles.categoryMeta}>
          {category.totalViews} {config.mode === 'tk' ? 'görkeziş' : config.mode === 'zh' ? '次查看' : 'просмотров'}
        </Text>
      </View>
      {!isLast && <View style={styles.divider} />}
    </>
  );
});

export default function StatsScreen() {
  const navigation = useNavigation<any>();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');
  const { width, scale: scaleResp } = useResponsive();
  const chartWidth = width - scaleResp(80);

  const {
    stats,
    loading,
    getCategoryStats,
    getLearningTrends,
    setDailyGoal,
    currentSession,
  } = useHistory();
  const { config } = useAppLanguage();
  const { phrases } = usePhrases();

  const categoryStats = useMemo(() => {
    const s = getCategoryStats(categories);
    return s.map(stat => ({
      ...stat,
      totalPhrasesInCategory: phrases.filter(p => p.categoryId === stat.category.id).length,
    }));
  }, [getCategoryStats]);

  const learningTrends = useMemo(() => getLearningTrends(), [getLearningTrends]);

  const chartData = useMemo(() => {
    return learningTrends.map((day, index) => ({
      day: index + 1,
      phrases: day.phrasesStudied,
      time: day.timeSpent,
      date: new Date(day.date).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' }),
    }));
  }, [learningTrends]);

  const topCategories = useMemo(() => {
    return categoryStats
      .filter(cat => cat.phrasesStudied > 0)
      .sort((a, b) => b.totalViews - a.totalViews)
      .slice(0, 5);
  }, [categoryStats]);

  const handleDailyGoalPress = useCallback(() => {
    const options = [5, 10, 15, 20, 25];
    Alert.alert(
      config.mode === 'tk' ? 'Gündelik maksat' : config.mode === 'zh' ? '每日目标' : 'Дневная цель',
      config.mode === 'tk' ? 'Günde näçe sözlem öwrenmek isleýärsiňiz?' :
      config.mode === 'zh' ? '您每天想学习多少个短语？' :
      'Сколько фраз вы хотите изучать в день?',
      [
        ...options.map(goal => ({
          text: `${goal} ${config.mode === 'tk' ? 'sözlem' : config.mode === 'zh' ? '短语' : 'фраз'}`,
          onPress: () => setDailyGoal(goal),
        })),
        { text: config.mode === 'tk' ? 'Ýatyr' : config.mode === 'zh' ? '取消' : 'Отмена', style: 'cancel' as const },
      ]
    );
  }, [stats.dailyGoal.phrasesPerDay, config.mode, setDailyGoal]);

  const formatTime = useCallback((minutes: number) => {
    if (minutes < 60) return `${minutes}${config.mode === 'tk' ? 'min' : config.mode === 'zh' ? '分' : 'мин'}`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}${config.mode === 'tk' ? 's' : config.mode === 'zh' ? '时' : 'ч'} ${mins}${config.mode === 'tk' ? 'min' : config.mode === 'zh' ? '分' : 'м'}`;
  }, [config.mode]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message={
          config.mode === 'tk' ? 'Statistika ýüklenýär...' :
          config.mode === 'zh' ? '加载统计数据...' :
          'Загрузка статистики...'
        } />
      </SafeAreaView>
    );
  }

  if (stats.totalViews === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <EmptyState
          icon="📊"
          title={
            config.mode === 'tk' ? 'Heniz statistika ýok' :
            config.mode === 'zh' ? '暂无统计数据' :
            'Пока нет статистики'
          }
          message={
            config.mode === 'tk' ? 'Sözlem öwrenip başlaň' :
            config.mode === 'zh' ? '开始学习短语' :
            'Начните изучать фразы'
          }
        />
      </SafeAreaView>
    );
  }

  const dailyProgress = Math.min(stats.todaysPhrases / stats.dailyGoal.phrasesPerDay, 1);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <SafeAreaView edges={['top']} style={styles.headerArea}>
        <View style={styles.header}>
          {navigation.canGoBack() && (
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={moderateScale(24)} color="#1A1A1A" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>
            {config.mode === 'tk' ? 'Statistika' : config.mode === 'zh' ? '统计' : 'Статистика'}
          </Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ErrorBoundary>
          {/* Overview stats */}
          <View style={styles.section}>
            <SectionTitle
              title={config.mode === 'tk' ? 'Umumy' : config.mode === 'zh' ? '总览' : 'Обзор'}
              icon="analytics-outline"
            />

            <View style={styles.statsContainer}>
              <StatRow
                icon="book-outline"
                title={config.mode === 'tk' ? 'Öwrenilen sözlemler' : config.mode === 'zh' ? '学过的短语' : 'Изучено фраз'}
                value={`${stats.uniquePhrases}`}
                subtitle={`/ ${phrases.length}`}
              />
              <StatRow
                icon="eye-outline"
                title={config.mode === 'tk' ? 'Jemi görkezişler' : config.mode === 'zh' ? '总查看' : 'Просмотров'}
                value={stats.totalViews.toString()}
              />
              <StatRow
                icon="time-outline"
                title={config.mode === 'tk' ? 'Öwreniş wagty' : config.mode === 'zh' ? '学习时间' : 'Время'}
                value={formatTime(stats.totalStudyTime)}
                subtitle={`${stats.sessionsCount} ${config.mode === 'tk' ? 'sessiýa' : config.mode === 'zh' ? '次' : 'сессий'}`}
              />
              <StatRow
                icon="flame-outline"
                title={config.mode === 'tk' ? 'Dowamly günler' : config.mode === 'zh' ? '连续天数' : 'Стрик'}
                value={stats.streakDays.toString()}
                subtitle={`${config.mode === 'tk' ? 'Iň gowy' : config.mode === 'zh' ? '最佳' : 'Лучший'}: ${stats.bestStreakDays}`}
                showDivider={false}
              />
            </View>
          </View>

          {/* Daily goal */}
          <View style={styles.section}>
            <SectionTitle
              title={config.mode === 'tk' ? 'Gündelik maksat' : config.mode === 'zh' ? '每日目标' : 'Дневная цель'}
              icon="flag-outline"
            />

            <View style={styles.goalContainer}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalText}>
                  {stats.todaysPhrases}/{stats.dailyGoal.phrasesPerDay}{' '}
                  {config.mode === 'tk' ? 'sözlem' : config.mode === 'zh' ? '短语' : 'фраз'}
                </Text>
                <TouchableOpacity onPress={handleDailyGoalPress}>
                  <Text style={styles.goalChangeText}>
                    {config.mode === 'tk' ? 'Üýtget' : config.mode === 'zh' ? '修改' : 'Изменить'}
                  </Text>
                </TouchableOpacity>
              </View>
              <ProgressBar
                progress={dailyProgress}
                color={stats.dailyGoal.achieved ? '#10B981' : '#2D8CFF'}
                height={8}
              />
              {stats.dailyGoal.achieved && (
                <Text style={styles.goalAchieved}>
                  {config.mode === 'tk' ? 'Maksat ýerine ýetirildi!' : config.mode === 'zh' ? '目标已达成！' : 'Цель достигнута!'}
                </Text>
              )}
            </View>
          </View>

          {/* Weekly chart */}
          <View style={styles.section}>
            <SectionTitle
              title={config.mode === 'tk' ? '7 günüň işjeňligi' : config.mode === 'zh' ? '近7天' : 'За 7 дней'}
              icon="bar-chart-outline"
            />
            <View style={styles.chartBox}>
              <SimpleBarChart data={chartData} width={chartWidth} height={180} />
            </View>
          </View>

          {/* Category progress */}
          {topCategories.length > 0 && (
            <View style={styles.section}>
              <SectionTitle
                title={config.mode === 'tk' ? 'Kategoriýalar' : config.mode === 'zh' ? '类别进度' : 'По категориям'}
                icon="grid-outline"
              />
              <View style={styles.categoryContainer}>
                {topCategories.map((cat, i) => (
                  <CategoryProgressItem
                    key={cat.category.id}
                    category={cat}
                    totalPhrasesInCategory={phrases.filter(p => p.categoryId === cat.category.id).length}
                    isLast={i === topCategories.length - 1}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Weekly stats chart */}
          {stats.weeklyStats.length > 0 && (
            <View style={styles.section}>
              <SectionTitle
                title={config.mode === 'tk' ? 'Hepdelik ösüş' : config.mode === 'zh' ? '每周' : 'По неделям'}
                icon="calendar-outline"
              />
              <View style={styles.chartBox}>
                <SimpleLineChart
                  data={stats.weeklyStats.map((week, index) => ({
                    week: `${config.mode === 'tk' ? 'H' : config.mode === 'zh' ? '周' : 'Н'}${index + 1}`,
                    phrases: week.phrasesStudied,
                    time: week.timeSpent,
                  }))}
                  width={chartWidth}
                  height={160}
                />
              </View>
            </View>
          )}

          {/* Achievements */}
          <View style={styles.section}>
            <SectionTitle
              title={config.mode === 'tk' ? 'Üstünlikler' : config.mode === 'zh' ? '成就' : 'Достижения'}
              icon="trophy-outline"
            />
            <View style={styles.achievementsContainer}>
              {[
                {
                  icon: 'flame-outline' as const,
                  title: config.mode === 'tk' ? '7 gün yzygiderli' : config.mode === 'zh' ? '连续7天' : '7 дней подряд',
                  current: stats.streakDays,
                  target: 7,
                },
                {
                  icon: 'library-outline' as const,
                  title: config.mode === 'tk' ? '50 sözlem' : config.mode === 'zh' ? '50个短语' : '50 фраз',
                  current: stats.uniquePhrases,
                  target: 50,
                },
                {
                  icon: 'apps-outline' as const,
                  title: config.mode === 'tk' ? '10 kategoriýa' : config.mode === 'zh' ? '10个类别' : '10 категорий',
                  current: Object.keys(stats.categoriesProgress).length,
                  target: 10,
                },
              ].map((ach, i, arr) => {
                const done = ach.current >= ach.target;
                return (
                  <React.Fragment key={i}>
                    <View style={styles.achievementRow}>
                      <View style={[styles.achievementIcon, done && styles.achievementIconDone]}>
                        <Ionicons name={ach.icon} size={moderateScale(20)} color={done ? '#10B981' : '#9CA3AF'} />
                      </View>
                      <Text style={styles.achievementTitle}>{ach.title}</Text>
                      <Text style={[styles.achievementStatus, done && styles.achievementStatusDone]}>
                        {done ? '✓' : `${ach.current}/${ach.target}`}
                      </Text>
                    </View>
                    {i < arr.length - 1 && <View style={styles.divider} />}
                  </React.Fragment>
                );
              })}
            </View>
          </View>
        </ErrorBoundary>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },

  headerArea: {
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
  },

  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },

  backButton: {
    alignItems: 'center',
    height: scale(40),
    justifyContent: 'center',
    width: scale(40),
  },

  headerTitle: {
    color: '#1A1A1A',
    flex: 1,
    fontSize: moderateScale(18),
    fontWeight: '600',
    textAlign: 'center',
  },

  placeholder: {
    width: scale(40),
  },

  scrollContent: {
    paddingBottom: verticalScale(40),
  },

  // Sections
  section: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(24),
  },

  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(8),
    marginBottom: verticalScale(14),
  },

  sectionTitle: {
    color: '#1A1A1A',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },

  // Stats rows
  statsContainer: {
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    borderWidth: 1,
    overflow: 'hidden',
  },

  statRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
  },

  statIconCircle: {
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
    borderRadius: scale(10),
    height: scale(40),
    justifyContent: 'center',
    width: scale(40),
  },

  statInfo: {
    flex: 1,
  },

  statTitle: {
    color: '#1A1A1A',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },

  statSubtitle: {
    color: '#9CA3AF',
    fontSize: moderateScale(12),
    marginTop: verticalScale(1),
  },

  statValue: {
    color: '#2D8CFF',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },

  divider: {
    backgroundColor: '#E5E7EB',
    height: 1,
    marginLeft: scale(68),
  },

  // Daily goal
  goalContainer: {
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    borderWidth: 1,
    padding: scale(16),
  },

  goalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },

  goalText: {
    color: '#1A1A1A',
    fontSize: moderateScale(15),
    fontWeight: '600',
  },

  goalChangeText: {
    color: '#2D8CFF',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },

  goalAchieved: {
    color: '#10B981',
    fontSize: moderateScale(13),
    fontWeight: '600',
    marginTop: verticalScale(8),
  },

  // Progress bar
  progressBg: {
    backgroundColor: '#F3F4F6',
    borderRadius: scale(4),
    overflow: 'hidden',
  },

  progressFill: {
    borderRadius: scale(4),
  },

  // Chart
  chartBox: {
    alignItems: 'center',
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    borderWidth: 1,
    padding: scale(16),
  },

  // Categories
  categoryContainer: {
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: scale(16),
  },

  categoryItem: {
    paddingVertical: verticalScale(14),
  },

  categoryTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(8),
  },

  categoryLeft: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: scale(10),
  },

  categoryEmoji: {
    fontSize: moderateScale(20),
  },

  categoryName: {
    color: '#1A1A1A',
    fontSize: moderateScale(15),
    fontWeight: '500',
  },

  categoryCount: {
    color: '#2D8CFF',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },

  categoryMeta: {
    color: '#9CA3AF',
    fontSize: moderateScale(12),
    marginTop: verticalScale(4),
  },

  // Achievements
  achievementsContainer: {
    borderColor: '#E5E7EB',
    borderRadius: scale(12),
    borderWidth: 1,
    overflow: 'hidden',
  },

  achievementRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(12),
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(14),
  },

  achievementIcon: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: scale(10),
    height: scale(40),
    justifyContent: 'center',
    width: scale(40),
  },

  achievementIconDone: {
    backgroundColor: '#ECFDF5',
  },

  achievementTitle: {
    color: '#1A1A1A',
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },

  achievementStatus: {
    color: '#9CA3AF',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },

  achievementStatusDone: {
    color: '#10B981',
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
});
