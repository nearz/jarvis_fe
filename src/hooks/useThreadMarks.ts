import { useState, useEffect } from "react";
import type { ThreadMark } from "../components/navigation/MainView";
import type { Message } from "../api/types";

interface UseThreadMarksOptions {
  /** Ref to the scrollable thread container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Current list of messages in the thread */
  msgList: Message[];
  /** Whether the AI is currently streaming a response */
  isStreaming: boolean;
}

/**
 * Hook that reactively scans the DOM for thread marks (user messages and AI headings).
 *
 * Uses `querySelectorAll("[data-ct-mark]")` on the thread container after React
 * commits a render, gated behind `requestAnimationFrame` to ensure the DOM has
 * been painted. Re-scans whenever `msgList` changes or streaming ends.
 */
export function useThreadMarks({
  containerRef,
  msgList,
  isStreaming,
}: UseThreadMarksOptions): ThreadMark[] {
  const [marks, setMarks] = useState<ThreadMark[]>([]);

  useEffect(() => {
    // Don't scan while streaming -- wait for the final message to land
    if (isStreaming) return;

    const container = containerRef.current;
    if (!container) return;

    // requestAnimationFrame ensures the DOM has been painted after React's commit
    const frame = requestAnimationFrame(() => {
      const els = container.querySelectorAll<HTMLElement>("[data-ct-mark]");
      const newMarks: ThreadMark[] = [];
      els.forEach((el) => {
        newMarks.push({
          type: el.dataset.threadMsgType ?? "",
          elemID: el.dataset.ctMark ?? "",
          content: el.textContent ?? "",
        });
      });
      setMarks(newMarks);
    });

    return () => cancelAnimationFrame(frame);
  }, [containerRef, msgList, isStreaming]);

  return marks;
}
