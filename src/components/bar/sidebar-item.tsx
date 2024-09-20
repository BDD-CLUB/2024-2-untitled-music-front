"use client";

import { CircleUser, Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { UploadButton } from "./upload-button";

export const SidebarItem = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex items-center justify-center cursor-pointer group">
        <Button
          onClick={() => router.push("/user/123")}
          variant="transparent"
          className={cn(
            "p-2 group-hover:bg-accent/20",
            pathname.includes("/user") && "bg-accent/20"
          )}
        >
          <CircleUser className="size-7 text-white group-hover:scale-110 transition-all" />
        </Button>
      </div>

      <div className="flex items-center justify-center cursor-pointer group">
        <Button
          variant="transparent"
          className={cn("p-2 group-hover:bg-accent/20")}
        >
          <Heart className="size-7 text-white group-hover:scale-110 transition-all" />
        </Button>
      </div>

      <div className="flex items-center justify-center cursor-pointer group">
        <UploadButton />
      </div>
    </div>
  );
};
