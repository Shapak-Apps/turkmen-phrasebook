// src/hooks/useAnimations.ts - Исправленная версия с типизацией
import { useRef, useEffect, useCallback } from "react";
import { Animated, Easing, Vibration, Platform } from "react-native";
import * as Haptics from "expo-haptics";

interface AnimationConfig {
  duration?: number;
  delay?: number;
  useNativeDriver: boolean; // Строго boolean, не optional
  easing?: (value: number) => number;
}

const DEFAULT_CONFIG: AnimationConfig = {
  duration: 300,
  delay: 0,
  useNativeDriver: true, // Всегда указываем явно
  easing: Easing.out(Easing.cubic),
};

export function useAnimations() {
  // Основные анимированные значения
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Для карточек и списков
  const cardAnimations = useRef<Animated.Value[]>([]).current;
  const listItemAnimations = useRef<Map<string, Animated.Value>>(
    new Map()
  ).current;

  // Haptic feedback
  const hapticFeedback = useCallback(
    (
      type:
        | "light"
        | "medium"
        | "heavy"
        | "success"
        | "warning"
        | "error" = "light"
    ) => {
      if (Platform.OS === "ios") {
        try {
          switch (type) {
            case "light":
              Vibration.vibrate([10]);
              break;
            case "medium":
              Vibration.vibrate([25]);
              break;
            case "heavy":
              Vibration.vibrate([50]);
              break;
            case "success":
              Vibration.vibrate([10, 50, 10]);
              break;
            case "warning":
              Vibration.vibrate([25, 25, 25]);
              break;
            case "error":
              Vibration.vibrate([50, 25, 50]);
              break;
          }
        } catch (error) {
          console.warn("Haptic feedback error:", error);
        }
      } else if (Platform.OS === "android") {
        switch (type) {
          case "light":
            Vibration.vibrate(50);
            break;
          case "medium":
            Vibration.vibrate(100);
            break;
          case "heavy":
          case "error":
            Vibration.vibrate(200);
            break;
          case "success":
            Vibration.vibrate([50, 100, 50]);
            break;
          case "warning":
            Vibration.vibrate([100, 50, 100]);
            break;
        }
      }
    },
    []
  );

  // Анимация появления (fade in)
  const fadeIn = useCallback(
    (config: Partial<AnimationConfig> = {}) => {
      const finalConfig = { ...DEFAULT_CONFIG, ...config };

      return new Promise<void>((resolve) => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: finalConfig.duration,
          delay: finalConfig.delay,
          easing: finalConfig.easing,
          useNativeDriver: finalConfig.useNativeDriver, // Всегда boolean
        }).start(() => resolve());
      });
    },
    [fadeAnim]
  );

  // Анимация исчезновения (fade out)
  const fadeOut = useCallback(
    (config: Partial<AnimationConfig> = {}) => {
      const finalConfig = { ...DEFAULT_CONFIG, ...config };

      return new Promise<void>((resolve) => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: finalConfig.duration,
          delay: finalConfig.delay,
          easing: finalConfig.easing,
          useNativeDriver: finalConfig.useNativeDriver, // Всегда boolean
        }).start(() => resolve());
      });
    },
    [fadeAnim]
  );

  // Анимация появления снизу
  const slideInFromBottom = useCallback(
    (config: Partial<AnimationConfig> = {}) => {
      const finalConfig = { ...DEFAULT_CONFIG, ...config };
      slideAnim.setValue(100);

      return new Promise<void>((resolve) => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: finalConfig.duration,
          delay: finalConfig.delay,
          easing: finalConfig.easing,
          useNativeDriver: finalConfig.useNativeDriver, // Всегда boolean
        }).start(() => resolve());
      });
    },
    [slideAnim]
  );

  // Анимация появления сверху
  const slideInFromTop = useCallback(
    (config: Partial<AnimationConfig> = {}) => {
      const finalConfig = { ...DEFAULT_CONFIG, ...config };
      slideAnim.setValue(-100);

      return new Promise<void>((resolve) => {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: finalConfig.duration,
          delay: finalConfig.delay,
          easing: finalConfig.easing,
          useNativeDriver: finalConfig.useNativeDriver, // Всегда boolean
        }).start(() => resolve());
      });
    },
    [slideAnim]
  );

  // Пружинная анимация масштабирования
  const springScale = useCallback(
    (
      toValue: number = 1,
      config: Partial<Animated.SpringAnimationConfig> = {}
    ) => {
      return new Promise<void>((resolve) => {
        Animated.spring(scaleAnim, {
          toValue,
          tension: 100,
          friction: 8,
          useNativeDriver: true, // Всегда true для transform
          ...config,
        }).start(() => resolve());
      });
    },
    [scaleAnim]
  );

  // Анимация нажатия кнопки
  const pressAnimation = useCallback(
    (animValue?: Animated.Value) => {
      const value = animValue || scaleAnim;

      return new Promise<void>((resolve) => {
        Animated.sequence([
          Animated.timing(value, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true, // Всегда true для transform
            easing: Easing.out(Easing.quad),
          }),
          Animated.timing(value, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true, // Всегда true для transform
            easing: Easing.out(Easing.quad),
          }),
        ]).start(() => resolve());
      });
    },
    [scaleAnim]
  );

  // Анимация вращения
  const rotate360 = useCallback(
    (config: Partial<AnimationConfig> = {}) => {
      const finalConfig = { ...DEFAULT_CONFIG, duration: 1000, ...config };

      return new Promise<void>((resolve) => {
        rotateAnim.setValue(0);
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: finalConfig.duration,
          easing: Easing.linear,
          useNativeDriver: true, // Всегда true для transform
        }).start(() => resolve());
      });
    },
    [rotateAnim]
  );

  // Создание анимированного значения для элемента списка
  const createListItemAnimation = useCallback(
    (key: string, initialValue: number = 0) => {
      if (!listItemAnimations.has(key)) {
        listItemAnimations.set(key, new Animated.Value(initialValue));
      }
      return listItemAnimations.get(key)!;
    },
    [listItemAnimations]
  );

  // Анимированное появление элементов списка
  const animateListItems = useCallback(
    (items: string[], staggerDelay: number = 50) => {
      const animations = items.map((key, index) => {
        const anim = createListItemAnimation(key);
        anim.setValue(0);

        return Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          delay: index * staggerDelay,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true, // Всегда true для opacity/transform
        });
      });

      return new Promise<void>((resolve) => {
        Animated.parallel(animations).start(() => resolve());
      });
    },
    [createListItemAnimation]
  );

  // Shake анимация для ошибок
  const shakeAnimation = useCallback(
    (animValue?: Animated.Value) => {
      const value = animValue || slideAnim;
      value.setValue(0);

      return new Promise<void>((resolve) => {
        Animated.sequence([
          Animated.timing(value, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: -10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: -10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
        ]).start(() => resolve());
      });
    },
    [slideAnim]
  );

  // Pulse анимация для уведомлений
  const pulseAnimation = useCallback(
    (animValue?: Animated.Value) => {
      const value = animValue || scaleAnim;

      return new Promise<void>((resolve) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(value, {
              toValue: 1.1,
              duration: 500,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true, // Всегда true для transform
            }),
            Animated.timing(value, {
              toValue: 1,
              duration: 500,
              easing: Easing.inOut(Easing.quad),
              useNativeDriver: true, // Всегда true для transform
            }),
          ]),
          { iterations: 3 }
        ).start(() => resolve());
      });
    },
    [scaleAnim]
  );

  // Комбинированная анимация для карточек
  const cardEntranceAnimation = useCallback((index: number = 0) => {
    const cardFade = new Animated.Value(0);
    const cardSlide = new Animated.Value(50);
    const cardScale = new Animated.Value(0.9);

    return {
      opacity: cardFade,
      transform: [{ translateY: cardSlide }, { scale: cardScale }],
      animate: () =>
        new Promise<void>((resolve) => {
          Animated.parallel([
            Animated.timing(cardFade, {
              toValue: 1,
              duration: 400,
              delay: index * 100,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true, // Всегда true для opacity
            }),
            Animated.timing(cardSlide, {
              toValue: 0,
              duration: 400,
              delay: index * 100,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true, // Всегда true для transform
            }),
            Animated.timing(cardScale, {
              toValue: 1,
              duration: 400,
              delay: index * 100,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true, // Всегда true для transform
            }),
          ]).start(() => resolve());
        }),
    };
  }, []);

  // Автоматическая анимация при монтировании компонента
  const mountAnimation = useCallback(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(-20);
    scaleAnim.setValue(0.95);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true, // Всегда true для opacity
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true, // Всегда true для transform
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true, // Всегда true для transform
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  // Получение интерполированных значений
  const getInterpolatedValues = useCallback(() => {
    return {
      rotate: rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"],
      }),
      fadeStyle: {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
      },
    };
  }, [rotateAnim, fadeAnim, slideAnim, scaleAnim]);

  // Сброс всех анимаций
  const resetAnimations = useCallback(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(0);
    scaleAnim.setValue(1);
    rotateAnim.setValue(0);
    listItemAnimations.clear();
  }, [fadeAnim, slideAnim, scaleAnim, rotateAnim, listItemAnimations]);

  const favoriteAnimation = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.sequence([
      Animated.timing(bounceAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(bounceAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return {
    // Анимированные значения
    fadeAnim,
    slideAnim,
    scaleAnim,
    rotateAnim,
    bounceAnim,
    pulseAnim,
    favoriteAnimation,

    // Основные анимации
    fadeIn,
    fadeOut,
    slideInFromBottom,
    slideInFromTop,
    springScale,
    pressAnimation,
    rotate360,

    // Специальные анимации
    shakeAnimation,
    pulseAnimation,
    cardEntranceAnimation,
    animateListItems,
    createListItemAnimation,

    // Утилиты
    hapticFeedback,
    mountAnimation,
    getInterpolatedValues,
    resetAnimations,
  };
}

// Хук для анимированных кнопок
export function useButtonAnimation() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true, // Всегда true для transform
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true, // Всегда true для transform
      }),
    ]).start();
  }, [scaleAnim]);

  return {
    style: { transform: [{ scale: scaleAnim }] },
    animatePress,
  };
}
