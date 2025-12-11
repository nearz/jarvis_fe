export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  error: string;
}

export interface TokenResponse {
  success: boolean;
  token: string;
  tokenType: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
}

export interface RegisterResult {
  success: boolean;
}

export interface ChatRequest {
  message: string;
  llm: string;
}

export interface ThreadMetaData {
  title: string;
  thread_id: string;
  last_llm_used: string;
  created_at: string;
  updated_at: string;
}

export interface HistoryResult {
  success: boolean;
  threads: ThreadMetaData[];
}

export interface ThreadHistoryResult {
  success: boolean;
  messages: Message[];
}

export interface Message {
  index: number;
  content: string;
  llm: string;
  message_type: "user" | "ai";
  message_id?: string;
  thread_id?: string;
  created_at?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
