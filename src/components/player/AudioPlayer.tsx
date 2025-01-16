"use client";

import { useAudio } from "@/contexts/audio/AudioContext";
import { Pause, Play, Volume2 } from "lucide-react";
import { formatDuration } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function AudioPlayer() {
  const { currentTrack, isPlaying, progress, duration, play, pause, seek, setVolume } = useAudio();

  if (!currentTrack) return null;

  return (
    <div className={cn(
      "rounded-2xl",
      "bg-white/5 dark:bg-black/20",
      "backdrop-blur-xl",
      "border border-white/10",
      "shadow-lg",
      "p-4",
      "flex items-center gap-6",
      "transition-all duration-300"
    )}>
      {/* 트랙 정보 */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={currentTrack.trackResponseDto.artUrl}
            alt={currentTrack.trackResponseDto.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold truncate">
            {currentTrack.trackResponseDto.title}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link
              href={`/${currentTrack.artistResponseDto.uuid}`}
              className="hover:underline truncate hover:text-foreground transition-colors"
            >
              {currentTrack.artistResponseDto.name}
            </Link>
            <span>•</span>
            <Link
              href={`/albums/${currentTrack.albumResponseDto.uuid}`}
              className="hover:underline truncate hover:text-foreground transition-colors"
            >
              {currentTrack.albumResponseDto.title}
            </Link>
          </div>
        </div>
      </div>

      {/* 재생 컨트롤 */}
      <div className="flex flex-col items-center gap-2 w-[500px]">
        <button
          onClick={() => (isPlaying ? pause() : play(currentTrack))}
          className={cn(
            "p-3 rounded-xl",
            "bg-white/5 hover:bg-white/10",
            "transition-all duration-300",
            "hover:scale-105"
          )}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
        <div className="flex items-center gap-3 w-full">
          <div className="text-xs text-muted-foreground w-12 text-right">
            {formatDuration(progress)}
          </div>
          <Slider
            value={[progress]}
            max={duration}
            step={1}
            onValueChange={([value]) => seek(value)}
            className="flex-1"
          />
          <div className="text-xs text-muted-foreground w-12">
            {formatDuration(duration)}
          </div>
        </div>
      </div>

      {/* 볼륨 컨트롤 */}
      <div className="flex items-center gap-3 w-40">
        <Volume2 className="w-4 h-4 text-muted-foreground" />
        <Slider
          defaultValue={[100]}
          max={100}
          step={1}
          onValueChange={([value]) => setVolume(value / 100)}
          className="flex-1"
        />
      </div>
    </div>
  );
} 