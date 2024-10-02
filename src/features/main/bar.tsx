"use client";

import { cn } from "@/lib/utils";
import { UploadMenu } from "@/components/bar/upload-menu";
import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconCirclePlus,
  IconHeart,
  IconMenu2,
  IconSearch,
  IconUserCircle,
} from "@tabler/icons-react";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function Bar() {
  const router = useRouter();

  const [uploadOpen, setUploadOpen] = useState(false);

  const menuref = useRef(null);
  useOutsideClick(menuref, () => setUploadOpen(false));


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
      onClick: () => {},
    },
    {
      title: "업로드",
      icon: (
        <IconCirclePlus
          className={cn(
            `h-full w-full dark:text-neutral-300`,
            uploadOpen ? "text-black" : "text-neutral-500"
          )}
        />
      ),
      onClick: () => {
        setUploadOpen(!uploadOpen);
      },
    },
    {
      title: "알림",
      icon: (
        <IconHeart className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {},
    },
    {
      title: "프로필",
      icon: (
        <IconUserCircle className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {},
    },

    {
      title: "더보기",
      icon: (
        <IconMenu2 className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {},
    },
  ];

  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-center h-full w-full">
      <FloatingDock items={links} />
      <div ref={menuref}>
        {uploadOpen && <UploadMenu />}
      </div>
    </div>
  );
};

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