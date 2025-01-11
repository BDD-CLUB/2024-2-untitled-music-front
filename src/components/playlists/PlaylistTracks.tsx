import { cn } from "@/lib/utils";
import { Play, Music2 } from "lucide-react";
import { formatDuration } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";

interface PlaylistTracksProps {
  tracks: Array<{
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
  }>;
}

export function PlaylistTracks({ tracks }: PlaylistTracksProps) {
  const hasNoTracks = !tracks || tracks.length === 0;

  return (
    <div className="p-8 pt-0">
      {/* 트랙 목록 헤더 */}
      <div className="flex items-center gap-4 mb-6 px-3">
        <Music2 className="w-5 h-5 text-muted-foreground" />
        <h2 className="font-medium">트랙 목록</h2>
        {!hasNoTracks && (
          <span className="text-sm text-muted-foreground">
            {tracks.length}곡
          </span>
        )}
      </div>

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
        </div>
      )}
    </div>
  );
} 