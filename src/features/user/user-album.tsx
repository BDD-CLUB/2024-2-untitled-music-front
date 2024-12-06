'use client'

import SquareContainer from "@/components/container/square-container";
import { useRouter } from "next/navigation";

const UserAlbum = () => {
  const router = useRouter();

  const dummy = [
    {
      id: 1,
      src: "/images/music1.png",
      name: "ROCK-STAR",
      description: "2024 · IPCGRDN",
      onClickName: () => router.push("/album/123"),
    },
    {
      id: 2,
      src: "/images/music1.png",
      name: "ROCK-STAR",
      description: "2024 · IPCGRDN",
      onClickName: () => router.push("/album/123"),
    },
    {
      id: 3,
      src: "/images/music1.png",
      name: "ROCK-STAR",
      description: "2024 · IPCGRDN",
      onClickName: () => router.push("/album/123"),
    },
    {
      id: 4,
      src: "/images/music1.png",
      name: "BREAK",
      description: "2018 · PALM",
      onClickName: () => router.push("/album/123"),
    },
    {
      id: 5,
      src: "/images/music1.png",
      name: "Thirsty",
      description: "1988 · RARO",
      onClickName: () => router.push("/album/123"),
    },
    {
      id: 6,
      src: "/images/music1.png",
      name: "산책",
      description: "EP · BDD",
      onClickName: () => router.push("/album/123"),
    },
  ];

  return (
    <div className="h-full w-full">
      <div className="w-full gap-x-2 grid grid-cols-2 xl:grid-cols-4">
        {dummy.map((item) => (
          <SquareContainer
            key={item.id}
            src={item.src}
            name={item.name}
            description={item.description}
            design="rounded-xl"
            onClickName={item.onClickName}
          />
        ))}
      </div>
    </div>
  );
};

export default UserAlbum;
