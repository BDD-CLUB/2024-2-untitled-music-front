'use client'

import SquareContainer from "@/components/container/square-container";
import { useRouter } from "next/navigation";

const MainTrack = () => {
    const router = useRouter();

  const dummy = [
    {
      id: 1,
      src: "/images/music1.png",
      name: "ROCK-STAR",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 2,
      src: "/images/music1.png",
      name: "ROCK-STAR",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 3,
      src: "/images/music1.png",
      name: "ROCK-STAR",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 4,
      src: "/images/music1.png",
      name: "BREAK",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 5,
      src: "/images/music1.png",
      name: "Thirsty",
      onClickName: () => router.push("/album/123"),
      onClickDescription: () => router.push("/user/123"),
    },
  ];

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-start">
        <p className="text-[#FF4D74] font-bold text-xl tracking-wide">TRACK</p>
      </div>
      <div className="w-full overflow-x-auto flex gap-x-4">
        {dummy.map((item) => (
          <SquareContainer
            key={item.id}
            src={item.src}
            name={item.name}
            description="IPCGRDN"
            design="rounded-xl"
            onClickName={item.onClickName}
            onClickDescription={item.onClickDescription}
          />
        ))}
      </div>
    </div>
  );
};

export default MainTrack;
