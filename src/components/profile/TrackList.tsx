"use client";

import { cn } from "@/lib/utils";
import { Music, Loader2 } from "lucide-react";
import { formatDuration } from "@/lib/format";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrackActions } from "@/components/albums/TrackActions";
import { useAudio } from "@/contexts/audio/AudioContext";
import { useUser } from "@/contexts/auth/UserContext";
import { useInView } from "react-intersection-observer";
import { useToast } from "@/hooks/use-toast";

interface Track {
  trackResponseDto: {
    uuid: string;
    title: string;
    duration: number;
    artUrl: string;
    lyric: string;
    trackUrl: string;
  };
  albumResponseDto: {
    uuid: string;
    title: string;
    artImage: string;
  };
  artistResponseDto: {
    uuid: string;
    name: string;
    artistImage: string;
  };
}

interface TrackListProps {
  artistId: string;
}

export function TrackList({ artistId }: TrackListProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView();
  const { play } = useAudio();

  const { user } = useUser();
  const isOwner = user?.uuid === artistId;

  const fetchTracks = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/artists/${artistId}/tracks?page=${page}&pageSize=10&sortBy=createdAt&direction=desc`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      setTracks(prev => [...prev, ...data]);
      setPage(prev => prev + 1);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "트랙 목록을 불러오는데 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  }, [artistId, page, hasMore]);

  // 초기 데이터 로드
  useEffect(() => {
    setTracks([]);
    setPage(0);
    setHasMore(true);
    fetchTracks();
  }, [fetchTracks]);

  // 스크롤 감지하여 추가 데이터 로드
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchTracks();
    }
  }, [inView, hasMore, isLoading, fetchTracks]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Music className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center">
          아직 등록된 트랙이 없습니다
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tracks.map((track) => (
        <button
          key={track.trackResponseDto.uuid}
          onClick={() => play(track.trackResponseDto.uuid)}
          className={cn(
            "w-full px-4 py-3",
            "flex items-center gap-4",
            "rounded-xl",
            "transition-all duration-300",
            "hover:bg-black/5 dark:hover:bg-white/5 hover:opacity-75",
            "group relative",
            "text-left"
          )}
        >
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />
          </div>

          <div className="relative flex items-center gap-4 w-full">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden">
              <Image
                src={track.trackResponseDto.artUrl}
                alt={track.trackResponseDto.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {track.trackResponseDto.title}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link
                  href={`/albums/${track.albumResponseDto.uuid}`}
                  className="hover:underline truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {track.albumResponseDto.title}
                </Link>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mr-4">
              {formatDuration(track.trackResponseDto.duration)}
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <TrackActions
                place="profile"
                isOwner={isOwner}
                track={{
                  uuid: track.trackResponseDto.uuid,
                  title: track.trackResponseDto.title,
                  lyric: track.trackResponseDto.lyric,
                }}
              />
            </div>
          </div>
        </button>
      ))}

      {/* 무한 스크롤 감지 요소 */}
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
  );
}
