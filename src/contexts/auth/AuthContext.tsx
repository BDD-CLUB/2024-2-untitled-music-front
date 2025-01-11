"use client";

import { createContext, useContext } from "react";
import { AuthContextType, User } from "./types";
import { useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const router = useRouter();
  const login = () => {
    const googleOAuthUrl = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL;
    router.push(googleOAuthUrl as string);
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