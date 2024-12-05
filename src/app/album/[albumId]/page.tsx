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
import { useMediaQuery } from "react-responsive";

import useStreamingBar from "@/hooks/modal/use-streaming-bar";
import { cn } from "@/lib/utils";

export default function AlbumPage() {
  const router = useRouter();
  const streamingBar = useStreamingBar();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const dummy = [
    {
      id: 1,
      title: "피곤해",
      duration: "3:02",
    },
    {
      id: 2,
      title: "피곤해",
      duration: "3:02",
    },
    {
      id: 3,
      title: "피곤해",
      duration: "3:02",
    },
    {
      id: 4,
      title: "피곤해",
      duration: "3:02",
    },
  ];

  return (
    <main
      className={cn(
        "flex gap-x-12 bg-transparent h-full mb-20 md:mb-10 pl-4 md:pl-0 md:ml-48 mt-8 md:mt-24 pt-2 pr-4 md:pr-0 md:mr-28 overflow-y-auto hide-scrollbar",
        isMobile && streamingBar.isOpen && "mb-36"
      )}
    >
      <div className="h-full lg:w-1/2 w-full flex flex-col gap-y-12 overflow-y-auto">
        <div className="flex w-full flex-row md:h-[250px] gap-x-8 pr-2">
          <div className="h-full w-full flex flex-col items-center justify-center group">
            <Image
              src="/images/music1.png"
              alt="albumCover"
              width={250}
              height={250}
              className="rounded-xl group-hover:opacity-75"
            />
            <div
              onClick={() => streamingBar.onOpen()}
              className="absolute flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-full bg-[#FF00B1] w-14 h-14 transform hover:scale-125 transition-transform duration-300"
            >
              <IconPlayerPlayFilled className="w-8 h-8 text-black" />
            </div>
          </div>
          <div className="flex flex-col w-full h-full items-start justify-between py-2 gap-y-4">
            <div
              onClick={() => router.push("/user/123")}
              className="flex gap-x-2 items-center"
            >
              <Avatar className="w-6 h-6 lg:w-10 lg:h-10">
                <AvatarImage src="/images/music1.png" alt="profile" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="text-sm hover:underline truncate">RARO YANG</span>
            </div>
            <div className="tracking-wide text-3xl md:text-4xl lg:text-5xl font-extrabold truncate">
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
                className="group hover:bg-[#7E47631F] dark:hover:bg-white/10 h-12"
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
                <TableCell className="w-full truncate">{song.title}</TableCell>
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
