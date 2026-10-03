"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiClient, ApiRequestError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { setAccessToken, clearTokens } from "@/lib/auth/token-store";

interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "admin" | "super_admin";
}

interface AuthContextValue {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiClient.get<AdminUser>(ENDPOINTS.auth.me);
      if (data.role !== "admin" && data.role !== "super_admin") {
        clearTokens();
        setUser(null);
        return;
      }
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiClient.post<{ access_token: string; user: AdminUser }>(
      ENDPOINTS.auth.login,
      { email, password },
    );
    if (data.user.role !== "admin" && data.user.role !== "super_admin") {
      throw new ApiRequestError(403, "FORBIDDEN", "Admin access required");
    }
    setAccessToken(data.access_token);
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post(ENDPOINTS.auth.logout);
    } catch {
      // proceed with local logout even if API call fails
    }
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
