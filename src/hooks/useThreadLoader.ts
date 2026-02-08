import { useEffect, useState } from "react";
import type { Message } from "../api/types";
import { historyService } from "../api/services/historyService";

interface UseThreadLoaderOptions {
  /** The thread ID selected from navigation/external source */
  selectedThreadID: string;
  /** Callback when thread is successfully loaded */
  onThreadLoaded: (messages: Message[]) => void;
  /** Callback when thread is cleared (no selection) */
  onThreadCleared: () => void;
}

interface UseThreadLoaderReturn {
  /** Whether thread data is currently being fetched */
  loading: boolean;
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
 *   onThreadLoaded: (messages) => {
 *     setMsgList(messages);
 *   },
 *   onThreadCleared: () => {
 *     setMsgList([]);
 *   },
 * });
 * ```
 */

export function useThreadLoader({
  selectedThreadID,
  onThreadLoaded,
  onThreadCleared,
}: UseThreadLoaderOptions): UseThreadLoaderReturn {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!selectedThreadID) {
      onThreadCleared();
      return;
    }

    let cancelled = false;
    loadThreadHistory(
      selectedThreadID,
      onThreadLoaded,
      setLoading,
      () => cancelled,
    );

    return () => {
      cancelled = true;
    };
  }, [selectedThreadID]);
  return { loading };
}

async function loadThreadHistory(
  threadID: string,
  onLoaded: (msgs: Message[]) => void,
  setLoading: (isLoading: boolean) => void,
  isCancelled: () => boolean,
): Promise<void> {
  try {
    setLoading(true);
    const resp = await historyService.threadHistory(threadID);
    if (isCancelled()) return;
    if (resp.success && resp.messages.length > 0) {
      onLoaded(resp.messages);
    }
  } catch (err) {
    if (!isCancelled()) {
      console.log("Error loading thread", err);
    }
  } finally {
    setLoading(false);
  }
}
