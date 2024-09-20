"use client";

import { useRouter } from "next/navigation";
import { CircleUser, Heart, House, Search } from "lucide-react";

import { Button } from "../ui/button";
import { UploadButton } from "./upload-button";

export const BottombarItem = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-center cursor-pointer group">
        <Button
          onClick={() => router.push("/")}
          variant="transparent"
          className="p-2 group-hover:bg-accent/20"
        >
          <House className="size-7 text-white group-hover:scale-110 transition-all" />
        </Button>
      </div>

      <div className="flex items-center justify-center cursor-pointer group">
        <Button variant="transparent" className="p-2 group-hover:bg-accent/20">
          <Search className="size-7 text-white group-hover:scale-110 transition-all" />
        </Button>
      </div>

      <div className="flex items-center justify-center cursor-pointer group">
        <UploadButton />
      </div>

      <div className="flex items-center justify-center cursor-pointer group">
        <Button variant="transparent" className="p-2 group-hover:bg-accent/20">
          <Heart className="size-7 text-white group-hover:scale-110 transition-all" />
        </Button>
      </div>

      <div className="flex items-center justify-center cursor-pointer group">
        <Button
          onClick={() => router.push("/user/123")}
          variant="transparent"
          className="p-2 group-hover:bg-accent/20"
        >
          <CircleUser className="size-7 text-white group-hover:scale-110 transition-all" />
        </Button>
      </div>
    </>
  );
};
