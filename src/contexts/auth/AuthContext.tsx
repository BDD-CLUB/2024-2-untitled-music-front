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
          console.log('User set:', user);
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [user]);

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
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );
      
      if (!response.ok) throw new Error('Logout failed');
      
      setUser(null);
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
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