// src/contexts/__tests__/ConfigContext.test.tsx
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConfigProvider, useConfig } from '../ConfigContext';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('../../config/languages.config', () => ({
  getLanguageByCode: jest.fn((code: string) => {
    const languages: Record<string, any> = {
      tk: { code: 'tk', name: 'Türkmen', isAvailable: true },
      zh: { code: 'zh', name: '中文', isAvailable: true },
      ru: { code: 'ru', name: 'Русский', isAvailable: true },
      en: { code: 'en', name: 'English', isAvailable: true },
      unavailable: { code: 'unavailable', name: 'Unavailable', isAvailable: false },
    };
    return languages[code] || null;
  }),
}));

jest.mock('../../services/LanguageAnalytics', () => ({
  LanguageAnalyticsService: {
    startSession: jest.fn(() => Promise.resolve()),
    endSession: jest.fn(() => Promise.resolve()),
  },
}));

jest.mock('../../services/TranslationVersioning', () => ({
  TranslationVersioningService: {
    setLanguageVersion: jest.fn(() => Promise.resolve()),
    addDownloadHistory: jest.fn(() => Promise.resolve()),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider>{children}</ConfigProvider>
);

beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  (AsyncStorage.multiSet as jest.Mock).mockResolvedValue(undefined);
});

describe('ConfigContext', () => {
  describe('useConfig hook', () => {
    it('should throw error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useConfig());
      }).toThrow('useConfig must be used within ConfigProvider');

      consoleSpy.mockRestore();
    });

    it('should provide default values', async () => {
      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.turkmenLanguage).toBe('tk');
      expect(result.current.selectedLanguage).toBe('tk');
    });
  });

  describe('ConfigProvider', () => {
    it('should load saved language on mount', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@turkmen_phrasebook:selected_language') {
          return Promise.resolve('zh');
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.selectedLanguage).toBe('zh');
      expect(result.current.isFirstLaunch).toBe(false);
    });

    it('should use default language when saved language is unavailable', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@turkmen_phrasebook:selected_language') {
          return Promise.resolve('unavailable');
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.selectedLanguage).toBe('tk');
    });

    it('should load onboarding status', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
        if (key === '@onboarding_completed') {
          return Promise.resolve('true');
        }
        return Promise.resolve(null);
      });

      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.onboardingCompleted).toBe(true);
    });
  });

  describe('setSelectedLanguage', () => {
    it('should change language and save to storage', async () => {
      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.setSelectedLanguage('ru');
      });

      expect(result.current.selectedLanguage).toBe('ru');
      expect(AsyncStorage.multiSet).toHaveBeenCalled();
    });

    it('should throw error for non-existent language', async () => {
      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(async () => {
        await act(async () => {
          await result.current.setSelectedLanguage('invalid');
        });
      }).rejects.toThrow('Language invalid not found in configuration');
    });

    it('should throw error for unavailable language', async () => {
      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(async () => {
        await act(async () => {
          await result.current.setSelectedLanguage('unavailable');
        });
      }).rejects.toThrow('Language unavailable is not available yet');
    });
  });

  describe('setOnboardingCompleted', () => {
    it('should update onboarding status', async () => {
      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.setOnboardingCompleted(true);
      });

      expect(result.current.onboardingCompleted).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@onboarding_completed', 'true');
    });

    it('should handle setting onboarding to false', async () => {
      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.setOnboardingCompleted(false);
      });

      expect(result.current.onboardingCompleted).toBe(false);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@onboarding_completed', 'false');
    });
  });

  describe('turkmenLanguage', () => {
    it('should always return tk', async () => {
      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.turkmenLanguage).toBe('tk');

      // Change language, turkmenLanguage should still be 'tk'
      await act(async () => {
        await result.current.setSelectedLanguage('en');
      });

      expect(result.current.turkmenLanguage).toBe('tk');
    });
  });
});
