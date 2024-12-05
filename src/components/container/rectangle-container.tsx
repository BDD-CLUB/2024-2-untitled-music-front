"use client";

import { IconDotsVertical } from "@tabler/icons-react";
import Image from "next/image";

interface RectangleContainerProps {
  cover: string;
  name: string;
  artist: string;
  album: string;
  duration: string;
}

const RectangleContainer = ({
  cover,
  name,
  artist,
  album,
  duration,
}: RectangleContainerProps) => {
  return (
    <div className="flex text-black items-center gap-x-4 p-2 mb-2 rounded-lg hover:bg-white/30 transition-colors">
      <Image
        src={cover}
        alt="cover"
        width={44}
        height={44}
        className="rounded-lg"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-lg truncate">{name}</h3>
        <p className="text-sm text-neutral-700 truncate">
          {artist} · {album}
        </p>
      </div>
      <div className="flex items-center gap-x-2 mx-auto">
        <span className="text-base whitespace-nowrap">{duration}</span>
        <button className="cursor-pointer">
          <IconDotsVertical className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default RectangleContainer;
