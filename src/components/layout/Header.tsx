"use client";

import { cn } from "@/lib/utils";
import { LoginModal } from "@/components/auth/LoginModal";
import { useState } from "react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 right-0 z-50 p-4">
      <div
        className={cn(
          "flex items-center gap-2",
          "p-2",
          "rounded-3xl",
          "bg-white/10 dark:bg-black/10",
          "backdrop-blur-2xl",
          "border border-white/20 dark:border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
          "transition-all duration-300"
        )}
      >
        {!isAuthenticated && (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "w-8 h-8 rounded-2xl",
                    "hover:bg-white/20 dark:hover:bg-white/5",
                    "hover:shadow-lg hover:scale-110",
                    "transition-all duration-300 ease-in-out"
                  )}
                  onClick={() => setShowLoginModal(true)}
                >
                  <LogIn className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={14}>
                <div className="font-medium text-xs">로그인</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </header>
  );
} 