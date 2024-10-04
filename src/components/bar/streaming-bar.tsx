"use client";

import Image from "next/image";

import {
  Play,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  EllipsisVertical,
} from "lucide-react";

import { Slider } from "@/components/ui/slider";

const StreamingBar = () => {
  return (
    <div className="hidden md:flex items-center justify-between flex-1 border border-gray-300 dark:border-gray-500">
      <div className="flex items-center space-x-4 flex-1 overflow-hidden">
        <Image src="/images/music1.png" alt="cover" height={50} width={50} />
        <div>
          <h3 className="font-semibold text-sm">Current Song</h3>
          <p className="text-xs text-gray-500">Artist Name · Album Name</p>
        </div>
      </div>
      <div className="flex items-center mx-auto space-x-4 flex-2">
        <button>
          <Shuffle className="size-5" />
        </button>
        <button>
          <SkipBack className="size-5" />
        </button>
        <button className="rounded-full border border-black dark:border-white p-2">
          <Play className="size-5" />
        </button>
        <button>
          <SkipForward className="size-5" />
        </button>
        <button>
          <Repeat className="size-5" />
        </button>
      </div>
      <div className="flex items-center space-x-4 flex-1 justify-end">
        <button>
          <Volume2 className="size-5" />
        </button>
        <Slider defaultValue={[33]} max={100} step={1} className="w-1/6" />
        <button>
          <EllipsisVertical className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default StreamingBar;
