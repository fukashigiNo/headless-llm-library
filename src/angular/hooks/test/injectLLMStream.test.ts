import { describe, it, expect, vi, beforeEach } from 'vitest';
import { injectLLMStream } from '../injectLLMStream';

vi.mock('@angular/core', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    inject: (token: any) => {
      if (token === actual.DestroyRef) {
        return { onDestroy: vi.fn() };
      }
      return actual.inject(token); 
    }
  };
});

describe('injectLLMStream (Angular Isolated)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('инициализируется с правильным базовым состоянием', () => {
    const { messages, isStreaming, error } = injectLLMStream();
    
    expect(messages()).toEqual([]);
    expect(isStreaming()).toBe(false);
    expect(error()).toBe(null);
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