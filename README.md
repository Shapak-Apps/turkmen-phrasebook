<div align="center">

<img src="./assets/logo.png" alt="Ykjam Terjime" width="120" />

# Ykjam Terjime

**Turkmen phrasebook and language companion for 5+ languages**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Expo SDK](https://img.shields.io/badge/Expo_SDK-54-000020.svg?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB.svg?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

[🇷🇺 По-русски](./README.ru.md) · [🇹🇲 Türkmençe](./README.tk.md)

</div>

---

**Ykjam Terjime** (*"Ready Translation"* in Turkmen) is a free, offline-first phrasebook and language companion built specifically for Turkmen speakers. Learn and communicate in Chinese, Russian, English, Turkish — with pronunciation audio, favorites, search, and more.

Part of **[Shapak-Apps](https://github.com/Shapak-Apps)** — the first open-source organization in Turkmenistan.

## 📱 Screenshots

<div align="center">
<img src="./assets/screenshots/1.jpg" width="240" />
<img src="./assets/screenshots/2.jpg" width="240" />
<img src="./assets/screenshots/3.jpg" width="240" />
</div>

## ✨ Features

- 🗣️ **293 phrases** across **22 categories** (50+ subcategories)
- 🌍 **5 languages** available: 🇹🇲 Turkmen, 🇨🇳 Chinese, 🇷🇺 Russian, 🇬🇧 English, 🇹🇷 Turkish
- 🔊 **306 audio files** with native pronunciation (M4A)
- 📴 **Fully offline** — works without internet
- 🈲 **Pinyin transcription** for Chinese phrases
- ⭐ **Favorites, statistics, full-text search**
- 🎨 **Clean, minimalist design** (Lingify-inspired)
- 🆓 **100% free, no ads, no tracking**

**Coming in v2.0:** 25 more languages (German, French, Spanish, Japanese, Korean, Arabic, and more), AI-powered translator, visual translator.

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Expo SDK 54](https://expo.dev) + [React Native 0.81](https://reactnative.dev) |
| Language | [TypeScript 5.9](https://www.typescriptlang.org) (strict mode) |
| Navigation | [React Navigation 7](https://reactnavigation.org) (Stack + Bottom Tabs) |
| Storage | AsyncStorage (local-first) |
| Audio | expo-av (local MP3 + Expo Speech fallback) |
| Translation API | [MyMemory](https://mymemory.translated.net) + [LibreTranslate](https://libretranslate.com) |
| Build | [EAS Build](https://expo.dev/eas) |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- [Git](https://git-scm.com)
- [Android Studio](https://developer.android.com/studio) (for Android emulator) or [Xcode](https://developer.apple.com/xcode/) (for iOS simulator)
- [Expo CLI](https://docs.expo.dev/more/expo-cli/) (installed automatically via `npx`)

### Installation

```bash
# Clone the repository
git clone https://github.com/Shapak-Apps/turkmen-phrasebook.git
cd turkmen-phrasebook

# Install dependencies
npm install

# Create your environment file (optional, for AI features)
cp .env.example .env
# Then edit .env and add your API keys if needed
```

### Running the App

```bash
# Start the Metro bundler
npm start

# Then:
#   Press `a` to open on Android emulator
#   Press `i` to open on iOS simulator
#   Press `w` to open in the browser
```

Or run directly on a device:

```bash
npm run android    # Android
npm run ios        # iOS (macOS only)
```

### Other Commands

```bash
npm test           # Run tests
npm run lint       # Lint code
npm run lint:fix   # Auto-fix lint issues
```

## 📁 Project Structure

```
turkmen-phrasebook/
├── src/
│   ├── api/             # Translation API clients
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (language, config)
│   ├── data/            # Phrases, categories, translations
│   ├── features/        # Feature modules (translator, AI, favorites)
│   ├── navigation/      # Navigation configuration
│   ├── screens/         # App screens
│   ├── services/        # Business logic services
│   └── utils/           # Helpers and utilities
├── assets/              # Images, icons, audio files
├── android/             # Native Android project
├── ios/                 # Native iOS project
└── App.tsx              # Entry point
```

## 🤝 Contributing

We welcome contributions of all kinds — from fixing typos to adding full languages!

Read our **[Contributing Guide](./CONTRIBUTING.md)** for:

- How to set up the project locally
- How to submit a pull request
- Coding conventions
- "Good first issue" tags for newcomers

**Good first issues:**
- Add translations for a new language
- Record pronunciation audio for existing phrases
- Fix a typo, improve an icon, polish a screen
- Write unit tests for existing code

Found a bug or have a feature idea? **[Open an issue](https://github.com/Shapak-Apps/turkmen-phrasebook/issues)**.

## 📲 Download the App

<div align="center">

[<img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" height="60" style="vertical-align: middle;" />](https://apps.apple.com/app/ykjam-terjime/id6758071845)
&nbsp;&nbsp;
[<img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" height="90" style="vertical-align: middle;" />](https://play.google.com/store/apps/details?id=com.shapak.translator)

</div>

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

You are free to use, modify, and distribute this software, as long as the original copyright notice is preserved.

## 👤 Author

**Seydi Charyyev**
- 📧 Email: [seydi.charyev@gmail.com](mailto:seydi.charyev@gmail.com)
- 🐙 GitHub: [@TheSeydiCharyyev](https://github.com/TheSeydiCharyyev)
- 🏢 Organization: [Shapak-Apps](https://github.com/Shapak-Apps)

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev) — the fastest way to build cross-platform mobile apps
- Icons by [Ionicons](https://ionic.io/ionicons)
- Translation APIs by [MyMemory](https://mymemory.translated.net) and [LibreTranslate](https://libretranslate.com)

---

<div align="center">

Made with ❤️ in Turkmenistan — for the Turkmen language community.

**[⭐ Star us on GitHub](https://github.com/Shapak-Apps/turkmen-phrasebook)** to support open-source development in Turkmenistan.

</div>
