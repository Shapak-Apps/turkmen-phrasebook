# STATUS - Ykjam Terjime (Türkmen Gepleşik kitaby)
**Last Updated:** April 18, 2026

---

## Статус v1.0.2:
- App Store: ✅ Опубликовано (январь 2026)
- Google Play: ✅ Опубликовано (19.03.2026), v1.0.2 (versionCode 5) — IARC рейтинг активен
- IARC Global Rating ID: 01ac1b83-da19-8222-8b50-3f056fad5d5a

## Android Developer Verification (18.04.2026):
- ✅ `com.shapak.translator` автоматически зарегистрирован Google (зелёная галочка в Play Console)
- Распространяется только через Google Play → дополнительных действий не требуется
- Подпись: один keystore `ykjam-terjime.jks` (SHA1: CA:46:29:FA:08:B6:3B:DC:70:D0:8E:5F:68:56:E3:72:F1:66:C7:BC)

## Готовится v1.0.3 (багфиксы + блокировка):
- [x] Исправлен Onboarding — белый фон вместо синего (текст был невидимый)
- [x] Исправлен Visual/Voice Translator — текст фич не отображался рядом с иконками
- [x] Исправлен Dictionary — невидимая стрелка назад
- [x] Заблокированы языки — открыты только: 🇨🇳 Китайский, 🇷🇺 Русский, 🇬🇧 Английский, 🇹🇷 Турецкий (+🇹🇲 Туркменский)
- [x] AI раздел закрыт из MainHub — Coming Soon v2.0
- [x] AI кнопка убрана из CategoryScreen (inline "sparkles" рядом с каждой фразой) — 18.04.2026
- [x] `AskAIScreen` удалён из `AppNavigator` → `src/api/gemini.ts` больше не попадает в bundle v1.0.3
- [x] Заблокированы лишние Android permissions в `app.json`: CAMERA, RECORD_AUDIO, SYSTEM_ALERT_WINDOW, READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE (для соответствия Google Play Policy)
- [ ] Собрать билд и отправить в Google Play + App Store

## Secrets audit (18.04.2026):
- ✅ `.env` никогда не попадал в git
- ✅ В git отслеживается только `.env.example` (шаблон без реальных ключей)
- ✅ Keystore файлы, google-services.json, GoogleService-Info.plist отсутствуют в репе
- ✅ Hardcoded Google API ключи (`AIza…`) в коде не найдены
- ✅ **Gemini ключ отозван** 18.04.2026 в Google AI Studio (ключ `AIzaSyCh5HwwcBEetRRU_NW0w_3hjavhRjfsm2A` удалён)
- ✅ `.env` очищен — AI провайдер для v2.0 пока не выбран
- OCR Space ключ (free-tier, без привязки к аккаунту) оставлен как есть — риск минимальный

## Репозиторий:
- Рабочая папка: C:\Users\seydi\Shapak-Apps\turkmen-phrasebook
- GitHub: github.com/Shapak-Apps/turkmen-phrasebook
- Старый репо (TheSeydiCharyyev/TurkmenPhrasebook): ✅ Архивирован (09.04.2026)
- Секреты: .env (локально, не в GitHub)

## Keystore info:
- File: D:\2. SEYDI\5. Documents\Google Play Keystore\ykjam-terjime.jks
- Backup: C:\Users\seydi\ykjam-terjime-backup.jks
- Alias: upload
- Password: (в D:\2. SEYDI\5. Documents\Google Play Keystore\Keystore password.txt)
- EAS Credentials: Build Credentials qiYEFZe4Qu (Default)
- SHA1: CA:46:29:FA:08:B6:3B:DC:70:D0:8E:5F:68:56:E3:72:F1:66:C7:BC

## Google Play Console:
- Organization: Shapak-Apps
- App: Ykjam Terjime
- Package: com.shapak.translator

---

## Версия 2.0 — Фокус: Идеальный разговорник

### Концепция:
- Находим лучшие русско-X разговорники для каждого языка
- Команда переводит русскую часть на туркменский
- Каждый язык может иметь разный объём фраз — это нормально
- Проект open source — сообщество будет развивать дальше

### Подход:
```
Русско-X разговорник (издательство)  →  команда переводит  →  Туркменско-X разговорник
```

---

## TODO v2.0:
- [ ] Скачать и проверить качество каждого разговорника Фазы 1
- [ ] Определить формат для передачи команде переводчиков
- [ ] Перевести русскую часть на туркменский (команда)
- [ ] Определить финальную структуру категорий и фраз
- [ ] Записать аудио произношение
- [ ] Изменить лого приложения
- [ ] Улучшить UI (не адаптированы: DictionaryScreen, LanguagePairSelectionScreen, AdditionalFeaturesScreen, PhraseDetailScreen, AskAIScreen)
- [ ] Открыть остальные языки по мере готовности контента
- [ ] Вернуть AI раздел (выбрать провайдера: Gemini / другой)

---

## Источники разговорников (29 языков найдено)

### Фаза 1 — Популярные языки

| # | Язык | Лучший источник | Формат | Объём |
|---|------|----------------|--------|-------|
| 1 | Английский | Окошкина Е.В. (АСТ) — rulit.me | PDF | 256 стр. |
| 2 | Немецкий | Audio-class.ru + PDF | Веб+PDF+аудио | 200-400 фраз |
| 3 | Французский | Сорокин, Никитина (1991) — obuchalka.org | PDF | 274 стр. |
| 4 | Испанский | Razgovornik.net | PDF+MP3 | 300-500 фраз |
| 5 | Итальянский | Razgovornik.net | PDF+MP3 | 200+ фраз |
| 6 | Турецкий | Go2Turkey.ru | PDF/DJVU | 220 стр. |
| 7 | Португальский | Razgovornik.net | PDF/DOC | ~250 стр. |
| 8 | Польский | Лазарева Е.И. (АСТ) — rulit.me | PDF | 224 стр. |
| 9 | Нидерландский | Wikivoyage + flytimer.ru | Веб+PDF | Средний |
| 10 | Китайский | Цудин И.С. — alleng.org | PDF | 208 стр. |
| 11 | Японский | Nihon-Go.ru + TravelAsk PDF | Веб+PDF | Обширный |
| 12 | Корейский | FlyTimer.ru + Wikivoyage | PDF/DOC | Компактный |
| 13 | Арабский | Янин Е. (Феникс) — aventa.com.ua PDF | PDF | 192 стр. |
| 14 | Украинский | Лазарева Е.И. — obuchalka.org | PDF/DJVU | Полная книга |

### Фаза 2 — СНГ и Центральная Азия

| # | Язык | Лучший источник | Формат | Объём |
|---|------|----------------|--------|-------|
| 15 | Узбекский | Узбекско-русский разговорник (2007) — obuchalka.org | PDF/DJVU | Полная книга |
| 16 | Казахский | Razgovornik.net | PDF | Обширный |
| 17 | Азербайджанский | Фарзалиев А. (КАРО) + razgovornik.net | PDF | Полная книга |
| 18 | Кыргызский | Рахманов Ч. (КАРО, 2014) | PDF | 144 стр. |
| 19 | Таджикский | Razgovornik.net (1990) | PDF | 108 стр. |
| 20 | Армянский | Чарчоглян (КАРО) + tert.nla.am PDF | PDF | Полная книга |
| 21 | Грузинский | Вахтангашвили Е.А. (2006) + razgovornik.net | PDF/DJVU | Полная книга |

### Фаза 3 — Азия и сложные

| # | Язык | Лучший источник | Формат | Объём |
|---|------|----------------|--------|-------|
| 22 | Хинди | Костина Е.А. (КАРО) + flytimer.ru | PDF | Полная книга |
| 23 | Персидский | Наджафов Г.Г. + flytimer.ru | PDF | Полная книга |
| 24 | Тайский | Razgovornik.net (2000) | PDF | 174 стр. |
| 25 | Вьетнамский | Лутик Е.В. (КАРО) + razgovornik.net | PDF | Полная книга |
| 26 | Индонезийский | Razgovornik.net + flytimer.ru | PDF/DOC | Компактный |
| 27 | Малайский | Razgovornik.net + flytimer.ru | PDF/DOC | Компактный |
| 28 | Урду | Rough Guide Hindi/Urdu Phrasebook — archive.org (англо-урду) | PDF | Полная книга |
| 29 | Пушту | Лебедев К.А. (Русский язык-Медиа, 2004) | PDF | 217 стр. |

---

## Универсальные сайты-источники:
- **razgovornik.net** — онлайн + скачивание PDF/DJVU/MP3
- **flytimer.ru** — компактные PDF/DOC/TXT
- **travelask.ru** — онлайн с транскрипцией
- **Wikivoyage** — открытый, обновляемый сообществом
- **obuchalka.org / alleng.org** — электронные библиотеки с книгами
