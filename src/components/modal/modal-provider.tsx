"use client";

import { useEffect, useState } from "react";

import AlbumModal from "./album-modal";
import TrackModal from "./track-modal";
import PlaylistModal from "./playlist-modal";

import { NotiModal } from "../bar/noti-modal";
import { SearchInput } from "../bar/search-input";

import { SigninModal } from "./signin-modal";

import { MobileUploadMenu } from "../bar/mobile-upload-menu";
import { MobileSettingMenu } from "../bar/mobile-setting-menu";
import ProfileModal from "./profile-modal";
import ProfileEditModal from "./profileEdit-modal";
import InformationModal from "./album/information-modal";
import AlbumEditModal from "./album/albumEdit-modal";

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

      <InformationModal />
      <AlbumEditModal />
      
      <SigninModal />

      <ProfileModal />
      <ProfileEditModal />

      <MobileUploadMenu />
      <MobileSettingMenu />
    </>
  );
};

export default ModalProvider;
