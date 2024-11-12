"use client";

import Link from "next/link";
import Image from "next/image";

import {
  IconAlignBoxCenterMiddle,
  IconArrowsShuffle,
  IconDotsVertical,
  IconPlayerPlayFilled,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconRepeat,
  IconVinyl,
} from "@tabler/icons-react";

import { CustomSlider } from "@/components/ui/custom-slider";
import VolumeComponent from "@/components/bar/volume-component";
import { useState } from "react";
import WatchNowPlaying from "@/features/watch/watch-nowPlaying";
import { useRouter } from "next/navigation";

type ViewState = "lyrics" | "nowPlaying";

export default function WatchPage() {
  const [view, setView] = useState<ViewState>("nowPlaying");
  const router = useRouter();

  const toggleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setView((prev) => (prev === "lyrics" ? "nowPlaying" : "lyrics"));
  };

  const handleClick = () => {
    router.back();
  };

  return (
    <main className="h-full w-full z-50 relative flex flex-col overflow-hidden py-8 md:px-24 px-8">
      <div className="absolute inset-0 bg-[url('/images/aespa.png')] bg-cover bg-center brightness-50"></div>

      <div
        onClick={handleClick}
        className="relative flex w-full items-center justify-between"
      >
        <div className="flex flex-1">
          <button onClick={(e) => toggleView(e)}>
            {view === "nowPlaying" ? (
              <IconAlignBoxCenterMiddle className="size-8 text-white" />
            ) : (
              <IconVinyl className="size-8 text-white" />
            )}
          </button>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center flex-2 space-x-4"
        >
          <button>
            <IconArrowsShuffle className="size-5" />
          </button>
          <button>
            <IconPlayerSkipBackFilled className="size-5" />
          </button>
          <button className="rounded-full bg-white drop-shadow-md p-2 text-black">
            <IconPlayerPlayFilled className="size-5" />
          </button>
          <button>
            <IconPlayerSkipForwardFilled className="size-5" />
          </button>
          <button>
            <IconRepeat className="size-5" />
          </button>
        </div>
        <div className="flex flex-1 items-center space-x-2">
          <VolumeComponent onClick={(e) => e.stopPropagation()} />
          <button>
            <IconDotsVertical
              onClick={(e) => e.stopPropagation()}
              className="size-5"
            />
          </button>
        </div>
      </div>

      <div className="relative flex items-center justify-center space-x-4 w-full py-4">
        <div className="text-sm pb-2 font-bold">01:53</div>
        <div className="w-full">
          <CustomSlider
            className="cursor-pointer"
            defaultValue={[50]}
            max={100}
            step={1}
          />
        </div>
        <div className="text-sm pb-2 font-bold">03:10</div>
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between md:justify-center w-full h-full my-8 md:gap-x-10 overflow-y-auto">
        <div className="flex flex-col items-center justify-center gap-y-4 w-full md:w-1/4">
          <div className="bg-gradient-to-br from-[#FFFFFFA0] to-[#999999A0] aspect-square rounded-lg mb-4">
            <div className="p-6 flex items-center justify-center">
              <Image
                src="/images/albumcover.png"
                alt="albumcover"
                width={500}
                height={500}
                className="rounded-lg"
              />
            </div>
          </div>
          <div className="text-3xl font-bold">WHIPLASH</div>
          <div className="text-2xl font-bold text-neutral-300 flex items-center gap-x-2">
            <Link href="/user/123" className="hover:underline">
              에스파
            </Link>
            <span>·</span>
            <Link href="/album/123" className="hover:underline">
              WHIPLASH
            </Link>
          </div>
        </div>

        <div className="flex flex-col h-full w-full md:w-1/3">
          <div className="bg-gradient-to-br from-[#FFFFFFA0] to-[#999999A0] h-full rounded-lg p-2 overflow-y-auto hide-scrollbar">
            {view === "nowPlaying" ? (
              <WatchNowPlaying />
            ) : (
              <div className="whitespace-pre-line p-4 text-2xl truncate leading-loose text-white">
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
                외면해도 소용없지 don&apos;t you blow it?
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
