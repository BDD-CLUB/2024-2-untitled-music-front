"use client";

import Link from "next/link";
import Image from "next/image";
import {
  IconArrowsShuffle,
  IconDotsVertical,
  IconPlayerPlayFilled,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconRepeat,
} from "@tabler/icons-react";
import VolumeComponent from "./volume-component";
import { CustomSlider } from "../ui/custom-slider";
import { useRouter } from "next/navigation";

const StreamingBar = () => {
  const router = useRouter();

  const handleNowPlaying = () => {
    router.push("/watch/123");
  };

  return (
    <>
      <div className="hidden md:flex flex-col w-full h-full">
        <div
          className="flex items-center justify-center rounded-2xl px-4 py-2 bg-gradient-to-r from-[#FFFFFFB2] to-[#D4C4C2B2] backdrop-blur-lg dark:bg-gradient-to-r dark:from-[#FFFFFF08] dark:to-[#D4C4C208]"
          onClick={handleNowPlaying}
        >
          <div className="flex items-center space-x-4 flex-1 overflow-hidden">
            <Image
              src="/images/music1.png"
              alt="cover"
              height={50}
              width={50}
              className="rounded-md"
              onClick={(e) => e.stopPropagation()}
            />
            <div onClick={(e) => e.stopPropagation()}>
              <h3 className="font-semibold text-sm truncate">Current Song</h3>
              <div className="flex flex-row w-full overflow-x-hidden gap-x-2">
                <Link
                  href={"/user/123"}
                  className="text-xs text-neutral-700 dark:text-neutral-300 overflow-x-hidden hover:underline truncate"
                >
                  RARO
                </Link>
                <Link
                  href={"/album/123"}
                  className="text-xs text-neutral-700 dark:text-neutral-300 overflow-x-hidden hover:underline truncate"
                >
                  THIRSTY
                </Link>
              </div>
            </div>
          </div>
          <div
            className="flex items-center mx-auto space-x-4 flex-2 dark:text-neutral-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button>
              <IconArrowsShuffle className="size-5" />
            </button>
            <button>
              <IconPlayerSkipBackFilled className="size-5" />
            </button>
            <button className="rounded-full bg-white dark:bg-neutral-300 drop-shadow-md p-2">
              <IconPlayerPlayFilled className="size-5 dark:text-black" />
            </button>
            <button>
              <IconPlayerSkipForwardFilled className="size-5" />
            </button>
            <button>
              <IconRepeat className="size-5" />
            </button>
          </div>
          <div className="flex items-center space-x-2 flex-1 justify-end dark:text-neutral-300">
            <VolumeComponent onClick={(e) => e.stopPropagation()} />
            <button>
              <IconDotsVertical
                className="size-5"
                onClick={(e) => e.stopPropagation()}
              />
            </button>
          </div>
        </div>
        <div className="w-full px-4">
          <CustomSlider
            className="cursor-pointer"
            defaultValue={[50]}
            max={100}
            step={1}
          />
        </div>
      </div>

      <div className="flex flex-col md:hidden w-[400px] h-[70px] bg-white dark:bg-neutral-800 rounded-2xl drop-shadow-lg border border-neutral-100 dark:border-neutral-900 bottom-16 left-1/2 -translate-x-1/2 fixed">
        <div className="w-full px-1">
          <CustomSlider
            className="cursor-pointer"
            defaultValue={[50]}
            max={100}
            step={1}
          />
        </div>
        <div
          className="flex w-full items-center px-2 pb-1 justify-between"
          onClick={handleNowPlaying}
        >
          <div className="flex items-center space-x-4 flex-1 overflow-hidden">
            <Image
              src="/images/music1.png"
              alt="cover"
              height={50}
              width={50}
              className="rounded-md"
              onClick={(e) => e.stopPropagation()}
            />
            <div onClick={(e) => e.stopPropagation()}>
              <h3 className="font-semibold text-sm truncate">Current Song</h3>
              <div className="flex flex-row w-full overflow-x-hidden gap-x-2">
                <Link
                  href={"/user/123"}
                  className="text-xs text-neutral-700 dark:text-neutral-300 overflow-x-hidden hover:underline truncate"
                >
                  RARO
                </Link>
                <Link
                  href={"/album/123"}
                  className="text-xs text-neutral-700 dark:text-neutral-300 overflow-x-hidden hover:underline truncate"
                >
                  THIRSTY
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-6 dark:text-neutral-300">
            <button className="rounded-full bg-white dark:bg-neutral-300 drop-shadow-md p-2">
              <IconPlayerPlayFilled className="size-5 dark:text-black" />
            </button>
            <button>
              <IconPlayerSkipForwardFilled className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StreamingBar;
