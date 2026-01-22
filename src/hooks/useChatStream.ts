import { useState } from "react";
import type { ChatRequest, Message, StreamChunk } from "../api/types";
import { chatService } from "../api/services/chatService";
import { projectService } from "../api/services/projectService";

interface UseChatStreamOptions {
  threadID: string;
  projectID: string;
  onThreadCreated: (threadID: string) => void;
  setMsgList: React.Dispatch<React.SetStateAction<Message[]>>;
}

interface UseChatStreamReturn {
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
 * const { streamingMsg, isStreaming, handleSubmitChat } = useChatStream({
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
  setMsgList,
}: UseChatStreamOptions): UseChatStreamReturn {
  const [streamingMsg, setStreamingMsg] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  /**
   * Handle streaming tokens from the async-generator
   * TODO: How to present streaming errors?
   */
  async function streamer(
    stream: AsyncGenerator<StreamChunk, unknown, void>,
  ): Promise<string> {
    let accumulate = "";
    setIsStreaming(true);
    try {
      for await (const chunk of stream) {
        if (chunk.type === "content") {
          accumulate += chunk.text;
          setStreamingMsg(accumulate);
        } else {
          onThreadCreated(chunk.thread_id);
        }
      }
      return accumulate;
    } catch (err) {
      console.error("Streaming error: ", err);
      return accumulate;
    } finally {
      setIsStreaming(false);
    }
  }

  /**
   * Establish correct endpoint and get the async-generator
   * TODO: How to present errors on submitting chat?
   */
  async function submitChat(chatRequest: ChatRequest) {
    try {
      const serviceGenerator = selectService(chatRequest, projectID, threadID);
      const fullContent = await streamer(serviceGenerator);
      setMsgList((prev) => [
        ...prev,
        {
          index: prev.length,
          content: fullContent,
          llm: chatRequest.llm,
          message_type: "ai",
        },
      ]);
    } catch (err) {
      console.error("Submit chat error: ", err);
    } finally {
      setStreamingMsg("");
    }
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
    streamingMsg,
    isStreaming,
    handleSubmitChat,
    clearMessages,
  };
}

/**
 * Select service depending on thread id and project id
 */

function selectService(
  chatRequest: ChatRequest,
  projectID: string,
  threadID: string,
): AsyncGenerator<StreamChunk, unknown, void> {
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
  return stream;
}
