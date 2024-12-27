"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import {
  IconLink,
  IconDisc,
  IconMusic,
  IconPlaylist,
  IconDotsVertical,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import UserTrack from "@/features/user/user-track";
import UserAlbum from "@/features/user/user-album";
import UserPlaylist from "@/features/user/user-playlist";
import useStreamingBar from "@/hooks/modal/use-streaming-bar";

import { cn } from "@/lib/utils";
import { Profile, getProfile, getProfileById } from "@/services/profileService";
import useProfileEditModal from "@/hooks/modal/use-profileEdit-modal";
import useConfirmModal from "@/hooks/modal/use-confirm-modal";
import { usePathname } from "next/navigation";
import { useProfile } from "@/provider/profileProvider";

export default function UserPage() {
  const streamingBar = useStreamingBar();
  const confirmModal = useConfirmModal();
  const profileEditModal = useProfileEditModal();

  const [activeTab, setActiveTab] = useState("track");
  const [array, setArray] = useState("new");
  const [profileData, setProfileData] = useState<Profile | null>(null);

  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { uuid: profileUuid } = useProfile();
  const pathname = usePathname();
  const uuid = String(pathname.split("/").pop());

  useEffect(() => {
    const fetchProfile = async () => {
      if (profileUuid === uuid) {
        try {
          const myData = await getProfile();
          setProfileData(myData);
        } catch (error) {
          console.error("나의 프로필 로딩 실패:", error);
        }
      } else {
        try {
          const data = await getProfileById(uuid);
          setProfileData(data);
        } catch (error) {
          console.error("개별 프로필 로딩 실패:", error, uuid);
        }
      }
    };

    fetchProfile();
  }, [profileUuid]);

  const handleConfirm = (uuid: string, data: string) => {
    confirmModal.onOpen(uuid, data);
  };

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
    <main
      className={cn(
        "flex flex-col bg-transparent h-full mb-20 md:mb-10 pl-4 md:pl-0 md:ml-48 mt-8 md:mt-24 pt-2 pr-4 md:pr-0 md:mr-28 overflow-y-auto hide-scrollbar",
        isMobile && streamingBar.isOpen && "mb-36"
      )}
    >
      <div className="h-auto flex flex-col lg:flex-row gap-y-2 gap-x-8 items-start px-4 md:px-0">
        <div className="flex h-full w-full gap-x-8 items-center justify-start">
          <div className="flex">
            <Avatar className="md:w-48 md:h-48 min-w-32 max-w-48 min-h-32 max-h-48">
              <AvatarImage
                src={profileData?.profileImage}
                alt={profileData?.name}
              />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col items-start justify-between gap-y-4 md:py-6">
            <div className="flex items-center justify-between w-full">
              <div className="md:text-3xl font-bold text-2xl">
                {profileData?.name || "U"}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <IconDotsVertical className="size-6 hover:opacity-75" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-20 items-center justify-start flex flex-col">
                  <DropdownMenuItem
                    className={profileUuid !== uuid ? "hidden" : ""}
                    onClick={profileEditModal.onOpen}
                  >
                    프로필 편집
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={cn(
                      "text-red-500 focus:text-red-600 dark:focus:focus:text-red-600",
                      profileUuid !== uuid && "hidden"
                    )}
                    onClick={() =>
                      handleConfirm(profileData?.uuid || "", "profile")
                    }
                  >
                    프로필 삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex gap-x-4">
              <button className="bg-white text-black hover:bg-black/10 dark:hover:bg-white/75 shadow-lg w-auto font-medium text-sm p-2 rounded-lg">
                1.5M
              </button>
              <button
                className={cn(
                  "bg-[#FF3F8F] text-white hover:bg-opacity-75 hover:text-white/75 shadow-lg w-auto font-medium text-sm py-2 px-8 rounded-lg truncate bg-opacity-90",
                  profileUuid === uuid && "hidden"
                )}
              >
                팔로우
              </button>
            </div>
            {profileData?.link1 && (
              <div className="flex md:mt-8 gap-x-2">
                <IconLink className="size-4" />
                <a
                  href={profileData?.link1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-500 text-sm"
                >
                  {profileData?.link1}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full h-28 md:h-full text-sm items-start md:items-center whitespace-pre-line leading-normal overflow-auto">
          {profileData?.description}
        </div>
      </div>

      <div className="h-auto flex flex-col pt-8 gap-y-2">
        <div className="w-full h-0.5 bg-gradient-to-r from-[#FD5D9A]/30 to-[#FE8791]/30 rounded-full" />
        <div className="w-full flex items-center justify-between">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full flex-1 flex justify-center items-center"
          >
            <TabsList className="w-full ml-12 flex justify-center items-center gap-x-10 bg-transparent">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-none ${
                    activeTab === tab.id
                      ? "text-gray-900 border-t-2 border-[#FF7672] py-[15px]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="hidden md:flex">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-transparent flex justify-center items-center rounded-full border border-[#FD6997] dark:border-none dark:bg-white/5 px-3 mr-2">
                <ChevronDown className="text-[#FF4F93] size-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
              <DropdownMenuRadioGroup value={array} onValueChange={setArray}>
                <DropdownMenuRadioItem value="new">
                  최신순
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="like">
                  좋아요순
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="h-full w-full flex flex-col pt-2">
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
