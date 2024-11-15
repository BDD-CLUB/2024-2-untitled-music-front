"use client";

import { useCallback } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

import { useAuth } from "@/provider/authProvider";
import useSigninModal from "@/hooks/modal/use-signin-modal";
import {
  IconBrightness,
  IconLogin,
  IconLogout,
  IconSettings,
} from "@tabler/icons-react";
import useSettingMenu from "@/hooks/modal/use-setting-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";

export function MobileSettingMenu() {
  const { setTheme, theme, systemTheme } = useTheme();
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const signInModal = useSigninModal();
  const router = useRouter();

  const mobileSettingMenu = useSettingMenu();

  const onChange = (open: boolean) => {
    if (!open) {
      mobileSettingMenu.onClose();
    }
  };

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
      onClick: () => {
        mobileSettingMenu.onClose();
      },
    },
    {
      title: "모드전환",
      icon: (
        <IconBrightness className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {
        toggleTheme();
        mobileSettingMenu.onClose();
      }
    },
    isLoggedIn
      ? {
          title: "로그아웃",
          icon: (
            <IconLogout className="h-full w-full text-neutral-500 dark:text-neutral-300" />
          ),
          onClick: () => {
            handleLogout();
            mobileSettingMenu.onClose();
          }
        }
      : {
          title: "로그인",
          icon: (
            <IconLogin className="h-full w-full text-neutral-500 dark:text-neutral-300" />
          ),
          onClick: () => {
            handleLogin();
            mobileSettingMenu.onClose();
          }
        },
  ];

  return (
    <Dialog open={mobileSettingMenu.isOpen} onOpenChange={onChange}>
      <DialogTitle className="hidden">설정</DialogTitle>
      <DialogDescription className="hidden">
        설정할 항목을 선택하세요
      </DialogDescription>
      <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm fixed inset-0" />
      <DialogContent className="fixed md:hidden top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-none bg-transparent shadow-none h-[25%] w-[75%] p-0">
        <div className="flex items-center justify-center gap-x-8">
          {links.map((link, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-y-4 cursor-pointer"
              onClick={link.onClick}
            >
              <div className="items-center justify-center w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 p-2">{link.icon}</div>
              <span className="text-white truncate overflow-hidden text-sm">{link.title}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
