"use client";

import { createContext, useContext, useCallback, useMemo, useReducer, useEffect } from "react";
import { AuthContextType, AuthState } from "./types";
import { checkAuth } from "@/lib/auth";

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

type AuthAction = 
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_AUTH"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_AUTH":
      return { ...state, isAuthenticated: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  initialAuth: boolean;
}

export function AuthProvider({ children, initialAuth }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, {
    ...initialState,
    isAuthenticated: initialAuth,
  });

  // 인증 상태 체크
  const checkAuthStatus = useCallback(async () => {
    try {
      const { isAuthenticated } = await checkAuth();
      dispatch({ type: "SET_AUTH", payload: isAuthenticated });
    } catch (error) {
      console.error('Auth check failed:', error);
      dispatch({ type: "SET_AUTH", payload: false });
    }
  }, []);

  // 초기 마운트 시 인증 상태 체크
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const googleOAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL;
      if (!googleOAuthUrl) throw new Error('OAuth URL is not defined');
      window.location.href = googleOAuthUrl;
    } catch (error) {
      console.error('Login failed:', error);
      dispatch({ type: "SET_ERROR", payload: "로그인에 실패했습니다" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const logout = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Logout failed');
      
      dispatch({ type: "SET_AUTH", payload: false });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      dispatch({ type: "SET_ERROR", payload: "로그아웃에 실패했습니다" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const value = useMemo(() => ({
    ...state,
    login,
    logout,
    checkAuthStatus,
  }), [state, login, logout, checkAuthStatus]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}; 