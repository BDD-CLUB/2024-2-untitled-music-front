"use client";

import { useCallback } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { FloatingDock } from "../ui/floating-dock";

import { useAuth } from "@/provider/authProvider";
import useSigninModal from "@/hooks/modal/use-signin-modal";
import {
  IconBrightness,
  IconLogin,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";

export function SettingMenu() {
  const { setTheme, theme, systemTheme } = useTheme();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const signInModal = useSigninModal();
  const router = useRouter();

  const handleLogin = () => {
    signInModal.onOpen();
  };

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
    isLoggedIn
      ? {
          title: "로그아웃",
          icon: (
            <IconLogout className="h-full w-full text-neutral-500 dark:text-neutral-300" />
          ),
          onClick: handleLogout,
        }
      : {
          title: "로그인",
          icon: (
            <IconLogin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
          ),
          onClick: handleLogin,
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
