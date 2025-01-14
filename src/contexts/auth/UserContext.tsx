"use client";

import { createContext, useContext, useCallback, useMemo, useReducer } from "react";
import { UserContextType, UserState, User } from "./types";

type UserAction = 
  | { type: "SET_USER"; payload: User | null }
  | { type: "CLEAR_USER" };

function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "CLEAR_USER":
      return { ...state, user: null };
    default:
      return state;
  }
}

const UserContext = createContext<UserContextType | null>(null);

interface UserProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export function UserProvider({ children, initialUser }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, {
    user: initialUser,
  });

  const updateUser = useCallback((user: User) => {
    dispatch({ type: "SET_USER", payload: user });
  }, []);

  const clearUser = useCallback(() => {
    dispatch({ type: "CLEAR_USER" });
  }, []);

  const value = useMemo(() => ({
    ...state,
    updateUser,
    clearUser,
  }), [state, updateUser, clearUser]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}; 