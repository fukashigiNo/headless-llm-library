import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutoScrollDirective } from '../index';

@Component({
  standalone: true,
  imports: [AutoScrollDirective],
  template: `
    <div llmAutoScroll style="height: 100px; overflow-y: auto;" class="scroll-container">
      <div style="height: 500px;">Контент</div>
    </div>
  `
})
class TestHostComponent {}

describe('AutoScrollDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let container: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges(); 
    
    container = fixture.nativeElement.querySelector('.scroll-container');
  });

  it('ставит автоскролл на паузу, если пользователь прокрутил вверх', () => {
    Object.defineProperty(container, 'scrollHeight', { value: 500, configurable: true });
    Object.defineProperty(container, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(container, 'scrollTop', { value: 400, writable: true, configurable: true });

    container.scrollTop = 350;
    container.dispatchEvent(new Event('scroll'));

    const mutationCallback = vi.spyOn(container, 'scrollTop', 'set');
    
    container.appendChild(document.createElement('div'));
    
    return Promise.resolve().then(() => {
      expect(mutationCallback).not.toHaveBeenCalled();
    });
  });

  it('снимает паузу автоскролла, если прокрутить в самый низ', async () => {
    Object.defineProperty(container, 'scrollHeight', { value: 500, configurable: true });
    Object.defineProperty(container, 'clientHeight', { value: 100, configurable: true });
    Object.defineProperty(container, 'scrollTop', { value: 0, writable: true, configurable: true });

    container.dispatchEvent(new Event('scroll'));

    container.scrollTop = 400;
    container.dispatchEvent(new Event('scroll'));

    const mutationCallback = vi.spyOn(container, 'scrollTop', 'set');
    
    container.appendChild(document.createElement('div'));
    
    await Promise.resolve(); 
    
    expect(mutationCallback).toHaveBeenCalled();
  });
});