// src/data/scenarios/__tests__/integrity.test.ts
// Проверки целостности корпуса: чистые данные, без рендера.
import { phrases, scenarios, survivalCore } from '../skeleton';
import { ContentLang, LangLayer } from '../types';
import { tk } from '../texts/tk';
import { ru } from '../texts/ru';
import { en } from '../texts/en';
import { zh } from '../texts/zh';

// Regex-литералы, а не сборка из строк: в шаблоне `\.` схлопывается в обычную точку
// и проверка молча начинает принимать любой разделитель.
const SURVIVAL_ID = /^sv\.[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SCENARIO_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+(?:-[a-z0-9]+)*$/;

const allPhraseIds = Object.keys(phrases);
const layers: Record<ContentLang, LangLayer> = { tk, ru, en, zh };

describe('scenarios integrity', () => {
  // 1. Битые ссылки
  it('все ссылки на фразы указывают на существующие записи реестра', () => {
    const broken: string[] = [];
    scenarios.forEach((scenario) => {
      scenario.steps.forEach((step) => {
        step.phrases.forEach((id) => {
          if (!phrases[id]) broken.push(`${step.id} -> ${id}`);
        });
      });
    });
    survivalCore.forEach((id) => {
      if (!phrases[id]) broken.push(`survivalCore -> ${id}`);
    });
    allPhraseIds.forEach((id) => {
      (phrases[id].replies ?? []).forEach((replyId) => {
        if (!phrases[replyId]) broken.push(`${id}.replies -> ${replyId}`);
      });
    });
    expect(broken).toEqual([]);
  });

  // 2. Дубли и конвенция id
  it('фраза упомянута ровно один раз и id соответствует конвенции', () => {
    const mentions: string[] = [
      ...scenarios.flatMap((scenario) => scenario.steps.flatMap((step) => step.phrases)),
      ...survivalCore,
    ];
    const duplicates = mentions.filter((id, index) => mentions.indexOf(id) !== index);
    expect(duplicates).toEqual([]);

    const badFormat = allPhraseIds.filter(
      (id) => !SURVIVAL_ID.test(id) && !SCENARIO_ID.test(id)
    );
    expect(badFormat).toEqual([]);

    const badKey = allPhraseIds.filter((id) => phrases[id].id !== id);
    expect(badKey).toEqual([]);

    const badPrefix: string[] = [];
    scenarios.forEach((scenario) => {
      scenario.steps.forEach((step) => {
        if (!step.id.startsWith(`${scenario.id}.`)) badPrefix.push(step.id);
        step.phrases.forEach((id) => {
          if (!id.startsWith(`${step.id}.`)) badPrefix.push(id);
        });
      });
    });
    survivalCore.forEach((id) => {
      if (!id.startsWith('sv.')) badPrefix.push(id);
    });
    expect(badPrefix).toEqual([]);
  });

  // Страховка от регрессии: сами регексы конвенции должны требовать точку, а не любой символ.
  it('конвенция id проверяет точку буквально', () => {
    expect(SURVIVAL_ID.test('sv.hello')).toBe(true);
    expect(SURVIVAL_ID.test('svXhello')).toBe(false);
    expect(SCENARIO_ID.test('air.passport.q-purpose')).toBe(true);
    expect(SCENARIO_ID.test('airXpassportXq-purpose')).toBe(false);
    expect(SCENARIO_ID.test('sv.hello')).toBe(false);
  });

  // 3. Опорные слои заполнены
  it('у каждой фразы есть текст в слоях ru и tk', () => {
    const missing: string[] = [];
    allPhraseIds.forEach((id) => {
      (['ru', 'tk'] as ContentLang[]).forEach((lang) => {
        const entry = layers[lang][id];
        if (!entry || entry.text.trim() === '') missing.push(`${lang}: ${id}`);
      });
    });
    expect(missing).toEqual([]);
  });

  // 4. Пиньинь
  it('у каждой китайской записи есть непустой translit', () => {
    const missing = Object.keys(zh).filter((id) => !zh[id].translit || zh[id].translit!.trim() === '');
    expect(missing).toEqual([]);
  });

  // 5. Диалоговые связи
  it('ответы принадлежат противоположному собеседнику', () => {
    const wrong: string[] = [];
    allPhraseIds.forEach((id) => {
      (phrases[id].replies ?? []).forEach((replyId) => {
        const reply = phrases[replyId];
        if (reply && reply.speaker === phrases[id].speaker) {
          wrong.push(`${id} (${phrases[id].speaker}) -> ${replyId} (${reply.speaker})`);
        }
      });
    });
    expect(wrong).toEqual([]);
  });

  // 6. Наполненность структуры
  it('у каждого сценария есть хотя бы один шаг', () => {
    const empty = scenarios.filter((scenario) => scenario.steps.length === 0).map((s) => s.id);
    expect(empty).toEqual([]);
  });

  // Сценарий, который ещё не наполняли, — заготовка следующего этапа, это не ошибка.
  // А вот сценарий, наполненный наполовину, — забытый шаг: он попадёт в UI пустым.
  it('в наполненном сценарии нет пустых шагов', () => {
    const placeholders: string[] = [];
    const emptySteps: string[] = [];
    scenarios.forEach((scenario) => {
      if (scenario.steps.every((step) => step.phrases.length === 0)) {
        placeholders.push(scenario.id);
        return;
      }
      scenario.steps.forEach((step) => {
        if (step.phrases.length === 0) emptySteps.push(step.id);
      });
    });
    if (placeholders.length > 0) {
      console.log(`сценарии-заготовки без единой фразы: ${placeholders.join(', ')}`);
    }
    expect(emptySteps).toEqual([]);
  });

  it('у каждой фразы survival-ядра есть emoji', () => {
    const noEmoji = survivalCore.filter((id) => !phrases[id]?.emoji);
    expect(noEmoji).toEqual([]);
  });

  // Сверх ТЗ: фраза, не попавшая ни в один шаг, ни в ядро, ни в ответы — потерянная работа.
  it('в реестре нет фраз-сирот', () => {
    const referenced = new Set<string>([
      ...scenarios.flatMap((scenario) => scenario.steps.flatMap((step) => step.phrases)),
      ...survivalCore,
      ...allPhraseIds.flatMap((id) => phrases[id].replies ?? []),
    ]);
    const orphans = allPhraseIds.filter((id) => !referenced.has(id));
    expect(orphans).toEqual([]);
  });
});
