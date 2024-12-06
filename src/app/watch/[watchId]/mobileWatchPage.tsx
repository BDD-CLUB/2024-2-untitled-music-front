"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  IconAlignBoxCenterMiddle,
  IconArrowsShuffle,
  IconChevronDown,
  IconPlayerPlayFilled,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconRepeat,
  IconVinyl,
} from "@tabler/icons-react";

import { CustomSlider } from "@/components/ui/custom-slider";
import WatchNowPlaying from "@/features/watch/watch-nowPlaying";

type ViewState = "main" | "lyrics" | "nowPlaying";

export default function MobileWatchPage() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>("main");

  const handleClick = () => {
    router.back();
  };

  return (
    <main className="h-full w-full z-50 relative flex flex-col overflow-hidden py-8 px-8">
      <div className="absolute inset-0 bg-[url('/images/aespa.png')] bg-cover bg-center brightness-50"></div>

      <div className="relative">
        <button onClick={handleClick}>
          <IconChevronDown className="size-8 text-white" />
        </button>
      </div>

      <div className="relative flex flex-col items-center w-full h-full mt-16">
        {view === "main" && (
          <>
            <div className="bg-gradient-to-br from-[#FFFFFF33] to-[#99999933] aspect-square rounded-3xl mb-4 w-full overflow-y-auto max-h-96">
              <div className="p-6 flex items-center justify-center">
                <Image
                  src="/images/albumcover.png"
                  alt="albumcover"
                  width={300}
                  height={300}
                  className="rounded-full"
                />
              </div>
            </div>
            <div className="text-3xl font-bold text-white truncate">
              WHIPLASH
            </div>
            <div className="text-2xl font-bold text-neutral-300 flex items-center gap-x-2">
              <Link href="/user/123" className="hover:underline truncate">
                에스파
              </Link>
              <span>·</span>
              <Link href="/album/123" className="hover:underline truncate">
                WHIPLASH
              </Link>
            </div>
          </>
        )}
        {view === "lyrics" && (
          <div className="bg-gradient-to-br from-[#FFFFFF33] to-[#99999933] aspect-square rounded-3xl mb-64 w-full h-full overflow-y-auto">
            <div className="flex whitespace-pre-line p-4 items-center justify-center text-lg truncate leading-loose text-white">
              Fancy 이건 참 화려해
              <br />
              It&apos;s glowing and it&apos;s flashy (yeah)
              <br />
              알아, 적당함이 뭔지 keep it classy
              <br />
              따라 하지 넌 또 하나부터 열까지 (yeah)
              <br />
              아닌척하지 (yeah)
              <br />
              Under pressure, body sweating, can you focus? (Hoo)
              <br />
              I deliver, I can promise, I&apos;m the coldest (cold)
              <br />
              외면해도 소용없지 don&apos;t you blow it? Fancy 이건 참 화려해
              <br />
              It&apos;s glowing and it&apos;s flashy (yeah)
              <br />
              알아, 적당함이 뭔지 keep it classy
              <br />
              따라 하지 넌 또 하나부터 열까지 (yeah)
              <br />
              아닌척하지 (yeah)
              <br />
              Under pressure, body sweating, can you focus? (Hoo)
              <br />
              I deliver, I can promise, I&apos;m the coldest (cold)
              <br />
              외면해도 소용없지 don&apos;t you blow it?
            </div>
          </div>
        )}
        {view === "nowPlaying" && (
          <div className="bg-gradient-to-br from-[#FFFFFF33] to-[#99999933] aspect-square rounded-3xl h-full mb-64 w-full overflow-y-auto">
            <div className="p-4 w-full">
              <WatchNowPlaying />
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 w-full left-0 right-0 px-8 pb-16">
        <div className="relative flex flex-col items-center justify-center w-full py-4 mt-12">
          <div className="w-full">
            <CustomSlider
              className="cursor-pointer"
              defaultValue={[50]}
              max={100}
              step={1}
            />
          </div>
          <div className="w-full flex justify-between items-center text-white px-1">
            <div className="text-sm font-bold">01:53</div>
            <div className="text-sm font-bold">03:10</div>
          </div>
        </div>

        <div
          className="relative flex w-full items-center justify-center mt-4 space-x-8 text-white"
          onClick={(e) => e.stopPropagation()}
        >
          <button>
            <IconArrowsShuffle className="size-6" />
          </button>
          <button>
            <IconPlayerSkipBackFilled className="size-6" />
          </button>
          <button className="rounded-full bg-white drop-shadow-md p-3 text-black">
            <IconPlayerPlayFilled className="size-8" />
          </button>
          <button>
            <IconPlayerSkipForwardFilled className="size-6" />
          </button>
          <button>
            <IconRepeat className="size-6" />
          </button>
        </div>

        <div className="relative flex w-full items-center justify-between my-auto text-white">
          <button
            onClick={
              view !== "lyrics"
                ? () => setView("lyrics")
                : () => setView("main")
            }
          >
            <IconAlignBoxCenterMiddle className="size-8" />
          </button>
          <button
            onClick={
              view !== "nowPlaying"
                ? () => setView("nowPlaying")
                : () => setView("main")
            }
          >
            <IconVinyl className="size-8" />
          </button>
        </div>
      </div>

    </main>
  );
}
