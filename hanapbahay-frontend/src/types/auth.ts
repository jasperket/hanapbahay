export interface AuthUser {
  email: string;
  roles: string[];
}

export interface AuthLoaderData {
  user: AuthUser | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type UserRoleValue = 0 | 1 | 2;

export interface RegisterPayload {
  displayName: string;
  email: string;
  password: string;
  phoneNumber: string;
  role?: UserRoleValue;
}

export interface AuthCheckResponse {
  isAuthenticated: boolean;
  email?: string;
  roles?: string[];
}

export interface LoginResponse {
  message: string;
  role?: string;
}

export interface RegisterResponse {
  message: string;
  role: string;
}

export interface LogoutResponse {
  message: string;
}
