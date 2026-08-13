// src/data/scenarios/__tests__/helpers.test.ts
// Хелперы доступа к корпусу на реальных данных, без рендера.
import { getAvailableReplies, getAvailableScenarios, getPhraseText, isPhraseAvailable } from '../index';
import { ContentLang } from '../types';

const TARGET_LANGS: ContentLang[] = ['zh', 'en', 'ru'];

describe('getAvailableReplies', () => {
  it('отдаёт все четыре ответа на вопрос о цели визита на каждом языке', () => {
    TARGET_LANGS.forEach((lang) => {
      expect(getAvailableReplies('air.passport.q-purpose', lang)).toEqual([
        'air.passport.a-tourism',
        'air.passport.a-business',
        'air.passport.a-study',
        'air.passport.a-transit',
      ]);
    });
  });

  it('отдаёт пустой массив для фразы без ответов и для неизвестного id', () => {
    expect(getAvailableReplies('sv.hello', 'zh')).toEqual([]);
    expect(getAvailableReplies('air.checkin.one-bag', 'zh')).toEqual([]);
    expect(getAvailableReplies('нет.такой.фразы', 'zh')).toEqual([]);
  });

  it('у каждой фразы them есть хотя бы один доступный ответ', () => {
    TARGET_LANGS.forEach((lang) => {
      const scenario = getAvailableScenarios('travel', lang)[0];
      const themIds = scenario.steps
        .flatMap((step) => step.phrases)
        .filter((id) => getPhraseText(id, lang) !== null && id.includes('.q-'));
      expect(themIds.length).toBeGreaterThan(0);
      themIds.forEach((id) => {
        expect(getAvailableReplies(id, lang).length).toBeGreaterThan(0);
      });
    });
  });

  it('возвращает только доступные ответы', () => {
    const replies = getAvailableReplies('air.checkin.q-baggage-count', 'zh');
    replies.forEach((id) => expect(isPhraseAvailable(id, 'zh')).toBe(true));
    expect(replies).toHaveLength(2);
  });
});
