"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ListMusic } from "lucide-react";
import Link from "next/link";
import { PlaylistActions } from "./PlaylistActions";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useUser } from "@/contexts/auth/UserContext";
import Image from "next/image";

interface PlaylistInfoProps {
  playlist: {
    uuid: string;
    title: string;
    description: string;
    coverImageUrl: string;
  };
  artist: {
    uuid: string;
    name: string;
    artistImage: string;
  };
}

export function PlaylistInfo({ playlist, artist }: PlaylistInfoProps) {
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  
  const isOwner = isAuthenticated && user?.uuid === artist.uuid;

  return (
    <div className="relative">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />

      {/* 플레이리스트 정보 */}
      <div className="relative px-8 py-16">
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
          {/* 플레이리스트 아이콘 */}
          <div className="shrink-0">
            <div className="relative group">
              <div className="absolute -inset-4 rounded-[2rem] bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm" />
              <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl transition-transform group-hover:scale-[1.02] duration-500 bg-white/5 flex items-center justify-center">
                {playlist.coverImageUrl ? (
                  <Image 
                    src={playlist.coverImageUrl} 
                    alt={playlist.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                ) : (
                  <ListMusic className="w-32 h-32 text-white/20" />
                )}
              </div>
            </div>
          </div>

          {/* 플레이리스트 상세 정보 */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-bold">
                {playlist.title}
              </h1>
              {isOwner && (
                <PlaylistActions playlistId={playlist.uuid} />
              )}
            </div>
            
            <Link 
              href={`/profile/${artist.uuid}`}
              className="flex items-center gap-2 hover:bg-white/5 px-3 py-2 rounded-full transition-colors mb-6"
            >
              <Avatar className="w-8 h-8 border-2 border-white/10">
                <AvatarImage src={artist.artistImage} />
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{artist.name}</span>
            </Link>

            <p className="text-base text-muted-foreground max-w-2xl text-center md:text-left">
              {playlist.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 