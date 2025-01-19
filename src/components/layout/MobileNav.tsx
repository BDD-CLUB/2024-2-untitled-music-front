"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Upload, Bell, User, Settings } from "lucide-react";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useUser } from "@/contexts/auth/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useState } from "react";
import { LoginModal } from "@/components/auth/LoginModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navItems = [
    {
      icon: ({ className }: { className?: string }) => (
        <div className={cn("relative w-4 h-4", className)}>
          <Image
            src="/images/logo.svg"
            alt="SOFO Logo"
            fill
            priority
            sizes="16px"
            quality={50}
            className="object-contain"
          />
        </div>
      ),
      label: "홈",
      href: "/"
    },
    { icon: Search, label: "검색", href: "" },
    { icon: Upload, label: "업로드", href: "/upload" },
    { icon: Bell, label: "알림", href: "" },
    {
      icon: ({ className }: { className?: string }) =>
        isAuthenticated ? (
          <Avatar className={cn("w-6 h-6", className)}>
            <AvatarImage src={user?.artistImage || ""} />
            <AvatarFallback>
              <User className="w-3 h-3" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <User className={className} />
        ),
      label: "프로필",
      href: isAuthenticated ? `/profile/${user?.uuid}` : "",
      onClick: (e: React.MouseEvent) => {
        if (!isAuthenticated) {
          e.preventDefault();
          setShowLoginModal(true);
        }
      },
    },
    { icon: Settings, label: "설정", href: "/settings" },
  ];

  return (
    <TooltipProvider>
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "h-16 px-4",
        "backdrop-blur-sm",
        "md:hidden" // 중간 크기 이상에서는 숨김
      )}>
        <div className="h-full max-w-lg mx-auto flex items-center justify-around">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    onClick={item.onClick}
                    className={cn(
                      "flex flex-col items-center gap-1",
                      "p-2 rounded-lg",
                      "text-sm",
                      "transition-colors",
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-primary"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="font-medium text-xs"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </nav>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </TooltipProvider>
  );
} 