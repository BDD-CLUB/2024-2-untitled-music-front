"use client";

import { LoginModal } from "@/components/auth/LoginModal";
import { useState } from "react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { AudioPlayer } from "@/components/audio/AudioPlayer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-2 left-0 right-0 z-50">
      <div className="h-16 flex items-center justify-between px-8">
        <div className={cn(
          "flex-1",
          isAuthenticated ? "w-full" : "max-w-[calc(100%-50px)]"
        )}>
          <AudioPlayer />
        </div>
        {!isAuthenticated && (
          <div className="flex items-center justify-end w-[50px]">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowLoginModal(true)}
                    className="hover:bg-white/10"
                  >
                    <LogIn className="w-5 h-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" sideOffset={14}>
                  <div className="font-medium text-xs">로그인</div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </header>
  );
} 