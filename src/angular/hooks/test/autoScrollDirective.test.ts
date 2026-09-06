import { describe, it, expect, vi } from 'vitest';
import { AutoScrollDirective } from '../autoScrollDirective';
import { ElementRef } from '@angular/core';

describe('AutoScrollDirective (Isolated)', () => {
  it('ставит автоскролл на паузу, если пользователь прокрутил вверх', async () => {
    const mockElement = document.createElement('div');
    
    Object.defineProperty(mockElement, 'scrollHeight', { value: 500, configurable: true });
    Object.defineProperty(mockElement, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(mockElement, 'scrollTop', { value: 400, writable: true, configurable: true });

    const directive = new AutoScrollDirective(new ElementRef(mockElement));
    directive.ngOnInit();

    mockElement.scrollTop = 350;
    directive.onScroll();

    const mutationCallback = vi.spyOn(mockElement, 'scrollTop', 'set');
    
    mockElement.appendChild(document.createElement('div'));
    
    await Promise.resolve(); 

    expect(mutationCallback).not.toHaveBeenCalled();

    directive.ngOnDestroy();
  });

  it('снимает паузу автоскролла, если прокрутить в самый низ', async () => {
    const mockElement = document.createElement('div');
    Object.defineProperty(mockElement, 'scrollHeight', { value: 500, configurable: true });
    Object.defineProperty(mockElement, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(mockElement, 'scrollTop', { value: 0, writable: true, configurable: true });

    const directive = new AutoScrollDirective(new ElementRef(mockElement));
    directive.ngOnInit();

    directive.onScroll();

    mockElement.scrollTop = 400;
    directive.onScroll();

    const mutationCallback = vi.spyOn(mockElement, 'scrollTop', 'set');
    
    mockElement.appendChild(document.createElement('div'));
    
    await Promise.resolve();
    
    expect(mutationCallback).toHaveBeenCalled();

    directive.ngOnDestroy();
  });
});