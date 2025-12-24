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

  private getLocalISOString(): string {
    const now = new Date();
    const offset = -now.getTimezoneOffset();
    const sign = offset >= 0 ? "+" : "-";
    const pad = (n: number) => String(Math.abs(n)).padStart(2, "0");

    const offsetHours = Math.floor(Math.abs(offset) / 60);
    const offsetMins = Math.abs(offset) % 60;

    return (
      now.getFullYear() +
      "-" +
      pad(now.getMonth() + 1) +
      "-" +
      pad(now.getDate()) +
      "T" +
      pad(now.getHours()) +
      ":" +
      pad(now.getMinutes()) +
      ":" +
      pad(now.getSeconds()) +
      sign +
      pad(offsetHours) +
      ":" +
      pad(offsetMins)
    );
  }

  private async request<T>(
    endpoint: string,
    requiresAuth: boolean,
    request: Omit<RequestInit, "headers">,
    headers?: Record<string, string>,
  ): Promise<T> {
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "Jarvis-Client-Timestamp": this.getLocalISOString(),
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

  async *streamIterator(
    endpoint: string,
    data: unknown,
    requiresAuth = true,
  ): AsyncGenerator<any, void, unknown> {
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      "Jarvis-Client-Timestamp": this.getLocalISOString(),
      Accept: "text/event-stream",
    };

    if (requiresAuth && this.token) {
      requestHeaders["Authorization"] = `Bearer ${this.token}`;
    }

    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    let buffer = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            try {
              yield JSON.parse(data);
            } catch {
              yield data;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
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
