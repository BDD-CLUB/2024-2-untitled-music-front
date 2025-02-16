"use client";

import { useAudio } from "@/contexts/audio/AudioContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WatchPage() {
  const { currentTrack } = useAudio();
  const router = useRouter();

  // 현재 재생 중인 트랙이 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!currentTrack) {
      router.push('/');
    }
  }, [currentTrack, router]);

  if (!currentTrack) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 임시 레이아웃 - 추후 확장 예정 */}
        <div className="rounded-3xl overflow-hidden bg-white/10 dark:bg-black/10 backdrop-blur-2xl border border-white/20 dark:border-white/10">
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">현재 재생 중</h1>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{currentTrack.title}</h2>
                {/* 추가 정보는 나중에 구현 */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 