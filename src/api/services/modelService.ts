import { apiClient } from "../client";
import type { SupportedModelsResult } from "../types";

export const modelService = {
  async supportModels(): Promise<SupportedModelsResult> {
    try {
      const resp = await apiClient.get<SupportedModelsResult>(
        "/models/supported_models",
        true,
      );
      if (resp.success) {
        return resp;
      } else {
        return { success: false, supported_models: [] };
      }
    } catch (error: any) {
      return { success: false, supported_models: [] };
    }
  },
};
