import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useLLMStream } from "../useLLMStream";

describe('useLLMStream', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('инициализируется с правильным базовым состоянием', () => {
    const { messages, isStreaming, error } = useLLMStream();
    
    expect(messages.value).toEqual([]);
    expect(isStreaming.value).toBe(false);
    expect(error.value).toBe(null);
  });

  it('успешно обрабатывает стриминг данных', async () => {
    const mockChunks = ['Hello, ', 'I am ', 'AI!'];
    let chunkIndex = 0;

    const mockReader = {
      read: vi.fn().mockImplementation(() => {
        if (chunkIndex < mockChunks.length) {
          const value = new TextEncoder().encode(mockChunks[chunkIndex++]);
          return Promise.resolve({ done: false, value });
        }
        return Promise.resolve({ done: true });
      }),
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: { getReader: () => mockReader },
    });

    const { messages, isStreaming, send } = useLLMStream();

    const sendPromise = send('Привет');
    
    expect(isStreaming.value).toBe(true);
    expect(messages.value[0].content).toBe('Привет');
    
    await sendPromise;

    expect(isStreaming.value).toBe(false);
    expect(messages.value.length).toBe(2);
    expect(messages.value[1].content).toBe('Hello, I am AI!'); 
  });

  it('прерывает запрос при вызове stop()', async () => {
    global.fetch = vi.fn().mockImplementation((url, options) => {
      return new Promise((_, reject) => {
        options.signal.addEventListener('abort', () => {
          const err = new Error('AbortError');
          err.name = 'AbortError';
          reject(err);
        });
      });
    });

    const { isStreaming, send, stop } = useLLMStream();

    const sendPromise = send('Привет');
    expect(isStreaming.value).toBe(true);

    stop(); 
    await sendPromise;

    expect(isStreaming.value).toBe(false);
  });
});