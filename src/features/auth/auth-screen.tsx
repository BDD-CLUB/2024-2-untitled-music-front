'use client';

import { AuthCard } from "./auth-card";

export const AuthScreen = () => {
    return (
        <div className="h-full flex fles-col md:grid md:grid-cols-2 items-center justify-center bg-black">
            <div className="hidden h-full md:flex items-center justify-center">
                🦋
            </div>
            <div className="md:h-auto md:w-[400px]">
                <AuthCard />
            </div>
        </div>
    );
};