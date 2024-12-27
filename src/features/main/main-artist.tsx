"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/provider/userProvider";
import { Profile, getAllProfiles } from "@/services/profileService";
import SquareContainer from "@/components/container/square-container";

const MainArtist = () => {
  const router = useRouter();
  const { user } = useUser();
  const [artists, setArtists] = useState<Profile[]>([]);

  useEffect(() => {
    const getArtists = async () => {
      try {
        const data = await getAllProfiles(0, 10);

        setArtists(data);
      } catch (error) {
        console.error("프로필 로딩 실패:", error);
      }
    };

    getArtists();
  }, []);

  if (!artists.length) {
    return null;
  }
  
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-between items-center">
        <div className="flex justify-start">
          <p className="text-[#FF4D74] font-bold text-xl">
            {user?.name || "U"}
          </p>
          <p className="font-bold text-xl">님을 위한 아티스트</p>
        </div>
        <div className="flex justify-end rounded-full drop-shadow-lg bg-[#F1DCDC] hover:bg-pink-200 transition-colors duration-300 dark:bg-[#FFFFFF0D] dark:hover:bg-[#FFFFFF1A] px-4 py-1">
          <button
            className="text-base font-bold text-black dark:text-white"
            onClick={() => router.push("/more/artist")}
          >
            더보기
          </button>
        </div>
      </div>
      <div className="w-full overflow-x-auto flex gap-x-4">
        {artists.map((artist) => (
          <SquareContainer
            key={artist.uuid}
            src={artist.profileImage}
            name={artist.name}
            design="rounded-full"
            onClickName={() => router.push(`/user/${artist.uuid}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default MainArtist;
