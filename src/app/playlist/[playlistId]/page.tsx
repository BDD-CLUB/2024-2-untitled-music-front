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
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import useStreamingBar from "@/hooks/modal/use-streaming-bar";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { cn } from "@/lib/utils";
import { Playlist, getPlaylistById } from "@/services/playlistService";
import useConfirmModal from "@/hooks/modal/use-confirm-modal";
import useInformationModal from "@/hooks/modal/use-information-modal";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import usePlaylistEditModal from "@/hooks/modal/use-playlistEdit-modal";

export default function PlaylistPage() {
  const [playlistData, setPlaylistData] = useState<Playlist | undefined>(
    undefined
  );

  const router = useRouter();
  const streamingBar = useStreamingBar();
  const confirmModal = useConfirmModal();
  const playlistEditModal = usePlaylistEditModal();
  const informationModal = useInformationModal();

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const pathname = usePathname();
  const uuid = String(pathname.split("/").pop());

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

  useEffect(() => {
    const getPlaylist = async () => {
      try {
        const data = await getPlaylistById(uuid);
        setPlaylistData(data);
      } catch (error) {
        console.error("플레이리스트 로딩 실패:", error);
      }
    };

    getPlaylist();
  }, [uuid]);

  const handleShareClick = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("링크가 복사되었습니다!"))
      .catch(() => toast.error("복사 실패!"));
  };

  const handleConfirm = (uuid: string, data: string) => {
    confirmModal.onOpen(uuid, data);
  };

  return (
    <main
      className={cn(
        "flex gap-x-12 bg-transparent h-full mb-20 md:mb-10 pl-4 md:pl-0 md:ml-48 mt-8 md:mt-24 pt-2 pr-4 md:pr-0 md:mr-28 overflow-y-auto hide-scrollbar",
        isMobile && streamingBar.isOpen && "mb-36"
      )}
    >
      <div className="h-full lg:w-1/2 w-full flex flex-col gap-y-8 overflow-y-auto">
        <div className="flex w-full flex-row max-h-[250px] gap-x-8 px-2">
          <div className="h-full w-full flex flex-col items-center justify-center group">
            <GridImage />
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
              <span className="text-sm hover:underline truncate">
                RARO YANG
              </span>
            </div>
            <div className="tracking-wide text-3xl md:text-4xl lg:text-5xl font-extrabold truncate">
              {playlistData?.title}
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex gap-x-2 items-center justify-center mr-2 lg:mr-0">
                <IconHeart className="size-6" />
                <span className="text-base">13.1k</span>
              </div>
              <div className="flex gap-x-3">
                <IconShare onClick={handleShareClick} className="size-6" />
                <IconInfoCircle
                  onClick={() =>
                    playlistData && informationModal.onOpen(playlistData)
                  }
                  className="size-6"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <IconDotsVertical className="size-6 hover:opacity-75 cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-20 items-center justify-start flex flex-col">
                    <DropdownMenuItem onClick={playlistEditModal.onOpen}>
                      플레이리스트 편집
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-600 dark:focus:focus:text-red-600"
                      onClick={() => handleConfirm(uuid || "", "playlist")}
                    >
                      플레이리스트 삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
            {playlistData?.playlistItemResponseDtos.map((item) => (
              <TableRow
                key={item.uuid}
                className="group hover:bg-[#7E47631F] dark:hover:bg-white/10"
              >
                <TableCell className="w-[50px] pr-4">
                  <div className="flex group-hover:hidden pr-4">
                    {item.track.uuid}
                  </div>
                  <div
                    onClick={() => streamingBar.onOpen()}
                    className="hidden group-hover:flex text-[#FF239C]"
                  >
                    <IconPlayerPlayFilled className="size-6" />
                  </div>
                </TableCell>
                <TableCell className="flex flex-row items-start w-full gap-x-2">
                  <Image
                    src={item.track.artUrl}
                    alt="cover"
                    width={40}
                    height={40}
                    className="rounded-md"
                  />
                  <div className="flex flex-col gap-y-1 items-start w-full">
                    <p className="text-sm font-semibold overflow-x-hidden truncate">
                      {item.track.title}
                    </p>
                    <div className="flex flex-row w-full overflow-x-hidden gap-x-2">
                      <Link
                        href={"/user/123"}
                        className="text-xs text-neutral-500 overflow-x-hidden hover:underline truncate"
                      >
                        {item.track.title}
                      </Link>
                      <Link
                        href={"/album/123"}
                        className="text-xs text-neutral-500 overflow-x-hidden hover:underline truncate"
                      >
                        {item.track.title}
                      </Link>
                    </div>
                  </div>
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  {item.track.duration}
                </TableCell>
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
