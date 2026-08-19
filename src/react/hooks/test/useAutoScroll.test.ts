import { renderHook } from '@testing-library/react';
import { useAutoScroll } from '../useAutoScroll';
import { describe, it, expect, vi, beforeAll } from 'vitest';

describe('useAutoScroll Hook', () => {
  // Перед запуском тестов создаем фейковый MutationObserver, 
  // так как в чистом Node.js/jsdom его может не быть
 vi.stubGlobal('MutationObserver', class {
      constructor(callback: any) {}
      disconnect() {}
      observe(element: any, initObject: any) {}
    });

  it('должен инициализироваться с дефолтными значениями', () => {
    // Рендерим наш хук в изоляции
    const { result } = renderHook(() => useAutoScroll());

    // Проверяем, что isSticky изначально true
    expect(result.current.isSticky).toBe(true);
    
    // Проверяем, что ref создан и пока пустой
    expect(result.current.containerRef.current).toBeNull();
    
    // Проверяем, что метод scrollToBottom возвращается
    expect(typeof result.current.scrollToBottom).toBe('function');
  });

  it('должен принимать кастомные настройки', () => {
    // Можем передать настройки и убедиться, что ничего не падает
    const { result } = renderHook(() => useAutoScroll({ behavior: 'smooth', threshold: 50 }));
    expect(result.current.isSticky).toBe(true);
  });;
});