// src/screens/OnboardingScreen.tsx
// HERO + GRID DESIGN - Modern 2025 UI
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  Platform,
  useWindowDimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useConfig } from '../contexts/ConfigContext';
import { useAppLanguage } from '../contexts/LanguageContext';
import { scale, verticalScale, moderateScale } from '../utils/ResponsiveUtils';
import { useSafeArea } from '../hooks/useSafeArea';

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  gradient: [string, string, ...string[]];
  component: React.ReactNode;
}

interface OnboardingScreenProps {
  navigation: any;
  onComplete: () => void;
}

export default function OnboardingScreen({ navigation, onComplete }: OnboardingScreenProps) {
  const { setOnboardingCompleted } = useConfig();
  const { getTexts } = useAppLanguage();
  const texts = getTexts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Динамические размеры экрана (реактивные)
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  // Safe Area для корректной работы с notch/Dynamic Island
  const { bottom: safeAreaBottom, top: safeAreaTop } = useSafeArea();

  // Адаптивный размер иконки на основе высоты экрана
  const iconSize = Math.min(moderateScale(80), SCREEN_HEIGHT * 0.1);

  const slides: OnboardingSlide[] = [
    {
      id: '1',
      title: texts.onboardingWelcomeTitle,
      subtitle: texts.onboardingWelcomeSubtitle,
      icon: 'airplane',
      gradient: ['#2D8CFF', '#2D8CFF'],
      component: <WelcomeSlide />,
    },
    {
      id: '2',
      title: texts.onboardingPhrasebookTitle,
      subtitle: texts.onboardingPhrasebookSubtitle,
      icon: 'book',
      gradient: ['#2D8CFF', '#2D8CFF'],
      component: <PhrasebookSlide />,
    },
    {
      id: '3',
      title: texts.onboardingTranslationTitle,
      subtitle: texts.onboardingTranslationSubtitle,
      icon: 'language',
      gradient: ['#2D8CFF', '#2D8CFF'],
      component: <TranslatorSlide />,
    },
    {
      id: '4',
      title: texts.onboardingReadyTitle,
      subtitle: texts.onboardingReadySubtitle,
      icon: 'checkmark-circle',
      gradient: ['#2D8CFF', '#2D8CFF'],
      component: <ReadySlide onGetStarted={handleComplete} />,
    },
  ];

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  async function handleComplete() {
    try {
      await setOnboardingCompleted(true);
      if (navigation) {
        // После завершения onboarding переходим на MainHub
        navigation.replace('MainHub');
      } else if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Failed to save onboarding completion:', error);
    }
  }

  const renderSlide = ({ item }: { item: OnboardingSlide }) => {
    return (
      <View style={[styles.slide, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }]}>
        <LinearGradient
          colors={item.gradient as readonly [string, string, ...string[]]}
          style={styles.gradientBackground}
        >
          <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            {/* Skip button - с учётом SafeArea сверху */}
            {currentIndex < slides.length - 1 && (
              <TouchableOpacity
                style={[styles.skipButton, { top: safeAreaTop + verticalScale(16) }]}
                onPress={handleSkip}
              >
                <Text style={styles.skipText}>{texts.onboardingSkip}</Text>
              </TouchableOpacity>
            )}

            {/* Content */}
            <View style={styles.content}>{item.component}</View>

            {/* Dots Indicator */}
            <View style={[styles.footer, { paddingBottom: Math.max(safeAreaBottom, verticalScale(24)) }]}>
              <View style={styles.dotsContainer}>
                {slides.map((_, index) => {
                  const inputRange = [
                    (index - 1) * SCREEN_WIDTH,
                    index * SCREEN_WIDTH,
                    (index + 1) * SCREEN_WIDTH,
                  ];

                  const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 24, 8],
                    extrapolate: 'clamp',
                  });

                  const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                  });

                  return (
                    <Animated.View
                      key={index}
                      style={[
                        styles.dot,
                        {
                          width: dotWidth,
                          opacity,
                        },
                      ]}
                    />
                  );
                })}
              </View>

              {/* Next Button */}
              {currentIndex < slides.length - 1 && (
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                  <Text style={styles.nextButtonText}>{texts.onboardingNext}</Text>
                  <Ionicons name="arrow-forward" size={moderateScale(20)} color="#2D8CFF" />
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
      />
    </View>
  );
}

// ========== Slide Components ==========

function WelcomeSlide() {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();
  const { height } = useWindowDimensions();
  // Адаптивный размер логотипа
  const logoSize = Math.min(moderateScale(120), height * 0.15);

  return (
    <View style={styles.slideContent}>
      <Image
        source={require('../../assets/logo.png')}
        style={[styles.logoImage, { width: logoSize, height: logoSize }]}
        resizeMode="contain"
      />
      <Text style={styles.slideTitle}>{texts.onboardingWelcomeTitle}</Text>
      <Text style={styles.slideSubtitle}>
        {texts.onboardingWelcomeSubtitle}
      </Text>
    </View>
  );
}

function PhrasebookSlide() {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();
  const [audioPlaying, setAudioPlaying] = useState(false);
  const { height } = useWindowDimensions();
  const iconSize = Math.min(moderateScale(80), height * 0.1);

  const handlePlayAudio = () => {
    setAudioPlaying(true);
    setTimeout(() => setAudioPlaying(false), 1000);
  };

  return (
    <View style={styles.slideContent}>
      <Ionicons name="book" size={iconSize} color="#FFFFFF" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>{texts.onboardingPhrasebookTitle}</Text>
      <Text style={styles.slideSubtitle}>
        {texts.onboardingPhrasebookSubtitle}
      </Text>

      {/* Interactive Demo */}
      <View style={styles.demoBox}>
        <View style={styles.demoRow}>
          <Text style={styles.demoLabel}>{texts.onboardingPhrasebookDemo}</Text>
          <Text style={styles.demoArrow}>→</Text>
          <Text style={styles.demoValue}>Salam</Text>
        </View>
        <TouchableOpacity
          style={[styles.playButton, audioPlaying && styles.playButtonActive]}
          onPress={handlePlayAudio}
        >
          <Ionicons
            name={audioPlaying ? "volume-high" : "play"}
            size={20}
            color="#2D8CFF"
          />
          <Text style={styles.playButtonText}>
            {audioPlaying ? texts.onboardingPlaying : texts.onboardingPlayAudio}
          </Text>
        </TouchableOpacity>

        {/* Features */}
        <View style={styles.featuresListContainer}>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
            <Text style={styles.featureText}>{texts.onboardingFeatureAudio}</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
            <Text style={styles.featureText}>{texts.onboardingFeatureOffline}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function TranslatorSlide() {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();
  const [translated, setTranslated] = useState(false);
  const { height } = useWindowDimensions();
  const iconSize = Math.min(moderateScale(80), height * 0.1);

  return (
    <View style={styles.slideContent}>
      <Ionicons name="language" size={iconSize} color="#FFFFFF" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>{texts.onboardingTranslationTitle}</Text>
      <Text style={styles.slideSubtitle}>
        {texts.onboardingTranslationSubtitle}
      </Text>

      {/* Interactive Demo */}
      <View style={styles.demoBox}>
        <View style={styles.translatorBox}>
          <Text style={styles.translatorInput}>How are you?</Text>
          {translated && (
            <>
              <Ionicons name="arrow-down" size={24} color="#6E6E73" />
              <Text style={styles.translatorOutput}>Nähili?</Text>
            </>
          )}
        </View>
        <TouchableOpacity
          style={styles.translateButton}
          onPress={() => setTranslated(!translated)}
        >
          <Text style={styles.translateButtonText}>
            {translated ? texts.onboardingTryAgain : texts.onboardingTranslate}
          </Text>
        </TouchableOpacity>

        {/* Features list */}
        <View style={styles.featuresListContainer}>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
            <Text style={styles.featureText}>{texts.onboardingTextTranslator}</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
            <Text style={styles.featureText}>{texts.onboardingAIAssistant}</Text>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="camera" size={22} color="#8E8E93" />
            <Text style={[styles.featureText, styles.featureTextMuted]}>{texts.onboardingVisualTranslator}</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>{texts.onboardingComingSoon}</Text>
            </View>
          </View>
          <View style={styles.featureRow}>
            <Ionicons name="mic" size={22} color="#8E8E93" />
            <Text style={[styles.featureText, styles.featureTextMuted]}>{texts.onboardingVoiceTranslator}</Text>
            <View style={styles.comingSoonBadge}>
              <Text style={styles.comingSoonText}>{texts.onboardingComingSoon}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}


function ReadySlide({ onGetStarted }: { onGetStarted: () => void }) {
  const { getTexts } = useAppLanguage();
  const texts = getTexts();
  const { height } = useWindowDimensions();
  const iconSize = Math.min(moderateScale(80), height * 0.1);

  // Ряды тегов для аккуратного расположения
  const featureRows = [
    // Ряд 1: 2 тега
    [
      { icon: 'book-outline' as const, label: texts.onboardingTagPhrasebook, available: true },
      { icon: 'volume-high-outline' as const, label: texts.onboardingTagAudio, available: true },
    ],
    // Ряд 2: 3 тега
    [
      { icon: 'cloud-offline-outline' as const, label: texts.onboardingTagOffline, available: true },
      { icon: 'language-outline' as const, label: texts.onboardingTagTranslator, available: true },
      { icon: 'sparkles-outline' as const, label: texts.onboardingTagAI, available: true },
    ],
    // Ряд 3: 2 тега (coming soon)
    [
      { icon: 'camera-outline' as const, label: texts.onboardingTagVisual, available: false },
      { icon: 'mic-outline' as const, label: texts.onboardingTagVoice, available: false },
    ],
  ];

  return (
    <View style={styles.slideContent}>
      <Ionicons name="checkmark-circle" size={iconSize} color="#FFFFFF" style={styles.slideIcon} />
      <Text style={styles.slideTitle}>{texts.onboardingReadyTitle}</Text>
      <Text style={styles.slideSubtitle}>
        {texts.onboardingReadySubtitle}
      </Text>

      <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
        <Text style={styles.getStartedButtonText}>{texts.onboardingGetStarted}</Text>
        <Ionicons name="arrow-forward" size={moderateScale(20)} color="#2D8CFF" />
      </TouchableOpacity>

      <View style={styles.featuresGrid}>
        {featureRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.featureTagRow}>
            {row.map((feature, index) => (
              <View
                key={index}
                style={[
                  styles.featureTag,
                  !feature.available && styles.featureTagDisabled
                ]}
              >
                <Ionicons
                  name={feature.icon}
                  size={moderateScale(16)}
                  color={feature.available ? '#1A7BC4' : '#9CA3AF'}
                />
                <Text style={[
                  styles.featureTagText,
                  !feature.available && styles.featureTagTextDisabled
                ]}>
                  {feature.label}
                </Text>
                {!feature.available && (
                  <View style={styles.comingSoonMini}>
                    <Text style={styles.comingSoonMiniText}>{texts.onboardingComingSoon}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

// ========== Styles ==========

const ACCENT_COLOR = '#2D8CFF'; // Lingify blue
const TEXT_PRIMARY = '#FFFFFF'; // White text on blue bg
const TEXT_SECONDARY = 'rgba(255,255,255,0.8)';
const BACKGROUND = '#2D8CFF'; // Blue background

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND,
    flex: 1,
  },
  slide: {
    // width и height устанавливаются динамически
  },
  gradientBackground: {
    backgroundColor: BACKGROUND,
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    // top устанавливается динамически с учётом safeAreaTop
    right: scale(20),
    zIndex: 10,
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(8),
  },
  skipText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: moderateScale(16),
    fontWeight: '500',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(20),
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(24),
    width: '100%',
  },
  slideIcon: {
    marginBottom: verticalScale(24),
  },
  logoImage: {
    marginBottom: verticalScale(24),
  },
  slideTitle: {
    color: TEXT_PRIMARY,
    fontSize: moderateScale(28),
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: verticalScale(8),
    textAlign: 'center',
  },
  slideSubtitle: {
    color: TEXT_SECONDARY,
    fontSize: moderateScale(16),
    fontWeight: '400',
    lineHeight: moderateScale(22),
    marginBottom: verticalScale(24),
    textAlign: 'center',
  },
  footer: {
    // paddingBottom теперь динамический через safeAreaBottom
    paddingHorizontal: scale(20),
  },
  dotsContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: verticalScale(30),
    justifyContent: 'center',
    marginBottom: verticalScale(24),
  },
  dot: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(4),
    height: verticalScale(8),
    marginHorizontal: scale(4),
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(14),
    flexDirection: 'row',
    gap: scale(8),
    justifyContent: 'center',
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(16),
  },
  nextButtonText: {
    color: '#2D8CFF',
    fontSize: moderateScale(17),
    fontWeight: '600',
  },
  // Demo Components
  demoBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: moderateScale(16),
    marginTop: verticalScale(12),
    padding: scale(16),
    width: '100%',
  },
  demoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },
  demoLabel: {
    color: TEXT_PRIMARY,
    fontSize: moderateScale(18),
    fontWeight: '600',
  },
  demoArrow: {
    color: TEXT_SECONDARY,
    fontSize: moderateScale(18),
    marginHorizontal: scale(12),
  },
  demoValue: {
    color: ACCENT_COLOR,
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(12),
    flexDirection: 'row',
    gap: scale(8),
    justifyContent: 'center',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(12),
  },
  playButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  playButtonText: {
    color: '#2D8CFF',
    fontSize: moderateScale(15),
    fontWeight: '600',
  },
  demoSectionTitle: {
    color: TEXT_PRIMARY,
    fontSize: moderateScale(17),
    fontWeight: '600',
    marginBottom: verticalScale(12),
    textAlign: 'center',
  },
  translatorBox: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: moderateScale(12),
    borderWidth: 1,
    marginBottom: verticalScale(16),
    padding: scale(16),
  },
  translatorInput: {
    color: TEXT_PRIMARY,
    fontSize: moderateScale(19),
    marginBottom: verticalScale(8),
  },
  translatorOutput: {
    color: ACCENT_COLOR,
    fontSize: moderateScale(19),
    fontWeight: '600',
    marginTop: verticalScale(8),
  },
  translateButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(16),
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(12),
  },
  translateButtonText: {
    color: '#2D8CFF',
    fontSize: moderateScale(15),
    fontWeight: '600',
    textAlign: 'center',
  },
  featuresListContainer: {
    gap: verticalScale(8),
    marginTop: verticalScale(16),
  },
  featureRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: scale(12),
    marginVertical: verticalScale(4),
  },
  featureText: {
    color: TEXT_PRIMARY,
    fontSize: moderateScale(15),
    fontWeight: '500',
  },
  featuresContainer: {
    gap: verticalScale(16),
    marginTop: verticalScale(20),
    width: '100%',
  },
  featureItem: {
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
    borderRadius: moderateScale(16),
    padding: scale(20),
  },
  featureTitle: {
    color: TEXT_PRIMARY,
    fontSize: moderateScale(19),
    fontWeight: '600',
    marginBottom: verticalScale(6),
    marginTop: verticalScale(12),
  },
  featureDescription: {
    color: TEXT_SECONDARY,
    fontSize: moderateScale(15),
    lineHeight: moderateScale(21),
    textAlign: 'center',
  },
  getStartedButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: moderateScale(14),
    flexDirection: 'row',
    gap: scale(8),
    justifyContent: 'center',
    marginBottom: verticalScale(16),
    marginTop: verticalScale(20),
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(14),
  },
  getStartedButtonText: {
    color: '#2D8CFF',
    fontSize: moderateScale(17),
    fontWeight: '600',
  },
  featuresGrid: {
    alignItems: 'center',
    flexDirection: 'column',
    gap: verticalScale(8),
    paddingHorizontal: scale(16),
  },
  featureTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(6),
    justifyContent: 'center',
    maxWidth: '100%',
  },
  featureTag: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: moderateScale(16),
    borderWidth: 1,
    flexDirection: 'row',
    flexShrink: 1,
    gap: scale(4),
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(6),
  },
  featureTagDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  featureTagText: {
    color: '#FFFFFF',
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  featureTagTextDisabled: {
    color: 'rgba(255,255,255,0.6)',
  },
  comingSoonMini: {
    backgroundColor: '#F59E0B',
    borderRadius: moderateScale(6),
    marginLeft: scale(2),
    paddingHorizontal: scale(6),
    paddingVertical: verticalScale(2),
  },
  comingSoonMiniText: {
    color: '#FFFFFF',
    fontSize: moderateScale(9),
    fontWeight: '600',
  },
  featureTextMuted: {
    color: TEXT_SECONDARY,
  },
  comingSoonBadge: {
    backgroundColor: '#FF9500',
    borderRadius: moderateScale(8),
    marginLeft: scale(8),
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
  },
  comingSoonText: {
    color: '#FFFFFF',
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
});
