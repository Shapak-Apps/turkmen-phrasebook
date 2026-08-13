// src/data/scenarios/types.ts
// Типы сценарного разговорника. Каркас не знает языков — тексты подключаются слоями.

export type Wing = 'travel' | 'host';
export type ContentLang = 'tk' | 'ru' | 'en' | 'zh';
export type Speaker = 'me' | 'them';

export interface ScenarioPhrase {
  /** Стабильный id: "<scenario>.<step>.<slug>", survival: "sv.<slug>". Slug — англ. kebab-case. */
  id: string;
  speaker: Speaker;
  /** id фраз-ответов (обычно противоположный speaker). Порядок = порядок в UI. */
  replies?: string[];
  /** Пиктограмма для списков и кнопок-ответов. */
  emoji?: string;
}

export interface ScenarioStep {
  id: string;
  emoji: string;
  /** Порядок = порядок реального прохода ситуации. */
  phrases: string[];
}

export interface Scenario {
  id: string;
  wing: Wing;
  emoji: string;
  steps: ScenarioStep[];
}

export interface PhraseText {
  text: string;
  /** Пиньинь для zh; для остальных языков опционально. */
  translit?: string;
}

/** key = ScenarioPhrase.id */
export type LangLayer = Record<string, PhraseText>;
