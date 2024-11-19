"use client";

import useNotiModal from "@/hooks/modal/use-noti-modal";
import useSearchInput from "@/hooks/modal/use-search-input";
import useSigninModal from "@/hooks/modal/use-signin-modal";

import useUploadMenu from "@/hooks/modal/use-upload-menu";
import useSettingMenu from "@/hooks/modal/use-setting-menu";

import { UploadMenu } from "@/components/bar/upload-menu";
import { SettingMenu } from "@/components/bar/setting-menu";
import { FloatingDock } from "@/components/ui/floating-dock";

import {
  IconCirclePlus,
  IconHeart,
  IconMenu2,
  IconSearch,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { useEffect, useRef, useState } from "react";

import { useAuth } from "@/provider/authProvider";
import { useUser } from "@/provider/userProvider";

export function Bar() {
  const router = useRouter();
  const isLargeScreen = useMediaQuery({ query: "(min-width: 768px)" });

  const { isLoggedIn } = useAuth();
  const { user } = useUser();

  const searchInput = useSearchInput();
  const notiModal = useNotiModal();
  const signinModal = useSigninModal();
  const mobileUploadMenu = useUploadMenu();
  const mobileSettingMenu = useSettingMenu();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [settingOpen, setSettingOpen] = useState(false);

  const uploadRef = useRef(null);
  useOutsideClick(uploadRef, () => setUploadOpen(false));

  const settingRef = useRef(null);
  useOutsideClick(settingRef, () => setSettingOpen(false));

  const links = [
    {
      title: "홈",
      icon: <Image src="/images/logo.svg" width={20} height={20} alt="Logo" />,
      onClick: () => router.push("/"),
    },

    {
      title: "검색",
      icon: (
        <IconSearch className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {
        searchInput.onOpen();
      },
    },
    {
      title: "업로드",
      icon: (
        <IconCirclePlus className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {
        if (!isLoggedIn) {
          signinModal.onOpen();
        } else if (isLargeScreen) {
          setUploadOpen(!uploadOpen);
        } else {
          mobileUploadMenu.onOpen();
        }
      },
    },
    {
      title: "알림",
      icon: (
        <IconHeart className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {
        if (!isLoggedIn) {
          signinModal.onOpen();
        } else {
          notiModal.onOpen();
        }
      },
    },
    {
      title: "프로필",
      icon: (
        <Avatar>
          <AvatarImage src={user?.artistImage} alt={user?.name} />
          <AvatarFallback>
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </AvatarFallback>
        </Avatar>
      ),
      onClick: () => {
        if (!isLoggedIn) {
          signinModal.onOpen();
        } else {
          router.push("/user/123");
        }
      },
    },

    {
      title: "더보기",
      icon: (
        <IconMenu2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {
        if (isLargeScreen) {
          setSettingOpen(!settingOpen);
        } else {
          mobileSettingMenu.onOpen();
        }
      },
    },
  ];

  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-center h-full w-full">
      <FloatingDock items={links} />
      <div ref={uploadRef}>{uploadOpen && <UploadMenu />}</div>
      <div ref={settingRef}>{settingOpen && <SettingMenu />}</div>
    </div>
  );
}

export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
