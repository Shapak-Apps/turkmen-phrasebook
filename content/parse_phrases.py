# -*- coding: utf-8 -*-
"""Parse extracted.md → phrases.json with categoryId/subcategoryId mapping."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "extracted.md"
OUT_JSON = ROOT / "phrases.json"

# Mapping: heading text (normalized) -> (category_id, subcategory_id)
# subcategory_id None means phrase belongs directly to category
HEADING_MAP = {
    # 1. basic_phrases
    "Приветствие": ("basic", "basic_greetings"),
    "Обращение": ("basic", "basic_address"),
    "Знакомство": ("basic", "basic_introduction"),
    "Благодарность": ("basic", "basic_gratitude"),
    "Возможные ответы": ("basic", "basic_replies"),
    "Просьба": ("basic", "basic_request"),
    "Извинение": ("basic", "basic_apology"),
    "Поздравление": ("basic", "basic_congratulation"),
    "Приглашение": ("basic", "basic_invitation"),
    "Согласие": ("basic", "basic_agreement"),
    "Отказ, несогласие": ("basic", "basic_refusal"),
    "Отказ": ("basic", "basic_refusal"),
    "Несогласие": ("basic", "basic_refusal"),
    "Недоразумение": ("basic", "basic_misunderstanding"),
    "Сожаление, сочувствие": ("basic", "basic_regret"),
    "Сожаление": ("basic", "basic_regret"),
    "Сочувствие": ("basic", "basic_regret"),
    "Прощание": ("basic", "basic_farewell"),
    # 2. travel
    "Паспортный контроль. Таможня": ("travel", "travel_passport"),
    "Паспортный контроль": ("travel", "travel_passport"),
    "Таможня": ("travel", "travel_passport"),
    "В аэропорту, в самолете": ("travel", "travel_airport"),
    "В аэропорту, в самолёте": ("travel", "travel_airport"),
    "В аэропорту": ("travel", "travel_airport"),
    "В самолете": ("travel", "travel_airport"),
    "В самолёте": ("travel", "travel_airport"),
    "На вокзале, в поезде": ("travel", "travel_train"),
    "На вокзале": ("travel", "travel_train"),
    "В поезде": ("travel", "travel_train"),
    "Банк, обмен валюты": ("travel", "travel_bank"),
    "Банк": ("travel", "travel_bank"),
    "Обмен валюты": ("travel", "travel_bank"),
    # 3. hotel
    "Проживание в гостинице": ("hotel", "hotel_general"),
    "В гостинице": ("hotel", "hotel_general"),
    "Просьбы": ("hotel", "hotel_requests"),
    "Жалобы": ("hotel", "hotel_complaints"),
    # 4. restaurant
    "В ресторане": ("restaurant", "restaurant_general"),
    "Ресторан": ("restaurant", "restaurant_general"),
    "Закуски": ("restaurant", "restaurant_appetizers"),
    "Супы": ("restaurant", "restaurant_soups"),
    "Мясные блюда": ("restaurant", "restaurant_meat"),
    "Рыбные блюда": ("restaurant", "restaurant_fish"),
    "Овощи": ("restaurant", "restaurant_vegetables"),
    "Фрукты, орехи, ягоды": ("restaurant", "restaurant_fruits"),
    "Фрукты": ("restaurant", "restaurant_fruits"),
    "Спиртные напитки": ("restaurant", "restaurant_alcohol"),
    "Безалкогольные напитки": ("restaurant", "restaurant_soft_drinks"),
    "Десерты": ("restaurant", "restaurant_desserts"),
    # 5. communication
    "Почта, телеграф, телефон": ("communication", "communication_general"),
    "Почта": ("communication", "communication_general"),
    "Телеграф": ("communication", "communication_general"),
    "Телефон": ("communication", "communication_general"),
    # 6. city
    "Пребывание в городе": ("city", "city_general"),
    "Осмотр достопримечательностей": ("city", "city_sightseeing"),
    "Городской транспорт": ("city", "city_transport"),
    # 7. shopping
    "Магазин": ("shopping", "shopping_general"),
    "Одежда": ("shopping", "shopping_clothing"),
    "Обувь": ("shopping", "shopping_shoes"),
    "Галантерея, парфюмерия": ("shopping", "shopping_perfumery"),
    "Галантерея": ("shopping", "shopping_perfumery"),
    "Парфюмерия": ("shopping", "shopping_perfumery"),
    "Ткани": ("shopping", "shopping_fabrics"),
    "Постельные принадлежности": ("shopping", "shopping_bedding"),
    "Бытовая техника": ("shopping", "shopping_appliances"),
    "Книги, канцтовары": ("shopping", "shopping_books"),
    "Книги": ("shopping", "shopping_books"),
    "Канцтовары": ("shopping", "shopping_books"),
    "Цветы": ("shopping", "shopping_flowers"),
    "Табак": ("shopping", "shopping_tobacco"),
    "Подарки и посуда": ("shopping", "shopping_gifts"),
    "Подарки": ("shopping", "shopping_gifts"),
    "Посуда": ("shopping", "shopping_gifts"),
    # 8. leisure
    "Развлечения, отдых": ("leisure", "leisure_general"),
    "Развлечения и отдых": ("leisure", "leisure_general"),
    "Развлечения": ("leisure", "leisure_general"),
    "Театр": ("leisure", "leisure_theater"),
    "Кино": ("leisure", "leisure_cinema"),
    "Концерт": ("leisure", "leisure_concert"),
    "В музее": ("leisure", "leisure_museum"),
    "Спорт": ("leisure", "leisure_sports"),
    # 9. medicine
    "Медицинская помощь": ("medicine", "medicine_general"),
    "У врача": ("medicine", "medicine_doctor"),
    "В аптеке": ("medicine", "medicine_pharmacy"),
    # 10. business
    "Экономическое сотрудничество": ("business", "business_general"),
    "Конференции": ("business", "business_conferences"),
    "Техническая выставка": ("business", "business_exhibition"),
    "Деловые переговоры": ("business", "business_negotiations"),
    # 11. about_me
    "Общение. О себе": ("about", "about_general"),
    "О себе": ("about", "about_general"),
    "Имя, возраст": ("about", "about_name_age"),
    "Местожительство": ("about", "about_residence"),
    "Семья": ("about", "about_family"),
    "Работа": ("about", "about_work"),
    "Иностранные языки": ("about", "about_languages"),
    # 12. measurements
    "Система мер и весов": ("measurements", "measurements_general"),
    "Длина": ("measurements", "measurements_length"),
    "Вес": ("measurements", "measurements_weight"),
    "Объём": ("measurements", "measurements_volume"),
    "Объем": ("measurements", "measurements_volume"),
    "Китайские меры": ("measurements", "measurements_chinese"),
    # 13. appendix
    "Приложение": ("appendix", "appendix_general"),
    "Время": ("appendix", "appendix_time"),
    "Дни недели": ("appendix", "appendix_weekdays"),
    "Месяцы": ("appendix", "appendix_months"),
    "Числительные": ("appendix", "appendix_numbers"),
    "Цвета": ("appendix", "appendix_colors"),
}

# Headings to skip entirely (intro pages, TOC, etc.)
SKIP_HEADINGS = {
    "Предисловие", "Китай. Общие сведения", "Административное деление",
    "Содержание",
}


def normalize(s):
    return s.strip().rstrip(".:!?")


def main():
    text = SRC.read_text(encoding="utf-8")
    lines = text.split("\n")

    phrases = []
    current_cat = None  # 'useful' is sticky-with-parent; we track parent
    current_sub = None
    current_parent_cat = None  # last non-"useful" category
    last_book_section = None
    page = None
    in_table = False

    for raw_line in lines:
        line = raw_line.rstrip()

        # page marker
        m_page = re.match(r"^##\s+Страница\s+(\d+)", line)
        if m_page:
            page = int(m_page.group(1))
            in_table = False
            continue

        # heading
        m_h = re.match(r"^#{2,4}\s+(.+?)\s*$", line)
        if m_h:
            heading = m_h.group(1).strip()
            heading_norm = normalize(heading)
            in_table = False

            if heading_norm in SKIP_HEADINGS:
                current_cat = None
                current_sub = None
                continue

            # "Полезные слова" → keep with current parent category
            if heading_norm == "Полезные слова":
                if current_parent_cat:
                    current_sub = f"{current_parent_cat}_useful_words"
                    current_cat = current_parent_cat
                continue

            if heading_norm in HEADING_MAP:
                cat, sub = HEADING_MAP[heading_norm]
                current_cat = cat
                current_sub = sub
                current_parent_cat = cat
                continue

            # Unknown heading: log and reset
            # (don't reset — sometimes continuation pages have empty subheadings)
            continue

        # table rows
        if line.startswith("|"):
            # skip header / separator
            if "Русский" in line and "Транскрипция" in line:
                in_table = True
                continue
            if re.match(r"^\|[\s:\-|]+\|\s*$", line):
                continue
            if not in_table:
                # Could be a continuation table without header
                in_table = True

            # Parse cells
            cells = [c.strip() for c in line.strip("|").split("|")]
            if len(cells) < 2:
                continue
            # Some tables might be 2-column (e.g. TOC) — ignore those
            if len(cells) == 2 and re.search(r"\d+\s*$", cells[1]):
                continue
            ru = cells[0] if len(cells) > 0 else ""
            zh = cells[1] if len(cells) > 1 else ""
            tr = cells[2] if len(cells) > 2 else ""

            if not ru and not zh:
                continue
            if not current_cat:
                continue

            phrases.append({
                "categoryId": current_cat,
                "subcategoryId": current_sub if current_sub != f"{current_cat}_general" else None,
                "russian": ru,
                "chinese": zh,
                "transcription": tr,
                "page": page,
            })

    # Deduplicate exact ru+zh (sometimes book duplicates)
    seen = set()
    deduped = []
    for p in phrases:
        key = (p["russian"], p["chinese"])
        if key in seen:
            continue
        seen.add(key)
        deduped.append(p)

    # Stats
    cat_counts = {}
    for p in deduped:
        c = p["categoryId"]
        cat_counts[c] = cat_counts.get(c, 0) + 1

    OUT_JSON.write_text(json.dumps(deduped, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Total phrases (after dedup): {len(deduped)} (raw: {len(phrases)})")
    print("Per category:")
    for c, n in sorted(cat_counts.items()):
        print(f"  {c}: {n}")
    print(f"\nWrote: {OUT_JSON}")


if __name__ == "__main__":
    main()
