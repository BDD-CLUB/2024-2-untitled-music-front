"use client";

import { cn } from "@/lib/utils";
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

export function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="h-16 flex items-center justify-between px-4">
        <div className="flex-1 max-w-[calc(100%-50px)]">
          <AudioPlayer />
        </div>
        <div className="flex items-center justify-end w-[50px]">
          {!isAuthenticated && (
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
          )}
        </div>
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </header>
  );
} 