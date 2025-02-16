"use client";

import { useAudio } from "@/contexts/audio/AudioContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { QueueList } from "@/components/audio/QueueList";
import { List, Image as ImageIcon } from "lucide-react";

export default function WatchPage() {
  const { currentTrack } = useAudio();
  const router = useRouter();
  const [showLyrics, setShowLyrics] = useState(false);
  const [showQueue, setShowQueue] = useState(false);

  // 현재 재생 중인 트랙이 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!currentTrack) {
      router.push("/");
    }
  }, [currentTrack, router]);

  if (!currentTrack) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* 좌측: 현재 트랙 정보 */}
        <div className={cn(
          "flex-[2] min-w-0",
          showQueue ? "hidden lg:block" : "block"
        )}>
          <div
            className={cn(
              "rounded-3xl",
              "bg-white/10 dark:bg-black/10",
              "backdrop-blur-2xl",
              "border border-white/20 dark:border-white/10",
              "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
              "overflow-hidden"
            )}
          >
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
                <h1 className="text-2xl font-bold">{currentTrack.title}</h1>
                <div className="flex items-center justify-center gap-2 text-lg">
                  <Link
                    href={`/albums/${currentTrack.album.uuid}`}
                    className="text-muted-foreground hover:underline"
                  >
                    {currentTrack.album.title}
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link
                    href={`/profile/${currentTrack.artist.uuid}`}
                    className="text-muted-foreground hover:underline"
                  >
                    {currentTrack.artist.name}
                  </Link>
                </div>
              </div>
            </div>

            {/* 모바일 재생목록 토글 버튼 추가 */}
            <button 
              onClick={() => setShowQueue(true)}
              className="lg:hidden absolute bottom-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              <List className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 우측: 재생 목록 */}
        <div className={cn(
          "flex-1 min-w-0",
          showQueue ? "block" : "hidden lg:block"
        )}>
          <div className={cn(
            "rounded-3xl",
            "bg-white/10 dark:bg-black/10",
            "backdrop-blur-2xl",
            "border border-white/20 dark:border-white/10",
            "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
            "overflow-hidden",
            "h-full"
          )}>
            {/* 모바일 아트워크 보기 토글 버튼 추가 */}
            <button 
              onClick={() => setShowQueue(false)}
              className="lg:hidden p-4 w-full flex items-center gap-2 text-muted-foreground hover:bg-white/5"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <div className="p-6">
              <QueueList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
