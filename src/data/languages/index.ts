// AUTO-GENERATED: Агрегация переводов
// Updated: 2025-10-31 - Added Malay
import { chineseTranslations } from './translations/chinese';
import { russianTranslations } from './translations/russian';
import { englishTranslations } from './translations/english';
import { turkishTranslations } from './translations/turkish';
import { uzbekTranslations } from './translations/uzbek';
import { germanTranslations } from './translations/german';
import { frenchTranslations } from './translations/french';
import { spanishTranslations } from './translations/spanish';
import { italianTranslations } from './translations/italian';
import { japaneseTranslations } from './translations/japanese';
import { koreanTranslations } from './translations/korean';
import { polishTranslations } from './translations/polish';
import { portugueseTranslations } from './translations/portuguese';
import { dutchTranslations } from './translations/dutch';
import { azerbaijaniTranslations } from './translations/azerbaijani';
import { kazakhTranslations } from './translations/kazakh';
import { kyrgyzTranslations } from './translations/kyrgyz';
import { tajikTranslations } from './translations/tajik';
import { ukrainianTranslations } from './translations/ukrainian';
import { thaiTranslations } from './translations/thai';
import { vietnameseTranslations } from './translations/vietnamese';
import { indonesianTranslations } from './translations/indonesian';
import { hindiTranslations } from './translations/hindi';
import { arabicTranslations } from './translations/arabic';
import { persianTranslations } from './translations/persian';
import { malayTranslations } from './translations/malay';
import { urduTranslations } from './translations/urdu';
import { pashtoTranslations } from './translations/pashto';
import { armenianTranslations } from './translations/armenian';
import { georgianTranslations } from './translations/georgian';
import { LanguageTranslation } from '../../types';

const translationsMap: Record<string, LanguageTranslation[]> = {
  zh: chineseTranslations,
  ru: russianTranslations,
  en: englishTranslations,
  tr: turkishTranslations,
  uz: uzbekTranslations,
  de: germanTranslations,
  fr: frenchTranslations,
  es: spanishTranslations,
  it: italianTranslations,
  ja: japaneseTranslations,
  ko: koreanTranslations,
  pl: polishTranslations,
  pt: portugueseTranslations,
  nl: dutchTranslations,
  az: azerbaijaniTranslations,
  kk: kazakhTranslations,
  ky: kyrgyzTranslations,
  tg: tajikTranslations,
  uk: ukrainianTranslations,
  th: thaiTranslations,
  vi: vietnameseTranslations,
  id: indonesianTranslations,
  hi: hindiTranslations,
  ar: arabicTranslations,
  fa: persianTranslations,
  ms: malayTranslations,
  ur: urduTranslations,
  ps: pashtoTranslations,
  hy: armenianTranslations,
  ka: georgianTranslations,
};

/**
 * Получить переводы для указанного языка
 * @param languageCode - Код языка (zh, ru, en...)
 * @returns Массив переводов или пустой массив
 */
export const getTranslationsForLanguage = (
  languageCode: string
): LanguageTranslation[] => {
  return translationsMap[languageCode] || [];
};

/**
 * Проверить наличие переводов для языка
 * @param languageCode - Код языка
 * @returns true если переводы есть
 */
export const hasTranslationsForLanguage = (
  languageCode: string
): boolean => {
  const translations = translationsMap[languageCode];
  return translations && translations.length > 0;
};
