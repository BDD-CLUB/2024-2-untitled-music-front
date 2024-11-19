"use client";

import SquareContainer from "@/components/container/square-container";
import { useUser } from "@/provider/userProvider";
import { useRouter } from "next/navigation";

const MainAlbum = () => {
  const router = useRouter();
  const { user } = useUser();

  const dummy = [
    {
      id: 1,
      src: "/images/music1.png",
      name: "ROCK-STAR",
      description: "2024 · IPCGRDN",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 2,
      src: "/images/music1.png",
      name: "ROCK-STAR",
      description: "2024 · IPCGRDN",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 3,
      src: "/images/music1.png",
      name: "ROCK-STAR",
      description: "2024 · IPCGRDN",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 4,
      src: "/images/music1.png",
      name: "BREAK",
      description: "2018 · PALM",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 5,
      src: "/images/music1.png",
      name: "Thirsty",
      description: "1988 · RARO",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 6,
      src: "/images/music1.png",
      name: "산책",
      description: "EP · BDD",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 7,
      src: "/images/music1.png",
      name: "산책",
      description: "EP · BDD",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 8,
      src: "/images/music1.png",
      name: "산책",
      description: "EP · BDD",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
    },
  ];

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-start">
        <p className="text-[#FF4D74] font-bold text-xl">
          {user?.name || "U"}
        </p>
        <p className="font-bold text-xl">님을 위한 앨범</p>
      </div>
      <div className="w-full overflow-x-auto flex gap-x-4">
        {dummy.map((item) => (
          <SquareContainer
            key={item.id}
            src={item.src}
            name={item.name}
            description={item.description}
            design="rounded-xl"
            onClickName={item.onClickName}
            onClickDescription={item.onClickDescription}
          />
        ))}
      </div>
    </div>
  );
};

export default MainAlbum;
