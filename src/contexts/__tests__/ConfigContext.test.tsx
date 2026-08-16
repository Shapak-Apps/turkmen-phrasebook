// src/contexts/__tests__/ConfigContext.test.tsx
import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ConfigProvider, useConfig } from '../ConfigContext';

jest.mock('@react-native-async-storage/async-storage');

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ConfigProvider>{children}</ConfigProvider>
);

beforeEach(() => {
  jest.clearAllMocks();
  (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
});

describe('ConfigContext', () => {
  describe('useConfig hook', () => {
    it('should throw error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useConfig());
      }).toThrow('useConfig must be used within ConfigProvider');

      consoleSpy.mockRestore();
    });

    it('should finish loading and expose the first launch flag', async () => {
      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isFirstLaunch).toBe(true);
    });
  });

  describe('first launch', () => {
    it('treats a missing flag as first launch', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isFirstLaunch).toBe(true);
    });

    it('treats a stored flag as a repeat launch', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('false');

      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isFirstLaunch).toBe(false);
    });

    it('completeFirstLaunch persists the flag and flips the state', async () => {
      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.completeFirstLaunch();
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@turkmen_phrasebook:first_launch',
        'false'
      );
      expect(result.current.isFirstLaunch).toBe(false);
    });

    it('surfaces storage failures from completeFirstLaunch', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('disk full'));

      const { result } = renderHook(() => useConfig(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(result.current.completeFirstLaunch()).rejects.toThrow('disk full');
      expect(result.current.isFirstLaunch).toBe(true);

      consoleSpy.mockRestore();
    });
  });
});
