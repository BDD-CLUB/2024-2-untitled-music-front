"use client";

import { useEffect, useState } from "react";

import AlbumModal from "./album-modal";
import TrackModal from "./track-modal";
import PlaylistModal from "./playlist-modal";

import { NotiModal } from "../bar/noti-modal";
import { SearchInput } from "../bar/search-input";
import { SigninModal } from "./signin-modal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AlbumModal />
      <TrackModal />
      <PlaylistModal />

      <SearchInput />
      <NotiModal />
      
      <SigninModal />
    </>
  );
};

export default ModalProvider;
