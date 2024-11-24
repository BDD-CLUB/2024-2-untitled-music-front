"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  IconDotsVertical,
  IconHeart,
  IconInfoCircle,
  IconShare,
  IconClock,
  IconPlayerPlayFilled,
} from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Image from "next/image";
import { useRouter } from "next/navigation";

import useStreamingBar from "@/hooks/modal/use-streaming-bar";
import Link from "next/link";

export default function PlaylistPage() {
  const router = useRouter();
  const streamingBar = useStreamingBar();

  const dummy = [
    {
      id: 1,
      cover: "/images/music1.png",
      title: "행복해",
      artist: "라로",
      album: "THIRSTY",
      duration: "3:02",
    },
    {
      id: 2,
      cover: "/images/music1.png",
      title: "행복해",
      artist: "라로",
      album: "THIRSTY",
      duration: "3:02",
    },
    {
      id: 3,
      cover: "/images/music1.png",
      title: "행복해",
      artist: "라로",
      album: "THIRSTY",
      duration: "3:02",
    },
    {
      id: 4,
      cover: "/images/music1.png",
      title: "행복해",
      artist: "라로",
      album: "THIRSTY",
      duration: "3:02",
    },
  ];

  const GridImage = () => {
    return (
      <div className="grid grid-cols-2 grid-rows-2 max-w-[250px] max-h-[250px] rounded-xl overflow-hidden group-hover:opacity-75">
        <Image
          src="/images/music1.png"
          alt="albumCover1"
          width={125}
          height={125}
          className="w-full h-full object-cover"
        />
        <Image
          src="/images/music1.png"
          alt="albumCover2"
          width={125}
          height={125}
          className="w-full h-full object-cover"
        />
        <Image
          src="/images/music1.png"
          alt="albumCover3"
          width={125}
          height={125}
          className="w-full h-full object-cover"
        />
        <Image
          src="/images/music1.png"
          alt="albumCover4"
          width={125}
          height={125}
          className="w-full h-full object-cover"
        />
      </div>
    );
  };

  return (
    <main className="flex gap-x-12 bg-transparent h-full mb-20 md:mb-10 pl-4 md:pl-0 md:ml-48 mt-8 md:mt-24 pt-2 pr-4 md:pr-0 md:mr-28 overflow-y-auto hide-scrollbar">
      <div className="h-full lg:w-1/2 w-full flex flex-col gap-y-12 overflow-y-auto">
        <div className="flex w-full flex-col md:flex-row md:h-[250px] gap-x-8 pr-2">
          <div className="relative h-full w-full flex flex-col items-center justify-center group">
            <GridImage />
            <div
              onClick={() => streamingBar.onOpen()}
              className="absolute bottom-6 left-4 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-full bg-[#FF00B1] w-14 h-14 transform hover:scale-125 transition-transform duration-300"
            >
              <IconPlayerPlayFilled className="w-8 h-8 text-black" />
            </div>
          </div>
          <div className="flex flex-col w-full h-full items-start justify-center md:justify-between pt-6 mt:pt-0 md:py-2 gap-y-4">
            <div
              onClick={() => router.push("/user/123")}
              className="flex gap-x-2 items-center"
            >
              <Avatar className="w-6 h-6 lg:w-10 lg:h-10">
                <AvatarImage src="/images/music1.png" alt="profile" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="text-sm hover:underline">RARO YANG</span>
            </div>
            <div className="tracking-wide text-3xl md:text-4xl lg:text-5xl font-extrabold">
              THIRSTY
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex gap-x-2 items-center justify-center mr-2 lg:mr-0">
                <IconHeart className="size-6" />
                <span className="text-base">13.1k</span>
              </div>
              <div className="flex gap-x-3">
                <IconShare className="size-6" />
                <IconInfoCircle className="size-6" />
                <IconDotsVertical className="size-6" />
              </div>
            </div>
          </div>
        </div>

        <Table className="overflow-y-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px] text-black dark:text-white">
                #
              </TableHead>
              <TableHead className="text-black dark:text-white">제목</TableHead>
              <TableHead className="w-[100px]"></TableHead>
              <TableHead className="text-right w-[100px] text-black dark:text-white">
                <IconClock className="ml-auto" />
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummy.map((song) => (
              <TableRow
                key={song.id}
                className="group hover:bg-[#7E47631F] dark:hover:bg-white/10"
              >
                <TableCell className="w-[50px] pr-4">
                  <div className="flex group-hover:hidden pr-4">{song.id}</div>
                  <div
                    onClick={() => streamingBar.onOpen()}
                    className="hidden group-hover:flex text-[#FF239C]"
                  >
                    <IconPlayerPlayFilled className="size-6" />
                  </div>
                </TableCell>
                <TableCell className="flex flex-row items-start w-full gap-x-2">
                  <Image
                    src={song.cover}
                    alt="cover"
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                  <div className="flex flex-col gap-y-1 items-start w-full">
                    <p className="text-sm font-semibold overflow-x-hidden">
                      {song.title}
                    </p>
                    <div className="flex flex-row w-full overflow-x-hidden gap-x-2">
                      <Link
                        href={"/user/123"}
                        className="text-xs text-neutral-500 overflow-x-hidden hover:underline"
                      >
                        {song.artist}
                      </Link>
                      <Link
                        href={"/album/123"}
                        className="text-xs text-neutral-500 overflow-x-hidden hover:underline"
                      >
                        {song.album}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">{song.duration}</TableCell>
                <TableCell>
                  <IconDotsVertical className="size-6" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="h-full lg:w-1/2 w-full rounded-xl bg-[#7E476314] lg:flex hidden">
        {/* 댓글 기능 활성화 */}
      </div>
    </main>
  );
}
