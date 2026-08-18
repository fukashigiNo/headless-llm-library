import { useRef, useEffect, useState, useCallback } from "react"

export const useAutoScroll = <T extends HTMLElement = HTMLDivElement> () => {
    const containerRef = useRef<T>(null)

    const [isSticky, setIsSticky] = useState(true)
    const isStickyRef = useRef(isSticky)
    useEffect(() => {
        isStickyRef.current = isSticky
    }, [isSticky])

    const scrollToBottom = useCallback(() => {
        requestAnimationFrame(() => {
            if (containerRef.current) { 
                containerRef.current.scrollTop = containerRef.current.scrollHeight
            }
        })
    }, [])

    const handleScroll = useCallback(() => {
        if (!containerRef.current) return

        const {scrollTop, scrollHeight, clientHeight} = containerRef.current

        const isABottom = Math.abs(scrollHeight - scrollTop - clientHeight)  < 20

        setIsSticky(isABottom)
    }, [])

    useEffect(() => {
        const container = containerRef.current
        if(!container) return

        const observer = new MutationObserver(() => {
            if (isSticky) {
                scrollToBottom()
            }
        })

        observer.observe(container, {
            childList: true,
            subtree: true,
            characterData: true
        })
  

        return () => observer.disconnect()
    }, [scrollToBottom])

    return {
        containerRef,
        isSticky,
        scrollToBottom,
        handleScroll
    }
}