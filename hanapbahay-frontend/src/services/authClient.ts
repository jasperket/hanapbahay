import { isAxiosError } from "axios";
import { api } from "@/services/api";
import type {
  AuthCheckResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
  LoginResponse,
  RegisterResponse,
  LogoutResponse,
} from "@/types/auth";

const toAuthUser = (data: AuthCheckResponse): AuthUser | null => {
  if (!data.isAuthenticated) {
    return null;
  }

  return {
    email: data.email ?? "",
    roles: data.roles ?? [],
  };
};

const login = async (payload: LoginPayload) => {
  const { data } = await api.post<LoginResponse>("auth/login", payload);
  return data;
};

const register = async (payload: RegisterPayload) => {
  const role = payload.role ?? 0;

  const { data } = await api.post<RegisterResponse>("auth/register", {
    ...payload,
    role,
  });
  return data;
};

const logout = async () => {
  const { data } = await api.post<LogoutResponse>("auth/logout");
  return data;
};

const check = async () => {
  const { data } = await api.get<AuthCheckResponse>("auth/check");
  return data;
};

const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const authResponse = await check();
    return toAuthUser(authResponse);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw error;
  }
};

export { check, getCurrentUser, login, logout, register, toAuthUser };
