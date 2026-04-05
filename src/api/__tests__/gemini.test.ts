// src/api/__tests__/gemini.test.ts

// Mock @env first
jest.mock('@env', () => ({
  GEMINI_API_KEY: 'test-api-key-mock',
}));

// Create a mock function that we can access and modify
const mockGenerateContentFn = jest.fn();

// Mock @google/generative-ai
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: (...args: any[]) => mockGenerateContentFn(...args),
      }),
    })),
  };
});

// Import after mocks are set up
import { askAI } from '../gemini';

describe('Gemini API', () => {
  beforeEach(() => {
    mockGenerateContentFn.mockReset();
  });

  describe('askAI', () => {
    it('should return AI response for valid prompt', async () => {
      const mockResponse = 'This is a mock AI response';
      mockGenerateContentFn.mockResolvedValueOnce({
        response: {
          text: () => mockResponse,
        },
      });

      const result = await askAI('Hello, AI!');

      expect(result).toBe(mockResponse);
    });

    it('should handle different prompts correctly', async () => {
      mockGenerateContentFn.mockResolvedValueOnce({
        response: {
          text: () => 'Translation: Hello',
        },
      });

      const result = await askAI('Translate "Привет" to English');

      expect(result).toBe('Translation: Hello');
    });

    it('should return error message when API fails', async () => {
      mockGenerateContentFn.mockRejectedValueOnce(new Error('API Error'));

      const result = await askAI('Test prompt');

      expect(result).toBe('Извините, не удалось получить ответ от ИИ. Пожалуйста, попробуйте еще раз позже.');
    });

    it('should handle network timeout errors', async () => {
      mockGenerateContentFn.mockRejectedValueOnce(new Error('Network timeout'));

      const result = await askAI('Any prompt');

      expect(result).toContain('Извините');
    });

    it('should handle rate limit errors', async () => {
      mockGenerateContentFn.mockRejectedValueOnce(new Error('Rate limit exceeded'));

      const result = await askAI('Rate limited prompt');

      expect(result).toContain('не удалось');
    });

    it('should handle empty response', async () => {
      mockGenerateContentFn.mockResolvedValueOnce({
        response: {
          text: () => '',
        },
      });

      const result = await askAI('Empty response prompt');

      expect(result).toBe('');
    });

    it('should handle long prompts', async () => {
      mockGenerateContentFn.mockResolvedValueOnce({
        response: {
          text: () => 'Response to long prompt',
        },
      });

      const result = await askAI('A'.repeat(10000));

      expect(result).toBe('Response to long prompt');
    });

    it('should handle special characters in prompt', async () => {
      mockGenerateContentFn.mockResolvedValueOnce({
        response: {
          text: () => 'Response with special chars',
        },
      });

      const result = await askAI('你好！Привет! مرحبا 🎉');

      expect(result).toBe('Response with special chars');
    });
  });
});
