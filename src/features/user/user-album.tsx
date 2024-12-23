'use client'

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Album, getAlbumByProfileUUID } from "@/services/albumService";
import SquareContainer from "@/components/container/square-container";

const UserAlbum = () => {
  const [albums, setAlbums] = useState<Album[]>([]);

  const router = useRouter();
  const pathname = usePathname();
  const profileUUID = String(pathname.split("/").pop());

  useEffect(() => {
    const getAlbums = async () => {
      try {
        const data = await getAlbumByProfileUUID(profileUUID);
        setAlbums(data);
      } catch (error) {
        console.error("앨범 로딩 실패:", error);
      }
    };

    getAlbums();
  }, [profileUUID]);

  if (!albums.length) {
    return null;
  }
  
  return (
    <div className="h-full w-full">
      <div className="w-full gap-x-2 grid grid-cols-2 xl:grid-cols-4">
        {albums.map((album) => (
          <SquareContainer
            key={album.uuid}
            src={album.artImage}
            name={album.title}
            description={album.description}
            design="rounded-xl"
            onClickName={() => router.push(`/album/${album.uuid}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default UserAlbum;
