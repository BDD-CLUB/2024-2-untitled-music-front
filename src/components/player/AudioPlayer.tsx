"use client";

import { useAudio } from "@/contexts/audio/AudioContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2 } from "lucide-react";
import Image from "next/image";

export function AudioPlayer() {
  const { currentTrack, isPlaying, volume, pause, resume, setVolume } = useAudio();

  if (!currentTrack) return null;

  return (
    <div className="flex items-center gap-4">
      {/* 앨범 아트 */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5">
        <Image
          src={currentTrack.album.artImage}
          alt={currentTrack.title}
          width={48}
          height={48}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 트랙 정보 */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{currentTrack.title}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {currentTrack.artistName}
        </p>
      </div>

      {/* 재생 컨트롤 */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => (isPlaying ? pause() : resume())}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </Button>

        {/* 볼륨 컨트롤 */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4" />
          <Slider
            value={[volume * 100]}
            onValueChange={([value]) => setVolume(value / 100)}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
} 