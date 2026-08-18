import { useEffect, useRef, useState, useCallback } from 'react';
import { AutoScroller } from '../../core/AutoScroller';

export interface UseAutoScrollOptions {
  behavior?: ScrollBehavior;
  threshold?: number;
}

export const useAutoScroll = <T extends HTMLElement = HTMLDivElement>(
  options: UseAutoScrollOptions = {}
) => {
  const { behavior = 'auto', threshold = 20 } = options;

  const containerRef = useRef<T>(null);
  const [isSticky, setIsSticky] = useState(true);
  const scrollerRef = useRef<AutoScroller | null>(null);

  const scrollToBottom = useCallback(() => {
    scrollerRef.current?.scrollToBottom();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    scrollerRef.current = new AutoScroller({
      container,
      behavior,
      threshold,
      onStickyChange: (stickyState) => setIsSticky(stickyState),
    });

    scrollerRef.current.start();

    return () => {
      scrollerRef.current?.stop();
    };
  }, [behavior, threshold]);

  return {
    containerRef,
    isSticky,
    scrollToBottom,
  };
};