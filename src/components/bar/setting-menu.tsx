"use client";

import { IconBrightness, IconLogout, IconSettings } from "@tabler/icons-react";

import { FloatingDock } from "../ui/floating-dock";

import { useTheme } from "next-themes";

export function SettingMenu() {
  const { setTheme, theme, systemTheme } = useTheme();

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
      onClick: () => {
        const currentTheme = theme === "system" ? systemTheme : theme;
        if (currentTheme === "dark") {
          setTheme("light"); 
        } else {
          setTheme("dark");
        }
      },
    },
    {
      title: "로그아웃",
      icon: (
        <IconLogout className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {},
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
