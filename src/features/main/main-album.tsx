"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/provider/userProvider";
import { AlbumResponse, getAllAlbums } from "@/services/albumService";
import SquareContainer from "@/components/container/square-container";

const MainAlbum = () => {
  const router = useRouter();
  const { user } = useUser();
  const [albums, setAlbums] = useState<AlbumResponse[]>([]);

  useEffect(() => {
    const getAlbums = async () => {
      try {
        const data = await getAllAlbums(0, 10);
        setAlbums(data);
      } catch (error) {
        console.error("앨범 로딩 실패:", error);
      }
    };

    getAlbums();
  }, []);

  if (!albums.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-between items-center">
        <div className="flex justify-start">
          <p className="text-[#FF4D74] font-bold text-xl">
            {user?.name || "U"}
          </p>
          <p className="font-bold text-xl">님을 위한 앨범</p>
        </div>
        <div className="flex justify-end rounded-full drop-shadow-lg bg-[#F1DCDC] hover:bg-pink-200 transition-colors duration-300 dark:bg-[#FFFFFF0D] dark:hover:bg-[#FFFFFF1A] px-4 py-1">
          <button
            className="text-base font-bold text-black dark:text-white"
            onClick={() => router.push("/more/album")}
          >
            더보기
          </button>
        </div>
      </div>
      <div className="w-full overflow-x-auto flex gap-x-4">
        {albums.map(
          ({ albumResponseDto: album, profileResponseDto: profile }) => (
            <SquareContainer
              key={album.uuid}
              src={album.artImage}
              name={album.title}
              description={`${album.releaseDate} · ${profile.name}`}
              design="rounded-xl"
              onClickName={() => router.push(`/album/${album.uuid}`)}
              onClickDescription={() => router.push(`/user/${profile.name}`)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default MainAlbum;
