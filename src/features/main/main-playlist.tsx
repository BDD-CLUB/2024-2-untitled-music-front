"use client";

import SquareContainer from "@/components/container/square-container";
import { useUser } from "@/provider/userProvider";
import { useRouter } from "next/navigation";

const MainPlaylist = () => {
  const router = useRouter();
  const { user } = useUser();

  const dummy = [
    {
      id: 1,
      src: "/images/music1.png",
      name: "THIRSTY",
      description: "RARO",
      onClickName: () => router.push("/playlist/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 2,
      src: "/images/music1.png",
      name: "THIRSTY",
      description: "RARO",
      onClickName: () => router.push("/playlist/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 3,
      src: "/images/music1.png",
      name: "THIRSTY",
      description: "RARO",
      onClickName: () => router.push("/playlist/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 4,
      src: "/images/music1.png",
      name: "THIRSTY",
      description: "RARO",
      onClickName: () => router.push("/playlist/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 5,
      src: "/images/music1.png",
      name: "THIRSTY",
      description: "RARO",
      onClickName: () => router.push("/playlist/123"),
      onClickDescription: () => router.push("/user/123"),
    },
    {
      id: 6,
      src: "/images/music1.png",
      name: "THIRSTY",
      description: "RARO",
      onClickName: () => router.push("/playlist/123"),
      onClickDescription: () => router.push("/user/123"),
    },
  ];

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex justify-start">
        <p className="text-[#FF4D74] font-bold text-xl">
          {user?.name || "U"}
        </p>
        <p className="font-bold text-xl">님을 위한 플레이리스트</p>
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

export default MainPlaylist;
