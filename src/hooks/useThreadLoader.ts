import { useEffect } from "react";
import type { Message } from "../api/types";
import { historyService } from "../api/services/historyService";

interface UseThreadLoaderOptions {
  /** The thread ID selected from navigation/external source */
  selectedThreadID: string;
  /** The current thread ID in local state */
  currentThreadID: string;
  /** Callback when thread is successfully loaded */
  onThreadLoaded: (messages: Message[], threadID: string) => void;
  /** Callback when thread is cleared (no selection) */
  onThreadCleared: () => void;
}

/**
 * Hook to handle loading thread history when a thread is selected.
 *
 * Handles:
 * - Loading thread messages when selectedThreadID changes
 * - Clearing state when no thread is selected
 * - Preventing reload when thread is already loaded
 * - Cleanup on unmount/re-render
 *
 * @example
 * ```tsx
 * useThreadLoader({
 *   selectedThreadID,
 *   currentThreadID: threadID,
 *   onThreadLoaded: (messages, id) => {
 *     setMsgList(messages);
 *     setThreadID(id);
 *   },
 *   onThreadCleared: () => {
 *     setMsgList([]);
 *     setThreadID("");
 *   },
 * });
 * ```
 */
export function useThreadLoader({
  selectedThreadID,
  currentThreadID,
  onThreadLoaded,
  onThreadCleared,
}: UseThreadLoaderOptions): void {
  useEffect(() => {
    // Clear state when no thread is selected
    if (!selectedThreadID) {
      onThreadCleared();
      return;
    }

    // Skip loading if we're already on this thread
    // (e.g., when threadID was set internally after creating a new thread)
    if (selectedThreadID === currentThreadID) return;

    let cancelled = false;
    (async () => {
      try {
        const resp = await historyService.threadHistory(selectedThreadID);
        if (cancelled) return;
        if (resp.success && resp.messages.length > 0) {
          onThreadLoaded(resp.messages, selectedThreadID);
        }
      } catch (err) {
        if (!cancelled) {
          console.log("Error loading thread", err);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedThreadID]);
}
