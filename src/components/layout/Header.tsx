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
import { AudioPlayer } from "@/components/player/AudioPlayer";
import { useAudio } from "@/contexts/audio/AudioContext";

export function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const { currentTrack } = useAudio();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="h-16 bg-background/80 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto h-full px-2 pl-32 flex items-center justify-between gap-4">
          <div className="flex-1">
            {currentTrack && <AudioPlayer />}
          </div>
          {!isAuthenticated && (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className={cn(
                      "w-10 h-10 rounded-2xl",
                      "bg-white/5",
                      "hover:bg-white/10",
                      "hover:scale-105",
                      "transition-all duration-300"
                    )}
                    onClick={() => setShowLoginModal(true)}
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