export type AutoScrollerOptions =  {
    container: HTMLElement;
    onStickyChange?: (isSticky: boolean) => void
    threshold?: number
    behavior?: ScrollBehavior
}

export class AutoScroller  {
    private container: HTMLElement;
    private isSticky: boolean = false;
    private observer: MutationObserver |  null = null
    private onStickyChange?: (isSticky: boolean) => void
    private threshold: number 
    private behavior: ScrollBehavior

    constructor (options: AutoScrollerOptions) {
        this.container = options.container
        this.onStickyChange = options.onStickyChange
        this.threshold = options.threshold || 20
        this.behavior = options.behavior || "auto"

        this.handleScroll = this.handleScroll.bind(this)
        this.scrollToBottom = this.scrollToBottom.bind(this)
    }

    public start() {
        this.container.addEventListener("scroll", this.handleScroll)

        this.observer = new MutationObserver (() => {
            if(this.isSticky) {
                this.scrollToBottom()
            }
        });

        this.observer.observe(this.container, {
            childList: true,
            subtree: true,
            characterData: true
        })
    }

    public stop() {
        this.container.removeEventListener("scroll", this.handleScroll)
        if(this.observer) {
            this.observer?.disconnect()
            this.observer = null
        }
    }

    public scrollToBottom() {
        requestAnimationFrame(() => {
            this.container.scrollTo({
                top: this.container.scrollHeight,
                behavior: this.behavior
            })
        });
    }

    public handleScroll() {
        const { scrollTop, scrollHeight, clientHeight } = this.container;
        const isAtBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < this.threshold;
    
        if (this.isSticky !== isAtBottom) {
            this.isSticky = isAtBottom;
            if (this.onStickyChange) {
                this.onStickyChange(this.isSticky);
            }  
        }
    }
}

export default AutoScroller