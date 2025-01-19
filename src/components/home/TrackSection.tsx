"use client";

import { cn } from "@/lib/utils";
import { Music, Loader2 } from "lucide-react";
import { formatDuration } from "@/lib/format";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Track {
  trackResponseDto: {
    uuid: string;
    title: string;
    duration: number;
    artUrl: string;
    lyric: string;
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

export function TrackSection() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tracks?page=0&pageSize=10`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setTracks(data);

      console.log(data.trackResponseDto.artUrl);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "트랙 목록을 불러오는데 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  if (error) {
    return (
      <section className="p-6 border-t border-white/10">
        <h2 className="text-xl font-bold mb-4">최신 업로드</h2>
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="p-6 border-t border-white/10">
      <h2 className="text-xl font-bold mb-4">최신 업로드</h2>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : tracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Music className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            아직 등록된 트랙이 없습니다
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {tracks.map((track) => (
            <button
              key={track.trackResponseDto.uuid}
              className={cn(
                "w-full px-4 py-3",
                "flex items-center gap-4",
                "rounded-xl",
                "transition-all duration-300",
                "hover:bg-white/5",
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
                      href={`/profile/${track.artistResponseDto.uuid}`}
                      className="hover:underline truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {track.artistResponseDto.name}
                    </Link>
                    <span>•</span>
                    <Link
                      href={`/albums/${track.albumResponseDto.uuid}`}
                      className="hover:underline truncate"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {track.albumResponseDto.title}
                    </Link>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDuration(track.trackResponseDto.duration)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
