export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  identityName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}
