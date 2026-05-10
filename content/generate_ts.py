# -*- coding: utf-8 -*-
"""Generate categories.ts, category-translations.ts, phrases.ts from phrases.json + metadata."""
import json
from pathlib import Path

ROOT = Path(__file__).parent
PROJECT = ROOT.parent
PHRASES_JSON = ROOT / "phrases.json"

# 13 main categories with icon, color, and Ru/En/Zh/Tk names
CATEGORIES = [
    ("basic",         "👋", "#3B82F6", "Базовые фразы",          "Basic Phrases",        "基本短语",      "Esasy sözlemler"),
    ("travel",        "✈️", "#059669", "Путешествие",            "Travel",               "旅行",          "Syýahat"),
    ("hotel",         "🏨", "#8B5CF6", "Гостиница",              "Hotel",                "酒店",          "Myhmanhana"),
    ("restaurant",    "🍽️", "#C2410C", "Ресторан",               "Restaurant",           "饭店",          "Restoran"),
    ("communication", "📞", "#EC4899", "Связь",                  "Communication",        "通讯",          "Aragatnaşyk"),
    ("city",          "🏙️", "#0891B2", "Город",                  "City",                 "城市",          "Şäher"),
    ("shopping",      "🛍️", "#F59E0B", "Покупки",                "Shopping",             "购物",          "Söwda"),
    ("leisure",       "🎮", "#7C3AED", "Досуг",                  "Leisure",              "休闲",          "Dynç alyş"),
    ("medicine",      "💊", "#059669", "Медицина",               "Medicine",             "医疗",          "Lukmançylyk"),
    ("business",      "💼", "#1F2937", "Бизнес",                 "Business",             "商务",          "Iş"),
    ("about",         "👤", "#7C3AED", "О себе",                 "About Me",             "关于我",        "Özüm hakda"),
    ("measurements",  "📏", "#374151", "Меры и веса",            "Measurements",         "度量衡",        "Ölçegler"),
    ("appendix",      "📎", "#0EA5E9", "Приложение",             "Appendix",             "附录",          "Goşundy"),
]

# Subcategories: parent_id, sub_id, icon, ru, en, zh, tk
SUBCATEGORIES = [
    # basic
    ("basic", "basic_greetings",       "👋", "Приветствие",            "Greetings",          "问候",        "Salamlaşmak"),
    ("basic", "basic_address",         "🤝", "Обращение",              "Address",            "称呼",        "Ýüzlenme"),
    ("basic", "basic_introduction",    "🪪", "Знакомство",             "Introduction",       "介绍",        "Tanyşmak"),
    ("basic", "basic_gratitude",       "🙏", "Благодарность",          "Gratitude",          "感谢",        "Sagboldumlyk"),
    ("basic", "basic_replies",         "💬", "Возможные ответы",       "Possible Replies",   "可能的回答",  "Mümkin jogaplar"),
    ("basic", "basic_request",         "❓", "Просьба",                "Request",            "请求",        "Haýyş"),
    ("basic", "basic_apology",         "😔", "Извинение",              "Apology",            "道歉",        "Ötünç"),
    ("basic", "basic_congratulation",  "🎉", "Поздравление",           "Congratulation",     "祝贺",        "Gutlag"),
    ("basic", "basic_invitation",      "💌", "Приглашение",            "Invitation",         "邀请",        "Çakylyk"),
    ("basic", "basic_agreement",       "✅", "Согласие",               "Agreement",          "同意",        "Razylyk"),
    ("basic", "basic_refusal",         "❌", "Отказ, несогласие",      "Refusal",            "拒绝",        "Ýüz öwürmek"),
    ("basic", "basic_misunderstanding","🤔", "Недоразумение",          "Misunderstanding",   "误会",        "Düşünişmezlik"),
    ("basic", "basic_regret",          "💔", "Сожаление, сочувствие",  "Regret, Sympathy",   "遗憾",        "Gynanç"),
    ("basic", "basic_farewell",        "👋", "Прощание",               "Farewell",           "告别",        "Hoşlaşmak"),
    # travel
    ("travel", "travel_passport",       "🛂", "Паспортный контроль. Таможня", "Passport, Customs", "边检海关", "Pasport gözegçiligi"),
    ("travel", "travel_airport",        "✈️", "В аэропорту, в самолёте",      "Airport, Plane",    "机场飞机", "Howa menzili"),
    ("travel", "travel_train",          "🚂", "На вокзале, в поезде",         "Station, Train",    "车站火车", "Wokzal, otly"),
    ("travel", "travel_bank",           "💱", "Банк, обмен валюты",           "Bank, Exchange",    "银行兑换", "Bank, walýuta"),
    ("travel", "travel_useful_words",   "📖", "Полезные слова",               "Useful Words",      "有用词汇", "Peýdaly sözler"),
    # hotel
    ("hotel", "hotel_requests",     "❓", "Просьбы",        "Requests",     "请求",     "Haýyşlar"),
    ("hotel", "hotel_complaints",   "⚠️", "Жалобы",         "Complaints",   "投诉",     "Şikaýatlar"),
    ("hotel", "hotel_useful_words", "📖", "Полезные слова", "Useful Words", "有用词汇", "Peýdaly sözler"),
    # restaurant
    ("restaurant", "restaurant_appetizers",   "🍴", "Закуски",              "Appetizers",       "开胃菜",   "Şirelendiriji iýmitler"),
    ("restaurant", "restaurant_soups",        "🍜", "Супы",                 "Soups",            "汤类",     "Çorbalar"),
    ("restaurant", "restaurant_meat",         "🥩", "Мясные блюда",         "Meat Dishes",      "肉类",     "Etli naharlar"),
    ("restaurant", "restaurant_fish",         "🐟", "Рыбные блюда",         "Fish Dishes",      "鱼类",     "Balykly naharlar"),
    ("restaurant", "restaurant_vegetables",   "🥬", "Овощи",                "Vegetables",       "蔬菜",     "Gök önümler"),
    ("restaurant", "restaurant_fruits",       "🍎", "Фрукты, орехи, ягоды", "Fruits, Nuts",     "水果",     "Miweler"),
    ("restaurant", "restaurant_alcohol",      "🍷", "Спиртные напитки",     "Alcoholic Drinks", "酒精饮料", "Spirtli içgiler"),
    ("restaurant", "restaurant_soft_drinks",  "🥤", "Безалкогольные напитки","Soft Drinks",     "软饮料",   "Spirtsiz içgiler"),
    ("restaurant", "restaurant_desserts",     "🍰", "Десерты",              "Desserts",         "甜品",     "Desertler"),
    # communication
    ("communication", "communication_useful_words", "📖", "Полезные слова", "Useful Words", "有用词汇", "Peýdaly sözler"),
    # city
    ("city", "city_sightseeing",   "🗺️", "Осмотр достопримечательностей", "Sightseeing",     "观光",     "Gözden geçirmek"),
    ("city", "city_transport",     "🚌", "Городской транспорт",            "City Transport",  "市内交通", "Şäher transporty"),
    ("city", "city_useful_words",  "📖", "Полезные слова",                 "Useful Words",    "有用词汇", "Peýdaly sözler"),
    # shopping
    ("shopping", "shopping_useful_words",   "📖", "Полезные слова",         "Useful Words",      "有用词汇", "Peýdaly sözler"),
    # leisure
    ("leisure", "leisure_theater",      "🎭", "Театр",          "Theater",      "剧院",     "Teatr"),
    ("leisure", "leisure_cinema",       "🎬", "Кино",           "Cinema",       "电影",     "Kino"),
    ("leisure", "leisure_concert",      "🎤", "Концерт",        "Concert",      "音乐会",   "Konsert"),
    ("leisure", "leisure_museum",       "🏛️", "В музее",        "Museum",       "博物馆",   "Muzeýde"),
    ("leisure", "leisure_sports",       "⚽", "Спорт",          "Sports",       "运动",     "Sport"),
    ("leisure", "leisure_useful_words", "📖", "Полезные слова", "Useful Words", "有用词汇", "Peýdaly sözler"),
    # medicine
    ("medicine", "medicine_doctor",    "👨‍⚕️", "У врача",  "At Doctor", "看医生",   "Lukmanyňkyda"),
    ("medicine", "medicine_pharmacy",  "💊",   "В аптеке", "Pharmacy",  "在药店",   "Dermanhanada"),
    # business
    ("business", "business_conferences",  "🎤", "Конференции",         "Conferences",   "会议",       "Konferensiýalar"),
    ("business", "business_exhibition",   "🏢", "Техническая выставка","Tech Exhibition","技术展览",  "Tehniki sergi"),
    ("business", "business_negotiations", "🤝", "Деловые переговоры",  "Negotiations",  "商务谈判",   "Iş gepleşikleri"),
    # about
    ("about", "about_name_age",   "👤", "Имя, возраст",      "Name, Age",       "姓名年龄", "At, ýaş"),
    ("about", "about_residence",  "🏠", "Местожительство",   "Residence",       "住所",     "Ýaşaýan ýeri"),
    ("about", "about_family",     "👨‍👩‍👧", "Семья",            "Family",          "家庭",     "Maşgala"),
    ("about", "about_work",       "💼", "Работа",            "Work",            "工作",     "Iş"),
    ("about", "about_languages",  "🗣️", "Иностранные языки", "Foreign Languages", "外语",   "Daşary ýurt dilleri"),
    # measurements
    ("measurements", "measurements_length",  "📏", "Длина",          "Length",         "长度",     "Uzynlyk"),
    ("measurements", "measurements_weight",  "⚖️", "Вес",            "Weight",         "重量",     "Agram"),
    ("measurements", "measurements_volume",  "🧪", "Объём",          "Volume",         "体积",     "Göwrüm"),
    ("measurements", "measurements_chinese", "🀄", "Китайские меры", "Chinese Units",  "中国度量", "Hytaý ölçegleri"),
    # appendix
    ("appendix", "appendix_time",      "⏰", "Время",        "Time",      "时间",   "Wagt"),
    ("appendix", "appendix_weekdays",  "📅", "Дни недели",   "Weekdays",  "星期",   "Hepdäniň günleri"),
    ("appendix", "appendix_months",    "🗓️", "Месяцы",       "Months",    "月份",   "Aýlar"),
    ("appendix", "appendix_numbers",   "🔢", "Числительные", "Numerals",  "数字",   "Sanlar"),
    ("appendix", "appendix_colors",    "🎨", "Цвета",        "Colors",    "颜色",   "Reňkler"),
]

# All 31 language codes
LANG_CODES = [
    "tk","zh","ru","en","ja","ko","th","vi","id","ms","hi","ur","fa","ps",
    "de","fr","es","it","tr","pl","uk","hy","ka","ar","uz","kk","az","ky","tg","pt","nl"
]


def gen_category_translations():
    """Generate category-translations.ts with all 31 keys (only ru/en/zh/tk filled)."""
    rows = []
    for cat_id, _, _, ru, en, zh, tk in CATEGORIES:
        translations = {code: "" for code in LANG_CODES}
        translations["ru"] = ru
        translations["en"] = en
        translations["zh"] = zh
        translations["tk"] = tk
        rows.append((cat_id, translations))

    out = ["// src/data/category-translations.ts",
           "// Переводы категорий на 31 язык (заполнены ru, en, zh, tk; остальные пустые → fallback на en)",
           "",
           "export interface CategoryTranslations {",
           "  [categoryId: string]: {"]
    for code in LANG_CODES:
        out.append(f"    {code}: string;")
    out.append("  };")
    out.append("}")
    out.append("")
    out.append("export const CATEGORY_TRANSLATIONS: CategoryTranslations = {")
    for cat_id, tr in rows:
        out.append(f"  {cat_id}: {{")
        for code in LANG_CODES:
            v = tr[code].replace('"', '\\"')
            out.append(f'    {code}: "{v}",')
        out.append("  },")
    out.append("};")
    out.append("")
    return "\n".join(out)


def gen_categories():
    """Generate categories.ts."""
    # Group subcategories by parent
    sub_by_parent = {}
    for parent_id, sub_id, icon, ru, en, zh, tk in SUBCATEGORIES:
        sub_by_parent.setdefault(parent_id, []).append((sub_id, icon, ru, en, zh, tk))

    out = []
    out.append("// src/data/categories.ts")
    out.append("// 13 главных разделов из «Русско-Китайского разговорника» + подкатегории")
    out.append("")
    out.append("import { Category, SubCategory } from '../types';")
    out.append("import { AppLanguageMode } from '../contexts/LanguageContext';")
    out.append("import { CATEGORY_TRANSLATIONS } from './category-translations';")
    out.append("")
    out.append("export function getCategoryTranslation(categoryId: string, langCode: string): string {")
    out.append("  const translations = CATEGORY_TRANSLATIONS[categoryId];")
    out.append("  if (!translations) return categoryId;")
    out.append("  return (translations as Record<string, string>)[langCode] || translations.en || translations.ru;")
    out.append("}")
    out.append("")

    def name_fields(ru, en, zh, tk):
        # Generate nameTk/Zh/Ru/En filled, all others "" (will fallback)
        lines = [
            f'    nameTk: "{tk}",',
            f'    nameZh: "{zh}",',
            f'    nameRu: "{ru}",',
            f'    nameEn: "{en}",',
        ]
        for code in ["ja","ko","th","vi","id","ms","hi","ur","fa","ps","de","fr","es","it","tr","pl","uk","hy","ka","ar","uz","kk","az","ky","tg","pt","nl"]:
            cap = code[0].upper() + code[1:]
            lines.append(f'    name{cap}: "{en}",')
        return lines

    # Subcategories
    for parent_id, subs in sub_by_parent.items():
        out.append(f"const {parent_id}Subcategories: SubCategory[] = [")
        # Find parent color
        parent_color = next(c[2] for c in CATEGORIES if c[0] == parent_id)
        for sub_id, icon, ru, en, zh, tk in subs:
            out.append("  {")
            out.append(f"    id: '{sub_id}',")
            out.append(f"    parentId: '{parent_id}',")
            for line in name_fields(ru, en, zh, tk):
                out.append(line)
            out.append(f"    icon: '{icon}',")
            out.append(f"    color: '{parent_color}',")
            out.append("  },")
        out.append("];")
        out.append("")

    # Category factory + list
    out.append("function createCategory(")
    out.append("  id: string,")
    out.append("  icon: string,")
    out.append("  color: string,")
    out.append("  hasSubcategories?: boolean,")
    out.append("  subcategories?: SubCategory[]")
    out.append("): Category {")
    out.append("  const t = CATEGORY_TRANSLATIONS[id];")
    out.append("  return {")
    out.append("    id, icon, color,")
    for code in LANG_CODES:
        cap = code[0].upper() + code[1:]
        out.append(f"    name{cap}: t.{code} || t.en,")
    out.append("    hasSubcategories,")
    out.append("    subcategories,")
    out.append("  };")
    out.append("}")
    out.append("")

    out.append("export const categories: Category[] = [")
    for cat_id, icon, color, *_ in CATEGORIES:
        has_subs = cat_id in sub_by_parent
        if has_subs:
            out.append(f"  createCategory('{cat_id}', '{icon}', '{color}', true, {cat_id}Subcategories),")
        else:
            out.append(f"  createCategory('{cat_id}', '{icon}', '{color}'),")
    out.append("];")
    out.append("")

    # Helpers preserved
    out.append("export const getCategoryById = (id: string): Category | undefined =>")
    out.append("  categories.find(c => c.id === id);")
    out.append("")
    out.append("export const getSubcategoriesByParentId = (parentId: string): SubCategory[] => {")
    out.append("  const category = categories.find(c => c.id === parentId);")
    out.append("  return category?.subcategories || [];")
    out.append("};")
    out.append("")
    out.append("export const getAllSubcategories = (): SubCategory[] =>")
    out.append("  categories.flatMap(c => c.subcategories || []);")
    out.append("")
    out.append("export const getSubcategoryById = (id: string): SubCategory | undefined =>")
    out.append("  getAllSubcategories().find(s => s.id === id);")
    out.append("")
    out.append("export function getCategoryName(category: Category, language: AppLanguageMode): string {")
    out.append("  switch (language) {")
    out.append("    case 'tk': return category.nameTk;")
    out.append("    case 'zh': return category.nameZh;")
    out.append("    case 'en': return category.nameEn;")
    out.append("    default: return category.nameRu;")
    out.append("  }")
    out.append("}")
    out.append("")
    out.append("export function getSubcategoryName(subcategory: SubCategory, language: AppLanguageMode): string {")
    out.append("  switch (language) {")
    out.append("    case 'tk': return subcategory.nameTk;")
    out.append("    case 'zh': return subcategory.nameZh;")
    out.append("    case 'en': return subcategory.nameEn;")
    out.append("    default: return subcategory.nameRu;")
    out.append("  }")
    out.append("}")
    out.append("")
    return "\n".join(out)


def esc(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')


def gen_phrases():
    phrases = json.loads(PHRASES_JSON.read_text(encoding="utf-8"))
    out = []
    out.append("// src/data/phrases.ts")
    out.append('// Сгенерировано из "Русско-Китайского разговорника" (2013), 2174 фразы')
    out.append("// Заполнены: russian, chinese. transcription (кириллица) → pinyin поле для совместимости.")
    out.append("// Остальные языки пусты — заполнить вручную/поэтапно.")
    out.append("")
    out.append('import { Phrase } from "../types";')
    out.append("")
    out.append("export const phrases: Phrase[] = [")

    other_langs = [
        "vietnamese","indonesian","arabic","ukrainian","urdu","hindi","thai",
        "japanese","uzbek","kazakh","azerbaijani","malay","persian","kyrgyz",
        "tajik","armenian","georgian","pashto","korean","turkish","german",
        "french","spanish","italian","portuguese","polish","dutch"
    ]

    for i, p in enumerate(phrases, 1):
        pid = f"phrase_{i:04d}"
        cat = p["categoryId"]
        sub = p.get("subcategoryId")
        ru = esc(p["russian"])
        zh = esc(p["chinese"])
        tr = esc(p.get("transcription") or "")
        out.append("  {")
        out.append(f'    id: "{pid}",')
        out.append(f'    categoryId: "{cat}",')
        if sub:
            out.append(f'    subcategoryId: "{sub}",')
        out.append(f'    chinese: "{zh}",')
        out.append(f'    pinyin: "",')
        out.append(f'    russian: "{ru}",')
        out.append(f'    turkmen: "",')
        for lang in other_langs:
            out.append(f'    {lang}: "",')
        out.append("  },")
    out.append("];")
    out.append("")
    return "\n".join(out)


def gen_base_phrases():
    """Generate data/languages/base.ts (Turkmen base phrases — empty turkmen for new content)."""
    phrases = json.loads(PHRASES_JSON.read_text(encoding="utf-8"))
    out = []
    out.append("// AUTO-GENERATED: Базовые фразы (туркменский)")
    out.append('// Сгенерировано из "Русско-Китайского разговорника"')
    out.append(f"// Total phrases: {len(phrases)}")
    out.append("import { BasePhrase } from '../../types';")
    out.append("")
    out.append("export const basePhrases: BasePhrase[] = [")
    for i, p in enumerate(phrases, 1):
        pid = f"phrase_{i:04d}"
        cat = p["categoryId"]
        sub = p.get("subcategoryId")
        out.append("  {")
        out.append(f'    id: "{pid}",')
        out.append(f'    categoryId: "{cat}",')
        if sub:
            out.append(f'    subcategoryId: "{sub}",')
        out.append(f'    turkmen: "",')
        out.append(f"    order: {i}")
        out.append("  },")
    out.append("];")
    out.append("")
    return "\n".join(out)


def gen_translation_file(lang_name, var_name, get_text, get_transcription=None):
    """Generate a translation file."""
    phrases = json.loads(PHRASES_JSON.read_text(encoding="utf-8"))
    out = []
    out.append(f"// AUTO-GENERATED: {lang_name} переводы")
    out.append(f"// Total translations: {len(phrases)}")
    out.append("import { LanguageTranslation } from '../../../types';")
    out.append("")
    out.append(f"export const {var_name}: LanguageTranslation[] = [")
    for i, p in enumerate(phrases, 1):
        pid = f"phrase_{i:04d}"
        text = esc(get_text(p))
        out.append("  {")
        out.append(f'    phraseId: "{pid}",')
        out.append(f'    text: "{text}",')
        if get_transcription:
            tr = get_transcription(p)
            if tr:
                tr_esc = esc(tr)
                out.append(f'    transcription: "{tr_esc}"')
            else:
                out.append("    transcription: undefined")
        else:
            out.append("    transcription: undefined")
        out.append("  },")
    out.append("];")
    out.append("")
    return "\n".join(out)


def gen_empty_translation(lang_name, var_name):
    """Empty array for languages not yet translated."""
    return (
        f"// AUTO-GENERATED: {lang_name} переводы (пусто — заполнить позже)\n"
        "import { LanguageTranslation } from '../../../types';\n\n"
        f"export const {var_name}: LanguageTranslation[] = [];\n"
    )


def main():
    # Categories
    (PROJECT / "src/data/category-translations.ts").write_text(gen_category_translations(), encoding="utf-8")
    print("Wrote: src/data/category-translations.ts")
    (PROJECT / "src/data/categories.ts").write_text(gen_categories(), encoding="utf-8")
    print("Wrote: src/data/categories.ts")

    # Legacy phrases.ts (kept for compatibility with offline data hooks)
    (PROJECT / "src/data/phrases.ts").write_text(gen_phrases(), encoding="utf-8")
    print("Wrote: src/data/phrases.ts")

    # Active multilingual system
    (PROJECT / "src/data/languages/base.ts").write_text(gen_base_phrases(), encoding="utf-8")
    print("Wrote: src/data/languages/base.ts")

    # Russian (full)
    ru_content = gen_translation_file("Русские", "russianTranslations",
                                       get_text=lambda p: p["russian"])
    (PROJECT / "src/data/languages/translations/russian.ts").write_text(ru_content, encoding="utf-8")
    print("Wrote: russian.ts")

    # Chinese (full + transcription cyrillic)
    zh_content = gen_translation_file("Китайские", "chineseTranslations",
                                       get_text=lambda p: p["chinese"],
                                       get_transcription=lambda p: p.get("transcription") or None)
    (PROJECT / "src/data/languages/translations/chinese.ts").write_text(zh_content, encoding="utf-8")
    print("Wrote: chinese.ts")

    # Other languages → empty (will be filled later)
    other_translations = [
        ("english", "Английские", "englishTranslations"),
        ("turkish", "Турецкие", "turkishTranslations"),
        ("uzbek", "Узбекские", "uzbekTranslations"),
        ("german", "Немецкие", "germanTranslations"),
        ("french", "Французские", "frenchTranslations"),
        ("spanish", "Испанские", "spanishTranslations"),
        ("italian", "Итальянские", "italianTranslations"),
        ("japanese", "Японские", "japaneseTranslations"),
        ("korean", "Корейские", "koreanTranslations"),
        ("polish", "Польские", "polishTranslations"),
        ("portuguese", "Португальские", "portugueseTranslations"),
        ("dutch", "Голландские", "dutchTranslations"),
        ("azerbaijani", "Азербайджанские", "azerbaijaniTranslations"),
        ("kazakh", "Казахские", "kazakhTranslations"),
        ("kyrgyz", "Кыргызские", "kyrgyzTranslations"),
        ("tajik", "Таджикские", "tajikTranslations"),
        ("ukrainian", "Украинские", "ukrainianTranslations"),
        ("thai", "Тайские", "thaiTranslations"),
        ("vietnamese", "Вьетнамские", "vietnameseTranslations"),
        ("indonesian", "Индонезийские", "indonesianTranslations"),
        ("hindi", "Хинди", "hindiTranslations"),
        ("arabic", "Арабские", "arabicTranslations"),
        ("persian", "Персидские", "persianTranslations"),
        ("malay", "Малайские", "malayTranslations"),
        ("urdu", "Урду", "urduTranslations"),
        ("pashto", "Пуштунские", "pashtoTranslations"),
        ("armenian", "Армянские", "armenianTranslations"),
        ("georgian", "Грузинские", "georgianTranslations"),
    ]
    for fname, lang_name, var_name in other_translations:
        path = PROJECT / f"src/data/languages/translations/{fname}.ts"
        path.write_text(gen_empty_translation(lang_name, var_name), encoding="utf-8")
    print(f"Cleared {len(other_translations)} other translation files")


if __name__ == "__main__":
    main()
