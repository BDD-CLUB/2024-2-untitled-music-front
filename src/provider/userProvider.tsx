"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

import { api } from "../lib/axios";
import { useAuth } from "./authProvider";

export interface Artist {
  uuid: string;
  name: string;
  role: string;
  email: string;
  artistImage: string;
}

interface UserContextType {
  user: Artist | null;
  isLoading: boolean;
  error: Error | null;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Artist | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  
  const router = useRouter();

  const fetchUser = async () => {
    if (!isLoggedIn) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.get<Artist>("/artist");
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response data');
      }
      
      const requiredFields: (keyof Artist)[] = ['uuid', 'name', 'role', 'email', 'artistImage'];
      const missingFields = requiredFields.filter(field => !(field in data));
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      setUser(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setIsLoggedIn(false);
          setUser(null);
        } else {
          setError(
            new Error(
              err.response?.data?.message || 
              `Failed to fetch user data: ${err.response?.status}`
            )
          );
        }
      } else {
        setError(new Error("An unexpected error occurred while fetching user data"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [isLoggedIn]); 

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/logout");
      
      setUser(null);
      setError(null);
      setIsLoggedIn(false);

      router.push('/');
    } catch (err) {
      if (err instanceof AxiosError) {
        setError(new Error(err.response?.data?.message || 'Failed to logout'));
      } else {
        setError(new Error('An unexpected error occurred during logout'));
      }
    } finally {
      setIsLoading(false);
    }
  }, [router, setIsLoggedIn]);

  return (
    <UserContext.Provider value={{ user, isLoading, error, logout }}>
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