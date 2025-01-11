import { cn } from "@/lib/utils";
import { Play, Music } from "lucide-react";
import { formatDuration } from "@/lib/format";

interface TrackListProps {
  tracks: Array<{
    uuid: string;
    title: string;
    duration: number;
  }>;
}

export function TrackList({ tracks }: TrackListProps) {
  const hasNoTracks = !tracks || tracks.length === 0;

  return (
    <div className="p-8 pt-4">
      {/* 트랙이 없는 경우 */}
      {hasNoTracks ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <Music className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            아직 등록된 트랙이 없습니다
          </p>
        </div>
      ) : (
        /* 트랙 목록 */
        <div className="space-y-1">
          {tracks.map((track, index) => (
            <button
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
                <div className="flex-1 text-left">{track.title}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDuration(track.duration)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 