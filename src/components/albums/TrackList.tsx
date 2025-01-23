"use client";

import { cn } from "@/lib/utils";
import { Play, Music, Loader2 } from "lucide-react";
import { formatDuration } from "@/lib/format";
import { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { TrackActions } from "@/components/albums/TrackActions";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useUser } from "@/contexts/auth/UserContext";

interface Track {
  uuid: string;
  title: string;
  duration: number;
  lyric: string;
}

interface TrackListProps {
  tracks: Track[];
  albumId: string;
  artistId: string;
  album: {
    title: string;
    artImage: string;
  };
  artist: {
    name: string;
    artistImage: string;
  };
}

export function TrackList({
  tracks: initialTracks,
  albumId,
  artistId,
}: TrackListProps) {
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();

  const isOwner = isAuthenticated && user?.uuid === artistId;

  const fetchMoreTracks = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const nextPage = page + 1;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/albums/${albumId}?trackPage=${nextPage}&trackPageSize=10`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("트랙 목록을 불러오는데 실패했습니다.");

      const data = await response.json();
      const newTracks = data.trackResponseDtos;

      if (newTracks.length === 0) {
        setHasMore(false);
        return;
      }

      setTracks((prev) => [...prev, ...newTracks]);
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to fetch more tracks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [albumId, hasMore, isLoading, page]);

  useEffect(() => {
    if (inView) {
      fetchMoreTracks();
    }
  }, [inView, fetchMoreTracks]);

  const hasNoTracks = !tracks || tracks.length === 0;

  return (
    <div className="p-8 pt-4">
      {hasNoTracks ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Music className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            아직 등록된 트랙이 없습니다
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {tracks.map((track, index) => (
            <div
              key={track.uuid}
              className={cn(
                "w-full px-4 py-3",
                "flex items-center gap-4",
                "rounded-xl",
                "transition-all duration-300",
                "hover:bg-white/5",
                "group relative"
              )}
            >
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />
              </div>

              <div className="relative flex items-center gap-4 w-full">
                <button className="w-8 flex items-center justify-center">
                  <div className="text-sm text-muted-foreground group-hover:opacity-0 transition-opacity">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <Play className="w-4 h-4 absolute opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </button>

                <div className="flex-1 text-left">{track.title}</div>
                <div className="text-sm text-muted-foreground mr-4">
                  {formatDuration(track.duration)}
                </div>

                <TrackActions
                  place="album"
                  track={track}
                  isOwner={isOwner}
                  onUpdate={(updatedTrack) => {
                    setTracks((prev) =>
                      prev.map((t) =>
                        t.uuid === updatedTrack.uuid
                          ? {
                              ...t,
                              title: updatedTrack.title,
                              lyric: updatedTrack.lyric,
                            }
                          : t
                      )
                    );
                  }}
                  onDelete={(deletedTrackId) => {
                    setTracks((prev) =>
                      prev.filter((t) => t.uuid !== deletedTrackId)
                    );
                  }}
                />
              </div>
            </div>
          ))}

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
