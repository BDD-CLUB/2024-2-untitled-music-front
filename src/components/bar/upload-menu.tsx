"use client";

import useAlbumModal from "@/hooks/modal/use-album-modal";
import useTrackModal from "@/hooks/modal/use-track-modal";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconDisc, IconMusic, IconPlaylist } from "@tabler/icons-react";
import usePlaylistModal from "@/hooks/modal/use-playlist-modal";

export function UploadMenu() {
  const albumModal = useAlbumModal();
  const trackModal = useTrackModal();
  const playlistModal = usePlaylistModal();

  const links = [
    {
      title: "트랙",
      icon: (
        <IconMusic className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {trackModal.onOpen()},
    },
    {
      title: "앨범",
      icon: (
        <IconDisc className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {albumModal.onOpen()},
    },
    {
      title: "플레이리스트",
      icon: (
        <IconPlaylist className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => {playlistModal.onOpen()},
    },
  ];
  return (
    <div className="flex items-center justify-center h-full w-full">
      <FloatingDock
        items={links}
        desktopClassName="ml-4"
        mobileClassName="mb-4"
      />
    </div>
  );
};