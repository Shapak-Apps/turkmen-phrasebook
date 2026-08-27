<div align="center">
<img src="./assets/logo.png" alt="Ykjam Terjime" width="120" />

# Ykjam Terjime

Offline scenario phrasebook — 295 curated phrases in 13 real-life scenarios, Turkmen paired with Chinese, English or Russian

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Expo](https://img.shields.io/badge/Expo_SDK-54-000020.svg?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB.svg?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

[🇷🇺 По-русски](./README.ru.md) · [🇹 Türkmençe](./README.tk.md)
</div>

Ykjam Terjime ("Ready Translation" in Turkmen) is a free, offline-first, scenario-based phrasebook. Instead of word lists, it walks you through 13 real-life scenarios — 295 curated phrases in total — pairing Turkmen with Chinese, English or Russian. The interface is available in 5 languages, and the app makes zero network calls.

Part of [Shapak-Apps](https://github.com/Shapak-Apps) — the first open-source organization in Turkmenistan.

## 📱 Screenshots

<div align="center">
  <img src="./assets/screenshots/1.jpg" width="240" />
  <img src="./assets/screenshots/2.jpg" width="240" />
  <img src="./assets/screenshots/3.jpg" width="240" />
  <img src="./assets/screenshots/4.jpg" width="240" />
  <img src="./assets/screenshots/5.jpg" width="240" />
  <img src="./assets/screenshots/6.jpg" width="240" />
</div>

## ✨ What the app does today

- 🎭 **13 real-life scenarios** with **295 curated phrases** — 260 inside the scenarios, plus 35 in the survival core that the app shows as its own section, **"IŇ GEREK SÖZLEMLER"**
- 💬 **Expected replies** — every phrase can show what the other person is likely to answer
- 📺 **Show-screen mode** — the phone flips to large text that the other person can read, with tappable answers
- 🏷️ Dialogs are tagged **SIZDEN SORARLAR** ("they will ask you") and **SIZIŇ JOGABYŇYZ** ("your answer")
- 🌍 **3 content pairs**: Turkmen ↔ Chinese (with pinyin), Turkmen ↔ English, Turkmen ↔ Russian
- 🗺️ **5 interface languages**: Turkmen, Chinese, Russian, English and Turkish. 26 more are already translated in the code and will be unlocked later, once their missing interface keys are completed
- 📴 **Fully offline** — no internet, no accounts, zero network calls
- 🆓 100% free, no ads, no tracking

The scenarios are grouped into two wings:

| Wing | Scenarios |
|------|-----------|
| ✈️ **Men gidýärin** — "I am traveling" | Airport · Transport · Hotel · Food · Shopping · Money · Health · Problems (8) |
| 🏡 **Myhman geldi** — "A guest arrived" | Directions · Taxi driver · Seller · Hospitality · Helping a tourist (5) |

## 📴 Why offline-first?

Internet in Turkmenistan can be slow or absent, older people who only speak Russian still need to be understood, and a tourist needs an answer in seconds — not a loading spinner. Being offline-first is not a missing feature; it is the core design decision of the app.

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Expo SDK 54](https://expo.dev) + [React Native 0.81](https://reactnative.dev) |
| Language | [TypeScript 5.9](https://www.typescriptlang.org) (strict mode) |
| Navigation | [React Navigation 7](https://reactnavigation.org) (Stack) |
| Storage | AsyncStorage (local-first) |
| Build | [EAS Build](https://expo.dev/eas) |

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- [Git](https://git-scm.com)
- [Android Studio](https://developer.android.com/studio) (for the Android emulator) or [Xcode](https://developer.apple.com/xcode/) (for the iOS simulator)

### Installation

```bash
# Clone the repository
git clone https://github.com/Shapak-Apps/turkmen-phrasebook.git
cd turkmen-phrasebook

# Install dependencies
npm install

# Start the app
npx expo start
```

### Other commands

```bash
npm start          # Start the Metro bundler
npm run android    # Run on an Android emulator/device
npm run ios        # Run on the iOS simulator (macOS only)
npm test           # Run tests
```

More details in the [Contributing Guide](./CONTRIBUTING.md).

## 📁 Project Structure

```
turkmen-phrasebook/
├── src/
│   ├── config/            # languages.config.ts — interface languages (5 available, 26 locked)
│   ├── data/
│   │   └── scenarios/     # the corpus: skeleton.ts + texts/{tk,ru,en,zh}.ts
│   ├── features/
│   │   └── scenarios/     # scenario screens, show-screen mode, ui-labels.ts
│   └── navigation/        # AppNavigator.tsx (Stack)
├── assets/                # logo, screenshots, store assets
├── android/               # native Android project
├── ios/                   # native iOS project
└── App.tsx                # entry point
```

## 🗺️ Roadmap (planned — not in the app yet)

- 📝 Text translator
- 🎤 Voice translator
- 📷 Visual translator (OCR + translate)
- 🤖 AI assistants

Everything in this list is a plan for future versions. None of it exists in the current release.

## 🤝 Contributing

We welcome contributions of all kinds — from fixing typos to improving phrases!

Read our **[Contributing Guide](./CONTRIBUTING.md)** for:

- How to set up the project locally
- How to submit a pull request
- Coding conventions
- "Good first issue" tags for newcomers

**Good first issues:**

- Add or complete an interface translation (26 languages are waiting to be unlocked)
- Fix a typo, improve a phrase, polish a screen
- Write unit tests for existing code

Found a bug or have a feature idea? **[Open an issue](https://github.com/Shapak-Apps/turkmen-phrasebook/issues)**.

## 📲 Download the App

<div align="center">

<a href="https://apps.apple.com/app/ykjam-terjime/id6758071845"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" height="50" alt="Download on the App Store" /></a>&nbsp;<a href="https://play.google.com/store/apps/details?id=com.shapak.translator"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" height="50" alt="Get it on Google Play" /></a>

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

---

<div align="center">

Made with ❤️ in Turkmenistan — for the Turkmen language community.

**[⭐ Star us on GitHub](https://github.com/Shapak-Apps/turkmen-phrasebook)** to support open-source development in Turkmenistan.

</div>
