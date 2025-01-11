"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, User } from "./types";
import { checkAuth } from "@/lib/auth";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  // 인증 상태 확인
  useEffect(() => {
    const verifyAuth = async () => {
      const { isAuthenticated } = await checkAuth();
      if (!isAuthenticated && user) {
        setUser(null);
      }
    };

    verifyAuth();
  }, [user]);

  const login = () => {
    const googleOAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL;
    if (!googleOAuthUrl) {
      console.error('OAuth URL is not defined');
      return;
    }
    window.location.href = googleOAuthUrl;
  };

  const logout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );
      
      if (!response.ok) throw new Error('Logout failed');
      
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user,
        isAuthenticated: !!user,
        isLoading: isLoading,
        login,
        logout,
      }}
    >
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