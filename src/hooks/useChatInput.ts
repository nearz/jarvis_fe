import { useState, useEffect, useRef, useCallback } from "react";
import type { ChatRequest } from "../api/types";

/** Default model placeholder text used for validation */
export const DEFAULT_MODEL = "Select Model";

interface UseChatInputOptions {
  /** The currently selected model name */
  selectedModel: string;
  /** Callback fired when chat is submitted */
  onSubmitChat: (chatRequest: ChatRequest) => void;
}

interface UseChatInputReturn {
  /** Current chat message text */
  chatMsg: string;
  /** Ref for the textarea element (auto-focused on mount) */
  textAreaRef: React.RefObject<HTMLTextAreaElement | null>;
  /** Whether the form can be submitted (has message and valid model) */
  canSubmit: boolean;
  /** Handler for textarea change events */
  handleMsgUpdate: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /** Submit the chat message */
  handleChatSubmit: () => void;
  /** Handler for textarea keydown events (Enter to submit) */
  handleChatKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

/**
 * Hook for managing chat input state and behavior.
 *
 * Features:
 * - Message state management
 * - Auto-focus on mount
 * - Enter key submission (Shift+Enter for newline)
 * - Validation (requires message and valid model)
 * - Stable callback references
 *
 * @example
 * ```tsx
 * function ChatInput({ selectedModel, onSubmitChat }) {
 *   const {
 *     chatMsg,
 *     textAreaRef,
 *     canSubmit,
 *     handleMsgUpdate,
 *     handleChatSubmit,
 *     handleChatKeyDown,
 *   } = useChatInput({ selectedModel, onSubmitChat });
 *
 *   return (
 *     <Textarea
 *       ref={textAreaRef}
 *       value={chatMsg}
 *       onChange={handleMsgUpdate}
 *       onKeyDown={handleChatKeyDown}
 *     />
 *   );
 * }
 * ```
 *
 * @param options - Configuration options
 * @returns Object containing state, ref, and handlers
 */
export const useChatInput = ({
  selectedModel,
  onSubmitChat,
}: UseChatInputOptions): UseChatInputReturn => {
  const [chatMsg, setChatMsg] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus textarea on mount
  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  const canSubmit =
    chatMsg.trim().length > 0 && selectedModel.trim() !== DEFAULT_MODEL;

  const handleMsgUpdate = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setChatMsg(e.target.value);
    },
    [],
  );

  const handleChatSubmit = useCallback(() => {
    if (chatMsg.trim() && selectedModel.trim() !== DEFAULT_MODEL) {
      onSubmitChat({ message: chatMsg, llm: selectedModel });
      setChatMsg("");
      textAreaRef.current?.focus();
    }
  }, [chatMsg, selectedModel, onSubmitChat]);

  const handleChatKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChatSubmit();
      }
    },
    [handleChatSubmit],
  );

  return {
    chatMsg,
    textAreaRef,
    canSubmit,
    handleMsgUpdate,
    handleChatSubmit,
    handleChatKeyDown,
  };
};
