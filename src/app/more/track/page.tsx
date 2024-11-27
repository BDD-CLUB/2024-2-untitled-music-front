"use client";

import SquareContainer from "@/components/container/square-container";
import { useRouter } from "next/navigation";

interface Track {
  id: number;
  name: string;
  description?: string;
  src: string;
  onClickName?: () => void;
  onClickDescription: () => void;
}

export default function MoreTrackPage() {
  const router = useRouter();

  const tracks: Track[] = [
    {
      id: 1,
      name: "Blinding Lights",
      description: "After Hours · The Weeknd",
      src: "/images/albumcover.png",
      onClickDescription: () => router.push("/album/123"),
    },
    {
      id: 2,
      name: "Levitating",
      description: "Future Nostalgia · Dua Lipa",
      src: "/images/albumcover.png",
      onClickDescription: () => router.push("/album/123"),
    },
    {
      id: 3,
      name: "Watermelon Sugar",
      description: "Fine Line · Harry Styles",
      src: "/images/albumcover.png",
      onClickDescription: () => router.push("/album/123"),
    },
    {
      id: 4,
      name: "Peaches",
      description: "Justice · Justin Bieber",
      src: "/images/albumcover.png",
      onClickDescription: () => router.push("/album/123"),
    },
    {
      id: 5,
      name: "Save Your Tears",
      description: "After Hours · The Weeknd",
      src: "/images/albumcover.png",
      onClickDescription: () => router.push("/album/123"),
    },
    {
      id: 6,
      name: "Good 4 U",
      description: "SOUR · Olivia Rodrigo",
      src: "/images/albumcover.png",
      onClickDescription: () => router.push("/album/123"),
    },
  ];
  
  return (
    <main className="flex flex-col bg-transparent h-full mb-20 md:mb-10 pl-4 md:pl-0 md:ml-48 mt-8 md:mt-24 pt-2 pr-4 md:pr-0 md:mr-28 overflow-y-auto hide-scrollbar">
      <div className="h-auto flex flex-col gap-y-4 lg:flex-row gap-x-4 items-center justify-center">
        <div className="w-full h-full bg-[#D7C5C526] dark:bg-gradient-to-t dark:from-[#00000033] dark:to-[#41414133] backdrop-blur-xl lg:p-8 rounded-lg overflow-y-auto hide-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-8">
            {tracks.map((track) => (
              <div
                className="flex flex-col items-center cursor-pointer"
                key={track.id}
              >
                <SquareContainer
                  src={track.src}
                  name={track.name}
                  description={track.description}
                  design="rounded-lg"
                  onClickDescription={track.onClickDescription}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
