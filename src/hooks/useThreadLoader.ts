import { useEffect } from "react";
import type { Message } from "../api/types";
import { historyService } from "../api/services/historyService";

//NOTES: Should I add loading state?

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
    if (!selectedThreadID) {
      onThreadCleared();
      return;
    }

    if (selectedThreadID === currentThreadID) return;

    let cancelled = false;
    loadThreadHistory(selectedThreadID, onThreadLoaded, () => cancelled);

    return () => {
      cancelled = true;
    };
  }, [selectedThreadID]);
}

async function loadThreadHistory(
  threadID: string,
  onLoaded: (msgs: Message[], threadID: string) => void,
  isCancelled: () => boolean,
): Promise<void> {
  try {
    const resp = await historyService.threadHistory(threadID);
    if (isCancelled()) return;
    if (resp.success && resp.messages.length > 0) {
      onLoaded(resp.messages, threadID);
    }
  } catch (err) {
    if (!isCancelled()) {
      console.log("Error loading thread", err);
    }
  }
}
