"use client";

import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { AlbumActions } from "./AlbumActions";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useUser } from "@/contexts/auth/UserContext";
import { useState } from "react";
import { EditAlbumModal } from "./EditAlbumModal";

interface AlbumInfoProps {
  album: {
    uuid: string;
    title: string;
    description: string;
    artImage: string;
    releaseDate: string;
  };
  artist: {
    uuid: string;
    name: string;
    artistImage: string;
  };
}

export function AlbumInfo({ album, artist }: AlbumInfoProps) {
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  const [showEditModal, setShowEditModal] = useState(false);
  const isOwner = isAuthenticated && user?.uuid === artist.uuid;

  return (
    <div className="relative">
      {/* 앨범 커버 배경 (블러 처리) */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <Image
          src={album.artImage}
          alt={album.title}
          fill
          className="object-cover opacity-75 blur-md scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white/75 dark:via-black/50 dark:to-black/75" />
      </div>

      {/* 앨범 정보 */}
      <div className="relative px-8 py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-end">
          {/* 앨범 커버 */}
          <div className="shrink-0">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-[2rem] bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm" />
              <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl transition-transform group-hover:scale-[1.02] duration-500">
                <Image
                  src={album.artImage}
                  alt={album.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* 앨범 상세 정보 */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                {album.title}
              </h1>
              {isOwner && (
                <AlbumActions
                  albumId={album.uuid}
                  onEdit={() => setShowEditModal(true)}
                />
              )}
            </div>
            <div className="flex items-center mb-6">
              <Link 
                href={`/profile/${artist.uuid}`}
                className="flex items-center gap-2 hover:bg-white/5 px-3 py-2 rounded-full transition-colors"
              >
                <Avatar className="w-8 h-8 border-2 border-white/10">
                  <AvatarImage src={artist.artistImage} />
                  <AvatarFallback>
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{artist.name}</span>
              </Link>
            </div>
            <p className="text-base text-muted-foreground max-w-2xl text-center md:text-left truncate">
              {album.description}
            </p>
          </div>
        </div>
      </div>

      <EditAlbumModal
        album={album}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
} 