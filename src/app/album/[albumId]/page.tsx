"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
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

import useStreamingBar from "@/hooks/modal/use-streaming-bar";
import useInformationModal from "@/hooks/modal/use-information-modal";
import useAlbumEditModal from "@/hooks/modal/use-albumEdit-modal";
import { Album, Profile, Track, getAlbumById } from "@/services/albumService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AlbumPage() {
  const [albumData, setAlbumData] = useState<Album | undefined>(undefined);
  const [albumTrack, setAlbumTrack] = useState<Track[]>([]);
  const [albumProfile, setAlbumProfile] = useState<Profile | undefined>(
    undefined
  );

  const router = useRouter();
  const streamingBar = useStreamingBar();
  const informationModal = useInformationModal();
  const albumEditModal = useAlbumEditModal();

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const pathname = usePathname();
  const uuid = String(pathname.split("/").pop());

  useEffect(() => {
    const getAlbum = async () => {
      try {
        const data = await getAlbumById(uuid);
        setAlbumData(data.albumResponseDto);
        setAlbumTrack(data.trackResponseDtos);
        setAlbumProfile(data.profileResponseDto);
      } catch (error) {
        console.error("앨범 로딩 실패:", error);
      }
    };

    getAlbum();
  }, [uuid]);

  const handleShareClick = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => toast.success("링크가 복사되었습니다!"))
      .catch(() => toast.error("복사 실패!"));
  };

  if (!albumData) {
    return <div>앨범 데이터를 불러오는 중입니다...</div>;
  }

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
              src={albumData.artImage || ""}
              alt="album"
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
            {albumProfile && (
              <div
                onClick={() => router.push(`/profile/${albumProfile.name}`)}
                className="flex gap-x-2 items-center"
              >
                <Avatar className="w-6 h-6 lg:w-10 lg:h-10">
                  <AvatarImage
                    src={`${albumProfile.profileImage}`}
                    alt="profile"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="text-sm hover:underline truncate">
                  {albumProfile.name}
                </span>
              </div>
            )}
            <div className="tracking-wide text-3xl md:text-4xl lg:text-5xl font-extrabold truncate">
              {albumData.title}
            </div>
            <div className="flex w-full items-center justify-between">
              <div className="flex gap-x-2 items-center justify-center mr-2 lg:mr-0">
                <IconHeart className="size-6" />
                <span className="text-base">13.1k</span>
              </div>
              <div className="flex gap-x-3">
                <IconShare
                  onClick={handleShareClick}
                  className="size-6 cursor-pointer"
                />
                <IconInfoCircle
                  onClick={() =>
                    albumData && informationModal.onOpen(albumData)
                  }
                  className="size-6 cursor-pointer"
                />
                <IconDotsVertical
                  onClick={albumEditModal.onOpen}
                  className="size-6 cursor-pointer"
                />
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
            {albumTrack.map((song) => (
              <TableRow
                key={song.uuid}
                className="group hover:bg-[#7E47631F] dark:hover:bg-white/10 h-12"
              >
                <TableCell className="w-[50px] pr-4">
                  <div className="flex group-hover:hidden pr-4">
                    {song.uuid}
                  </div>
                  <div
                    onClick={() => streamingBar.onOpen()}
                    className="hidden group-hover:flex text-[#FF239C]"
                  >
                    <IconPlayerPlayFilled className="size-6" />
                  </div>
                </TableCell>
                <TableCell className="w-full truncate">{song.title}</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">{song.title}</TableCell>
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
