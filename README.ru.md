<div align="center">
<img src="./assets/logo.png" alt="Ykjam Terjime" width="120" />

# Ykjam Terjime

Оффлайн-разговорник на основе сценариев — 295 отобранных фраз в 13 жизненных ситуациях, туркменский в паре с китайским, английским или русским

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Expo](https://img.shields.io/badge/Expo_SDK-54-000020.svg?logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB.svg?logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6.svg?logo=typescript)](https://www.typescriptlang.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

[🇬🇧 English](./README.md) · [🇹🇲 Türkmençe](./README.tk.md)
</div>

Ykjam Terjime («готовый перевод» с туркменского) — бесплатный оффлайн-разговорник, построенный вокруг сценариев. Вместо списков слов — 13 жизненных сценариев и 295 отобранных фраз: туркменский в паре с китайским, английским или русским. Интерфейс доступен на 5 языках, и приложение не делает ни одного сетевого запроса.

Часть [Shapak-Apps](https://github.com/Shapak-Apps) — первой open-source организации в Туркменистане.

## 📱 Скриншоты

<div align="center">
  <img src="./assets/screenshots/1.jpg" width="240" />
  <img src="./assets/screenshots/2.jpg" width="240" />
  <img src="./assets/screenshots/3.jpg" width="240" />
  <img src="./assets/screenshots/4.jpg" width="240" />
  <img src="./assets/screenshots/5.jpg" width="240" />
  <img src="./assets/screenshots/6.jpg" width="240" />
</div>

## ✨ Что умеет приложение сегодня

- 🎭 **13 жизненных сценариев** и **295 отобранных фраз** — 260 внутри сценариев плюс 35 в ядре выживания, которое приложение показывает отдельным разделом **«IŇ GEREK SÖZLEMLER»**
- 💬 **Ожидаемые ответы** — у каждой фразы может быть показано, что скорее всего ответит собеседник
- 📺 **Режим «покажи экран»** — телефон поворачивается к собеседнику крупным текстом, ответы можно нажимать
- 🏷️ Диалоги помечены тегами **SIZDEN SORARLAR** («вас спросят») и **SIZIŇ JOGABYŇYZ** («ваш ответ»)
- 🌍 **3 языковые пары**: туркменский ↔ китайский (с пиньинем), туркменский ↔ английский, туркменский ↔ русский
- 🗺️ **5 языков интерфейса**: туркменский, китайский, русский, английский и турецкий. Ещё 26 уже переведены в коде и откроются позже, когда будут заполнены недостающие строки интерфейса
- 📴 **Полный оффлайн** — без интернета, аккаунтов и сетевых запросов
- 🆓 100% бесплатно, без рекламы и трекинга

Сценарии сгруппированы в два крыла:

| Крыло | Сценарии |
|-------|----------|
| ✈️ **Men gidýärin** — «Я путешествую» | Аэропорт · Транспорт · Отель · Еда · Покупки · Деньги · Здоровье · Проблемы (8) |
| 🏡 **Myhman geldi** — «Пришёл гость» | Объяснить дорогу · Таксист · Продавец · Гостеприимство · Помощь туристу (5) |

## 📴 Почему оффлайн — прежде всего?

Интернет в Туркменистане бывает медленным или отсутствует вовсе; пожилым людям, говорящим только по-русски, важно быть понятыми; а туристу ответ нужен за секунды, а не со спиннером загрузки. Оффлайн — не отсутствующая функция, а осознанное проектное решение приложения.

## 🛠 Технологии

| Слой | Технология |
|------|------------|
| Фреймворк | [Expo SDK 54](https://expo.dev) + [React Native 0.81](https://reactnative.dev) |
| Язык | [TypeScript 5.9](https://www.typescriptlang.org) (strict mode) |
| Навигация | [React Navigation 7](https://reactnavigation.org) (Stack) |
| Хранилище | AsyncStorage (local-first) |
| Сборка | [EAS Build](https://expo.dev/eas) |

## 🚀 Начало работы

### Требования

- [Node.js](https://nodejs.org) 20+
- [Git](https://git-scm.com)
- [Android Studio](https://developer.android.com/studio) (для эмулятора Android) или [Xcode](https://developer.apple.com/xcode/) (для симулятора iOS)

### Установка

```bash
# Клонируем репозиторий
git clone https://github.com/Shapak-Apps/turkmen-phrasebook.git
cd turkmen-phrasebook

# Ставим зависимости
npm install

# Запускаем приложение
npx expo start
```

### Другие команды

```bash
npm start          # Запустить Metro bundler
npm run android    # Запуск на эмуляторе/устройстве Android
npm run ios        # Запуск на симуляторе iOS (только macOS)
npm test           # Запустить тесты
```

Подробнее — в [гайде контрибьютора](./CONTRIBUTING.md).

## 📁 Структура проекта

```
turkmen-phrasebook/
├── src/
│   ├── config/            # languages.config.ts — языки интерфейса (5 доступны, 26 заблокированы)
│   ├── data/
│   │   └── scenarios/     # корпус: skeleton.ts + texts/{tk,ru,en,zh}.ts
│   ├── features/
│   │   └── scenarios/     # экраны сценариев, режим «покажи экран», ui-labels.ts
│   └── navigation/        # AppNavigator.tsx (Stack)
├── assets/                # логотип, скриншоты, материалы для сторов
├── android/               # нативный Android-проект
├── ios/                   # нативный iOS-проект
└── App.tsx                # точка входа
```

## 🗺️ Дорожная карта (запланировано — в приложении ещё нет)

- 📝 Текстовый переводчик
- 🎤 Голосовой переводчик
- 📷 Визуальный переводчик (OCR + перевод)
- 🤖 AI-ассистенты

Всё в этом списке — планы на будущие версии. В текущем релизе этого нет.

## 🤝 Как внести вклад

Мы рады любому вкладу — от исправления опечаток до улучшения фраз!

Читай **[гайд контрибьютора](./CONTRIBUTING.md)** — там описано:

- Как настроить проект локально
- Как оформить pull request
- Конвенции кода
- Метки «good first issue» для новичков

**Хорошие задачи для новичков:**

- Добавить или дополнить перевод интерфейса (26 языков ждут разблокировки)
- Исправить опечатку, улучшить фразу, отполировать экран
- Написать unit-тесты для существующего кода

Нашёл баг или есть идея? **[Открой issue](https://github.com/Shapak-Apps/turkmen-phrasebook/issues)**.

## 📲 Скачать приложение

<div align="center">

<a href="https://apps.apple.com/app/ykjam-terjime/id6758071845"><img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" height="50" alt="Скачать в App Store" /></a>&nbsp;<a href="https://play.google.com/store/apps/details?id=com.shapak.translator"><img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" height="50" alt="Скачать в Google Play" /></a>

</div>

## 📄 Лицензия

Проект распространяется под лицензией **MIT** — см. файл [LICENSE](./LICENSE).

Ты можешь свободно использовать, изменять и распространять этот код, сохраняя оригинальное упоминание авторских прав.

## 👤 Автор

**Сейди Чарыев**
- 📧 Email: [seydi.charyev@gmail.com](mailto:seydi.charyev@gmail.com)
- 🐙 GitHub: [@TheSeydiCharyyev](https://github.com/TheSeydiCharyyev)
- 🏢 Организация: [Shapak-Apps](https://github.com/Shapak-Apps)

## 🙏 Благодарности

- Собрано на [Expo](https://expo.dev) — самый быстрый способ создавать кросс-платформенные мобильные приложения
- Иконки — [Ionicons](https://ionic.io/ionicons)

---

<div align="center">

Сделано с ❤️ в Туркменистане — для сообщества туркменского языка.

**[⭐ Поставь звезду на GitHub](https://github.com/Shapak-Apps/turkmen-phrasebook)**, чтобы поддержать open-source в Туркменистане.

</div>
