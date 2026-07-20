# Устранение проблем безопасности API-ключей

## Статус проверки (аудит: Июль 2026)

| Проблема | Статус |
| --- | --- |
| Старый Gemini ключ в git-истории | ⚠️ Была утечка — устранено |
| `.env` в `.gitignore` | ✅ OK |
| Текущий `GEMINI_API_KEY` в git-истории | ✅ OK |
| `OCR_SPACE_API_KEY` в git-истории | ✅ OK |
| Аудио временно отключено (`AudioPlayer.tsx` → `audioDisabled = true`) | ✅ OK |
| AI (Gemini) — код интегрирован, в UI не выведен (планируется в v2.0) | ✅ OK |

## Шаг 1. Отозвать скомпрометированный ключ

Ключ `***REDACTED***` был виден в публичной git-истории. Он был немедленно отозван.

1. Открыт [Google Cloud Console → API & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Найден ключ, начинающийся с `старый Gemini ключ`
3. Нажат Delete (или Revoke если это сервисный аккаунт)
4. ✅ Ключ успешно отозван

## Шаг 2. Ограничить текущий GEMINI_API_KEY

Текущий ключ `***REDACTED***` не утёк, но был ограничен для безопасности.

1. Открыт [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Найден ключ `***REDACTED***`
3. Нажат Edit (карандаш)
4. В разделе **API restrictions**:
   - Выбран **Restrict key**
   - Отмечен только **Generative Language API (Gemini)**
5. В разделе **Application restrictions** (опционально):
   - Для мобильного приложения: ограничено по Android package name / iOS bundle ID
6. ✅ Нажат Save

## Шаг 3. Очистить git-историю от утёкшего ключа

Даже после отзыва ключа, он был убран из истории.

### Использован Вариант А: С помощью git filter-repo (рекомендуется)

```bash
# Установить git-filter-repo
pip install git-filter-repo

# Создать файл замены
echo "***REDACTED***==>***REDACTED_API_KEY***" > replacements.txt

# Выполнить замену во всей истории
git filter-repo --replace-text replacements.txt

# Принудительно отправить на GitHub
git push origin --force --all

# Удалить файл замены
rm replacements.txt

# После force push все коллабораторы должны сделать git clone заново.