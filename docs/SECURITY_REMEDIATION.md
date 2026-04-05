# Устранение проблем безопасности API-ключей

## Статус проверки

| Проблема | Статус |
|----------|--------|
| Старый Gemini ключ в git-истории | УТЕЧКА (устранено) |
| `.env` в `.gitignore` | OK |
| Текущий `GEMINI_API_KEY` в git-истории | OK |
| `OCR_SPACE_API_KEY` в git-истории | OK |

---

## Шаг 1. Отозвать скомпрометированный ключ

Ключ `***REDACTED***` виден в публичной git-истории. Его нужно немедленно отозвать.

1. Открой [Google Cloud Console → API & Services → Credentials](https://console.cloud.google.com/apis/credentials)
2. Найди ключ, начинающийся с `старый Gemini ключ`
3. Нажми на него → **Delete** (или **Revoke** если это сервисный аккаунт)
4. Если ключ уже не существует в консоли — он мог быть удалён автоматически Google

> Если этот ключ ещё активен, **отзови его прямо сейчас** — это самый важный шаг.

---

## Шаг 2. Ограничить текущий GEMINI_API_KEY

Текущий ключ `текущий Gemini ключ` не утёк, но его нужно ограничить.

1. Открой [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Найди ключ `текущий Gemini ключ`
3. Нажми **Edit** (карандаш)
4. В разделе **API restrictions**:
   - Выбери **Restrict key**
   - Отметь только **Generative Language API** (Gemini)
5. В разделе **Application restrictions** (опционально):
   - Для мобильного приложения: ограничь по Android package name / iOS bundle ID
   - Для разработки: ограничь по IP-адресу
6. Нажми **Save**

---

## Шаг 3. Очистить git-историю от утёкшего ключа

Даже после отзыва ключа, лучше убрать его из истории.

### Вариант А: С помощью git filter-repo (рекомендуется)

```bash
# Установить git-filter-repo (если нет)
pip install git-filter-repo

# Создать файл замены
echo "***REDACTED***==>***REDACTED_API_KEY***" > replacements.txt

# Выполнить замену во всей истории
git filter-repo --replace-text replacements.txt

# Принудительно отправить на GitHub
git push origin --force --all

# Удалить файл замены
rm replacements.txt
```

### Вариант Б: Удалить файл test-gemini.js из истории целиком

Если файл `test-gemini.js` больше не нужен:

```bash
git filter-repo --path test-gemini.js --invert-paths
git push origin --force --all
```

> **Важно:** После force push все коллабораторы должны сделать `git clone` заново.

---

## Шаг 4. Настроить защиту от повторных утечек

### 4.1. Добавить pre-commit хук

Создай файл `.githooks/pre-commit`:

```bash
#!/bin/bash
# Проверка на наличие API ключей в коммите
if git diff --cached --diff-filter=ACM | grep -qE "AIzaSy[a-zA-Z0-9_-]{33}"; then
    echo "ERROR: Обнаружен Google API ключ в коммите!"
    echo "Используйте .env файл для хранения ключей."
    exit 1
fi
```

Активируй:

```bash
git config core.hooksPath .githooks
chmod +x .githooks/pre-commit
```

### 4.2. Проверить .gitignore

Убедись, что в `.gitignore` есть:

```
.env
.env*.local
*.keystore
google-services.json
```

---

## Шаг 5. Настроить оповещения в Google Cloud

1. Открой [Billing → Budgets & alerts](https://console.cloud.google.com/billing/budgets)
2. Создай бюджет с порогами 50%, 90%, 100%
3. Укажи email для уведомлений
4. Открой [Essential Contacts](https://console.cloud.google.com/iam-admin/essential-contacts)
5. Добавь свой email в категорию **Security**

---

## Шаг 6. Аудит неиспользуемых ключей

1. Открой [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Проверь столбец **Last used** для каждого ключа
3. Ключи, не использовавшиеся >30 дней — удали
4. `GOOGLE_VISION_API_KEY` в `.env` пустой — если не планируешь использовать, удали строку из `.env` и `.env.example`

---

## Чеклист

- [x] Отозвать скомпрометированный ключ `старый Gemini ключ`
- [x] Ограничить текущий `GEMINI_API_KEY` по API (уже был ограничен)
- [x] Очистить git-историю (filter-repo)
- [x] Добавить pre-commit хук
- [x] ~~Настроить бюджетные оповещения~~ (пропущено — бесплатный тариф)
- [x] Убрать `GOOGLE_VISION_API_KEY` из `.env`
