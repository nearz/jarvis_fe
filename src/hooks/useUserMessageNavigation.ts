import { useCallback, useEffect, useRef, useState } from "react";

interface UseUserMessageNavigationOptions {
  /** Ref to the scrollable container element */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Callback to scroll the container to the bottom */
  scrollToBottom: (behavior?: ScrollBehavior) => void;
}

interface UseUserMessageNavigationReturn {
  /** Navigate to the previous user message */
  navigateUp: () => void;
  /** Navigate to the next user message, or scroll to bottom if at the last */
  navigateDown: () => void;
  /** Whether the scroll container is at the top */
  isAtTop: boolean;
  /** Whether the scroll container is at the bottom */
  isAtBottom: boolean;
}

/**
 * Hook to navigate between user messages in a scrollable chat container.
 *
 * Provides up/down navigation that scrolls to the previous/next user message.
 * When navigating past the last user message, scrolls to the bottom of the container.
 *
 * User message elements must have a `data-user-msg-index` attribute set on them.
 */
export function useUserMessageNavigation({
  containerRef,
  scrollToBottom,
}: UseUserMessageNavigationOptions): UseUserMessageNavigationReturn {
  const currentIndexRef = useRef<number>(-1);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  /**
   * Track scroll position to determine if the container is at the top or bottom.
   * Attaches a passive scroll listener and updates state on each scroll event.
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScrollPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setIsAtTop(scrollTop <= 10);
      setIsAtBottom(scrollHeight - scrollTop - clientHeight <= 10);
    };

    updateScrollPosition();
    container.addEventListener("scroll", updateScrollPosition, {
      passive: true,
    });
    return () => container.removeEventListener("scroll", updateScrollPosition);
  }, [containerRef]);

  /**
   * Query all user message elements from the scrollable container.
   * Elements are identified by the `data-user-msg-index` attribute.
   */
  const getUserMessageElements = useCallback(() => {
    const container = containerRef.current;
    if (!container) return [];
    return Array.from(
      container.querySelectorAll<HTMLElement>("[data-user-msg-index]"),
    );
  }, [containerRef]);

  /**
   * Find the index (within the user-message elements list) of the user message
   * closest to the top of the visible scroll area.
   */
  const findCurrentIndex = useCallback(() => {
    const container = containerRef.current;
    const elements = getUserMessageElements();
    if (!container || elements.length === 0) return -1;

    const containerRect = container.getBoundingClientRect();

    for (let i = elements.length - 1; i >= 0; i--) {
      const elRect = elements[i].getBoundingClientRect();
      // Element top relative to container top, accounting for scroll
      if (elRect.top <= containerRect.top + 50) {
        return i;
      }
    }
    return 0;
  }, [containerRef, getUserMessageElements]);

  /**
   * Smoothly scroll a given element to the top of the container.
   * @param element - The DOM element to scroll into view
   */
  const scrollToElement = useCallback(
    (element: HTMLElement) => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const elRect = element.getBoundingClientRect();
      const scrollOffset = elRect.top - containerRect.top + container.scrollTop;

      container.scrollTo({
        top: scrollOffset,
        behavior: "smooth",
      });
    },
    [containerRef],
  );

  /**
   * Navigate to the previous user message in the thread.
   * If the current user message is not visible (scrolled out of view),
   * navigates to it first rather than skipping to the one above.
   */
  const navigateUp = useCallback(() => {
    const container = containerRef.current;
    const elements = getUserMessageElements();
    if (!container || elements.length === 0) return;

    const current = findCurrentIndex();
    const currentElement = elements[current];

    let targetIndex: number;
    if (currentElement) {
      const containerRect = container.getBoundingClientRect();
      const elRect = currentElement.getBoundingClientRect();
      const isVisible =
        elRect.bottom > containerRect.top && elRect.top < containerRect.bottom;
      targetIndex = isVisible ? Math.max(0, current - 1) : current;
    } else {
      targetIndex = Math.max(0, current - 1);
    }

    currentIndexRef.current = targetIndex;
    scrollToElement(elements[targetIndex]);
  }, [containerRef, getUserMessageElements, findCurrentIndex, scrollToElement]);

  /**
   * Navigate to the next user message in the thread.
   * If already at or past the last user message, scrolls to the bottom of the container.
   */
  const navigateDown = useCallback(() => {
    const elements = getUserMessageElements();
    if (elements.length === 0) return;

    const current = findCurrentIndex();
    const nextIndex = current + 1;

    // If at or past the last user message, scroll to bottom
    if (nextIndex >= elements.length) {
      scrollToBottom("smooth");
      currentIndexRef.current = elements.length - 1;
      return;
    }

    currentIndexRef.current = nextIndex;
    scrollToElement(elements[nextIndex]);
  }, [
    getUserMessageElements,
    findCurrentIndex,
    scrollToElement,
    scrollToBottom,
  ]);

  return { navigateUp, navigateDown, isAtTop, isAtBottom };
}
