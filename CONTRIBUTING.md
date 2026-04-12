# Contributing to Ykjam Terjime

First of all — **thank you!** Every contribution, no matter how small, helps make this project better for the Turkmen language community.

> 🇷🇺 Русскоязычная версия — смотри раздел [Как внести вклад на русском](#как-внести-вклад-на-русском) ниже.

---

## 🤝 Ways to Contribute

You don't have to be a senior developer to contribute. Here are some ways anyone can help:

- 🌍 **Add translations** for a new language
- 🔊 **Record audio** pronunciation for phrases
- 🎨 **Polish UI** — improve a screen, fix alignment, add animation
- 🐛 **Fix bugs** — check the [issues](https://github.com/Shapak-Apps/turkmen-phrasebook/issues) page
- ✏️ **Fix typos** in code comments, documentation, or translations
- 📝 **Improve documentation** — add examples, clarify instructions
- ✅ **Write tests** — unit tests or integration tests
- 💡 **Suggest features** — open a GitHub issue with your idea

Look for issues tagged **`good first issue`** — those are designed for newcomers.

---

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

### 3. Set up environment

```bash
cp .env.example .env
```

The `.env` file is only needed for AI features. Leave it empty if you're not working on those.

### 4. Run the app

```bash
npm start
```

Then press `a` for Android, `i` for iOS, or `w` for web.

---

## 🌳 Workflow

### 1. Create a branch

Use descriptive branch names:

```bash
git checkout -b feature/add-german-translations
git checkout -b fix/audio-playback-ios
git checkout -b docs/improve-readme
```

Prefixes:
- `feature/` — new features
- `fix/` — bug fixes
- `docs/` — documentation only
- `refactor/` — code cleanup (no behavior change)
- `test/` — adding tests

### 2. Make your changes

- Follow the existing code style
- Run `npm run lint` before committing
- Write clear commit messages

### 3. Test your changes

```bash
npm test              # Unit tests
npm run lint          # Code style check
npm run lint:fix      # Auto-fix lint issues
```

Test in the emulator that your change doesn't break existing features.

### 4. Commit and push

```bash
git add .
git commit -m "Add German translations for phrasebook module"
git push origin feature/add-german-translations
```

### 5. Open a Pull Request

Go to GitHub and open a PR. In the description:

- **What** does this PR do?
- **Why** is it needed?
- **How** did you test it?
- Screenshots/videos for UI changes

---

## 📝 Code Style

- **Language:** TypeScript (strict mode is ON)
- **Linter:** ESLint (config in `.eslintrc.js`)
- **Indent:** 2 spaces
- **Quotes:** single (`'`) in JS/TS, double (`"`) in JSX attributes
- **Imports:** ordered — React first, third-party, then local
- **Components:** functional with hooks, `PascalCase` filenames

### TypeScript tips

- Don't use `any` unless absolutely necessary — use `unknown` or proper types
- Export types from `src/types/`
- Document public APIs with JSDoc comments

### React Native tips

- Use `StyleSheet.create` — not inline styles for repeated use
- Use `useSafeArea` hook instead of raw `SafeAreaView` insets
- For performance-critical lists, use `FlatList` — not `map()` in `ScrollView`

---

## 🌍 Adding a New Language

1. Add the language to `src/config/languages.config.ts`
2. Create a translations file in `src/data/languages/translations/<code>.ts`
3. Add UI strings in `src/contexts/LanguageContext.tsx`
4. Enable the language in the config (`isAvailable: true`)
5. Test it on both Android and iOS

See existing languages (e.g., `zh`, `ru`, `en`) as reference.

---

## 🔊 Adding Audio

1. Record clear, slow pronunciation (prefer native speakers)
2. Use `.m4a` format, mono, 22050 Hz or higher
3. Place files in `assets/audio/<language-code>/`
4. Reference them in phrase data
5. Test playback on a real device (not just emulator)

---

## 🐛 Reporting Bugs

Open an issue at [github.com/Shapak-Apps/turkmen-phrasebook/issues](https://github.com/Shapak-Apps/turkmen-phrasebook/issues) with:

- **Steps to reproduce** — what did you do?
- **Expected behavior** — what should happen?
- **Actual behavior** — what actually happens?
- **Environment** — OS, device, app version
- **Screenshots/logs** — if applicable

---

## 💬 Getting Help

- **GitHub Issues:** [github.com/Shapak-Apps/turkmen-phrasebook/issues](https://github.com/Shapak-Apps/turkmen-phrasebook/issues)
- **Email:** [seydi.charyev@gmail.com](mailto:seydi.charyev@gmail.com)

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the **[MIT License](./LICENSE)**.

---

## <a name="как-внести-вклад-на-русском"></a> Как внести вклад (на русском)

### Быстрый старт

```bash
# 1. Форкни репо на GitHub, затем:
git clone https://github.com/ТВОЙ_ЛОГИН/turkmen-phrasebook.git
cd turkmen-phrasebook

# 2. Поставь зависимости
npm install

# 3. Создай .env (если работаешь с AI)
cp .env.example .env

# 4. Запусти приложение
npm start
```

### Как оформить pull request

1. **Создай ветку** с понятным именем:
   ```bash
   git checkout -b feature/add-german-translations
   ```
2. **Сделай изменения**, соблюдая code style (ESLint уже настроен)
3. **Проверь код**:
   ```bash
   npm test
   npm run lint
   ```
4. **Закоммить и запушь**:
   ```bash
   git commit -m "Понятное описание изменений"
   git push origin feature/add-german-translations
   ```
5. **Открой PR** на GitHub с описанием: что, зачем, как тестировал

### Где взять задачи

Ищи issues с тегом **`good first issue`** — они специально помечены как простые для новичков.

Спасибо, что помогаешь развивать open-source в Туркменистане! 🇹🇲
