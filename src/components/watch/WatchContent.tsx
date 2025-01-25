"use client";

import { useAudio } from "@/contexts/audio/AudioContext";
import { TrackInfo } from "@/components/watch/TrackInfo";
import { QueueList } from "@/components/watch/QueueList";

export function WatchContent() {
  const { currentTrack } = useAudio();

  if (!currentTrack) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <p className="text-muted-foreground">재생 중인 트랙이 없습니다</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
      <TrackInfo track={currentTrack} />
      <QueueList />
    </div>
  );
} 