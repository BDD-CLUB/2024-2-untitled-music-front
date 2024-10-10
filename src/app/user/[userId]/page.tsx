"use client";

import { useState } from "react";

import {
  IconLink,
  IconDisc,
  IconMusic,
  IconPlaylist,
} from "@tabler/icons-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import UserTrack from "@/features/user/user-track";
import UserAlbum from "@/features/user/user-album";
import UserPlaylist from "@/features/user/user-playlist";

export default function UserPage() {
  const [activeTab, setActiveTab] = useState("track");

  const tabs = [
    { id: "track", label: "트랙", icon: IconMusic, onClick: () => {} },
    { id: "album", label: "앨범", icon: IconDisc, onClick: () => {} },
    {
      id: "playlist",
      label: "플레이리스트",
      icon: IconPlaylist,
      onClick: () => {},
    },
  ];

  return (
    <main className="bg-transparent h-full mb-20 pl-4 mt-16 pt-2 pr-4 md:pl-0 md:mb-0 md:ml-48 md:mr-28 overflow-y-auto flex flex-col">
      <div className="h-auto flex flex-col lg:flex-row gap-y-4 gap-x-8 items-start">
        <div className="flex h-full w-full lg:w-2/3 gap-x-8 items-center">
          <div className="flex flex-col">
            <Avatar className="w-48 h-48">
              <AvatarImage src="/images/music1.png" alt="profile" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col items-start justify-between gap-y-4 py-6">
            <div className="text-3xl font-bold">YANG RARO</div>
            <div className="flex gap-x-4">
              <div className="bg-white text-black hover:bg-black/10 drop-shadow-lg w-auto font-medium text-sm p-2 rounded-lg">
                1.5M followers
              </div>
              <div className="bg-[#FF3F8F] text-black hover:bg-opacity-75 hover:text-black/75 drop-shadow-lg w-auto font-medium text-sm py-2 px-8 rounded-lg">
                팔로우
              </div>
            </div>
            <div className="flex mt-8 gap-x-2">
              <IconLink className="size-6" />
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-500"
              >
                www.instagram.com
              </a>
            </div>
          </div>
        </div>
        <div className="flex h-full w-full lg:w-1/3 font-medium text-sm items-center">
          Hello! My name is Raro, and I'm passionate about exploring new ideas
          and cultures. I enjoy reading, traveling, and meeting new people.
          Currently, I'm pursuing my interests in technology and innovation,
          aiming to make a positive impact in the world. I believe in lifelong
          learning and always seek to grow personally and professionally
        </div>
      </div>

      <div className="h-auto flex flex-col pt-8 gap-y-2">
        <div className="w-full h-0.5 bg-gradient-to-r from-[#FD5D9A]/30 to-[#FE8791]/30 rounded-full">
          <div
            className="h-full bg-[#FF7672] transition-all duration-300 ease-in-out"
            style={{
              width: `${100 / tabs.length}%`,
              transform: `translateX(${
                tabs.findIndex((tab) => tab.id === activeTab) * 100
              }%)`,
            }}
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex justify-center items-center gap-x-10 bg-transparent">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  activeTab === tab.id
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={tab.onClick}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="h-full flex flex-col pt-2">
        {activeTab === "track" ? (
          <UserTrack />
        ) : activeTab === "album" ? (
          <UserAlbum />
        ) : (
          <UserPlaylist />
        )}
      </div>
    </main>
  );
}
