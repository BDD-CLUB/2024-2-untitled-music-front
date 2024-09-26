"use client";

import { CirclePlus, DiscAlbum, ListMusic, Music } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

import useTrackModal from "@/hooks/modal/use-track-modal";
import useAlbumModal from "@/hooks/modal/use-album-modal";
import usePlaylistModal from "@/hooks/modal/use-playlist-modal";

export const UploadButton = () => {
  const trackModal = useTrackModal();
  const albumModal = useAlbumModal();
  const playlistModal = usePlaylistModal();

  const albumClick = () => {
    // 유저인지 체크

    return albumModal.onOpen();
  };

  const trackClick = () => {
    // 유저인지 체크

    return trackModal.onOpen();
  }

  const playlistClick = () => {
    // 유저인지 체크

    return playlistModal.onOpen();
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className="flex items-center justify-center group outline-none relative"
        asChild
      >
        <Button
          variant="transparent"
          className="p-2 group-hover:animate-spinOnce group-hover:bg-black"
        >
          <CirclePlus className="size-7 text-white group-hover:scale-110 transition-all" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="right" className="w-40 ml-2">
        <DropdownMenuItem className="h-10" onClick={trackClick}>
          <Music className="size-4 mr-2" />
          트랙
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10" onClick={albumClick}>
          <DiscAlbum className="size-4 mr-2" />
          앨범
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10" onClick={playlistClick}>
          <ListMusic className="size-4 mr-2" />
          플레이리스트
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
