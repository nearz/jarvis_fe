import { useRef, useCallback, useEffect } from "react";

interface UseDelayedCloseOptions {
  /** Delay in milliseconds before closing. Default: 1000 */
  delay?: number;
  /** Callback fired when the delay completes */
  onClose: () => void;
}

interface UseDelayedCloseReturn {
  /** Call this when mouse enters the element to cancel pending close */
  handleMouseEnter: () => void;
  /** Call this when mouse leaves the element to start the close timer */
  handleMouseLeave: () => void;
  /** Manually cancel any pending close timer */
  cancelClose: () => void;
}

/**
 * Hook to manage delayed close behavior for UI elements like dropdowns, trays, or tooltips.
 *
 * Starts a timer when the mouse leaves an element, and cancels it if the mouse
 * re-enters before the delay completes. Useful for preventing accidental closes
 * when users briefly move their mouse away.
 *
 * @example
 * ```tsx
 * function Dropdown({ isOpen, onClose }) {
 *   const { handleMouseEnter, handleMouseLeave } = useDelayedClose({
 *     delay: 500,
 *     onClose,
 *   });
 *
 *   return (
 *     <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
 *       {isOpen && <DropdownContent />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With multiple elements - use separate hook instances
 * function MultiTray({ activeTray, setActiveTray }) {
 *   // Use functional setState to avoid stale closures
 *   const closeChatsTray = useCallback(() => {
 *     setActiveTray(current => current === "chats" ? null : current);
 *   }, []);
 *
 *   const closeProjectsTray = useCallback(() => {
 *     setActiveTray(current => current === "projects" ? null : current);
 *   }, []);
 *
 *   // Each tray gets its own hook instance
 *   const chatsTray = useDelayedClose({ delay: 1000, onClose: closeChatsTray });
 *   const projectsTray = useDelayedClose({ delay: 1000, onClose: closeProjectsTray });
 *
 *   return (
 *     <>
 *       <Tray onMouseEnter={chatsTray.handleMouseEnter} onMouseLeave={chatsTray.handleMouseLeave}>
 *         ...
 *       </Tray>
 *       <Tray onMouseEnter={projectsTray.handleMouseEnter} onMouseLeave={projectsTray.handleMouseLeave}>
 *         ...
 *       </Tray>
 *     </>
 *   );
 * }
 * ```
 */
export function useDelayedClose(
  options: UseDelayedCloseOptions,
): UseDelayedCloseReturn {
  const { delay = 1000, onClose } = options;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Cancel any pending close timer.
   * Called internally by handleMouseEnter, but also exposed for manual control.
   */
  const cancelClose = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Handle mouse entering the element - cancels any pending close.
   */
  const handleMouseEnter = useCallback(() => {
    cancelClose();
  }, [cancelClose]);

  /**
   * Handle mouse leaving the element - starts the close timer.
   */
  const handleMouseLeave = useCallback(() => {
    // Cancel any existing timer first
    cancelClose();

    timerRef.current = setTimeout(() => {
      onClose();
      timerRef.current = null;
    }, delay);
  }, [delay, onClose, cancelClose]);

  // Cleanup timer on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    handleMouseEnter,
    handleMouseLeave,
    cancelClose,
  };
}
