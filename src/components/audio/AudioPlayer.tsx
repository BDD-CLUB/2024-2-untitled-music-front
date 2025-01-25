"use client";

import { cn } from "@/lib/utils";
import { useAudio } from "@/contexts/audio/AudioContext";
import { formatDuration } from "@/lib/format";
import { Slider } from "@/components/ui/slider";
import { 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Repeat,
  Repeat1,
  Shuffle,
  ListMusic,
} from "lucide-react";
import { Play, Pause } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function AudioPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    repeat,
    shuffle,
    pause,
    resume,
    next,
    previous,
    setVolume,
    seek,
    toggleRepeat,
    toggleShuffle,
  } = useAudio();
  const router = useRouter();

  // 키보드 이벤트 핸들러를 useCallback으로 분리
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    // 입력 필드에서는 키보드 이벤트를 무시
    if (
      document.activeElement?.tagName === "INPUT" ||
      document.activeElement?.tagName === "TEXTAREA"
    ) {
      return;
    }

    switch (e.code) {
      case "Space": // 스페이스바: 재생/일시정지
        e.preventDefault();
        if (isPlaying) {
          pause();
        } else {
          resume();
        }
        break;
      case "ArrowLeft": // 왼쪽 화살표: 뒤로 5초
        e.preventDefault();
        seek(Math.max(0, progress - 5));
        break;
      case "ArrowRight": // 오른쪽 화살표: 앞으로 5초
        e.preventDefault();
        seek(Math.min(duration, progress + 5));
        break;
      case "ArrowUp": // 위쪽 화살표: 볼륨 증가
        e.preventDefault();
        setVolume(Math.min(1, volume + 0.1));
        break;
      case "ArrowDown": // 아래쪽 화살표: 볼륨 감소
        e.preventDefault();
        setVolume(Math.max(0, volume - 0.1));
        break;
      case "KeyM": // M키: 음소거 토글
        setVolume(volume === 0 ? 1 : 0);
        break;
    }
  }, [isPlaying, pause, resume, seek, setVolume, volume, progress, duration]);

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  if (!currentTrack) return null;

  return (
    <div className={cn(
      "w-full h-16",
      "bg-background/30 dark:bg-black/20",
      "backdrop-blur-2xl",
      "border border-white/20",
      "rounded-3xl",
      "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
      "overflow-hidden",
      "relative"
    )}>
      {/* 컨텐츠 영역 */}
      <div className="flex items-center justify-between h-full px-6">
        {/* 트랙 정보 */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={cn(
            "relative w-10 h-10",
            "rounded-xl overflow-hidden",
            "bg-white/5",
            "ring-1 ring-white/10",
            "shadow-lg"
          )}>
            <Image
              src={currentTrack.artUrl}
              alt={currentTrack.title}
              fill
              className="object-cover rounded-xl"
            />
          </div>
          <div className="flex-1 min-w-0">
            <Link 
              href={`/albums/${currentTrack.album.uuid}`}
              className="text-sm font-medium hover:underline truncate block"
            >
              {currentTrack.title}
            </Link>
            <Link
              href={`/profile/${currentTrack.artist.uuid}`}
              className="text-sm text-muted-foreground hover:underline truncate block"
            >
              {currentTrack.artist.name}
            </Link>
          </div>
        </div>

        {/* 재생 컨트롤 */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleShuffle}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                shuffle && "text-foreground"
              )}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button 
              onClick={previous}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={isPlaying ? pause : resume}
              className={cn(
                "w-10 h-10 rounded-full",
                "flex items-center justify-center",
                "bg-white/10",
                "hover:bg-white/20",
                "ring-1 ring-white/20",
                "transition-all duration-300",
                "hover:scale-105",
                "shadow-lg"
              )}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            <button 
              onClick={next}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button 
              onClick={toggleRepeat}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                repeat !== "none" && "text-foreground"
              )}
            >
              {repeat === "one" ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* 볼륨 컨트롤 */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground min-w-[40px] text-right">
              {formatDuration(Math.floor(progress))}
            </span>
            <span className="text-xs text-muted-foreground">/</span>
            <span className="text-xs text-muted-foreground min-w-[40px]">
              {formatDuration(duration)}
            </span>
          </div>
          <div className="w-px h-4 bg-white/10 mx-4" />
          <button
            onClick={() => router.push("/watch")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ListMusic className="w-5 h-5" />
          </button>
          <button
            onClick={() => setVolume(volume === 0 ? 1 : 0)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {volume === 0 ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={([value]) => setVolume(value / 100)}
            className={cn(
              "w-20",
              "h-1.5",
              "[&_[role=slider]]:h-3 [&_[role=slider]]:w-3",
              "[&_[role=slider]]:hover:h-4 [&_[role=slider]]:hover:w-4",
              "[&_[role=slider]]:transition-all",
              "[&_[role=slider]]:border-2",
              "[&_[role=slider]]:border-white",
              "[&_[role=slider]]:bg-white",
              "[&_[role=slider]]:shadow-md",
              "[&_[data-disabled]]:opacity-50",
              "[&_[data-orientation=horizontal]]:h-full",
              "[&_.range-track]:bg-white/20",
              "[&_.range-track-progress]:bg-white/40",
            )}
          />
        </div>
      </div>

      {/* 프로그레스 바를 하단으로 이동 */}
      <div className="absolute bottom-0 left-0 right-0 px-0">
        <Slider
          value={[progress]}
          max={duration}
          step={1}
          onValueChange={([value]) => seek(value)}
          className={cn(
            "h-1.5",
            "cursor-pointer",
            "hover:h-2 transition-all",
            "[&_[role=slider]]:h-3 [&_[role=slider]]:w-3",
            "[&_[role=slider]]:hover:h-4 [&_[role=slider]]:hover:w-4",
            "[&_[role=slider]]:transition-all",
            "[&_[role=slider]]:border-2",
            "[&_[role=slider]]:border-white",
            "[&_[role=slider]]:bg-white",
            "[&_[role=slider]]:shadow-md",
            "[&_[data-disabled]]:opacity-50",
            "[&_[data-orientation=horizontal]]:h-full",
            "[&_.range-track]:bg-white/20",
            "[&_.range-track-progress]:bg-white/40",
          )}
        />
      </div>
    </div>
  );
} 