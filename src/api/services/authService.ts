import { apiClient } from "../client";
import type {
  LoginRequest,
  LoginResult,
  TokenResponse,
  RegisterRequest,
  RegisterResult,
} from "../types";

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResult> {
    try {
      const resp = await apiClient.post<TokenResponse>(
        "/login",
        credentials,
        false,
      );

      apiClient.setToken(resp.token);

      return { success: true, error: "" };
    } catch (error: any) {
      if (error.statusCode === 401) {
        return { success: false, error: "Invalid Credentials" };
      } else {
        return { success: false, error: "System Error" };
      }
    }
  },

  async register(credentials: RegisterRequest): Promise<RegisterResult> {
    try {
      const resp = await apiClient.post<RegisterResult>(
        "/register",
        credentials,
        false,
      );

      return resp;
    } catch (error: any) {
      return { success: false };
    }
  },
};
