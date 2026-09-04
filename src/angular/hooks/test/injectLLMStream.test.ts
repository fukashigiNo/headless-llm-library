import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { injectLLMStream } from '../index';

describe('injectLLMStream (Angular)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('инициализируется с правильным базовым состоянием', () => {
    // Запускаем внутри контекста Angular, чтобы inject(DestroyRef) сработал
    TestBed.runInInjectionContext(() => {
      const { messages, isStreaming, error } = injectLLMStream();
      
      expect(messages()).toEqual([]);
      expect(isStreaming()).toBe(false);
      expect(error()).toBe(null);
    });
  });

  it('успешно обрабатывает стриминг данных', async () => {
    const mockChunks = ['Hello, ', 'I am ', 'Angular!'];
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

    await TestBed.runInInjectionContext(async () => {
      const { messages, isStreaming, send } = injectLLMStream();

      const sendPromise = send('Привет');
      
      expect(isStreaming()).toBe(true);
      expect(messages()[0].content).toBe('Привет');
      
      await sendPromise;

      expect(isStreaming()).toBe(false);
      expect(messages().length).toBe(2);
      expect(messages()[1].content).toBe('Hello, I am Angular!');
    });
  });
});