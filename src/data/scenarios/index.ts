// src/data/scenarios/index.ts
// Сборка каркаса и языковых слоёв + хелперы доступа.
import { phrases, scenarios, survivalCore } from './skeleton';
import { ContentLang, LangLayer, PhraseText, Scenario, Wing } from './types';
import { tk } from './texts/tk';
import { ru } from './texts/ru';
import { en } from './texts/en';
import { zh } from './texts/zh';

export * from './types';
export { phrases, scenarios, survivalCore };

/** Языковые слои корпуса. Добавление языка = новый файл texts/<lang>.ts + строка здесь. */
export const layers: Record<ContentLang, LangLayer> = { tk, ru, en, zh };

/**
 * Текст считается готовым, если он не пустой и это не метка «?»,
 * которой помечают фразы «нужно вернуться». Правило то же, что в usePhrases.
 */
const isMeaningful = (text: string): boolean => {
  const trimmed = text.trim();
  return trimmed !== '' && trimmed !== '?';
};

/** Текст фразы на языке lang. null — если записи нет или текст пустой/«?». */
export const getPhraseText = (id: string, lang: ContentLang): PhraseText | null => {
  const entry = layers[lang][id];
  if (!entry || !isMeaningful(entry.text)) {
    return null;
  }
  return entry;
};

/** Фразу можно показать, если есть туркменский текст И текст на языке собеседника. */
export const isPhraseAvailable = (id: string, lang: ContentLang): boolean =>
  getPhraseText(id, 'tk') !== null && getPhraseText(id, lang) !== null;

/**
 * Сценарии крыла, у которых доступна хотя бы одна фраза.
 * Недоступные фразы и опустевшие шаги вырезаны из копии — исходные данные не мутируются.
 */
export const getAvailableScenarios = (wing: Wing, lang: ContentLang): Scenario[] =>
  scenarios
    .filter((scenario) => scenario.wing === wing)
    .map((scenario) => ({
      ...scenario,
      steps: scenario.steps
        .map((step) => ({
          ...step,
          phrases: step.phrases.filter((id) => isPhraseAvailable(id, lang)),
        }))
        .filter((step) => step.phrases.length > 0),
    }))
    .filter((scenario) => scenario.steps.length > 0);
