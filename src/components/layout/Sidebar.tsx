"use client";

import { cn } from "@/lib/utils";
import { Search, Upload, Bell, User, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/auth/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { LoginModal } from "@/components/auth/LoginModal";

export function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const sidebarItems = [
    {
      icon: ({ className }: { className?: string }) => (
        <div className={cn("relative w-4 h-4", className)}>
          <Image
            src="/images/logo.svg"
            alt="SOFO Logo"
            fill
            priority
            className="object-contain"
          />
        </div>
      ),
      label: "홈",
      href: "/"
    },
    { icon: Search, label: "검색", href: "/" },
    { icon: Upload, label: "업로드", href: "/upload" },
    { icon: Bell, label: "알림", href: "/" },
    {
      icon: ({ className }: { className?: string }) => (
        isAuthenticated ? (
          <Avatar className={cn("w-6 h-6", className)}>
            <AvatarImage src={user?.artistImage || ""} />
            <AvatarFallback>
              <User className="w-3 h-3" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <User className={className} />
        )
      ),
      label: "프로필",
      href: user ? `/profile/${user.uuid}` : "#",
      onClick: () => {
        if (!isAuthenticated) {
          setShowLoginModal(true);
        }
      }
    },
    { icon: Settings, label: "설정", href: "/" },
  ];

  return (
    <TooltipProvider>
      <aside className="fixed left-8 top-1/2 -translate-y-1/2 z-50">
        <div
          className={cn(
            "flex flex-col gap-3 p-4",
            "rounded-3xl",
            "bg-white/10 dark:bg-black/10",
            "backdrop-blur-2xl",
            "border border-white/20 dark:border-white/10",
            "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
            "transition-all duration-300"
          )}
        >
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (pathname.startsWith('/profile/') && item.href.startsWith('/profile'));

            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                    }}
                    className={cn(
                      "p-3 rounded-3xl",
                      "group relative",
                      "transition-all duration-300 ease-in-out",
                      "hover:bg-white/20 dark:hover:bg-white/5",
                      "hover:shadow-lg hover:scale-110",
                      isActive && [
                        "bg-white/20 dark:bg-white/5",
                        "shadow-inner",
                        "scale-105",
                      ]
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4",
                        "text-gray-800 dark:text-gray-200",
                        "transition-all duration-300",
                        isActive && "text-primary dark:text-primary"
                      )}
                    />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={14}>
                  <div className="font-medium text-xs">{item.label}</div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </aside>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </TooltipProvider>
  );
} 