"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ListMusic } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

interface Playlist {
  playlistBasicResponseDto: {
    uuid: string;
    title: string;
    description: string;
    coverImageUrl: string;
  };
  artistResponseDto: {
    uuid: string;
    name: string;
    artistImage: string;
  };
}

export function PlaylistSection() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { toast } = useToast();

  const fetchPlaylists = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists?page=0&pageSize=6`,
        {
          credentials: "include",
        }
      );

      if (!response.ok)
        throw new Error("플레이리스트 목록을 불러오는데 실패했습니다.");

      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
      toast({
        variant: "destructive",
        title: "플레이리스트 목록을 불러오는데 실패했습니다.",
        description:
          error instanceof Error
            ? error.message
            : "플레이리스트 목록을 불러오는데 실패했습니다.",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  return (
    <section className="p-6">
      <h2 className="text-xl font-bold mb-4">인기 플레이리스트</h2>
      <div className="grid grid-cols-2 gap-2">
        {playlists.map((playlist) => (
          <Link
            key={playlist.playlistBasicResponseDto.uuid}
            href={`/playlists/${playlist.playlistBasicResponseDto.uuid}`}
            className={cn(
              "group relative",
              "rounded-xl overflow-hidden",
              "transition-all duration-300",
              "hover:scale-[1.02] hover:shadow-xl"
            )}
          >
            {/* 플레이리스트 커버 */}
            <div className="relative aspect-square">
              {playlist.playlistBasicResponseDto.coverImageUrl ? (
                <Image
                  src={playlist.playlistBasicResponseDto.coverImageUrl}
                  alt={playlist.playlistBasicResponseDto.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                  <ListMusic className="w-1/3 h-1/3 text-white/20" />
                </div>
              )}
              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* 플레이리스트 정보 */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="font-medium text-white text-xs mb-2 truncate">
                {playlist.playlistBasicResponseDto.title}
              </h3>
              <div className="flex items-center gap-2">
                <Avatar className="w-5 h-5 border border-white/10">
                  <AvatarImage src={playlist.artistResponseDto.artistImage} />
                  <AvatarFallback>
                    <User className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs text-white/70 truncate">
                  {playlist.artistResponseDto.name}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
