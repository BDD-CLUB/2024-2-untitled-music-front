"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useUser } from "@/provider/userProvider";
import { Album, getAllAlbums } from "@/services/albumService";
import SquareContainer from "@/components/container/square-container";

const MainAlbum = () => {
  const router = useRouter();
  const { user } = useUser();
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const getAlbums = async () => {
      try {
        const data = await getAllAlbums();
        setAlbums(data);
      } catch (error) {
        console.error('앨범 로딩 실패:', error);
      }
    };

    getAlbums();
  }, []);

  if (!albums.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-start">
        <p className="text-[#FF4D74] font-bold text-xl">
          {user?.name || "U"}
        </p>
        <p className="font-bold text-xl">님을 위한 앨범</p>
      </div>
      <div className="w-full overflow-x-auto flex gap-x-4">
        {albums.map((album) => (
          <SquareContainer
            key={album.uuid}
            src={album.artImage}
            name={album.title}
            description={`${album.releaseDate} · ${album.description}`}
            design="rounded-xl"
            onClickName={() => router.push(`/album/${album.uuid}`)}
            onClickDescription={() => router.push(`/user/${album.uuid}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default MainAlbum;
