"use client";

import { createContext, useContext } from "react";
import { AuthContextType, User } from "./types";
import axios from "axios";

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const login = () => {
    window.location.href = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL as string;
  };

  const logout = async () => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
    window.location.reload();
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