import { apiClient } from "../client";
import type {
  HistoryResult,
  ThreadHistoryResult,
  DeleteThreadResult,
} from "../types";

export const historyService = {
  async history(): Promise<HistoryResult> {
    try {
      const resp = await apiClient.get<HistoryResult>("/history", true);
      if (resp.success) {
        return resp;
      } else {
        return { success: false, threads: [] };
      }
    } catch (error: any) {
      return { success: false, threads: [] };
    }
  },
  async threadHistory(threadID: string): Promise<ThreadHistoryResult> {
    try {
      const resp = await apiClient.get<ThreadHistoryResult>(
        `/history/${threadID}`,
        true,
      );
      if (resp.success && resp.messages.length > 0) {
        return resp;
      } else {
        return { success: false, messages: [] };
      }
    } catch (error: any) {
      return { success: false, messages: [] };
    }
  },
  async deleteThread(threadID: string): Promise<DeleteThreadResult> {
    try {
      const resp = await apiClient.delete<DeleteThreadResult>(
        `/history/${threadID}`,
        true,
      );
      console.log(`Delete Thread: ${resp}`);
      if (resp.success) {
        return resp;
      } else {
        return { success: false, thread_id: "" };
      }
    } catch (error: any) {
      return { success: false, thread_id: "" };
    }
  },
};
