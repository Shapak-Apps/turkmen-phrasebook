<div align="center">
<img src="./assets/logo.png" alt="Ykjam Terjime" width="120" />

# Ykjam Terjime

**A scenario-based Turkmen phrasebook — for travelers, and for those who host them.**

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Expo](https://img.shields.io/badge/Expo_SDK-54-000020.svg?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB.svg?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![Offline First](https://img.shields.io/badge/Offline-100%25-success.svg)](#-why-offline-first)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

[🇷🇺 По-русски](./README.ru.md) · [🇹🇲 Türkmençe](./README.tk.md)
</div>

**Ykjam Terjime** ("Ready Translation" in Turkmen) is a free, 100% offline phrasebook app. Instead of a dictionary you have to search, it gives you **295 curated, real-life phrases** organized into **13 scenarios** you're actually likely to face — at the airport, in a taxi, at the market, or hosting a guest in your home.

Part of [Shapak-Apps](https://github.com/Shapak-Apps) — the first open-source organization in Turkmenistan.

---

## 📱 Screenshots

<div align="center">
  <img src="./assets/screenshots/1.jpg" width="240" />
  <img src="./assets/screenshots/2.jpg" width="240" />
  <img src="./assets/screenshots/3.jpg" width="240" />
  <img src="./assets/screenshots/4.jpg" width="240" />
  <img src="./assets/screenshots/5.jpg" width="240" />
  <img src="./assets/screenshots/6.jpg" width="240" />
</div>

---

## ✨ What's Inside

- 🗂️ **295 phrases** curated into **13 real-life scenarios** — no endless dictionary scrolling
- 🧭 Organized into **two wings**, so you pick the right mindset before you pick a phrase
- 🌍 **3 content language pairs**: Turkmen ↔ Chinese, Turkmen ↔ English, Turkmen ↔ Russian
- 🖥️ **5 interface languages** available now: Turkmen, Chinese, Russian, English, Turkish
- 🈶 **Pinyin transcription** for every Chinese phrase — readable without knowing Hanzi
- 💬 Phrase cards show both sides of the conversation, so you know what's coming
- 🔎 **Show-Screen Mode** — flip the phone around and let the other person read and tap
- 📴 **Fully offline** — zero network calls, zero waiting, zero data roaming
- 🆓 100% free, no ads, no tracking

> 🔊 Audio pronunciation and 🔤 dictionary-style search are not part of this release — see [Roadmap](#-roadmap).

### 🧳 The Two Wings

| Wing | Turkmen | Covers |
|------|---------|--------|
| ✈️ **I am traveling** | *Men syýahat edýärin* | Airport, transport, hotel, food, shopping, money, health, handling problems |
| 🏡 **A guest arrived** | *Gonaq geldi* | Giving directions, taxi driver mode, seller mode, hospitality, helping a tourist |

Together, the two wings cover **13 scenarios** and **295 phrases** — enough to get through nearly any everyday interaction, from either side of it.

### 💡 How a phrase card works

Each phrase is shown with color-coded context tags, so you always know whose line it is:

| Tag | Meaning |
|-----|---------|
| 🟠 **SIZDEN SORARLAR** | *"They will ask you"* — the question you should expect to hear |
| 🔵 **SIZIŇ JOGABYŇYZ** | *"Your answer"* — the reply you can give |

This turns the phrasebook into a rehearsal for the actual conversation, not just a list of translations.

---

## 📴 Why Offline-First

Ykjam Terjime does not make a single network request to show you a phrase. This is a deliberate design decision, not a missing feature:

- 🌐 **Internet in Turkmenistan is often slow, restricted, or unavailable.** A phrasebook that depends on a live connection fails exactly when it's needed most.
- 👵 **Many Russian-speaking elders navigating Turkmen-language settings don't have reliable data plans** and shouldn't need one just to communicate.
- ✈️ **Tourists rarely have local SIM cards or affordable roaming** the moment they land — that's precisely when they need an answer instantly, not after finding Wi-Fi.

Every phrase, every scenario, and both content languages are bundled into the app itself. Install it once, and it works exactly the same in an airport lounge, a rural taxi, or a house with no signal at all.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Expo SDK 54](https://expo.dev) + [React Native 0.81](https://reactnative.dev) |
| Language | [TypeScript 5.9](https://www.typescriptlang.org) (strict mode) |
| Navigation | [React Navigation 7](https://reactnavigation.org) (Stack + Bottom Tabs) |
| Storage | AsyncStorage (local-first, no backend) |
| Data | Static bundled JSON/TS corpus (`src/data/scenarios/`) |
| Build | [EAS Build](https://expo.dev/eas) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- [Git](https://git-scm.com)
- [Android Studio](https://developer.android.com/studio) (for Android emulator) or [Xcode](https://developer.apple.com/xcode/) (for iOS simulator)
- [Expo Go](https://expo.dev/go) app if you want to test on a physical device

### Installation

```bash 
# Clone the repository
git clone https://github.com/Shapak-Apps/turkmen-phrasebook.git
cd turkmen-phrasebook

# Install dependencies
npm install

## 🗺 Roadmap

The following are **planned for future major releases** and do not exist in the app yet:

- 🌐 Text Translator
- 🎙️ Voice Translator
- 📷 Visual Translator (OCR-based)
- 🤖 AI Assistant
- 🔊 Native pronunciation audio
- 🔓 Unlocking the remaining **26 interface languages** already translated in code, but currently locked in the picker pending missing keys

---

## 🤝 Contributing

We welcome contributions of all kinds — from fixing typos to adding new scenarios and languages.

Read our **[Contributing Guide](./CONTRIBUTING.md)** for:

- How to set up the project locally
- How to submit a pull request
- Coding conventions
- "Good first issue" tags for newcomers

**Good first issues:**

- Add or refine phrases for an existing scenario
- Help unlock one of the 26 pending interface languages
- Fix a typo, improve an icon, polish a screen
- Write unit tests for existing code

Found a bug or have a feature idea? **[Open an issue](https://github.com/Shapak-Apps/turkmen-phrasebook/issues)**.

---

## 📲 Download the App

<div align="center">

<a href="https://apps.apple.com/app/ykjam-terjime/id6758071845"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" height="50" alt="Download on the App Store" /></a>&nbsp;<a href="https://play.google.com/store/apps/details?id=com.shapak.translator"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" height="50" alt="Get it on Google Play" /></a>

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

You are free to use, modify, and distribute this software, as long as the original copyright notice is preserved.

## 👤 Author

**Seydi Charyyev**
- 📧 Email: [seydi.charyev@gmail.com](mailto:seydi.charyev@gmail.com)
- 🐙 GitHub: [@TheSeydiCharyyev](https://github.com/TheSeydiCharyyev)
- 🏢 Organization: [Shapak-Apps](https://github.com/Shapak-Apps)