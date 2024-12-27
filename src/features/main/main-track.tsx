"use client";

import SquareContainer from "@/components/container/square-container";
import { TrackResponse, getAllTracks } from "@/services/trackService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MainTrack = () => {
  const router = useRouter();
  const [tracks, setTracks] = useState<TrackResponse[]>([]);

  useEffect(() => {
    const getTracks = async () => {
      try {
        const data = await getAllTracks(0, 10);
        setTracks(data);
      } catch (error) {
        console.error("트랙 로딩 실패:", error);
      }
    };

    getTracks();
  }, []);

  if (!tracks.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-between items-center">
        <div className="flex justify-start">
          <p className="text-[#FF4D74] font-bold text-xl tracking-wide">
            🔥 HOT TRACKS
          </p>
        </div>
        <div className="flex justify-end rounded-full drop-shadow-lg bg-[#F1DCDC] hover:bg-pink-200 transition-colors duration-300 dark:bg-[#FFFFFF0D] dark:hover:bg-[#FFFFFF1A] px-4 py-1">
          <button
            className="text-base font-bold text-black dark:text-white"
            onClick={() => router.push("/more/track")}
          >
            더보기
          </button>
        </div>
      </div>
      <div className="w-full overflow-x-auto flex gap-x-4">
        {tracks.map((track) => (
          <SquareContainer
            key={track.trackResponseDto.uuid}
            src={track.trackResponseDto.artUrl}
            name={track.trackResponseDto.title}
            description={`${track.albumResponseDto.title} · ${track.profileResponseDto.name}`}
            design="rounded-xl"
            onClickName={() => router.push(`/album/${track.albumResponseDto.uuid}`)}
            onClickDescription={() => router.push(`/user/${track.profileResponseDto.uuid}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default MainTrack;
