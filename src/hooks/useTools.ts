import { useState, useCallback } from "react";
import { useThreadMarks } from "./useThreadMarks";
import type { ThreadMark } from "../components/navigation/MainView";
import type { Message } from "../api/types";

interface UseToolsOptions {
  /** Ref to the scrollable thread container */
  threadContainerRef: React.RefObject<HTMLDivElement | null>;
  /** Current list of messages in the thread */
  msgList: Message[];
  /** Whether the AI is currently streaming a response */
  isStreaming: boolean;
}

interface UseToolsReturn {
  /** Whether the Tools panel is open */
  toolsOpen: boolean;
  /** Toggle the Tools panel open/closed */
  toggleTools: () => void;
  /** Close the Tools panel */
  closeTools: () => void;
  /** Reactively computed thread marks */
  threadMarks: ThreadMark[];
  /** Scroll the thread container to a mark by its element ID */
  scrollToMark: (markID: string) => void;
}

/**
 * Hook that orchestrates the Tools sidebar panel.
 *
 * Owns the open/closed toggle state, derives thread marks reactively via
 * useThreadMarks, and provides a direct scroll callback that bypasses
 * React state (fixing the re-click bug).
 */
export function useTools({
  threadContainerRef,
  msgList,
  isStreaming,
}: UseToolsOptions): UseToolsReturn {
  const [toolsOpen, setToolsOpen] = useState(false);

  const threadMarks = useThreadMarks({
    containerRef: threadContainerRef,
    msgList,
    isStreaming,
  });

  const toggleTools = useCallback(() => {
    setToolsOpen((prev) => !prev);
  }, []);

  const closeTools = useCallback(() => {
    setToolsOpen(false);
  }, []);

  const scrollToMark = useCallback(
    (markID: string) => {
      const container = threadContainerRef.current;
      if (!container) return;
      const el = document.getElementById(markID);
      if (!el) return;
      const offset =
        el.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop -
        10;
      container.scrollTo({ top: offset, behavior: "smooth" });
    },
    [threadContainerRef],
  );

  return {
    toolsOpen,
    toggleTools,
    closeTools,
    threadMarks,
    scrollToMark,
  };
}
