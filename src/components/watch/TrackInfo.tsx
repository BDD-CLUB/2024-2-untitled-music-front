"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Track } from "@/contexts/audio/AudioContext";

interface TrackInfoProps {
  track: Track;
}

export function TrackInfo({ track }: TrackInfoProps) {
  return (
    <div className={cn(
      "p-8",
      "bg-background/30 dark:bg-black/20",
      "backdrop-blur-2xl",
      "border border-white/20",
      "rounded-3xl",
      "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
    )}>
      <div className="space-y-8">
        {/* 앨범 아트 */}
        <div className={cn(
          "aspect-square w-full max-w-md mx-auto",
          "relative rounded-2xl overflow-hidden",
          "bg-white/5",
          "ring-1 ring-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
          "group",
          "transition-transform duration-300 hover:scale-[1.02]"
        )}>
          <Image
            src={track.artUrl}
            alt={track.title}
            fill
            className="object-cover"
          />
          <div className={cn(
            "absolute inset-0",
            "bg-gradient-to-b from-transparent to-black/50",
            "opacity-0 group-hover:opacity-100",
            "transition-opacity duration-300"
          )} />
        </div>

        {/* 트랙 정보 */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{track.title}</h1>
          <div className="flex items-center gap-3 text-lg">
            <Link
              href={`/profile/${track.artist.uuid}`}
              className={cn(
                "text-muted-foreground",
                "hover:text-foreground",
                "transition-colors"
              )}
            >
              {track.artist.name}
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href={`/albums/${track.album.uuid}`}
              className={cn(
                "text-muted-foreground",
                "hover:text-foreground",
                "transition-colors"
              )}
            >
              {track.album.title}
            </Link>
          </div>
        </div>

        {/* 가사 */}
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">가사</h2>
          <div className={cn(
            "whitespace-pre-wrap",
            "text-muted-foreground",
            "text-lg leading-relaxed",
            "max-h-[400px] overflow-y-auto",
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10",
            "pr-4"
          )}>
            {track.lyrics || "가사가 없습니다"}
          </div>
        </div>
      </div>
    </div>
  );
} 