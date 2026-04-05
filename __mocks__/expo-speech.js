export const speak = jest.fn();
export const stop = jest.fn();
export const getAvailableVoicesAsync = jest.fn(() => Promise.resolve([{ identifier: 'test-voice' }]));
export const VoiceQuality = { Enhanced: 'Enhanced' };