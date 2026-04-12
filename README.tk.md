<div align="center">

<img src="./assets/logo.png" alt="Ykjam Terjime" width="120" />

# Ykjam Terjime

**Türkmençe üçin 5+ dilde gepleşik kitaby we dil kömekçisi**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Expo SDK](https://img.shields.io/badge/Expo_SDK-54-000020.svg?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB.svg?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

[🇬🇧 English](./README.md) · [🇷🇺 По-русски](./README.ru.md)

</div>

---

**Ykjam Terjime** türkmen dilinde gepleýänler üçin döredilen mugt, oflaýn işleýän gepleşik kitaby we dil kömekçisidir. Hytaý, rus, iňlis we türk dillerinde öwren we gürleş — ses aýdylyşy, halan fralarym, gözleg we başga-da köp funksiýalar bilen.

**[Shapak-Apps](https://github.com/Shapak-Apps)** — Türkmenistanyň ilkinji açyk kodly (open-source) guramasynyň bir bölegi.

## 📱 Ekran şekilleri

<div align="center">
<img src="./assets/screenshots/1.jpg" width="240" />
<img src="./assets/screenshots/2.jpg" width="240" />
<img src="./assets/screenshots/3.jpg" width="240" />
</div>

## ✨ Mümkinçilikler

- 🗣️ **293 fraza** — **22 kategoriýada** (50+ kiçi kategoriýa)
- 🌍 **5 dil**: 🇹🇲 türkmen, 🇨🇳 hytaý, 🇷🇺 rus, 🇬🇧 iňlis, 🇹🇷 türk
- 🔊 **306 ses faýly** — ene dilinde aýdylyşy (M4A)
- 📴 **Doly oflaýn** — internet gerek däl
- 🈲 **Pinyin transkripsiýasy** hytaý frazalary üçin
- ⭐ **Halanlar, statistika, doly tekst gözlegi**
- 🎨 **Arassa, minimalistik dizaýn** (Lingify stilinde)
- 🆓 **100% mugt, mahabatsyz, yzarlamasyz**

**v2.0 wersiýasynda:** ýene 25 dil (nemes, fransuz, ispan, ýapon, koreý, arap we başg.), AI-terjimeçi, wizual terjimeçi.

## 🛠 Tehnologiýalar

| Gat | Tehnologiýa |
|-----|-------------|
| Freýmwork | [Expo SDK 54](https://expo.dev) + [React Native 0.81](https://reactnative.dev) |
| Dil | [TypeScript 5.9](https://www.typescriptlang.org) (strict) |
| Nawigasiýa | [React Navigation 7](https://reactnavigation.org) (Stack + Bottom Tabs) |
| Ammar | AsyncStorage (lokal) |
| Ses | expo-av (lokal MP3 + Expo Speech) |
| Terjime API | [MyMemory](https://mymemory.translated.net) + [LibreTranslate](https://libretranslate.com) |
| Gurnama | [EAS Build](https://expo.dev/eas) |

## 🚀 Başlamak

### Zerurlyklar

- [Node.js](https://nodejs.org) 20+
- [Git](https://git-scm.com)
- [Android Studio](https://developer.android.com/studio) (Android emulýator üçin) ýa-da [Xcode](https://developer.apple.com/xcode/) (iOS simulýator üçin)
- [Expo CLI](https://docs.expo.dev/more/expo-cli/) (`npx` arkaly awtomatiki gurulýar)

### Gurnama

```bash
# Repozitoriýany klonlaýarys
git clone https://github.com/Shapak-Apps/turkmen-phrasebook.git
cd turkmen-phrasebook

# Bagalylyklary gurýarys
npm install

# .env faýlyny döredýäris (islege görä, AI üçin)
cp .env.example .env
# Gerek bolsa .env faýlyny açyp, API açarlaryňyzy goşuň
```

### Programmany işletmek

```bash
# Metro bundler-ni başladýarys
npm start

# Soňra:
#   `a` basyň — Android emulýatorda açylar
#   `i` basyň — iOS simulýatorda açylar
#   `w` basyň — brauzerde açylar
```

Ýa-da enjamda gönüden-göni işletmek:

```bash
npm run android    # Android
npm run ios        # iOS (diňe macOS)
```

### Beýleki buýruklar

```bash
npm test           # Testleri işletmek
npm run lint       # Kody barlamak
npm run lint:fix   # Lint ýalňyşlaryny düzetmek
```

## 📁 Proýekt gurluşy

```
turkmen-phrasebook/
├── src/
│   ├── api/             # Terjime API klientleri
│   ├── components/      # Gaýtadan ulanylýan UI-komponentler
│   ├── contexts/        # React kontekstler (dil, konfig)
│   ├── data/            # Frazalar, kategoriýalar, terjimeler
│   ├── features/        # Funksiýa modullary (terjimeçi, AI, halanlar)
│   ├── navigation/      # Nawigasiýa konfigurasiýasy
│   ├── screens/         # Programmanyň ekranlary
│   ├── services/        # Biznes-logika hyzmatlary
│   └── utils/           # Kömekçi funksiýalar
├── assets/              # Suratlar, ikonalar, ses faýllary
├── android/             # Native Android proýekti
├── ios/                 # Native iOS proýekti
└── App.tsx              # Giriş nokady
```

## 🤝 Goşant goşmak

Biz islendik goşantlary kabul edýäris — harp ýalňyşyny düzetmekden başlap, täze dilleri goşmaga çenli!

**[Goşant goşmak boýunça gollanma](./CONTRIBUTING.md)** okaň — şol ýerde bar:

- Proýekti nädip lokal gurmaly
- Pull request-i nädip tabşyrmaly
- Kod ýazmak düzgünleri
- Täze gelenler üçin «good first issue» bellikleri

**Täze başlaýanlar üçin gowy wezipeler:**
- Täze dile terjime goşmak
- Bar bolan frazalar üçin ses aýdylyşyny ýazga almak
- Harp ýalňyşyny düzetmek, ikonany gowulandyrmak, ekrany timarlamak
- Bar bolan kod üçin unit-test ýazmak

Säwlik tapdyňyzmy ýa-da pikiriňiz barmy? **[Issue açyň](https://github.com/Shapak-Apps/turkmen-phrasebook/issues)**.

## 📲 Programmany göçürip almak

<div align="center">

[<img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" height="50" />](https://apps.apple.com/app/ykjam-terjime/id6758071845)
&nbsp;
[<img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" height="72" />](https://play.google.com/store/apps/details?id=com.shapak.translator)

</div>

## 📄 Litsenziýa

Bu proýekt **MIT Litsenziýa** esasynda paýlanýar — [LICENSE](./LICENSE) faýlyna serediň.

Asyl awtorlyk belligini saklap, bu kody erkin ulanmaga, üýtgetmäge we paýlaşmaga hukugyňyz bar.

## 👤 Awtor

**Seýdi Çaryýew**
- 📧 E-poçta: [seydi.charyev@gmail.com](mailto:seydi.charyev@gmail.com)
- 🐙 GitHub: [@TheSeydiCharyyev](https://github.com/TheSeydiCharyyev)
- 🏢 Gurama: [Shapak-Apps](https://github.com/Shapak-Apps)

## 🙏 Minnetdarlyk

- [Expo](https://expo.dev) — kross-platforma mobil programmalary döretmegiň iň çalt ýoly
- Ikonalar: [Ionicons](https://ionic.io/ionicons)
- Terjime API: [MyMemory](https://mymemory.translated.net) we [LibreTranslate](https://libretranslate.com)

---

<div align="center">

Türkmenistanda ❤️ bilen ýasaldy — türkmen dili jemgyýeti üçin.

**[⭐ GitHub-da ýyldyz goýuň](https://github.com/Shapak-Apps/turkmen-phrasebook)** — Türkmenistanda açyk kody goldaň.

</div>
