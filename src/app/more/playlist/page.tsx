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

interface Playlist {
  id: number;
  name: string;
  description?: string;
  src: string;
  onClickName: () => void;
  onClickDescription: () => void;
}

export default function MorePlaylistPage() {
  const router = useRouter();
  const streamingBar = useStreamingBar();

  const playlists: Playlist[] = [
    {
      id: 1,
      name: "K-pop 최신곡 모음",
      description: "RARO",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/playlist/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 2,
      name: "드라이브 플레이리스트",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/playlist/123"),
      onClickDescription: () => router.push("/user/123"),
      description: "RARO",
    },
    {
      id: 3,
      name: "공부할 때 듣기 좋은 노래",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/playlist/123"),
      onClickDescription: () => router.push("/user/123"),
      description: "RARO",
    },
    {
      id: 4,
      name: "운동할 때 듣는 노래",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/playlist/123"),
      onClickDescription: () => router.push("/user/123"),
      description: "RARO",
    },
    {
      id: 5,
      name: "감성 발라드 모음",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/playlist/123"),
      onClickDescription: () => router.push("/user/123"),
      description: "RARO",
    },
    {
      id: 6,
      name: "인디음악 플레이리스트",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/playlist/123"),
      onClickDescription: () => router.push("/user/123"),
      description: "인디음악팬",
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

  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist>(
    playlists[0]
  );

  const handlePlaylistSelect = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
  };

  return (
    <main className="flex flex-col bg-transparent h-full mb-20 md:mb-10 pl-4 md:pl-0 md:ml-48 mt-8 md:mt-24 pt-2 pr-4 md:pr-0 md:mr-28 overflow-y-auto hide-scrollbar">
      <div className="h-auto flex flex-col gap-y-4 lg:flex-row gap-x-4 items-center justify-center">
        {/* 왼쪽 프로필 섹션 */}
        <div className="w-full lg:w-1/3 h-full bg-[#D7C5C526] dark:bg-gradient-to-t dark:from-[#00000033] dark:to-[#41414133] backdrop-blur-xl lg:p-8 rounded-lg relative">
          <div className="flex flex-col items-center mx-8 mt-2">
            <Image
              src={selectedPlaylist.src}
              alt={selectedPlaylist.name}
              width={200}
              height={200}
              className="rounded-lg"
            />
            <h1 className="text-3xl font-bold mt-8 text-center truncate tracking-wide">
              {selectedPlaylist.name}
            </h1>
            <p
              onClick={() => router.push("/user/123")}
              className="mt-4 tracking-wide uppercase truncate font-bold text-lg text-gray-700 dark:text-white hover:underline cursor-pointer"
            >
              {selectedPlaylist.description}
            </p>
            <div className="flex w-full items-center justify-between mt-6">
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
                onClick={selectedPlaylist.onClickName}
              >
                <IconChevronRight className="size-6" />
              </button>
            </div>
          </div>
        </div>

        {/* 오른쪽 아티스트 그리드 섹션 */}
        <div className="w-full lg:w-2/3 h-full bg-[#D7C5C526] dark:bg-gradient-to-t dark:from-[#00000033] dark:to-[#41414133] backdrop-blur-xl lg:p-8 rounded-lg overflow-y-auto hide-scrollbar">
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-8">
            {playlists.map((playlist) => (
              <div
                className="flex flex-col items-center cursor-pointer"
                key={playlist.id}
                onClick={() => handlePlaylistSelect(playlist)}
              >
                <SquareContainer
                  src={playlist.src}
                  name={playlist.name}
                  description={playlist.description}
                  design="rounded-lg"
                  onClickName={playlist.onClickName}
                  onClickDescription={playlist.onClickDescription}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
