"use client";

import { cn } from "@/lib/utils";
import { Music2, Disc3, ListMusic } from "lucide-react";
import Link from "next/link";

const uploadOptions = [
  {
    value: "track",
    label: "트랙 업로드",
    description: "단일 트랙을 업로드하고 관리합니다",
    icon: Music2,
    href: "/upload/track",
  },
  {
    value: "album",
    label: "앨범 업로드",
    description: "여러 트랙을 하나의 앨범으로 구성합니다",
    icon: Disc3,
    href: "/upload/album",
  },
  {
    value: "playlist",
    label: "플레이리스트 생성",
    description: "나만의 플레이리스트를 만들고 공유합니다",
    icon: ListMusic,
    href: "/upload/playlist",
  },
];

export function UploadTabs() {
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uploadOptions.map((option) => {
          const Icon = option.icon;

          return (
            <Link
              key={option.value}
              href={option.href}
              className={cn(
                "group p-6",
                "rounded-3xl",
                "bg-white/5 hover:bg-white/10",
                "border border-white/10",
                "backdrop-blur-sm",
                "transition-all duration-300",
                "hover:scale-[1.02] hover:shadow-lg"
              )}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className={cn(
                  "p-4 rounded-2xl",
                  "bg-white/5 group-hover:bg-white/10",
                  "transition-colors duration-300"
                )}>
                  <Icon className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">{option.label}</h3>
                  <p className="text-sm">{option.description}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 