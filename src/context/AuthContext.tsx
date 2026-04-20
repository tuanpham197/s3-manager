"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { User } from "@/types/api";

interface AuthState {
  user: User | null;
  sessionToken: string | null;
}

interface AuthContextValue extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "sessionToken";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, sessionToken: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      setState((prev) => ({ ...prev, sessionToken: token }));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((user: User, token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setState({ user, sessionToken: token });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setState({ user: null, sessionToken: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
