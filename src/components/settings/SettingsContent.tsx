"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { useAuth } from "@/contexts/auth/AuthContext";
import { Moon, Sun, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsContent() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">설정</h1>

      {/* 테마 설정 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium mb-1">테마 설정</h2>
            <p className="text-sm text-muted-foreground">
              라이트 모드와 다크 모드를 전환할 수 있습니다.
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className={cn(
              "rounded-full w-10 h-10",
              "hover:bg-white/10",
              "transition-colors"
            )}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* 로그아웃 */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium mb-1">로그아웃</h2>
              <p className="text-sm text-muted-foreground">
                계정에서 로그아웃합니다.
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={logout}
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-1" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 