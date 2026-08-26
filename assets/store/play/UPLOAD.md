# Play Console upload checklist (issue #29)

For the person sitting in Play Console. Do the steps in order.
App: **Ykjam Terjime** (`com.shapak.translator`).
Images to upload are attached to issue #29 as a .zip (files named in upload order);
sources live in this folder.

## 1. Open the store listing

- EN: **Grow → Store presence → Main store listing**
- RU: **Развитие → Присутствие в Play Маркете → Основная страница в Play Маркете**

(If your RU UI wording differs slightly, follow the English path.)

## 2. Images (default card)

| Console field | File (zip name) | Source in repo |
| --- | --- | --- |
| App icon / Иконка приложения | `01-icon-512.png` | `assets/store/play/icon-512.png` |
| Feature graphic / Баннер | `02-feature-graphic.png` | `assets/store/play/feature-graphic.png` |
| Phone screenshots / Скриншоты (delete the old six first, upload in order) | `03-phone-1.png` … `08-phone-6.png` | `1-phone.png` … `6-phone.png` |

## 3. Text fields (from `store-listing.md`, Default listing)

| Console field | Takes |
| --- | --- |
| Short description / Краткое описание | «Short description» block — Turkmen |
| Full description / Полное описание | «Full description» block — one block as-is (Turkmen, blank line, English) |
| What's new / Что нового | «What's new» block — Turkmen |

## 4. Remove the 21 other languages

Language menu on the store listing page → manage translations → delete:
`ru, tr, zh, ar, es, fr, de, ja, ko, hi, it, pt, uk, kk, az, fa, id, vi, pl, nl, ms`.
Removing is reversible: those users then see the default card.

## 5. Final step

**Publishing overview / Обзор публикаций → send the changes for review / отправить на проверку.**
This is the step that failed last time. Until it is done, the store keeps the old listing.

## 6. After publishing

Open the public page a day or two later and compare the icon and the first screenshot.