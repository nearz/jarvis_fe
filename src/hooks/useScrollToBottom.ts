import { useRef, useCallback, useEffect } from "react";

interface UseScrollToBottomOptions {
  /** Distance from bottom (in pixels) to consider "near bottom". Default: 150 */
  threshold?: number;
}

interface UseScrollToBottomReturn {
  /** Ref to attach to the scrollable container element */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Call this on the container's onScroll event */
  handleScroll: () => void;
  /** Programmatically scroll to bottom */
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  /** Programmatically scroll to bottom if user is within threshold */
  scrollToBottomIfEnabled: (behavior?: ScrollBehavior) => void;
  /** Reset auto-scroll to enabled (useful when loading new content) */
  enableAutoScroll: () => void;
}

/**
 * Hook to manage auto-scrolling behavior for chat-like interfaces.
 *
 * Features:
 * - Auto-scrolls to bottom when new content arrives (if user is near bottom)
 * - Respects user scroll position (stops auto-scroll if user scrolls up)
 * - Provides manual scroll-to-bottom function
 *
 * @example
 * ```tsx
 * function ChatMessages({ messages }) {
 *   const { containerRef, handleScroll, scrollToBottom } = useScrollToBottom();
 *
 *   return (
 *     <div ref={containerRef} onScroll={handleScroll}>
 *       {messages.map(msg => <Message key={msg.id} {...msg} />)}
 *     </div>
 *   );
 * }
 * ```
 */
export function useScrollToBottom(
  options: UseScrollToBottomOptions = {},
): UseScrollToBottomReturn {
  const { threshold = 150 } = options;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef<boolean>(true);

  /**
   * Check if the scroll position is near the bottom of the container.
   * Used to determine if we should auto-scroll when new content arrives.
   */
  const isNearBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;

    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight < threshold;
  }, [threshold]);

  /**
   * Scroll the container to the bottom.
   * @param behavior - "smooth" for animated scroll, "instant" for immediate
   */
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    }
  }, []);

  /**
   * Scroll the container to the bottom.
   * @param behavior - "smooth" for animated scroll, "instant" for immediate
   */
  const scrollToBottomIfEnabled = useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      if (shouldAutoScrollRef.current) {
        scrollToBottom(behavior);
      }
    },
    [scrollToBottom],
  );

  /**
   * Handle scroll events - updates whether auto-scroll should be enabled
   * based on if the user has scrolled away from the bottom.
   */
  const handleScroll = useCallback(() => {
    shouldAutoScrollRef.current = isNearBottom();
  }, [isNearBottom]);

  /**
   * Manually enable auto-scroll (useful when switching threads/conversations)
   */
  const enableAutoScroll = useCallback(() => {
    shouldAutoScrollRef.current = true;
  }, []);

  return {
    containerRef,
    handleScroll,
    scrollToBottom,
    scrollToBottomIfEnabled,
    enableAutoScroll,
  };
}

/**
 * Hook to trigger auto-scroll when dependencies change.
 * Use this alongside useScrollToBottom for automatic scrolling on new content.
 *
 * @example
 * ```tsx
 * const { containerRef, handleScroll, scrollToBottom } = useScrollToBottom();
 *
 * // Auto-scroll when messages change
 * useAutoScroll(scrollToBottom, [messages]);
 *
 * // Auto-scroll during streaming (more frequent updates)
 * useAutoScroll(scrollToBottom, [streamingContent], { behavior: "smooth" });
 * ```
 */
export function useAutoScroll(
  scrollToBottom: (behavior?: ScrollBehavior) => void,
  deps: React.DependencyList,
  options: { behavior?: ScrollBehavior; enabled?: boolean } = {},
) {
  const { behavior = "smooth", enabled = true } = options;

  useEffect(() => {
    if (enabled) {
      scrollToBottom(behavior);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
