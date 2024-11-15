"use client";

import SquareContainer from "@/components/container/square-container";
import { useRouter } from "next/navigation";

const MainArtist = () => {
  const router = useRouter();

  const dummy = [
    {
      id: 1,
      src: "/images/music1.png",
      name: "IPCGRDN",
      onClickName: () => router.push("/user/123"),
    },
    {
      id: 2,
      src: "/images/music1.png",
      name: "IPCGRDN",
      onClickName: () => router.push("/user/123"),
    },
    {
      id: 3,
      src: "/images/albumcover.png",
      name: "AESPA",
      onClickName: () => router.push("/user/123"),
    },
    {
      id: 4,
      src: "/images/music1.png",
      name: "RARO",
      onClickName: () => router.push("/user/123"),
    },
  ];

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-start">
        <p className="text-[#FF4D74] font-bold text-xl">RARO</p>
        <p className="font-bold text-xl">님을 위한 아티스트</p>
      </div>
      <div className="w-full overflow-x-auto flex gap-x-4">
        {dummy.map((item) => (
          <SquareContainer
            key={item.id}
            src={item.src}
            name={item.name}
            design="rounded-full"
            onClickName={item.onClickName}
          />
        ))}
      </div>
    </div>
  );
};

export default MainArtist;
