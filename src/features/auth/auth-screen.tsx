"use client";

import { AuthCard } from "./auth-card";

export const AuthScreen = () => {
  return (
    <div className="h-full flex items-center justify-center bg-black md:bg-[url('/images/auth-background.svg')] bg-cover bg-center">
      <div className="h-auto w-[400px] md:absolute md:right-40">
        <AuthCard />
      </div>
    </div>
  );
};
