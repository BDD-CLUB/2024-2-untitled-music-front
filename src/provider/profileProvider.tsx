"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type ProfileContextType = {
  uuid: string | null;
  setUuid: (uuid: string | null) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({
  children,
  uuid: initialUuid,
}: {
  children: React.ReactNode;
  uuid: string | null;
}) {
  const [uuid, setUuid] = useState<string | null>(initialUuid);

  useEffect(() => {
    if (initialUuid) {
      setUuid(initialUuid);
    }
  }, [initialUuid]);

  return (
    <ProfileContext.Provider value={{ uuid, setUuid }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
