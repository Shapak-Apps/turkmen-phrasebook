// src/data/categories.ts - ПОЛНАЯ ВЕРСИЯ с расширениями + все 31 язык

import { Category, SubCategory } from '../types';
import { AppLanguageMode } from '../contexts/LanguageContext';
import { CATEGORY_TRANSLATIONS } from './category-translations';

// ✅ Helper функция для получения названия категории на любом из 31 языков
export function getCategoryTranslation(categoryId: string, langCode: string): string {
  const translations = CATEGORY_TRANSLATIONS[categoryId];
  if (!translations) return categoryId; // fallback на ID

  // ✅ FIXED: Properly typed dynamic access with index signature
  return (translations as Record<string, string>)[langCode] || translations.en; // fallback на английский
}

// ✅ Helper функция для создания категории с переводами на все языки
function createCategory(
  id: string,
  icon: string,
  color: string,
  hasSubcategories?: boolean,
  subcategories?: SubCategory[]
): Category {
  const translations = CATEGORY_TRANSLATIONS[id];

  return {
    id,
    icon,
    color,
    nameTk: translations.tk,
    nameZh: translations.zh,
    nameRu: translations.ru,
    nameEn: translations.en,
    nameJa: translations.ja,
    nameKo: translations.ko,
    nameTh: translations.th,
    nameVi: translations.vi,
    nameId: translations.id,
    nameMs: translations.ms,
    nameHi: translations.hi,
    nameUr: translations.ur,
    nameFa: translations.fa,
    namePs: translations.ps,
    nameDe: translations.de,
    nameFr: translations.fr,
    nameEs: translations.es,
    nameIt: translations.it,
    nameTr: translations.tr,
    namePl: translations.pl,
    nameUk: translations.uk,
    nameHy: translations.hy,
    nameKa: translations.ka,
    nameAr: translations.ar,
    nameUz: translations.uz,
    nameKk: translations.kk,
    nameAz: translations.az,
    nameKy: translations.ky,
    nameTg: translations.tg,
    namePt: translations.pt,
    nameNl: translations.nl,
    hasSubcategories,
    subcategories,
  };
}

// ===== ПОДКАТЕГОРИИ =====

// Подкатегории для "В отеле" (hotel)
const hotelSubcategories: SubCategory[] = [
  {
    id: 'hotel_requests',
    parentId: 'hotel',
    nameRu: 'Просьбы',
    nameTk: 'Haýyşlar',
    nameZh: '请求',
    nameEn: 'Requests',
    icon: '❓',
    color: '#8B5CF6',
  },
  {
    id: 'hotel_complaints',
    parentId: 'hotel',
    nameRu: 'Жалобы',
    nameTk: 'Şikaýatlar',
    nameZh: '投诉',
    nameEn: 'Complaints',
    icon: '⚠️',
    color: '#8B5CF6',
  },
  {
    id: 'hotel_useful_words',
    parentId: 'hotel',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    nameEn: 'Useful Words',
    icon: '📖',
    color: '#8B5CF6',
  },
];

// Подкатегории для "Еда и рестораны" (food)
const foodSubcategories: SubCategory[] = [
  {
    id: 'food_ordering',
    parentId: 'food',
    nameRu: 'Заказ еды',
    nameTk: 'Nahar sargyt etmek',
    nameZh: '点餐',
    nameEn: 'Ordering Food',
    icon: '📝',
    color: '#C2410C',
  },
  {
    id: 'food_appetizers',
    parentId: 'food',
    nameRu: 'Закуски',
    nameTk: 'Şirelendiriji iýmitler',
    nameZh: '开胃菜',
    nameEn: 'Appetizers',
    icon: '🍴',
    color: '#C2410C',
  },
  {
    id: 'food_soups',
    parentId: 'food',
    nameRu: 'Супы',
    nameTk: 'Çorbalar',
    nameZh: '汤类',
    nameEn: 'Soups',
    icon: '🍜',
    color: '#C2410C',
  },
  {
    id: 'food_meat',
    parentId: 'food',
    nameRu: 'Мясные блюда',
    nameTk: 'Etli naharlar',
    nameZh: '肉类菜肴',
    nameEn: 'Meat Dishes',
    icon: '🥩',
    color: '#C2410C',
  },
  {
    id: 'food_fish',
    parentId: 'food',
    nameRu: 'Рыбные блюда',
    nameTk: 'Balykly naharlar',
    nameZh: '鱼类菜肴',
    nameEn: 'Fish Dishes',
    icon: '🐟',
    color: '#C2410C',
  },
  {
    id: 'food_vegetables',
    parentId: 'food',
    nameRu: 'Овощи и фрукты',
    nameTk: 'Gök we miweler',
    nameZh: '蔬菜水果',
    nameEn: 'Vegetables and Fruits',
    icon: '🥗',
    color: '#C2410C',
  },
  {
    id: 'food_drinks',
    parentId: 'food',
    nameRu: 'Напитки',
    nameTk: 'Içgiler',
    nameZh: '饮料',
    nameEn: 'Drinks',
    icon: '🍷',
    color: '#C2410C',
  },
  {
    id: 'food_desserts',
    parentId: 'food',
    nameRu: 'Десерты',
    nameTk: 'Desertler',
    nameZh: '甜品',
    nameEn: 'Desserts',
    icon: '🍰',
    color: '#C2410C',
  },
];

// Подкатегории для "Покупки и торг" (shopping)
const shoppingSubcategories: SubCategory[] = [
  {
    id: 'shopping_clothing',
    parentId: 'shopping',
    nameRu: 'Одежда',
    nameTk: 'Eşikler',
    nameZh: '服装',
    nameEn: 'Clothing',
    icon: '👕',
    color: '#F59E0B',
  },
  {
    id: 'shopping_bargaining',
    parentId: 'shopping',
    nameRu: 'Торг',
    nameTk: 'Söwda',
    nameZh: '讨价还价',
    nameEn: 'Bargaining',
    icon: '💲',
    color: '#F59E0B',
  },
  {
    id: 'shopping_useful_words',
    parentId: 'shopping',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    nameEn: 'Useful Words',
    icon: '📖',
    color: '#F59E0B',
  },
];

// Подкатегории для "Транспорт" (transport)
const transportSubcategories: SubCategory[] = [
  {
    id: 'transport_airport',
    parentId: 'transport',
    nameRu: 'В аэропорту, в самолете',
    nameTk: 'Howa menzilinde, uçarda',
    nameZh: '在机场，在飞机上',
    nameEn: 'At Airport, On Plane',
    icon: '✈️',
    color: '#059669',
  },
  {
    id: 'transport_train',
    parentId: 'transport',
    nameRu: 'На вокзале, в поезде',
    nameTk: 'Wokzalda, poýezdde',
    nameZh: '在车站，在火车上',
    nameEn: 'At Station, On Train',
    icon: '🚂',
    color: '#059669',
  },
  {
    id: 'transport_city',
    parentId: 'transport',
    nameRu: 'Городской транспорт',
    nameTk: 'Şäher transporty',
    nameZh: '城市交通',
    nameEn: 'City Transport',
    icon: '🚌',
    color: '#059669',
  },
];

// Подкатегории для "Направления" (directions)
const directionsSubcategories: SubCategory[] = [
  {
    id: 'directions_sightseeing',
    parentId: 'directions',
    nameRu: 'Осмотр достопримечательностей',
    nameTk: 'Meşhur ýerleri seredip görmek',
    nameZh: '观光景点',
    nameEn: 'Sightseeing',
    icon: '📸',
    color: '#DC2626',
  },
  {
    id: 'directions_useful_words',
    parentId: 'directions',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    nameEn: 'Useful Words',
    icon: '📖',
    color: '#DC2626',
  },
];

// Подкатегории для "Связь" (communication)
const communicationSubcategories: SubCategory[] = [
  {
    id: 'communication_postal',
    parentId: 'communication',
    nameRu: 'Почта, телеграф, телефон',
    nameTk: 'Poçta, telegraf, telefon',
    nameZh: '邮政，电报，电话',
    nameEn: 'Post, Telegraph, Phone',
    icon: '📧',
    color: '#EC4899',
  },
  {
    id: 'communication_useful_words',
    parentId: 'communication',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    nameEn: 'Useful Words',
    icon: '📖',
    color: '#EC4899',
  },
];

// Подкатегории для "Развлечения" (entertainment)
const entertainmentSubcategories: SubCategory[] = [
  {
    id: 'entertainment_theater',
    parentId: 'entertainment',
    nameRu: 'Театр',
    nameTk: 'Teatr',
    nameZh: '剧院',
    nameEn: 'Theater',
    icon: '🎭',
    color: '#7C3AED',
  },
  {
    id: 'entertainment_cinema',
    parentId: 'entertainment',
    nameRu: 'Кино',
    nameTk: 'Kino',
    nameZh: '电影院',
    nameEn: 'Cinema',
    icon: '🎬',
    color: '#7C3AED',
  },
  {
    id: 'entertainment_concert',
    parentId: 'entertainment',
    nameRu: 'Концерт',
    nameTk: 'Konsert',
    nameZh: '音乐会',
    nameEn: 'Concert',
    icon: '🎵',
    color: '#7C3AED',
  },
  {
    id: 'entertainment_museum',
    parentId: 'entertainment',
    nameRu: 'В музее',
    nameTk: 'Muzeýde',
    nameZh: '在博物馆',
    nameEn: 'At Museum',
    icon: '🏛️',
    color: '#7C3AED',
  },
  {
    id: 'entertainment_useful_words',
    parentId: 'entertainment',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    nameEn: 'Useful Words',
    icon: '📖',
    color: '#7C3AED',
  },
];

// Подкатегории для "Время и даты" (time)
const timeSubcategories: SubCategory[] = [
  {
    id: 'time_basic',
    parentId: 'time',
    nameRu: 'Время',
    nameTk: 'Wagt',
    nameZh: '时间',
    nameEn: 'Time',
    icon: '⏰',
    color: '#0D9488',
  },
  {
    id: 'time_days',
    parentId: 'time',
    nameRu: 'Дни недели',
    nameTk: 'Hepdäniň günleri',
    nameZh: '星期',
    nameEn: 'Days of Week',
    icon: '📅',
    color: '#0D9488',
  },
  {
    id: 'time_months',
    parentId: 'time',
    nameRu: 'Месяцы',
    nameTk: 'Aýlar',
    nameZh: '月份',
    nameEn: 'Months',
    icon: '📆',
    color: '#0D9488',
  },
];

// Подкатегории для "Здоровье" (health)
const healthSubcategories: SubCategory[] = [
  {
    id: 'health_doctor',
    parentId: 'health',
    nameRu: 'У врача',
    nameTk: 'Lukmanyňkyda',
    nameZh: '看医生',
    nameEn: 'At Doctor',
    icon: '👨‍⚕️',
    color: '#059669',
  },
  {
    id: 'health_pharmacy',
    parentId: 'health',
    nameRu: 'В аптеке',
    nameTk: 'Dermanhanada',
    nameZh: '在药店',
    nameEn: 'At Pharmacy',
    icon: '🩹',
    color: '#059669',
  },
];

// Подкатегории для "Деньги и банки" (money)
const moneySubcategories: SubCategory[] = [
  {
    id: 'money_exchange',
    parentId: 'money',
    nameRu: 'Банк, обмен валюты',
    nameTk: 'Bank, walýuta çalyşmak',
    nameZh: '银行，外汇兑换',
    nameEn: 'Bank, Currency Exchange',
    icon: '💳',
    color: '#0891B2',
  },
  {
    id: 'money_useful_words',
    parentId: 'money',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    nameEn: 'Useful Words',
    icon: '📖',
    color: '#0891B2',
  },
];

// Подкатегории для "Таможня" (customs)
const customsSubcategories: SubCategory[] = [
  {
    id: 'customs_passport',
    parentId: 'customs',
    nameRu: 'Паспортный контроль',
    nameTk: 'Pasport gözegçiligi',
    nameZh: '护照检查',
    nameEn: 'Passport Control',
    icon: '📄',
    color: '#1E40AF',
  },
  {
    id: 'customs_useful_words',
    parentId: 'customs',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    nameEn: 'Useful Words',
    icon: '📖',
    color: '#1E40AF',
  },
];

// Подкатегории для "Спорт" (sports)
const sportsSubcategories: SubCategory[] = [
  {
    id: 'sports_activities',
    parentId: 'sports',
    nameRu: 'Спорт',
    nameTk: 'Sport',
    nameZh: '体育运动',
    nameEn: 'Sports',
    icon: '⚽',
    color: '#DC2626',
  },
  {
    id: 'sports_useful_words',
    parentId: 'sports',
    nameRu: 'Полезные слова',
    nameTk: 'Peýdaly sözler',
    nameZh: '有用词汇',
    nameEn: 'Useful Words',
    icon: '📖',
    color: '#DC2626',
  },
];

// ===== НОВЫЕ ПОДКАТЕГОРИИ =====

// Подкатегории для "О себе" (personal_info)
const personalInfoSubcategories: SubCategory[] = [
  {
    id: 'personal_name_age',
    parentId: 'personal_info',
    nameRu: 'Имя, возраст',
    nameTk: 'At, ýaş',
    nameZh: '姓名，年龄',
    nameEn: 'Name, Age',
    icon: '👤',
    color: '#7C3AED',
  },
  {
    id: 'personal_residence',
    parentId: 'personal_info',
    nameRu: 'Местожительство',
    nameTk: 'Ýaşaýan ýeri',
    nameZh: '居住地',
    nameEn: 'Residence',
    icon: '🏠',
    color: '#7C3AED',
  },
  {
    id: 'personal_family',
    parentId: 'personal_info',
    nameRu: 'Семья',
    nameTk: 'Maşgala',
    nameZh: '家庭',
    nameEn: 'Family',
    icon: '👨‍👩‍👧‍👦',
    color: '#7C3AED',
  },
  {
    id: 'personal_work',
    parentId: 'personal_info',
    nameRu: 'Работа',
    nameTk: 'Iş',
    nameZh: '工作',
    nameEn: 'Work',
    icon: '💼',
    color: '#7C3AED',
  },
  {
    id: 'personal_languages',
    parentId: 'personal_info',
    nameRu: 'Иностранные языки',
    nameTk: 'Daşary ýurt dilleri',
    nameZh: '外语',
    nameEn: 'Foreign Languages',
    icon: '🗣️',
    color: '#7C3AED',
  },
];

// Подкатегории для "Экономическое сотрудничество" (business)
const businessSubcategories: SubCategory[] = [
  {
    id: 'business_conferences',
    parentId: 'business',
    nameRu: 'Конференции',
    nameTk: 'Konferensiýalar',
    nameZh: '会议',
    nameEn: 'Conferences',
    icon: '👥',
    color: '#1F2937',
  },
  {
    id: 'business_exhibitions',
    parentId: 'business',
    nameRu: 'Техническая выставка',
    nameTk: 'Tehniki sergi',
    nameZh: '技术展览',
    nameEn: 'Technical Exhibition',
    icon: '🖥️',
    color: '#1F2937',
  },
  {
    id: 'business_negotiations',
    parentId: 'business',
    nameRu: 'Деловые переговоры',
    nameTk: 'Işewür gepleşikler',
    nameZh: '商务谈判',
    nameEn: 'Business Negotiations',
    icon: '💬',
    color: '#1F2937',
  },
];

// Подкатегории для "Система мер и весов" (measurements)
const measurementsSubcategories: SubCategory[] = [
  {
    id: 'measurements_length',
    parentId: 'measurements',
    nameRu: 'Длина',
    nameTk: 'Uzynlyk',
    nameZh: '长度',
    nameEn: 'Length',
    icon: '📐',
    color: '#374151',
  },
  {
    id: 'measurements_weight',
    parentId: 'measurements',
    nameRu: 'Вес',
    nameTk: 'Agram',
    nameZh: '重量',
    nameEn: 'Weight',
    icon: '⚖️',
    color: '#374151',
  },
  {
    id: 'measurements_volume',
    parentId: 'measurements',
    nameRu: 'Объем',
    nameTk: 'Göwrüm',
    nameZh: '体积',
    nameEn: 'Volume',
    icon: '📦',
    color: '#374151',
  },
  {
    id: 'measurements_chinese',
    parentId: 'measurements',
    nameRu: 'Китайские меры',
    nameTk: 'Hytaý ölçegleri',
    nameZh: '中国度量单位',
    nameEn: 'Chinese Measurements',
    icon: '🧮',
    color: '#374151',
  },
];



// ✅ ОБНОВЛЕННЫЙ массив категорий с переводами на все 31 язык + ЭМОДЗИ ИКОНКИ
export const categories: Category[] = [
  createCategory('greetings', '👋', '#3B82F6'),
  createCategory('emergency', '🚨', '#EF4444'),
  createCategory('hotel', '🏨', '#8B5CF6', true, hotelSubcategories),
  createCategory('food', '🍽️', '#C2410C', true, foodSubcategories),
  createCategory('shopping', '🛍️', '#F59E0B', true, shoppingSubcategories),
  createCategory('transport', '🚗', '#059669', true, transportSubcategories),
  createCategory('directions', '🧭', '#DC2626', true, directionsSubcategories),
  createCategory('health', '💊', '#059669', true, healthSubcategories),
  createCategory('money', '💰', '#0891B2', true, moneySubcategories),
  createCategory('communication', '📞', '#EC4899', true, communicationSubcategories),
  createCategory('entertainment', '🎮', '#7C3AED', true, entertainmentSubcategories),
  createCategory('time', '⏰', '#0D9488', true, timeSubcategories),
  createCategory('numbers', '🔢', '#0EA5E9'),
  createCategory('weather', '⛅', '#F97316'),
  createCategory('personal_info', '👤', '#7C3AED', true, personalInfoSubcategories),
  createCategory('business', '💼', '#1F2937', true, businessSubcategories),
  createCategory('measurements', '📏', '#374151', true, measurementsSubcategories),
  createCategory('colors', '🎨', '#BE185D'),
  createCategory('body', '🖐️', '#B91C1C'),
  createCategory('home', '🏠', '#7C2D12'),
  createCategory('customs', '🛃', '#1E40AF', true, customsSubcategories),
  createCategory('sports', '⚽', '#DC2626', true, sportsSubcategories),
];

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====

/**
 * Получить все подкатегории
 */
export const getAllSubcategories = (): SubCategory[] => {
  const allSubcategories: SubCategory[] = [];
  
  categories.forEach(category => {
    if (category.hasSubcategories && category.subcategories) {
      allSubcategories.push(...category.subcategories);
    }
  });
  
  return allSubcategories;
};

/**
 * Получить подкатегории по ID родительской категории
 */
export const getSubcategoriesByParentId = (parentId: string): SubCategory[] => {
  const category = categories.find(cat => cat.id === parentId);
  return category?.subcategories || [];
};

/**
 * Получить подкатегорию по ID
 */
export const getSubcategoryById = (id: string): SubCategory | undefined => {
  const allSubcategories = getAllSubcategories();
  return allSubcategories.find(subcat => subcat.id === id);
};

/**
 * Получить название категории на нужном языке
 */
export function getCategoryName(category: Category, language: AppLanguageMode): string {
  switch (language) {
    case 'tk': return category.nameTk;
    case 'zh': return category.nameZh;
    case 'en': return category.nameEn;
    default: return category.nameRu;
  }
}

/**
 * Получить название подкатегории на нужном языке
 */
export function getSubcategoryName(subcategory: SubCategory, language: AppLanguageMode): string {
  switch (language) {
    case 'tk': return subcategory.nameTk;
    case 'zh': return subcategory.nameZh;
    case 'en': return subcategory.nameEn;
    default: return subcategory.nameRu;
  }
}

/**
 * Поиск категории по ID
 */
export const getCategoryById = (id: string): Category | undefined => {
  return categories.find(category => category.id === id);
};

/**
 * Получить категории с подкатегориями
 */
export const getCategoriesWithSubcategories = (): Category[] => {
  return categories.filter(category => category.hasSubcategories);
};

/**
 * Получить статистику категорий и подкатегорий
 */
export const getCategoriesStats = () => {
  const categoriesWithSub = getCategoriesWithSubcategories();
  const totalSubcategories = getAllSubcategories().length;
  
  return {
    totalCategories: categories.length, // 22 категории
    categoriesWithSubcategories: categoriesWithSub.length, // 17 категорий с подкатегориями
    totalSubcategories: totalSubcategories, // 50+ подкатегорий
    withPhrases: 20, // Категории с фразами
    additional: 2, // Дополнительные (customs, sports)
  };
};

