// src/services/TranslationService.ts
// Общий сервис для перевода текста через бесплатные API

const MYMEMORY_API = 'https://api.mymemory.translated.net/get';
const LIBRETRANSLATE_API = 'https://libretranslate.com/translate';

interface TranslationAvailability {
  myMemory: boolean;
  libreTranslate: boolean;
}

class TranslationService {
  /**
   * Переводит текст с одного языка на другой
   * Использует MyMemory API (бесплатный, 5000 слов/день)
   */
  async translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string> {
    if (!text || text.trim().length === 0) {
      return '';
    }

    // Пробуем MyMemory API (основной)
    try {
      const result = await this.translateWithMyMemory(text, sourceLanguage, targetLanguage);
      if (result) {
        return result;
      }
    } catch (error) {
      console.warn('[TranslationService] MyMemory failed:', error);
    }

    // Fallback: LibreTranslate
    try {
      const result = await this.translateWithLibreTranslate(text, sourceLanguage, targetLanguage);
      if (result) {
        return result;
      }
    } catch (error) {
      console.warn('[TranslationService] LibreTranslate failed:', error);
    }

    // Если все API недоступны, возвращаем оригинальный текст
    console.error('[TranslationService] All translation APIs failed');
    return text;
  }

  /**
   * Перевод через MyMemory API
   */
  private async translateWithMyMemory(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string | null> {
    const langPair = `${sourceLanguage === 'auto' ? 'en' : sourceLanguage}|${targetLanguage}`;
    const url = `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${langPair}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    return null;
  }

  /**
   * Перевод через LibreTranslate API
   */
  private async translateWithLibreTranslate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string | null> {
    const response = await fetch(LIBRETRANSLATE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLanguage === 'auto' ? 'auto' : sourceLanguage,
        target: targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error(`LibreTranslate API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.translatedText) {
      return data.translatedText;
    }

    return null;
  }

  /**
   * Проверяет доступность API переводов
   */
  async checkAvailability(): Promise<TranslationAvailability> {
    const results: TranslationAvailability = {
      myMemory: false,
      libreTranslate: false,
    };

    // Проверяем MyMemory
    try {
      const testUrl = `${MYMEMORY_API}?q=test&langpair=en|ru`;
      const response = await fetch(testUrl, { method: 'GET' });
      results.myMemory = response.ok;
    } catch {
      results.myMemory = false;
    }

    // Проверяем LibreTranslate
    try {
      const response = await fetch('https://libretranslate.com/languages', { method: 'GET' });
      results.libreTranslate = response.ok;
    } catch {
      results.libreTranslate = false;
    }

    return results;
  }
}

export default new TranslationService();
