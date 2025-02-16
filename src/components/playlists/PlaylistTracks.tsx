"use client";

import { cn } from "@/lib/utils";
import { Play, Music2, Loader2 } from "lucide-react";
import { formatDuration } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { TrackActions } from "@/components/albums/TrackActions";
import { useUser } from "@/contexts/auth/UserContext";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useAudio } from "@/contexts/audio/AudioContext";

interface Track {
  uuid: string;
  trackGetResponseDto: {
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
    };
  };
}

interface PlaylistTracksProps {
  playlistId: string;
  initialTracks: Track[];
  artistId: string;
}

export function PlaylistTracks({
  playlistId,
  initialTracks,
  artistId,
}: PlaylistTracksProps) {
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  const isOwner = isAuthenticated && user?.uuid === artistId;

  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();
  const { updateQueue, playFromQueue } = useAudio();

  const fetchMoreTracks = useCallback(async () => {
    if (isLoading || !hasMore) return;

    try {
      setIsLoading(true);
      const nextPage = page + 1;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${playlistId}?itemPage=${nextPage}&itemPageSize=10`
      );

      if (!response.ok) throw new Error("트랙 목록을 불러오는데 실패했습니다.");

      const data = await response.json();
      const newTracks = data.playlistItemResponseDtos;

      if (newTracks.length === 0) {
        setHasMore(false);
        return;
      }

      setTracks((prev) => [...prev, ...newTracks]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching more tracks:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [playlistId, hasMore, isLoading, page]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchMoreTracks();
    }
  }, [inView, hasMore, isLoading, fetchMoreTracks]);

  const handleTrackDelete = useCallback((deletedTrackId: string) => {
    setTracks((prev) => prev.filter((t) => t.uuid !== deletedTrackId));
  }, []);

  const hasNoTracks = !tracks || tracks.length === 0;

  const handlePlay = async (trackId: string) => {
    const queueTracks = tracks.map((track) => ({
      uuid: track.uuid,
      title: track.trackGetResponseDto.trackResponseDto.title,
      artUrl: track.trackGetResponseDto.trackResponseDto.artUrl,
      trackUrl: track.trackGetResponseDto.trackResponseDto.trackUrl,
      duration: track.trackGetResponseDto.trackResponseDto.duration,
      artist: track.trackGetResponseDto.artistResponseDto,
      album: track.trackGetResponseDto.albumResponseDto,
    }));

    const selectedIndex = queueTracks.findIndex(
      (track) => track.uuid === trackId
    );

    try {
      await updateQueue(queueTracks);
      await playFromQueue(selectedIndex);
    } catch (error) {
      console.error('Failed to play track:', error);
    }
  };

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
              <div
                key={item.uuid}
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
                  <button className="w-8 flex items-center justify-center" onClick={() => handlePlay(track.uuid)}>
                    <div className="text-sm text-muted-foreground group-hover:opacity-0 transition-opacity">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <Play className="w-4 h-4 absolute opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </button>

                  <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                    <Image
                      src={album.artImage}
                      alt={album.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {track.title}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Link
                        href={`/profile/${artist.uuid}`}
                        className="hover:underline truncate"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {artist.name}
                      </Link>
                      <span>•</span>
                      <Link
                        href={`/albums/${album.uuid}`}
                        className="hover:underline truncate"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {album.title}
                      </Link>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground mr-4">
                    {formatDuration(track.duration)}
                  </div>

                  <TrackActions
                    place="playlist"
                    track={{
                      uuid: track.uuid,
                      title: track.title,
                      lyric: track.lyric,
                      artUrl: track.artUrl,
                      trackUrl: track.trackUrl,
                      duration: track.duration,
                      artist: artist,
                      album: album,
                    }}
                    isOwner={isOwner}
                    playlistId={playlistId}
                    playlistItemId={item.uuid}
                    onDelete={handleTrackDelete}
                  />
                </div>
              </div>
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
