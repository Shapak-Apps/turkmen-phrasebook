// src/features/scenarios/TargetLangContext.tsx
// Язык собеседника для сценарного разговорника. Отдельно от LanguageContext:
// там язык интерфейса (31 штука), здесь язык, на котором говорят с человеком напротив.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { SafeStorage } from '../../utils/SafeStorage';
import type { TargetLang } from './ui-labels';

const STORAGE_KEY = '@scenario_target_lang';
const DEFAULT_LANG: TargetLang = 'zh';

interface TargetLangValue {
  targetLang: TargetLang;
  setTargetLang: (lang: TargetLang) => void;
  /** false, пока не прочитали сохранённый выбор */
  isReady: boolean;
}

const TargetLangContext = createContext<TargetLangValue | undefined>(undefined);

const isTargetLang = (value: unknown): value is TargetLang =>
  value === 'zh' || value === 'en' || value === 'ru';

export const TargetLangProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [targetLang, setLang] = useState<TargetLang>(DEFAULT_LANG);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    SafeStorage.getItem<TargetLang>(STORAGE_KEY, DEFAULT_LANG).then((result) => {
      if (cancelled) {
        return;
      }
      if (isTargetLang(result.data)) {
        setLang(result.data);
      }
      setIsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Коллбэк стабильный намеренно: нестабильные коллбэки в контексте уже давали
  // бесконечный цикл рендера в useHistory (HANDOFF, 2026-08-08).
  const setTargetLang = useCallback((lang: TargetLang) => {
    setLang(lang);
    void SafeStorage.setItem(STORAGE_KEY, lang);
  }, []);

  const value = useMemo(
    () => ({ targetLang, setTargetLang, isReady }),
    [targetLang, setTargetLang, isReady]
  );

  return <TargetLangContext.Provider value={value}>{children}</TargetLangContext.Provider>;
};

export const useTargetLang = (): TargetLangValue => {
  const context = useContext(TargetLangContext);
  if (!context) {
    throw new Error('useTargetLang использован вне TargetLangProvider');
  }
  return context;
};
