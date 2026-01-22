import { apiClient } from "../client";
import type { ChatRequest, StreamChunk } from "../types";

export const chatService = {
  async *newChat(
    chat: ChatRequest,
  ): AsyncGenerator<StreamChunk, void, unknown> {
    yield* apiClient.streamIterator("/chat", chat);
  },
  async *chat(
    chat: ChatRequest,
    threadID: string,
  ): AsyncGenerator<StreamChunk, void, unknown> {
    yield* apiClient.streamIterator(`/chat/${threadID}`, chat);
  },
};
