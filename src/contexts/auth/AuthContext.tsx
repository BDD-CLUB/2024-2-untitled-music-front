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
      setIsLoading(true);
      try {
        const { isAuthenticated } = await checkAuth();
        if (!isAuthenticated && user) {
          setUser(null);
        } else {
          setUser(initialUser);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [user, initialUser]);

  const login = () => {
    setIsLoading(true);
    const googleOAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL;
    if (!googleOAuthUrl) {
      console.error('OAuth URL is not defined');
      setIsLoading(false);
      return;
    }
    window.location.href = googleOAuthUrl;
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // 1. 서버에 로그아웃 요청
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Logout failed');

      // 2. 클라이언트 상태 초기화
      setUser(null);
      
      // 3. 페이지 새로고침 (선택사항)
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
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