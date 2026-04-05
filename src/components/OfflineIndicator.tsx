// src/components/OfflineIndicator.tsx - Расширенная версия дня 17
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors,} from '../constants/Colors';
import { ColorUtils } from '../utils/ColorUtils'; 
import { TextStyles } from '../constants/Typography';
import { useOfflineDataManager } from '../hooks/useOfflineDataManager';
import { useAnimations } from '../hooks/useAnimations';
import { useAppLanguage } from '../contexts/LanguageContext';

export default function OfflineIndicator() {
  const { 
    isOnline, 
    networkQuality,
    isSyncing, 
    syncProgress,
    queueSize,
    lastSync,
    dataFreshness,
    forcSync,
    getDetailedStats 
  } = useOfflineDataManager();
  
  const { fadeIn, fadeOut, pulseAnimation, hapticFeedback } = useAnimations();
  const { config } = useAppLanguage();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Анимация появления/скрытия индикатора
  useEffect(() => {
    if (isOnline && queueSize === 0 && dataFreshness === 'fresh') {
      // Скрываем индикатор когда все в порядке
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Показываем индикатор
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOnline, queueSize, dataFreshness, opacityAnim]);

  // Pulse анимация для синхронизации
  useEffect(() => {
    if (isSyncing) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isSyncing, pulseAnim]);

  // Анимация расширения для деталей
  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, heightAnim]);

  const getStatusInfo = () => {
    if (isSyncing) {
      return {
        icon: 'sync' as const,
        color: Colors.info,
        title: config.mode === 'tk' ? 'Sinhronizasiýa' : config.mode === 'zh' ? '同步中' : 'Синхронизация',
        subtitle: config.mode === 'tk' ? 'Maglumatlar täzeleniýär...' : config.mode === 'zh' ? '数据更新中...' : `Прогресс: ${Math.round(syncProgress * 100)}%`,
      };
    }

    if (dataFreshness === 'expired') {
      return {
        icon: 'alert-circle' as const,
        color: Colors.error,
        title: config.mode === 'tk' ? 'Maglumatlar köneldi' : config.mode === 'zh' ? '数据已过期' : 'Данные устарели',
        subtitle: config.mode === 'tk' ? 'Täzelenmeli' : config.mode === 'zh' ? '需要更新' : 'Требуется обновление',
      };
    }

    if (dataFreshness === 'stale') {
      return {
        icon: 'warning' as const,
        color: Colors.warning,
        title: config.mode === 'tk' ? 'Maglumatlar köne' : config.mode === 'zh' ? '数据不是最新' : 'Данные не свежие',
        subtitle: config.mode === 'tk' ? 'Ýakyn wagtda täzelener' : config.mode === 'zh' ? '即将更新' : 'Будут обновлены',
      };
    }
    
    if (!isOnline) {
      return {
        icon: 'cloud-offline' as const,
        color: Colors.error,
        title: config.mode === 'tk' ? 'Oflaýn režim' : config.mode === 'zh' ? '离线模式' : 'Офлайн режим',
        subtitle: config.mode === 'tk' ? `Tor hili: ${networkQuality}` : config.mode === 'zh' ? `网络质量: ${networkQuality}` : `Качество: ${networkQuality}`,
      };
    }

    if (queueSize > 0) {
      return {
        icon: 'cloud-upload' as const,
        color: Colors.accent,
        title: config.mode === 'tk' ? 'Sinhronizasiýa garaşýar' : config.mode === 'zh' ? '等待同步' : 'Ожидает синхронизации',
        subtitle: `${queueSize} ${config.mode === 'tk' ? 'üýtgeşme' : config.mode === 'zh' ? '项更改' : 'изменений'}`,
      };
    }

    return null;
  };

  const statusInfo = getStatusInfo();
  
  if (!statusInfo) return null;

  const handlePress = async () => {
    hapticFeedback('light');
    setIsExpanded(!isExpanded);
  };

  const handleSyncPress = async () => {
    hapticFeedback('medium');
    
    if (!isOnline) {
      Alert.alert(
        config.mode === 'tk' ? 'Internet ýok' : config.mode === 'zh' ? '无网络' : 'Нет сети',
        config.mode === 'tk' ? 'Sinhronizasiýa üçin internet gerek' : 
        config.mode === 'zh' ? '同步需要网络连接' : 
        'Для синхронизации требуется подключение к интернету'
      );
      return;
    }

    const success = await forcSync();
    if (success) {
      Alert.alert(
        '✅',
        config.mode === 'tk' ? 'Sinhronizasiýa tamamlandy' : 
        config.mode === 'zh' ? '同步完成' : 
        'Синхронизация завершена'
      );
    }
  };

  const handleStatsPress = async () => {
    hapticFeedback('light');
    
    try {
      const stats = await getDetailedStats();
      const cacheSize = Math.round(stats.cacheStats.totalSize / 1024) || 0;
      const lastSyncText = stats.lastSync 
        ? new Date(stats.lastSync).toLocaleString()
        : 'Никогда';

      Alert.alert(
        'Статистика офлайн режима',
        `Размер кэша: ${cacheSize} KB
Последняя синхронизация: ${lastSyncText}
Качество сети: ${stats.networkQuality}
Очередь синхронизации: ${stats.queueSize} элементов
Свежесть данных: ${stats.dataFreshness}
Успешность кэша: ${Math.round(stats.cacheStats.hitRate * 100)}%`
      );
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось получить статистику');
    }
  };

  const formatLastSync = () => {
    if (!lastSync) return '';
    
    const now = Date.now();
    const diff = now - lastSync;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    
    if (minutes < 1) return config.mode === 'tk' ? 'häzir' : config.mode === 'zh' ? '刚刚' : 'только что';
    if (minutes < 60) return `${minutes}${config.mode === 'tk' ? 'min' : config.mode === 'zh' ? '分' : 'м'}`;
    return `${hours}${config.mode === 'tk' ? 's' : config.mode === 'zh' ? '时' : 'ч'}`;
  };

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim }]}>
      <TouchableOpacity
        style={[styles.indicator, { backgroundColor: statusInfo.color }]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Animated.View style={[styles.content, { transform: [{ scale: pulseAnim }] }]}>
          <Ionicons 
            name={statusInfo.icon} 
            size={16} 
            color={Colors.textWhite} 
            style={styles.icon} 
          />
          <Text style={styles.title} numberOfLines={1}>
            {statusInfo.title}
          </Text>
          {queueSize > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{queueSize}</Text>
            </View>
          )}
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={14} 
            color={Colors.textWhite}
            style={styles.expandIcon}
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[
        styles.expandedContent,
        {
          opacity: heightAnim,
          height: heightAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 120],
          }),
        }
      ]}>
        <View style={styles.expandedBody}>
          <Text style={styles.subtitle}>{statusInfo.subtitle}</Text>
          
          {lastSync && (
            <Text style={styles.lastSyncText}>
              {config.mode === 'tk' ? 'Soňky sinhronizasiýa: ' : 
               config.mode === 'zh' ? '上次同步: ' : 
               'Последняя синхронизация: '}{formatLastSync()}
            </Text>
          )}

          <View style={styles.expandedActions}>
            {queueSize > 0 && isOnline && (
              <TouchableOpacity
                style={[styles.actionButton, styles.syncButton]}
                onPress={handleSyncPress}
              >
                <Ionicons name="sync" size={14} color={Colors.textWhite} />
                <Text style={styles.actionButtonText}>
                  {config.mode === 'tk' ? 'Sinhronizasiýa' : 
                   config.mode === 'zh' ? '同步' : 
                   'Синхронизировать'}
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={[styles.actionButton, styles.infoButton]}
              onPress={handleStatsPress}
            >
              <Ionicons name="information-circle" size={14} color={Colors.textWhite} />
              <Text style={styles.actionButtonText}>
                {config.mode === 'tk' ? 'Maglumat' : 
                 config.mode === 'zh' ? '详情' : 
                 'Подробнее'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionButtonText: {
    ...TextStyles.caption,
    color: Colors.textWhite,
    fontSize: 11,
    fontWeight: '500',
  },
  badge: {
    alignItems: 'center',
    backgroundColor: ColorUtils.withOpacity(Colors.textWhite, 0.3),
    borderRadius: 10,
    marginLeft: 8,
    minWidth: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    ...TextStyles.caption,
    color: Colors.textWhite,
    fontSize: 10,
    fontWeight: 'bold',
  },
  container: {
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  expandIcon: {
    marginLeft: 8,
  },
  expandedActions: {
    flexDirection: 'row',
    gap: 8,
  },
  expandedBody: {
    padding: 12,
  },
  expandedContent: {
    backgroundColor: ColorUtils.withOpacity(Colors.overlay, 0.9),
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  icon: {
    marginRight: 8,
  },
  indicator: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 8,
    marginTop: 44, // Учитываем status bar
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  infoButton: {
    backgroundColor: ColorUtils.withOpacity(Colors.textWhite, 0.2),
  },
  lastSyncText: {
    ...TextStyles.caption,
    color: Colors.textWhite,
    fontSize: 11,
    marginBottom: 12,
    opacity: 0.7,
  },
  subtitle: {
    ...TextStyles.caption,
    color: Colors.textWhite,
    marginBottom: 8,
    opacity: 0.9,
  },
  syncButton: {
    backgroundColor: ColorUtils.withOpacity(Colors.accent, 0.8),
  },
  title: {
    ...TextStyles.bodySmall,
    color: Colors.textWhite,
    flex: 1,
    fontWeight: '600',
  },
});