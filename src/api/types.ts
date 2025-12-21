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

export interface DeleteThreadResult {
  success: boolean;
  thread_id: string;
}

export interface DeleteProjectResult {
  success: boolean;
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

export interface ProjectsMetaData {
  project_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectsResult {
  success: boolean;
  projects: ProjectsMetaData[];
}

export interface ModelMetaData {
  provider: string;
  provider_display_name: string;
  model: string;
  display_name: string;
}

export interface SupportedModelsResult {
  success: boolean;
  supported_models: ModelMetaData[];
}

export interface ProjectResult {
  success: boolean;
  project_id: string;
  title: string;
  instructions: string;
  created_at: string;
  updated_at: string;
  threads?: ThreadMetaData[];
}

export interface ProjectUpdateResult {
  success: boolean;
  project_id: string;
}

export interface NewProjectResult {
  success: boolean;
  project_id: string;
}

export interface NewProjectRequest {
  title: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
