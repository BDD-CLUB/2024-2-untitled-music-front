"use client";

import { useAudio } from "@/contexts/audio/AudioContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function WatchPage() {
  const { currentTrack } = useAudio();
  const router = useRouter();
  const [showLyrics, setShowLyrics] = useState(false);

  // 현재 재생 중인 트랙이 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!currentTrack) {
      router.push('/');
    }
  }, [currentTrack, router]);

  if (!currentTrack) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* 좌측: 현재 트랙 정보 (2/3) */}
        <div className="flex-[2] min-w-0">
          <div className={cn(
            "rounded-3xl",
            "bg-white/10 dark:bg-black/10",
            "backdrop-blur-2xl",
            "border border-white/20 dark:border-white/10",
            "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
            "overflow-hidden"
          )}>
            <div className="p-8">
              {/* 앨범 아트워크/가사 토글 */}
              <div 
                onClick={() => setShowLyrics(!showLyrics)}
                className="relative w-full max-w-md mx-auto aspect-square mb-8 rounded-2xl overflow-hidden cursor-pointer group"
              >
                {showLyrics ? (
                  <div className="absolute inset-0 p-6 overflow-y-auto bg-white/5 backdrop-blur-xl border border-white/10">
                    <p className="text-muted-foreground whitespace-pre-line">
                      {currentTrack.lyric || "가사 정보가 없습니다."}
                    </p>
                  </div>
                ) : (
                  <>
                    <Image
                      src={currentTrack.artUrl}
                      alt={currentTrack.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                  </>
                )}
              </div>

              {/* 트랙 정보 - 중앙 정렬 */}
              <div className="text-center space-y-3">
                <h1 className="text-2xl font-bold">
                  {currentTrack.title}
                </h1>
                <div className="flex items-center justify-center gap-2 text-lg">
                  <Link
                    href={`/profile/${currentTrack.artist.uuid}`}
                    className="text-muted-foreground hover:underline"
                  >
                    {currentTrack.artist.name}
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link
                    href={`/albums/${currentTrack.album.uuid}`}
                    className="text-muted-foreground hover:underline"
                  >
                    {currentTrack.album.title}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 우측: 재생 목록 (1/3) */}
        <div className="flex-1 min-w-0">
          <div className={cn(
            "rounded-3xl",
            "bg-white/10 dark:bg-black/10",
            "backdrop-blur-2xl",
            "border border-white/20 dark:border-white/10",
            "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
            "overflow-hidden",
            "h-full"
          )}>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">재생 목록</h2>
              <p className="text-muted-foreground text-sm">
                재생 목록 기능은 곧 구현될 예정입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 