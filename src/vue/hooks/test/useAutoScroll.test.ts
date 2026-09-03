import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, ref, nextTick } from 'vue';
import { useAutoScroll } from '../useAutoScroll';

const TestComponent = defineComponent({
  template: `
    <div ref="containerRef" style="height: 100px; overflow-y: auto;">
      <div style="height: 500px;">Контент</div>
    </div>
  `,
  setup() {
    const { containerRef, isAutoScrollPaused, scrollToBottom } = useAutoScroll();
    return { containerRef, isAutoScrollPaused, scrollToBottom };
  }
});

describe('useAutoScroll', () => {
  it('ставит автоскролл на паузу, если пользователь прокрутил вверх', async () => {
    const wrapper = mount(TestComponent);
    const container = wrapper.element as HTMLElement;

    Object.defineProperty(container, 'scrollHeight', { value: 500 });
    Object.defineProperty(container, 'clientHeight', { value: 100 });
    Object.defineProperty(container, 'scrollTop', { value: 400, writable: true });

    expect(wrapper.vm.isAutoScrollPaused).toBe(false);

    container.scrollTop = 350;
    container.dispatchEvent(new Event('scroll'));

    await nextTick();

    expect(wrapper.vm.isAutoScrollPaused).toBe(true);
  });

  it('снимает паузу автоскролла, если прокрутить в самый низ', async () => {
    const wrapper = mount(TestComponent);
    const container = wrapper.element as HTMLElement;

    Object.defineProperty(container, 'scrollHeight', { value: 500 });
    Object.defineProperty(container, 'clientHeight', { value: 100 });
    Object.defineProperty(container, 'scrollTop', { value: 0, writable: true });

    container.dispatchEvent(new Event('scroll'));
    await nextTick();
    expect(wrapper.vm.isAutoScrollPaused).toBe(true);

    container.scrollTop = 400;
    container.dispatchEvent(new Event('scroll'));
    await nextTick();
    
    expect(wrapper.vm.isAutoScrollPaused).toBe(false);
  });

  it('отписывается от событий при демонтировании', () => {
    const wrapper = mount(TestComponent);
    const container = wrapper.element as HTMLElement;
    
    const removeEventListenerSpy = vi.spyOn(container, 'removeEventListener');
    
    wrapper.unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});