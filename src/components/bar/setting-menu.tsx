"use client";

import { IconBrightness, IconLogout, IconSettings } from "@tabler/icons-react";
import { FloatingDock } from "../ui/floating-dock";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAuth } from "@/provider/authProvider";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

export function SettingMenu() {
  const { setTheme, theme, systemTheme } = useTheme();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  }, [router, setIsLoggedIn]);

  const toggleTheme = useCallback(() => {
    const isDark = (theme === "system" ? systemTheme : theme) === "dark";
    setTheme(isDark ? "light" : "dark");
  }, [theme, systemTheme, setTheme]);

  const links = [
    {
      title: "설정",
      icon: (
        <IconSettings className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {},
    },
    {
      title: "모드전환",
      icon: (
        <IconBrightness className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: toggleTheme,
    },
    {
      title: "로그아웃",
      icon: (
        <IconLogout
          className={cn(
            "h-full w-full text-neutral-500 dark:text-neutral-300",
            { "opacity-50 cursor-not-allowed": !isLoggedIn }
          )}
        />
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <div className="flex items-center justify-center h-full w-full">
      <FloatingDock
        items={links}
        desktopClassName="ml-4 mt-60"
        mobileClassName="mb-4"
      />
    </div>
  );
}
