"use client";

import SquareContainer from "@/components/container/square-container";
import { useUser } from "@/provider/userProvider";
import { Playlist, getAllPlaylists } from "@/services/playlistService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MainPlaylist = () => {
  const router = useRouter();
  const { user } = useUser();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        const data = await getAllPlaylists(0, 10);
        setPlaylists(data);
      } catch (error) {
        console.error("플레이리스트 로딩 실패:", error);
      }
    };

    getPlaylists();
  }, []);

  if (!playlists.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-between items-center">
        <div className="flex justify-start">
          <p className="text-[#FF4D74] font-bold text-xl">
            {user?.name || "U"}
          </p>
          <p className="font-bold text-xl">님을 위한 플레이리스트</p>
        </div>
        <div className="flex justify-end rounded-full drop-shadow-lg bg-[#F1DCDC] hover:bg-pink-200 transition-colors duration-300 dark:bg-[#FFFFFF0D] dark:hover:bg-[#FFFFFF1A] px-4 py-1">
          <button
            className="text-base font-bold text-black dark:text-white"
            onClick={() => router.push("/more/playlist")}
          >
            더보기
          </button>
        </div>
      </div>
      <div className="w-full overflow-x-auto flex gap-x-4">
        {playlists.map((playlist) => (
          <SquareContainer
            key={playlist.uuid}
            src={playlist.playlistItemResponseDtos[0].track.artUrl}
            name={playlist.title}
            description="플레이리스트"
            design="rounded-xl"
            onClickName={() => router.push(`/playlist/${playlist.uuid}`)}
            onClickDescription={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default MainPlaylist;
