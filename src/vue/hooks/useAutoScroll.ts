import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useAutoScroll() {
  const containerRef = ref<HTMLElement | null>(null);
  const isAutoScrollPaused = ref(false);
  let observer: MutationObserver | null = null;

  const scrollToBottom = () => {
    if (!containerRef.value) return;
    containerRef.value.scrollTop = containerRef.value.scrollHeight;
  };

  const handleScroll = () => {
    if (!containerRef.value) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.value;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    isAutoScrollPaused.value = distanceToBottom > 10;
  };

  onMounted(() => {
    if (!containerRef.value) return;
    
    containerRef.value.addEventListener('scroll', handleScroll);

    observer = new MutationObserver(() => {
      if (!isAutoScrollPaused.value) {
        scrollToBottom();
      }
    });

    observer.observe(containerRef.value, {
      childList: true,
      subtree: true,
      characterData: true
    });
  });

  onBeforeUnmount(() => {
    if (containerRef.value) {
      containerRef.value.removeEventListener('scroll', handleScroll);
    }
    if (observer) {
      observer.disconnect();
    }
  });

  return {
    containerRef,
    isAutoScrollPaused,
    scrollToBottom
  };
}