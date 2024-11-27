'use client'

import { useState } from "react";
import SquareContainer from "@/components/container/square-container";
import { IconChevronRight } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Artist {
  id: number;
  name: string;
  src: string;
  onClickName: () => void;
  followers?: string;
  description?: string;
}

export default function MoreArtistPage() {
  const router = useRouter();

  const artists: Artist[] = [
    {
      id: 1,
      name: "NewJeans",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/user/123"),
      followers: "1.5M",
      description: "Hello! My name is NewJeans, and I'm passionate about exploring new ideas and cultures. I enjoy reading, traveling, and meeting new people...",
    },
    {
      id: 2,
      name: "AESPA",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/user/123"),
      followers: "2.1M",
      description: "We are AESPA! Known for our unique blend of K-pop and virtual reality concepts...",
    },
    {
      id: 3,
      name: "MAROON 5",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/user/123"),
      followers: "3.2M",
      description: "MAROON 5 is an American pop rock band that was formed in 1994 in Los Angeles, California...",
    },
    {
      id: 4,
      name: "AVRIL LAVIGNE",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/user/123"),
      followers: "4.5M",
      description: "AVRIL LAVIGNE is a Canadian singer, songwriter, and actress. She rose to fame with her debut album 'Let Go'...",
    },
    {
      id: 5,
      name: "IU",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/user/123"),
      followers: "5.2M",
      description: "IU is a South Korean singer, songwriter, and actress. She gained popularity with her albums 'IU...' and 'Palette'...",
    },
    {
      id: 6,
      name: "DAY6",
      src: "/images/albumcover.png",
      onClickName: () => router.push("/user/123"),
      followers: "2.8M",
      description: "DAY6 is a South Korean boy band that debuted in 2015. They gained popularity with their album 'The Day'...",
    },
  ];

  const [selectedArtist, setSelectedArtist] = useState<Artist>(artists[0]);

  const handleArtistSelect = (artist: Artist) => {
    setSelectedArtist(artist);
  };

  return (
    <main className="flex flex-col bg-transparent h-full mb-20 md:mb-10 pl-4 md:pl-0 md:ml-48 mt-8 md:mt-24 pt-2 pr-4 md:pr-0 md:mr-28 overflow-y-auto hide-scrollbar">
      <div className="h-auto flex flex-col lg:flex-row gap-x-4 items-center justify-center">
        {/* 왼쪽 프로필 섹션 */}
        <div className="w-full lg:w-1/3 h-full bg-[#D7C5C526] dark:bg-gradient-to-t dark:from-[#00000033] dark:to-[#41414133] backdrop-blur-xl lg:p-8 rounded-lg">
          <div className="flex flex-col items-center mx-8 mt-2">
            <Image
              src={selectedArtist.src}
              alt={selectedArtist.name}
              width={200}
              height={200}
              className="rounded-full"
            />
            <h1 className="text-3xl font-bold mt-8 text-center truncate tracking-wide">{selectedArtist.name}</h1>
            <div className="flex justify-center items-center gap-4 mt-6 gap-x-4 w-full">
              <button className="bg-[#FFFFFF] text-black font-bold text-sm w-1/2 rounded-lg py-2 drop-shadow-lg hover:opacity-75">
                {selectedArtist.followers}
              </button>
              <button className="bg-[#FF8EBD] text-white font-bold text-sm dark:text-black rounded-lg w-1/2 py-2 drop-shadow-lg hover:opacity-75">
                팔로우
              </button>
            </div>
            <p className="mt-6 text-gray-700 dark:text-white">
              {selectedArtist.description}
              <button className="text-gray-500 dark:text-gray-400">more</button>
            </p>
            <div className="mt-8">
              <button 
                className="bg-white dark:bg-black dark:backdrop-blur-xl hover:opacity-75 text-black dark:text-white rounded-full p-2"
                onClick={selectedArtist.onClickName}
              >
                <IconChevronRight className="size-6" />
              </button>
            </div>
          </div>
        </div>

        {/* 오른쪽 아티스트 그리드 섹션 */}
        <div className="w-full lg:w-2/3 h-full bg-[#D7C5C526] dark:bg-gradient-to-t dark:from-[#00000033] dark:to-[#41414133] backdrop-blur-xl lg:p-8 rounded-lg overflow-y-auto hide-scrollbar">
          <div className="grid grid-cols-3 xl:grid-cols-4 gap-8">
            {artists.map((artist) => (
              <div 
                className="flex flex-col items-center cursor-pointer" 
                key={artist.id}
                onClick={() => handleArtistSelect(artist)}
              >
                <SquareContainer
                  src={artist.src}
                  name={artist.name}
                  design="rounded-full"
                  onClickName={artist.onClickName}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
