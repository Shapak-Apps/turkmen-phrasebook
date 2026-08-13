// src/features/scenarios/ui-labels.ts
// Все строки и цвета сценарного разговорника в одном файле.
// Туркменские подписи — ЧЕРНОВИК, ждут правки носителем.
// В LanguageContext ничего не добавляем: 31 язык хрома — отдельное ТЗ.

export type TargetLang = 'zh' | 'en' | 'ru';

/** Палитра фичи. Намеренно локальная: старые экраны живут на своих цветах. */
export const ScenarioColors = {
  brand: '#2FA0D9',
  background: '#F7FAFC',
  surface: '#FFFFFF',
  text: '#17242F',
  muted: '#5D7181',
  line: '#DCE4EA',
  /** Карточка «моей» реплики */
  mine: '#EAF4FA',
  mineBorder: '#CBE4F2',
  /** Тег реплики собеседника */
  them: '#C77F2E',
} as const;

export const targetLangMeta: Record<TargetLang, { flag: string; nameTk: string; chip: string }> = {
  zh: { flag: '🇨🇳', nameTk: 'Hytaýça', chip: '中文' },
  en: { flag: '🇬🇧', nameTk: 'Iňlisçe', chip: 'English' },
  ru: { flag: '🇷🇺', nameTk: 'Rusça', chip: 'Русский' },
};

export const TARGET_LANGS: TargetLang[] = ['zh', 'en', 'ru'];

/** Подписи хрома. Черновики. */
export const uiLabels = {
  hubTileSubtitle: 'Sahnalar boýunça sözlemler',
  homeTitle: 'Gepleşik kitaby',
  ownFlag: '🇹🇲',
  survivalSection: 'IŇ GEREK SÖZLEMLER',
  scenariosSection: 'SAHNALAR',
  wingTravel: '✈️ Men gidýärin',
  wingHost: '🏡 Myhman geldi',
  soonBadge: 'Ýakynda',
  soonToast: 'Bu bölüm heniz taýýar däl',
  flowSubtitle: 'Ädimme-ädim',
  stepWord: 'ädim',
  phraseWord: 'sözlem',
  tagThem: 'SIZDEN SORARLAR',
  tagMine: 'SIZIŇ JOGABYŇYZ',
  showScreenButton: '📲 EKRANY GÖRKEZMEK',
  repliesSection: 'SIZE JOGAP BERERLER',
  usefulSection: 'ŞU ÝAGDAÝDA PEÝDALY',
  survivalHeader: 'Iň gerek sözlemler',
  phraseWordCap: 'Sözlem',
  sheetDone: 'Düşnükli ✓',
} as const;

/** Названия сценариев и шагов по id. */
export const scenarioTitles: Record<string, string> = {
  air: 'Aeroport we serhet',
  'air.checkin': 'Bellige alyş',
  'air.passport': 'Pasport gözegçiligi',
  'air.baggage': 'Goş almak',
  'air.sim-money': 'SIM we pul',
};

/** Приглашение собеседнику в режиме «покажи экран» — на его языке. */
export const showScreenPrompt: Record<TargetLang, string> = {
  zh: '请点击您的回答',
  en: 'Tap your answer',
  ru: 'Нажмите ваш ответ',
};

/** Название по id с запасным вариантом: незнакомый сценарий не должен рисовать пустоту. */
export const titleOf = (id: string): string => scenarioTitles[id] ?? id;
