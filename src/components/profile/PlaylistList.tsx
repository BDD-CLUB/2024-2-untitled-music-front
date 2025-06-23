"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ListMusic } from "lucide-react";
import Image from "next/image";

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

interface PlaylistListProps {
  artistId: string;
}

export function PlaylistList({ artistId }: PlaylistListProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { toast } = useToast();

  const fetchPlaylists = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/artists/${artistId}/playlists`,
        {
          credentials: 'include',
        }
      );
      
      if (!response.ok) throw new Error('플레이리스트 목록을 불러오는데 실패했습니다.');
      
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
      toast({
        variant: "destructive",
        title: "플레이리스트 목록을 불러오는데 실패했습니다.",
        description: error instanceof Error ? error.message : "플레이리스트 목록을 불러오는데 실패했습니다.",
      });
    }
  }, [artistId, toast]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  if (playlists.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <ListMusic className="w-12 h-12 mb-4" />
        <p>등록된 플레이리스트가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
            <h3 className="font-medium text-white text-sm mb-1 truncate">
              {playlist.playlistBasicResponseDto.title}
            </h3>
            <p className="text-xs text-white/70 truncate">
              {playlist.artistResponseDto.name}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
} 
