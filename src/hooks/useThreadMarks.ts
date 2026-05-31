import { useState, useEffect } from "react";
import type { ThreadMark, AiH2Mark } from "../components/navigation/types";
import type { Message } from "../api/types";

interface UseThreadMarksOptions {
  /** Ref to the scrollable thread container */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Current list of messages in the thread */
  msgList: Message[];
  /** Whether the AI is currently streaming a response */
  isStreaming: boolean;
}

/** Parse a list of marked DOM elements into structured ThreadMarks. */
function parseMarks(els: NodeListOf<HTMLElement>): ThreadMark[] {
  const marks: ThreadMark[] = [];
  let i = 0;

  while (i < els.length) {
    const { threadMsgType: type, ctMark: elemID = "" } = els[i].dataset;
    const content = els[i].textContent ?? "";

    if (type === "user") {
      marks.push({ type: "user", elemID, content });
      i++;
    } else if (type === "ai-h1") {
      const h2Marks: AiH2Mark[] = [];
      i++;
      while (i < els.length && els[i].dataset.threadMsgType === "ai-h2") {
        h2Marks.push({
          type: "ai-h2",
          elemID: els[i].dataset.ctMark ?? "",
          content: els[i].textContent ?? "",
        });
        i++;
      }
      marks.push({ type: "ai-h1", elemID, content, h2Marks });
    } else if (type === "ai-h2") {
      marks.push({ type: "ai-h2", elemID, content });
      i++;
    } else {
      console.log("Non-standard mark hit");
      i++;
    }
  }

  return marks;
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
    if (isStreaming) return;

    const container = containerRef.current;
    if (!container) return;

    const frame = requestAnimationFrame(() => {
      const els = container.querySelectorAll<HTMLElement>("[data-ct-mark]");
      setMarks(parseMarks(els));
    });

    return () => cancelAnimationFrame(frame);
  }, [containerRef, msgList, isStreaming]);

  return marks;
}
