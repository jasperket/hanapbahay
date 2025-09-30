import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRevalidator, useRouteLoaderData } from "react-router";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "@/services/authClient";
import type {
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
} from "@/types/auth";
import type {
  AuthLoaderData,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth";

interface AuthContextValue {
  user: AuthUser | null;
  login: (payload: LoginPayload) => Promise<LoginResponse>;
  register: (payload: RegisterPayload) => Promise<RegisterResponse>;
  logout: () => Promise<LogoutResponse>;
  isRefreshing: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const data = useRouteLoaderData("root") as AuthLoaderData | undefined;
  const revalidator = useRevalidator();
  const [user, setUser] = useState<AuthUser | null>(data?.user ?? null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setUser(data?.user ?? null);
  }, [data]);

  const refreshUser = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      revalidator.revalidate();
      return currentUser;
    } finally {
      setIsRefreshing(false);
    }
  }, [revalidator]);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const response = await loginRequest(payload);
      await refreshUser();
      return response;
    },
    [refreshUser],
  );

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await registerRequest(payload);
    return response;
  }, []);

  const logout = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const response = await logoutRequest();
      setUser(null);
      revalidator.revalidate();
      return response;
    } finally {
      setIsRefreshing(false);
    }
  }, [revalidator]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login,
      register,
      logout,
      isRefreshing,
    }),
    [user, login, register, logout, isRefreshing],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };

