'use client'

import SquareContainer from "@/components/container/square-container";
import { useRouter } from "next/navigation";

const MainArtist = () => {
    const router = useRouter();

    const dummy = [
        {
            src: "/images/music1.png",
            name: "IPCGRDN",
            onClickName: () => router.push("/user/123"),
        },
        {
            src: "/images/music1.png",
            name: "IPCGRDN",
            onClickName: () => router.push("/user/123"),
        },
        {
            src: "/images/music1.png",
            name: "IPCGRDN",
            onClickName: () => router.push("/user/123"),
        },
        {
            src: "/images/music2.jpg",
            name: "RARO",
            onClickName: () => router.push("/user/123"),
        },
        {
            src: "/images/music3.jpg",
            name: "PALM",
            onClickName: () => router.push("/user/123"),
        },
        {
            src: "/images/music4.jpg",
            name: "BDD",
            onClickName: () => router.push("/user/123"),
        },
    ]

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex justify-start">
                <p className="text-[#FF4D74] font-bold text-xl">
                    RARO
                </p>
                <p className="font-bold text-xl">
                    님을 위한 아티스트
                </p>
            </div>
            <div className="w-full overflow-x-auto flex gap-x-4">
                {dummy.map((item) => (
                    <SquareContainer
                        key={item.name}
                        src={item.src}
                        name={item.name}
                        description="아티스트"
                        design="rounded-full"
                        onClickName={item.onClickName}
                    />
                ))}
            </div>
        </div>
    )
};

export default MainArtist;