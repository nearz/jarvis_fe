import { useState } from "react";
import type { ChatRequest, Message } from "../api/types";
import { chatService } from "../api/services/chatService";
import { projectService } from "../api/services/projectService";

interface UseChatStreamOptions {
  threadID: string;
  projectID: string;
  onThreadCreated: (threadID: string) => void;
}

interface UseChatStreamReturn {
  msgList: Message[];
  setMsgList: React.Dispatch<React.SetStateAction<Message[]>>;
  streamingMsg: string;
  isStreaming: boolean;
  handleSubmitChat: (chatRequest: ChatRequest) => void;
  clearMessages: () => void;
}

/**
 * Hook to manage chat message streaming and submission.
 *
 * Handles:
 * - Submitting new chat messages
 * - Streaming AI responses
 * - Managing message list state
 * - Routing to correct API endpoint (project vs regular, new vs existing thread)
 *
 * @example
 * ```tsx
 * const { msgList, streamingMsg, isStreaming, handleSubmitChat } = useChatStream({
 *   threadID,
 *   projectID: selectedProjectID,
 *   onThreadCreated: (id) => setThreadID(id),
 * });
 * ```
 */
export function useChatStream({
  threadID,
  projectID,
  onThreadCreated,
}: UseChatStreamOptions): UseChatStreamReturn {
  const [msgList, setMsgList] = useState<Message[]>([]);
  const [streamingMsg, setStreamingMsg] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  /**
   * Handle streaming tokens from the async-generator
   */
  async function streamer(
    stream: AsyncGenerator<any, unknown, void>,
  ): Promise<string> {
    let accumulate = "";
    setIsStreaming(true);
    for await (const chunk of stream) {
      if (chunk.type === "content") {
        accumulate += chunk.text;
        setStreamingMsg(accumulate);
      } else if (chunk.type === "done") {
        onThreadCreated(chunk.thread_id);
      }
    }
    setIsStreaming(false);
    return accumulate;
  }

  /**
   * Establish correct endpoint and get the async-generator
   */
  async function submitChat(chatRequest: ChatRequest) {
    let stream = null;
    if (projectID !== "") {
      stream =
        threadID !== ""
          ? projectService.projectsChat(chatRequest, projectID, threadID)
          : projectService.projectsNewChat(chatRequest, projectID);
    } else {
      stream =
        threadID !== ""
          ? chatService.chat(chatRequest, threadID)
          : chatService.newChat(chatRequest);
    }
    const fullContent = await streamer(stream);
    setMsgList((prev) => [
      ...prev,
      {
        index: prev.length,
        content: fullContent,
        llm: chatRequest.llm,
        message_type: "ai",
      },
    ]);
    setStreamingMsg("");
  }

  /**
   * Submit a new chat message
   */
  function handleSubmitChat(chatRequest: ChatRequest) {
    setMsgList((prev) => [
      ...prev,
      {
        index: prev.length,
        content: chatRequest.message,
        llm: chatRequest.llm,
        message_type: "user",
      },
    ]);
    void submitChat(chatRequest);
  }

  /**
   * Clear all messages and streaming state
   */
  function clearMessages() {
    setMsgList([]);
    setStreamingMsg("");
  }

  return {
    msgList,
    setMsgList,
    streamingMsg,
    isStreaming,
    handleSubmitChat,
    clearMessages,
  };
}
