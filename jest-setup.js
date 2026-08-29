// jest-setup.js - Test environment configuration

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  return {
    default: {
      call: jest.fn(),
    },
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn((val) => val),
    withTiming: jest.fn((val) => val),
    withDelay: jest.fn((_, val) => val),
    withSequence: jest.fn((...vals) => vals[0]),
    withRepeat: jest.fn((val) => val),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      bezier: jest.fn(),
    },
    FadeIn: { duration: jest.fn(() => ({ delay: jest.fn() })) },
    FadeOut: { duration: jest.fn(() => ({ delay: jest.fn() })) },
    SlideInRight: { duration: jest.fn() },
    SlideOutLeft: { duration: jest.fn() },
    Layout: { duration: jest.fn() },
  };
});

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file://mock-document-directory/',
  cacheDirectory: 'file://mock-cache-directory/',
  getInfoAsync: jest.fn(() => Promise.resolve({ exists: true, size: 1000 })),
  readAsStringAsync: jest.fn(() => Promise.resolve('')),
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
  deleteAsync: jest.fn(() => Promise.resolve()),
  makeDirectoryAsync: jest.fn(() => Promise.resolve()),
  copyAsync: jest.fn(() => Promise.resolve()),
  downloadAsync: jest.fn(() => Promise.resolve({ uri: 'file://mock-uri' })),
}));

// Mock @react-native-community/netinfo
jest.mock('@react-native-community/netinfo', () => ({
  fetch: jest.fn(() => Promise.resolve({
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
  })),
  addEventListener: jest.fn(() => jest.fn()),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Global test timeout
jest.setTimeout(10000);

// Suppress console warnings in tests (optional, comment out for debugging)
// global.console = {
//   ...console,
//   warn: jest.fn(),
//   error: jest.fn(),
// };
