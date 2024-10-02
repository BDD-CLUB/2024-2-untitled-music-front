"use client";

import { useEffect, useState } from "react";

import AlbumModal from "./album-modal";
import TrackModal from "./track-modal";
import PlaylistModal from "./playlist-modal";

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
    </>
  );
};

export default ModalProvider;
