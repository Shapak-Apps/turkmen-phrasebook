# Contributing to Ykjam Terjime

First of all — thank you! Every contribution, no matter how small, helps make this project better for the Turkmen language community.

🇷 Русскоязычная версия — смотри раздел [Как внести вклад на русском](#как-внести-вклад-на-русском) ниже.

## 🤝 Ways to Contribute

You don't have to be a senior developer to contribute. Here are some ways anyone can help:

- 🌍 **Complete an interface translation** — 26 languages are translated but locked, waiting for their missing keys
- ✏️ **Add or correct phrases** in the scenario phrasebook (Turkmen, Chinese, English, Russian)
- 🎨 **Polish UI** — improve a screen, fix alignment, add animation
- 🐛 **Fix bugs** — check the [issues](https://github.com/Shapak-Apps/turkmen-phrasebook/issues) page
- ✏️ **Fix typos** in code comments, documentation, or translations
- 📝 **Improve documentation** — add examples, clarify instructions
- ✅ **Write tests** — unit tests or integration tests
- 💡 **Suggest features** — open a GitHub issue with your idea

Look for issues tagged `good first issue` — those are designed for newcomers.

## 📖 What This App Is

Ykjam Terjime is a free, offline-first, scenario-based phrasebook:

- 295 curated phrases in 13 real-life scenarios, grouped into two wings: ✈️ *Men gidýärin* (I am traveling) and 🏡 *Myhman geldi* (A guest arrived)
- 3 content pairs: Turkmen ↔ Chinese (with pinyin), Turkmen ↔ English, Turkmen ↔ Russian
- 5 interface languages: Turkmen, Chinese, Russian, English, Turkish — plus 26 more locked until their translations are completed
- Zero network calls — everything works offline

Planned but not in the app yet: text translator, voice translator, visual translator (OCR), AI assistants. Do not write code or docs as if they exist.

## 🗂️ Where Things Live

| Path | What it holds |
| --- | --- |
| `src/data/scenarios/skeleton.ts` | The phrase registry: scenarios, steps, the survival core (shown as «IŇ GEREK SÖZLEMLER») |
| `src/data/scenarios/texts/tk.ts` | Turkmen layer — 295 entries |
| `src/data/scenarios/texts/ru.ts` | Russian layer — 295 entries |
| `src/data/scenarios/texts/en.ts` | English layer — 295 entries |
| `src/data/scenarios/texts/zh.ts` | Chinese layer — 295 entries, each with pinyin in `translit` |
| `src/data/scenarios/__tests__/integrity.test.ts` | Integrity test: every layer has every skeleton key; every zh entry has a non-empty `translit` |
| `src/features/scenarios/` | Scenario screens, show-screen mode |
| `src/features/scenarios/ui-labels.ts` | Scenario labels (Turkmen only): wing names, dialog tags, buttons |
| `src/contexts/LanguageContext.tsx` | Interface strings for all interface languages, including the 26 locked ones |
| `src/config/languages.config.ts` | Interface languages: 5 with `isAvailable: true`, 26 locked |

## 🚀 Quick Start

### 1. Fork and clone

```bash
# Fork the repo on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/turkmen-phrasebook.git
cd turkmen-phrasebook

# Add upstream
git remote add upstream https://github.com/Shapak-Apps/turkmen-phrasebook.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `a` for the Android emulator, `i` for the iOS simulator, `w` for web.

## 🌳 Workflow

### 1. Create a branch

Use descriptive branch names:

```bash
git checkout -b feat/add-german-interface
git checkout -b fix/scenario-screen-crash
git checkout -b docs/improve-readme
```

Prefixes:

- `feat/` — new features
- `fix/` — bug fixes
- `docs/` — documentation only
- `refactor/` — code cleanup (no behavior change)
- `test/` — adding tests
- `chore/` — maintenance (dependency cleanup, repo housekeeping)

Keep one issue per PR — a phrase fix and a docs rewrite should not share a branch.

### 2. Make your changes

- Follow the existing code style
- Write clear commit messages

### 3. Check your work before opening a PR

```bash
npx tsc --noEmit   # TypeScript must compile with zero errors
npm test           # unit tests must pass
npm run lint       # no new lint problems
npm run lint:fix   # optional: auto-fix lint issues
```

Then run the app (`npx expo start`) and open the screens you touched.

### 4. Commit and push

```bash
git add .
git commit -m "Add the missing German interface keys"
git push origin feat/add-german-interface
```

### 5. Open a Pull Request

Go to GitHub and open a PR against `master`. In the description:

- What does this PR do?
- Why is it needed?
- How did you test it?
- Screenshots/videos for UI changes

## ✏️ Adding or Correcting Phrases

This is the contribution the project needs most.

### Correcting a phrase

1. Find the phrase id in `src/data/scenarios/skeleton.ts`
2. Open the language layer you want to fix, e.g. `src/data/scenarios/texts/ru.ts`
3. Edit the entry with that id
4. Run `npx tsc --noEmit` and `npm test`, then check the phrase in the app

### Adding a phrase

1. Register the phrase in `src/data/scenarios/skeleton.ts` (scenario, step, new id)
2. Add an entry with the same id to all four layers: `src/data/scenarios/texts/tk.ts`, `src/data/scenarios/texts/ru.ts`, `src/data/scenarios/texts/en.ts`, `src/data/scenarios/texts/zh.ts`
3. For Chinese, fill the `translit` field with pinyin
4. Run `npm test` — the integrity test (`src/data/scenarios/__tests__/integrity.test.ts`) compares every layer's keys against the skeleton and fails if a layer misses an entry; it also checks that every zh entry has a non-empty `translit`
5. Run `npx tsc --noEmit` to confirm everything compiles, then open the scenario in the app and verify the phrase shows in every content language

## 🌍 Completing an Interface Language

The interface is configured in `src/config/languages.config.ts`; the interface strings themselves live in `src/contexts/LanguageContext.tsx`. Five languages are available; 26 more are translated in the code but locked because some interface keys are missing.

1. Pick a locked language in `src/config/languages.config.ts`
2. Compare its interface strings with the Turkmen ones in `src/contexts/LanguageContext.tsx` and fill every missing key
3. Set `isAvailable: true` in `src/config/languages.config.ts`
4. Run the app and switch the interface to your language — walk through a scenario end to end

## 📝 Code Style

- Language: TypeScript (strict mode is ON)
- Linter: ESLint
- Indent: 2 spaces
- Quotes: single (`'`) in JS/TS, double (`"`) in JSX attributes
- Imports: ordered — React first, third-party, then local
- Components: functional with hooks, `PascalCase` filenames

### TypeScript tips

- Don't use `any` unless absolutely necessary — use `unknown` or proper types
- Document public APIs with JSDoc comments

### React Native tips

- Use `StyleSheet.create` — not inline styles for repeated use
- For performance-critical lists, use `FlatList` — not `map()` in `ScrollView`

## 🐛 Reporting Bugs

Open an issue at [github.com/Shapak-Apps/turkmen-phrasebook/issues](https://github.com/Shapak-Apps/turkmen-phrasebook/issues) with:

- Steps to reproduce — what did you do?
- Expected behavior — what should happen?
- Actual behavior — what actually happens?
- Environment — OS, device, app version
- Screenshots/logs — if applicable

## 💬 Getting Help

- GitHub Issues: [github.com/Shapak-Apps/turkmen-phrasebook/issues](https://github.com/Shapak-Apps/turkmen-phrasebook/issues)
- Email: [shapak.apps@gmail.com](mailto:shapak.apps@gmail.com)

## Как внести вклад на русском

Прежде всего — спасибо! Любой вклад, даже самый маленький, делает приложение лучше для туркменоязычного сообщества.

### Как помочь

- 🌍 Довести перевод интерфейса до конца — 26 языков уже переведены, но заблокированы: им не хватает части ключей
- ✏️ Добавить или исправить фразы в разговорнике (туркменский, китайский, английский, русский)
- 🐛 Исправить ошибки — список в [issues](https://github.com/Shapak-Apps/turkmen-phrasebook/issues)
- 📝 Улучшить документацию и писать тесты

### Быстрый старт

```bash
git clone https://github.com/YOUR_USERNAME/turkmen-phrasebook.git
cd turkmen-phrasebook
npm install
npx expo start
```

### Рабочий процесс

1. Создайте ветку: `git checkout -b feat/...`, `fix/...` или `docs/...`
2. Внесите изменения, соблюдая стиль кода.
3. Проверьте: `npx tsc --noEmit` (ноль ошибок), `npm test` (тесты проходят), `npm run lint`.
4. Закоммитьте и отправьте: `git push origin <имя-ветки>`.
5. Откройте Pull Request в `master` и опишите: что делает, зачем нужно и как вы проверяли.

### Добавление или исправление фразы

1. Найдите (или зарегистрируйте) id фразы в `src/data/scenarios/skeleton.ts`.
2. Добавьте/исправьте запись с этим id во всех четырёх слоях: `src/data/scenarios/texts/tk.ts`, `src/data/scenarios/texts/ru.ts`, `src/data/scenarios/texts/en.ts`, `src/data/scenarios/texts/zh.ts`.
3. Для китайского заполните `translit` (пиньинь).
4. Запустите `npm test` — тест целостности упадёт, если какой-то слой пропустит запись или у китайской записи будет пустой `translit`.

### Завершение перевода интерфейса

1. Выберите заблокированный язык в `src/config/languages.config.ts`.
2. Сравните его строки интерфейса с туркменскими в `src/contexts/LanguageContext.tsx` и заполните все недостающие ключи.
3. Поставьте `isAvailable: true` в `src/config/languages.config.ts`.
4. Запустите приложение и пройдите сценарий от начала до конца на своём языке.

### Куда писать

- GitHub Issues: [github.com/Shapak-Apps/turkmen-phrasebook/issues](https://github.com/Shapak-Apps/turkmen-phrasebook/issues)
- Email: [shapak.apps@gmail.com](mailto:shapak.apps@gmail.com)

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](https://github.com/Shapak-Apps/turkmen-phrasebook/blob/master/LICENSE).