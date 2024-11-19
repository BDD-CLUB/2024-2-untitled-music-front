"use client";

import { AxiosError } from "axios";
import React, { createContext, useContext, useEffect, useState } from "react";

import { api } from "../lib/axios";

export interface Artist {
  uuid: string;
  name: string;
  email: string;
  artistImage: string;
}

interface UserContextType {
  user: Artist | null;
  isLoading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get<Artist>("/artist");
        setUser(data);
      } catch (err) {
        if (err instanceof AxiosError) {
          setError(
            new Error(
              err.response?.data?.message || "Failed to fetch user data"
            )
          );
        } else {
          setError(new Error("An unexpected error occurred"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, error }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
