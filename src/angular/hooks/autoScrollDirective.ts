import { Directive, ElementRef, OnInit, OnDestroy, HostListener } from '@angular/core';

@Directive({
  selector: '[llmAutoScroll]',
  standalone: true
})
export class AutoScrollDirective implements OnInit, OnDestroy {
  private isAutoScrollPaused = false;
  private observer: MutationObserver | null = null;

  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('scroll')
  onScroll() {
    const { scrollTop, scrollHeight, clientHeight } = this.el.nativeElement;
    const distanceToBottom = scrollHeight - scrollTop - clientHeight;
    this.isAutoScrollPaused = distanceToBottom > 10;
  }

  ngOnInit() {
    this.observer = new MutationObserver(() => {
      if (!this.isAutoScrollPaused) {
        this.scrollToBottom();
      }
    });

    this.observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true,
      characterData: true 
    });
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private scrollToBottom() {
    this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
  }
}