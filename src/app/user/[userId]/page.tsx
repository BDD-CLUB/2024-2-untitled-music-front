"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useMediaQuery } from "react-responsive";

import {
  IconLink,
  IconDisc,
  IconMusic,
  IconPlaylist,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import UserTrack from "@/features/user/user-track";
import UserAlbum from "@/features/user/user-album";
import UserPlaylist from "@/features/user/user-playlist";
import useStreamingBar from "@/hooks/modal/use-streaming-bar";

import { cn } from "@/lib/utils";
import { Profile, getProfile, isProfile } from "@/services/profileService";
import useProfileModal from "@/hooks/modal/use-profile-modal";
import { useUser } from "@/provider/userProvider";

export default function UserPage() {
  const streamingBar = useStreamingBar();
  const profileModal = useProfileModal();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const { user } = useUser();

  const [activeTab, setActiveTab] = useState("track");
  const [array, setArray] = useState("new");
  const [profile, setProfile] = useState(false);
  const [profileData, setProfileData] = useState<Profile>();

  const checkProfile = async () => {
    const isProfileData = await isProfile();
    setProfile(isProfileData);
  };

  useEffect(() => {
    checkProfile();
  }, [profile]);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const data = await getProfile();
        setProfileData(data);
      } catch (error) {
        console.error("프로필 로딩 실패:", error);
      }
    };

    getProfileData();
  }, [profile])

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
    <>
      {profile ? (
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
                  <AvatarImage src={profileData?.profileImage} alt={profileData?.name} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col items-start justify-between gap-y-4 md:py-6">
                <div className="md:text-3xl font-bold text-2xl pl-2">
                  {profileData?.name || "U"}
                </div>
                <div className="flex gap-x-4">
                  <button className="bg-white text-black hover:bg-black/10 dark:hover:bg-white/75 shadow-lg w-auto font-medium text-sm p-2 rounded-lg">
                    1.5M
                  </button>
                  <button className="bg-[#FF3F8F] text-black hover:bg-opacity-75 hover:text-black/75 shadow-lg w-auto font-medium text-sm py-2 px-8 rounded-lg">
                    팔로우
                  </button>
                </div>
                <div className="flex md:mt-8 gap-x-2">
                  <IconLink className="size-6" />
                  <a
                    href={profileData?.link1}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-500"
                  >
                    {profileData?.link1}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex w-full h-28 md:h-full font-light text-sm items-start md:items-center whitespace-pre-line leading-normal overflow-auto">
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
                  <DropdownMenuRadioGroup
                    value={array}
                    onValueChange={setArray}
                  >
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
      ) : (
        <main
          className={cn(
            "flex flex-col bg-transparent h-full mb-20 md:mb-10 pl-4 md:pl-0 md:ml-48 mt-8 md:mt-24 pt-2 pr-4 md:pr-0 md:mr-28 overflow-y-auto hide-scrollbar",
            isMobile && streamingBar.isOpen && "mb-36"
          )}
        >
          <div className="h-full flex flex-col gap-y-8 items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-y-4">
              <Avatar className="md:w-48 md:h-48 min-w-32 max-w-48 min-h-32 max-h-48">
                <AvatarImage src={user?.artistImage} alt={user?.name} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="text-3xl font-bold">{user?.name || "U"}</div>
              <div className="text-sm font-light text-center">
                프로필이 아직 생성되지 않았습니다. <br />
                프로필을 생성해주세요.
              </div>
            </div>
            <button
              className="p-[2px] relative rounded-xl bg-gradient-to-br from-[#FF00B1] to-[#875BFF]"
              onClick={profileModal.onOpen}
            >
              <div className="px-6 py-2 bg-[#f8e6f3] backdrop-blur-lg dark:bg-black rounded-xl relative transition duration-200 text-black dark:text-white hover:bg-opacity-75 text-sm">
                프로필 생성
              </div>
            </button>
          </div>
        </main>
      )}
    </>
  );
}
