"use client";

import { createContext, useContext } from "react";
import { AuthContextType, User } from "./types";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const login = () => {
    console.log('Starting login process...');
    console.log('OAuth URL:', process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL);
    
    if (!process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL) {
      console.error('OAuth URL is not defined');
      return;
    }
    window.location.href = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL;
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
        user: initialUser,
        isAuthenticated: !!initialUser,
        isLoading: false,
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