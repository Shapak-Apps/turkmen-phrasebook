// src/utils/TTSChecker.ts
// Утилита для проверки доступности TTS голосов

import * as Speech from 'expo-speech';
import { Platform } from 'react-native';
import { AppLanguageMode } from '../contexts/LanguageContext';

export interface VoiceInfo {
  identifier: string;
  name: string;
  quality: string;
  language: string;
}

export interface TTSCheckResult {
  hasChineseVoice: boolean;
  hasTurkmenVoice: boolean;
  hasRussianVoice: boolean;
  chineseVoices: VoiceInfo[];
  allVoices: VoiceInfo[];
  needsInternet: boolean;
  platform: string;
}

/**
 * Проверяет доступность TTS голосов для разных языков
 */
export class TTSChecker {
  private static cachedResult: TTSCheckResult | null = null;
  private static lastCheckTime: number = 0;
  private static CACHE_DURATION = 60000; // 1 минута

  /**
   * Проверить доступность китайских голосов
   */
  static async checkChineseVoiceAvailability(): Promise<TTSCheckResult> {
    // Используем кэш, если доступен и не истек
    const now = Date.now();
    if (
      this.cachedResult &&
      now - this.lastCheckTime < this.CACHE_DURATION
    ) {
      return this.cachedResult;
    }

    try {
      const voices = await Speech.getAvailableVoicesAsync();

      // Фильтруем голоса по языкам
      const chineseVoices = voices.filter(voice =>
        voice.language.toLowerCase().startsWith('zh')
      );

      const turkmenVoices = voices.filter(voice =>
        voice.language.toLowerCase().startsWith('tk') ||
        voice.language.toLowerCase().startsWith('tr') // Турецкий как альтернатива
      );

      const russianVoices = voices.filter(voice =>
        voice.language.toLowerCase().startsWith('ru')
      );

      const result: TTSCheckResult = {
        hasChineseVoice: chineseVoices.length > 0,
        hasTurkmenVoice: turkmenVoices.length > 0,
        hasRussianVoice: russianVoices.length > 0,
        chineseVoices,
        allVoices: voices,
        needsInternet: chineseVoices.length === 0, // Если голосов нет, нужен интернет
        platform: Platform.OS,
      };

      // Кэшируем результат
      this.cachedResult = result;
      this.lastCheckTime = now;

      return result;
    } catch (error) {
      console.warn('TTSChecker: Ошибка при проверке голосов:', error);

      // Возвращаем безопасный результат по умолчанию
      return {
        hasChineseVoice: false,
        hasTurkmenVoice: false,
        hasRussianVoice: false,
        chineseVoices: [],
        allVoices: [],
        needsInternet: true,
        platform: Platform.OS,
      };
    }
  }

  /**
   * Получить рекомендации для пользователя
   */
  static async getRecommendations(languageMode: AppLanguageMode): Promise<{
    title: string;
    message: string;
    showWarning: boolean;
    instructions?: string[];
  }> {
    const result = await this.checkChineseVoiceAvailability();

    if (languageMode === 'tk') {
      // Туркмен изучает китайский - нужны китайские голоса
      if (!result.hasChineseVoice) {
        return {
          title: '⚠️ Hytaýça ses ýok',
          message: 'Hytaýça sözlemleriň sesi üçin internet gerek',
          showWarning: true,
          instructions: Platform.OS === 'android' ? [
            '1. Sazlamalary açyň',
            '2. "Ulgam" → "Dil we girişim"',
            '3. "TTS çykyş" → "Dili saýlaň"',
            '4. Hytaý dilini göçürip alyň',
          ] : [
            '1. Sazlamalary açyň',
            '2. "Ýeňil elýeterlilik"',
            '3. "Söz mazmun"',
            '4. Hytaý dilini goşuň',
          ]
        };
      }

      return {
        title: '✅ Ähli sesler elýeterli',
        message: `Hytaýça ses tapyldy: ${result.chineseVoices.length} sany`,
        showWarning: false,
      };
    } else if (languageMode === 'ru') {
      // Russian interface - check Russian voices
      if (!result.hasRussianVoice) {
        return {
          title: '⚠️ Нет русского голоса',
          message: 'Для воспроизведения фраз требуется интернет',
          showWarning: true,
          instructions: Platform.OS === 'android' ? [
            '1. Откройте настройки',
            '2. "Система" → "Язык и ввод"',
            '3. "Синтез речи" → "Выбрать язык"',
            '4. Скачайте русский язык',
          ] : [
            '1. Откройте настройки',
            '2. "Универсальный доступ"',
            '3. "Голосовой контент"',
            '4. Добавьте русский язык',
          ]
        };
      }

      return {
        title: '✅ Все голоса доступны',
        message: `Найдено голосов: ${result.allVoices.length}`,
        showWarning: false,
      };
    } else if (languageMode === 'en') {
      // English interface - usually no issues
      return {
        title: '✅ All voices available',
        message: 'Text-to-speech is ready',
        showWarning: false,
      };
    } else if (languageMode === 'tr') {
      // Turkish interface
      return {
        title: '✅ Tüm sesler mevcut',
        message: 'Metin okuma hazır',
        showWarning: false,
      };
    } else if (languageMode === 'de') {
      // German interface
      return {
        title: '✅ Alle Stimmen verfügbar',
        message: 'Text-zu-Sprache ist bereit',
        showWarning: false,
      };
    } else if (languageMode === 'fr') {
      // French interface
      return {
        title: '✅ Toutes les voix disponibles',
        message: 'La synthèse vocale est prête',
        showWarning: false,
      };
    } else if (languageMode === 'es') {
      // Spanish interface
      return {
        title: '✅ Todas las voces disponibles',
        message: 'El texto a voz está listo',
        showWarning: false,
      };
    } else if (languageMode === 'it') {
      // Italian interface
      return {
        title: '✅ Tutte le voci disponibili',
        message: 'La sintesi vocale è pronta',
        showWarning: false,
      };
    } else if (languageMode === 'pt') {
      // Portuguese interface
      return {
        title: '✅ Todas as vozes disponíveis',
        message: 'Texto para fala está pronto',
        showWarning: false,
      };
    } else if (languageMode === 'nl') {
      // Dutch interface
      return {
        title: '✅ Alle stemmen beschikbaar',
        message: 'Tekst-naar-spraak is klaar',
        showWarning: false,
      };
    } else if (languageMode === 'pl') {
      // Polish interface
      return {
        title: '✅ Wszystkie głosy dostępne',
        message: 'Zamiana tekstu na mowę jest gotowa',
        showWarning: false,
      };
    } else if (languageMode === 'uk') {
      // Ukrainian interface
      return {
        title: '✅ Всі голоси доступні',
        message: 'Синтез мовлення готовий',
        showWarning: false,
      };
    } else if (languageMode === 'ja') {
      // Japanese interface
      return {
        title: '✅ すべての音声が利用可能',
        message: 'テキスト読み上げの準備ができました',
        showWarning: false,
      };
    } else if (languageMode === 'ko') {
      // Korean interface
      return {
        title: '✅ 모든 음성 사용 가능',
        message: '텍스트 음성 변환 준비 완료',
        showWarning: false,
      };
    } else if (languageMode === 'th') {
      // Thai interface
      return {
        title: '✅ เสียงทั้งหมดพร้อมใช้งาน',
        message: 'การแปลงข้อความเป็นเสียงพร้อมแล้ว',
        showWarning: false,
      };
    } else if (languageMode === 'vi') {
      // Vietnamese interface
      return {
        title: '✅ Tất cả giọng nói có sẵn',
        message: 'Chuyển văn bản thành giọng nói đã sẵn sàng',
        showWarning: false,
      };
    } else if (languageMode === 'id') {
      // Indonesian interface
      return {
        title: '✅ Semua suara tersedia',
        message: 'Teks ke ucapan siap',
        showWarning: false,
      };
    } else if (languageMode === 'ms') {
      // Malay interface
      return {
        title: '✅ Semua suara tersedia',
        message: 'Teks ke pertuturan sedia',
        showWarning: false,
      };
    } else if (languageMode === 'hi') {
      // Hindi interface
      return {
        title: '✅ सभी आवाज़ें उपलब्ध',
        message: 'टेक्स्ट टू स्पीच तैयार है',
        showWarning: false,
      };
    } else if (languageMode === 'ur') {
      // Urdu interface
      return {
        title: '✅ تمام آوازیں دستیاب',
        message: 'ٹیکسٹ ٹو اسپیچ تیار ہے',
        showWarning: false,
      };
    } else if (languageMode === 'fa') {
      // Persian interface
      return {
        title: '✅ همه صداها موجود است',
        message: 'متن به گفتار آماده است',
        showWarning: false,
      };
    } else if (languageMode === 'ps') {
      // Pashto interface
      return {
        title: '✅ ټول غږونه شتون لري',
        message: 'متن ته وینا چمتو ده',
        showWarning: false,
      };
    } else if (languageMode === 'uz') {
      // Uzbek interface
      return {
        title: '✅ Barcha ovozlar mavjud',
        message: 'Matnni nutqqa aylantirish tayyor',
        showWarning: false,
      };
    } else if (languageMode === 'kk') {
      // Kazakh interface
      return {
        title: '✅ Барлық дауыстар қолжетімді',
        message: 'Мәтінді сөйлеуге айналдыру дайын',
        showWarning: false,
      };
    } else if (languageMode === 'az') {
      // Azerbaijani interface
      return {
        title: '✅ Bütün səslər mövcuddur',
        message: 'Mətn nitqə hazırdır',
        showWarning: false,
      };
    } else if (languageMode === 'ky') {
      // Kyrgyz interface
      return {
        title: '✅ Бардык үндөр жеткиликтүү',
        message: 'Текстти сүйлөөгө айлантуу даяр',
        showWarning: false,
      };
    } else if (languageMode === 'tg') {
      // Tajik interface
      return {
        title: '✅ Ҳамаи садоҳо мавҷуданд',
        message: 'Матн ба садо табдил шудан омода аст',
        showWarning: false,
      };
    } else if (languageMode === 'hy') {
      // Armenian interface
      return {
        title: '✅ Բոլոր ձայները հասանելի են',
        message: 'Տեքստի արտասանությունը պատրաստ է',
        showWarning: false,
      };
    } else if (languageMode === 'ka') {
      // Georgian interface
      return {
        title: '✅ ყველა ხმა ხელმისაწვდომია',
        message: 'ტექსტის წაკითხვა მზადაა',
        showWarning: false,
      };
    } else if (languageMode === 'ar') {
      // Arabic interface
      return {
        title: '✅ جميع الأصوات متاحة',
        message: 'تحويل النص إلى كلام جاهز',
        showWarning: false,
      };
    } else {
      // Китаец изучает туркменский - проверяем туркменские/турецкие голоса
      if (!result.hasTurkmenVoice) {
        return {
          title: '⚠️ 没有土库曼语音',
          message: '土库曼语短语需要互联网连接才能播放',
          showWarning: true,
          instructions: Platform.OS === 'android' ? [
            '1. 打开设置',
            '2. "系统" → "语言和输入法"',
            '3. "文字转语音输出" → "选择语言"',
            '4. 下载土耳其语（作为替代）',
          ] : [
            '1. 打开设置',
            '2. "辅助功能"',
            '3. "语音内容"',
            '4. 添加土耳其语',
          ]
        };
      }

      return {
        title: '✅ 所有语音可用',
        message: `找到语音: ${result.chineseVoices.length} 种`,
        showWarning: false,
      };
    }
  }

  /**
   * Очистить кэш
   */
  static clearCache(): void {
    this.cachedResult = null;
    this.lastCheckTime = 0;
  }

  /**
   * Тестовое произношение
   */
  static async testVoice(language: 'chinese' | 'turkmen' | 'russian'): Promise<boolean> {
    try {
      const testTexts = {
        chinese: '你好',
        turkmen: 'Salam',
        russian: 'Привет',
      };

      const languageCodes = {
        chinese: 'zh-CN',
        turkmen: 'tr-TR', // Используем турецкий
        russian: 'ru-RU',
      };

      await Speech.speak(testTexts[language], {
        language: languageCodes[language],
        rate: 0.85,
        pitch: 1.0,
      });

      return true;
    } catch (error) {
      console.warn(`TTSChecker: Ошибка тестирования голоса ${language}:`, error);
      return false;
    }
  }
}

export default TTSChecker;
