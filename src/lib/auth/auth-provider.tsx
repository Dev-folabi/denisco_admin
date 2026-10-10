"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiRequestError, refreshSession } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { setAccessToken, clearTokens } from "@/lib/auth/token-store";

/** Roles permitted to use the dashboard. */
const ADMIN_ROLES = ["admin", "super_admin"] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  role: AdminRole | "customer";
  status: "active" | "inactive" | "suspended";
  email_verified: boolean;
  created_at: string;
}

/** Body the backend returns from admin login and refresh. */
interface SessionResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AdminUser;
}

interface AuthContextValue {
  user: AdminUser | null;
  /** True until the session has been restored on first load. */
  isLoading: boolean;
  isAuthenticated: boolean;
  /** True for the super_admin role, which gates destructive operations. */
  isSuperAdmin: boolean;
  login: (email: string, password: string) => Promise<AdminUser>;
  logout: () => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Narrows a profile to an administrative account. */
function isAdmin(user: AdminUser): boolean {
  return (ADMIN_ROLES as readonly string[]).includes(user.role);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const refreshUser = useCallback(async () => {
    try {
      const profile = await apiClient.get<AdminUser>(ENDPOINTS.auth.me);

      // The backend already restricts admin endpoints by role; this check
      // stops a customer session from rendering the dashboard shell.
      if (!isAdmin(profile)) {
        clearTokens();
        setUser(null);
        return;
      }

      setUser(profile);
    } catch {
      clearTokens();
      setUser(null);
    }
  }, []);

  // On first load the access token is gone (it only ever lived in memory), so
  // the session is restored from the refresh cookie before asking who we are.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const restored = await refreshSession();
      if (restored && !cancelled) {
        await refreshUser();
      }
      if (!cancelled) setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    // skipRefresh: a 401 here means the credentials are wrong, not that a
    // session expired. Without it the client would try to refresh a session
    // that does not exist and report its failure instead, so a mistyped
    // password would read as "your session has expired".
    const session = await apiClient.post<SessionResponse>(
      ENDPOINTS.auth.login,
      { email, password },
      { skipRefresh: true },
    );

    if (!isAdmin(session.user)) {
      throw new ApiRequestError(
        403,
        "ADMIN_ACCESS_REQUIRED",
        "This account does not have administrative access.",
      );
    }

    setAccessToken(session.access_token);
    setUser(session.user);
    return session.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post(ENDPOINTS.auth.logout);
    } catch {
      // The local session is cleared regardless: the admin asked to sign out.
    }
    clearTokens();
    setUser(null);
    // Drop every cached query so the next admin never sees the previous one's data.
    queryClient.clear();
  }, [queryClient]);

  const changePassword = useCallback(
    async (current: string, next: string) => {
      await apiClient.post(ENDPOINTS.auth.changePassword, {
        current_password: current,
        new_password: next,
      });
      // The backend revokes every session on a password change.
      clearTokens();
      setUser(null);
      queryClient.clear();
    },
    [queryClient],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      isSuperAdmin: user?.role === "super_admin",
      login,
      logout,
      changePassword,
      refreshUser,
    }),
    [user, isLoading, login, logout, changePassword, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
