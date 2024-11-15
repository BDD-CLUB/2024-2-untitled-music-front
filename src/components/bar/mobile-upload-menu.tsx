"use client";

import useAlbumModal from "@/hooks/modal/use-album-modal";
import useTrackModal from "@/hooks/modal/use-track-modal";
import { IconDisc, IconMusic, IconPlaylist } from "@tabler/icons-react";
import usePlaylistModal from "@/hooks/modal/use-playlist-modal";
import useUploadMenu from "@/hooks/modal/use-upload-menu";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "../ui/dialog";

export function MobileUploadMenu() {
  const albumModal = useAlbumModal();
  const trackModal = useTrackModal();
  const playlistModal = usePlaylistModal();

  const mobileUploadMenu = useUploadMenu();

  const onChange = (open: boolean) => {
    if (!open) {
      mobileUploadMenu.onClose();
    }
  };

  const links = [
    {
      title: "트랙",
      icon: (
        <IconMusic className="h-full w-full text-black dark:text-white" />
      ),
      onClick: () => {
        trackModal.onOpen();
        mobileUploadMenu.onClose();
      },
    },
    {
      title: "앨범",
      icon: (
        <IconDisc className="h-full w-full text-black dark:text-white" />
      ),
      onClick: () => {
        albumModal.onOpen();
        mobileUploadMenu.onClose();
      },
    },
    {
      title: "플레이리스트",
      icon: (
        <IconPlaylist className="h-full w-full text-black dark:text-white" />
      ),
      onClick: () => {
        playlistModal.onOpen();
        mobileUploadMenu.onClose();
      },
    },
  ];

  return (
    <Dialog open={mobileUploadMenu.isOpen} onOpenChange={onChange}>
      <DialogTitle className="hidden">업로드</DialogTitle>
      <DialogDescription className="hidden">
       업로드할 항목을 선택하세요
      </DialogDescription>
      <DialogOverlay className="bg-black bg-opacity-50 backdrop-blur-sm fixed inset-0" />
      <DialogContent className="fixed md:hidden top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border-none bg-transparent shadow-none h-[25%] w-[75%] p-0">
        <div className="flex items-center justify-center gap-x-8">
          {links.map((link, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-y-4 cursor-pointer"
              onClick={link.onClick}
            >
              <div className="items-center justify-center w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 p-2">{link.icon}</div>
              <span className="text-white truncate overflow-hidden text-sm">{link.title}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
