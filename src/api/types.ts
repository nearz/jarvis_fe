export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  success: boolean;
  token: string;
  token_type: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  password_confirm: string;
}

export interface RegisterResponse {
  success: boolean;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
