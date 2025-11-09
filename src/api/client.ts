import type { ApiError } from "./types";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem("jarvis_token");
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("jarvis_token", token);
    } else {
      localStorage.removeItem("jarvis_token");
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    requiresAuth: boolean,
    request: Omit<RequestInit, "headers">,
    headers?: Record<string, string>,
  ): Promise<T> {
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (requiresAuth && this.token) {
      requestHeaders["Authorization"] = `Bearer ${this.token}`;
    }

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...request,
        headers: requestHeaders,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        const error: ApiError = {
          message:
            errorData.detail?.[0]?.msg || errorData.message || "Request Failed",
          statusCode: response.status,
        };

        throw error;
      }

      if (
        response.status === 204 ||
        response.headers.get("content-length") === "0"
      ) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (!isApiError(error)) {
        throw {
          message: "Network error occurred",
          statusCode: 0,
        } as ApiError;
      }
      throw error;
    }
  }

  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, requiresAuth, {
      method: "GET",
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    requiresAuth = false,
  ): Promise<T> {
    return this.request<T>(endpoint, requiresAuth, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, requiresAuth, {
      method: "DELETE",
    });
  }
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    "message" in error
  );
}

const API_BASE_URL = "http://127.0.0.1:8000";
export const apiClient = new ApiClient(API_BASE_URL);
