import { apiClient } from "../client";
import type {
  LoginRequest,
  TokenResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types";

export const authService = {
  async login(credentials: LoginRequest): Promise<TokenResponse> {
    const resp = await apiClient.post<TokenResponse>(
      "/login",
      credentials,
      false,
    );

    apiClient.setToken(resp.token);

    return resp;
  },

  async register(credentials: RegisterRequest): Promise<RegisterResponse> {
    const resp = await apiClient.post<RegisterResponse>(
      "/register",
      credentials,
      false,
    );

    return resp;
  },
};
