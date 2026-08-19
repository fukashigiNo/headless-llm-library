import { renderHook, act } from '@testing-library/react';
import { useLLMStream } from '../useLLMStream';
import { describe, it, expect, vi } from 'vitest';

describe('useLLMStream Hook', () => {
  it('должен иметь правильный начальный стейт', () => {
    const { result } = renderHook(() => useLLMStream());

    expect(result.current.text).toBe('');
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('должен обрабатывать ошибки fetch', async () => {
    // Подменяем fetch, заставляя его выдать ошибку
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    const { result } = renderHook(() => useLLMStream());

    // act() используется, когда мы вызываем функции, меняющие стейт хука
    await act(async () => {
      await result.current.startStream('https://fake-url.com');
    });

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
  });
});