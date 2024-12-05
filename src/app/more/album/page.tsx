"use client";

import { useState } from "react";
import SquareContainer from "@/components/container/square-container";
import {
  IconChevronRight,
  IconDotsVertical,
  IconHeart,
  IconInfoCircle,
  IconPlayerPlayFilled,
  IconShare,
} from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useStreamingBar from "@/hooks/modal/use-streaming-bar";
import { useMediaQuery } from "react-responsive";
import { cn } from "@/lib/utils";

interface Album {
  id: number;
  name: string;
  src: string;
  onClickName: () => void;
  onClickDescription: () => void;
  description?: string;
}

export default function MoreAlbumPage() {
  const router = useRouter();
  const streamingBar = useStreamingBar();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const albums: Album[] = [
    {
      id: 1,
      name: "Get Up",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
      description: "2023 NewJeans",
    },
    {
      id: 2,
      name: "Drama",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
      description: "2024 aespa",
    },
    {
      id: 3,
      name: "JORDI",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
      description: "2021 Maroon 5",
    },
    {
      id: 4,
      name: "Love Sux",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
      description: "2022 Avril Lavigne",
    },
    {
      id: 5,
      name: "The Winning",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
      description: "2024 IU",
    },
    {
      id: 6,
      name: "Remember Us",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
      description: "2018 DAY6",
    },
  ];

  const dummy = [
    {
      id: 1,
      title: "피곤해",
    },
    {
      id: 2,
      title: "피곤해",
    },
    {
      id: 3,
      title: "피곤해",
    },
    {
      id: 4,
      title: "피곤해",
    },
  ];

  const [selectedAlbum, setSelectedAlbum] = useState<Album>(albums[0]);

  const handleAlbumSelect = (album: Album) => {
    setSelectedAlbum(album);
  };

  return (
    <main
      className={cn(
        "flex flex-col bg-transparent h-full mb-20 md:mb-10 pl-4 md:pl-0 md:ml-48 mt-8 md:mt-24 pt-2 pr-4 md:pr-0 md:mr-28 overflow-y-auto",
        isMobile && streamingBar.isOpen && "mb-36"
      )}
    >
      <div className="h-auto flex gap-x-4 items-center justify-center">
        {/* 왼쪽 프로필 섹션 */}
        <div className="w-1/3 hidden lg:flex h-full bg-[#D7C5C526] dark:bg-gradient-to-t dark:from-[#00000033] dark:to-[#41414133] backdrop-blur-xl lg:p-8 rounded-lg relative">
          <div className="relative flex flex-col items-center mx-auto mt-2">
            <Image
              src={selectedAlbum.src}
              alt={selectedAlbum.name}
              width={200}
              height={200}
              className="rounded-lg"
            />
            <h1 className="text-2xl font-bold mt-8 text-center truncate tracking-wide">
              {selectedAlbum.name}
            </h1>
            <p
              onClick={() => router.push("/user/123")}
              className="mt-4 tracking-wide uppercase truncate font-bold text-lg text-gray-700 dark:text-white hover:underline cursor-pointer"
            >
              {selectedAlbum.description}
            </p>
            <div className="flex w-full items-center justify-between mt-6">
              <div className="flex gap-x-2 items-center justify-center mr-2 lg:mr-0">
                <IconHeart className="size-6" />
                <span className="text-base truncate">13.1k</span>
              </div>
              <div className="flex gap-x-3">
                <IconShare className="size-6" />
                <IconInfoCircle className="size-6" />
                <IconDotsVertical className="size-6" />
              </div>
            </div>

            <div className="mt-8 w-full overflow-y-auto hide-scrollbar">
              {dummy.map((song) => (
                <div
                  key={song.id}
                  className="group flex items-center rounded-lg hover:bg-[#7E47631F] dark:hover:bg-white/10 h-12"
                >
                  <div className="w-[50px] pr-4">
                    <div className="flex group-hover:hidden pr-4">
                      {song.id}
                    </div>
                    <div
                      onClick={() => streamingBar.onOpen()}
                      className="hidden group-hover:flex text-[#FF239C]"
                    >
                      <IconPlayerPlayFilled className="size-6" />
                    </div>
                  </div>
                  <div className="w-full group-hover:font-semibold">
                    {song.title}
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-[5%]">
              <button
                className="bg-white dark:bg-black dark:backdrop-blur-xl hover:opacity-75 text-black dark:text-white rounded-full p-2 shadow-lg"
                onClick={selectedAlbum.onClickName}
              >
                <IconChevronRight className="size-6" />
              </button>
            </div>
          </div>
        </div>

        {/* 오른쪽 아티스트 그리드 섹션 */}
        <div className="w-full lg:w-2/3 h-full bg-[#D7C5C526] dark:bg-gradient-to-t dark:from-[#00000033] dark:to-[#41414133] backdrop-blur-xl p-8 rounded-lg overflow-y-auto">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-8">
            {albums.map((album) => (
              <div
                className="flex flex-col items-center cursor-pointer"
                key={album.id}
                onClick={() => handleAlbumSelect(album)}
              >
                <SquareContainer
                  src={album.src}
                  name={album.name}
                  description={album.description}
                  design="rounded-lg"
                  onClickName={album.onClickName}
                  onClickDescription={album.onClickDescription}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
