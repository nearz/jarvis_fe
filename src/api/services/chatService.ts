import { apiClient } from "../client";
import type { ChatRequest } from "../types";

export const chatService = {
  async *newChat(chat: ChatRequest): AsyncGenerator<any, void, unknown> {
    yield* apiClient.streamIterator("/chat", chat);
  },
  async *chat(
    chat: ChatRequest,
    threadID: string,
  ): AsyncGenerator<any, void, unknown> {
    yield* apiClient.streamIterator(`/chat/${threadID}`, chat);
  },
};
