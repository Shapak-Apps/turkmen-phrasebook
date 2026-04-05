import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "@env";

// Проверяем, что API ключ доступен
if (!GEMINI_API_KEY) {
  throw new Error("Gemini API ключ не найден. Убедитесь, что он добавлен в .env файл.");
}

// Инициализируем клиент с API ключом
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Отправляет промпт в модель Gemini и возвращает ответ.
 * @param prompt - Текстовый запрос для модели.
 * @returns - Текстовый ответ от модели.
 */
export async function askAI(prompt: string): Promise<string> {
  try {
    // Указываем модель, которую хотим использовать
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Ошибка при обращении к Gemini API:", error);
    // Возвращаем пользователю сообщение об ошибке
    return "Извините, не удалось получить ответ от ИИ. Пожалуйста, попробуйте еще раз позже.";
  }
}

