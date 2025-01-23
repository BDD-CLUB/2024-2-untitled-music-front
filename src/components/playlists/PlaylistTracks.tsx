"use client";

import { cn } from "@/lib/utils";
import { Play, Music2, Loader2 } from "lucide-react";
import { formatDuration } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { checkAuth } from "@/lib/auth";

interface Track {
  uuid: string;
  trackGetResponseDto: {
    trackResponseDto: {
      uuid: string;
      title: string;
      duration: number;
      artUrl: string;
    };
    albumResponseDto: {
      uuid: string;
      title: string;
      artImage: string;
    };
    artistResponseDto: {
      uuid: string;
      name: string;
    };
  };
}

interface PlaylistTracksProps {
  playlistId: string;
  initialTracks: Track[];
}

export function PlaylistTracks({ playlistId, initialTracks }: PlaylistTracksProps) {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();

  const fetchMoreTracks = async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const { accessToken } = await checkAuth();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${playlistId}?itemPage=${nextPage}&itemPageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("트랙 목록을 불러오는데 실패했습니다.");

      const data = await response.json();
      const newTracks = data.playlistItemResponseDtos;

      if (newTracks.length === 0) {
        setHasMore(false);
        return;
      }

      setTracks(prev => [...prev, ...newTracks]);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to fetch more tracks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView) {
      fetchMoreTracks();
    }
  }, [inView]);

  const hasNoTracks = !tracks || tracks.length === 0;

  return (
    <div className="p-8 pt-4">
      {/* 트랙이 없는 경우 */}
      {hasNoTracks ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Music2 className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            아직 추가된 트랙이 없습니다
          </p>
        </div>
      ) : (
        /* 트랙 목록 */
        <div className="space-y-1">
          {tracks.map((item, index) => {
            const track = item.trackGetResponseDto.trackResponseDto;
            const album = item.trackGetResponseDto.albumResponseDto;
            const artist = item.trackGetResponseDto.artistResponseDto;

            return (
              <button
                key={item.uuid}
                className={cn(
                  "w-full p-3",
                  "flex items-center gap-4",
                  "rounded-xl",
                  "transition-all duration-300",
                  "hover:bg-white/5",
                  "group relative"
                )}
              >
                {/* 호버 효과 배경 */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />
                </div>

                {/* 트랙 정보 */}
                <div className="relative flex items-center gap-4 w-full">
                  <div className="w-8 text-sm text-muted-foreground group-hover:opacity-0 transition-opacity">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <Play className="w-4 h-4 absolute left-2 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={album.artImage}
                      alt={album.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col items-start min-w-0">
                    <span className="font-medium truncate w-full">
                      {track.title}
                    </span>
                    <Link
                      href={`/profile/${artist.uuid}`}
                      className="text-sm text-muted-foreground hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {artist.name}
                    </Link>
                  </div>

                  <Link
                    href={`/albums/${album.uuid}`}
                    className="text-sm text-muted-foreground hover:underline mr-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {album.title}
                  </Link>

                  <div className="text-sm text-muted-foreground">
                    {formatDuration(track.duration)}
                  </div>
                </div>
              </button>
            );
          })}

          {hasMore && (
            <div ref={ref} className="py-4 flex justify-center">
              {isLoading && (
                <div className="text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 