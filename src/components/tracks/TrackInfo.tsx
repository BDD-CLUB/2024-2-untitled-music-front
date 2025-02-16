"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDuration } from "@/lib/format";
import { Clock, Disc, Mic2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Track {
  uuid: string;
  title: string;
  lyric: string;
  artUrl: string;
  trackUrl: string;
  duration: number;
  artist: {
    uuid: string;
    name: string;
  };
  album: {
    uuid: string;
    title: string;
  };
}

interface TrackInfoProps {
  track: Track;
  isOpen: boolean;
  onClose: () => void;
}

export function TrackInfo({ track, isOpen, onClose }: TrackInfoProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-md border-none">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">트랙 정보</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* 앨범 아트와 기본 정보 */}
          <div className="flex gap-8">
            <div className="relative w-48 h-48 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={track.artUrl}
                alt={track.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold tracking-tight">{track.title}</h3>
                <div className="flex items-center gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mic2 className="w-4 h-4" />
                    <Link 
                      href={`/profile/${track.artist.uuid}`}
                      className="hover:text-primary transition-colors"
                    >
                      {track.artist.name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <Disc className="w-4 h-4" />
                    <Link 
                      href={`/albums/${track.album.uuid}`}
                      className="hover:text-primary transition-colors"
                    >
                      {track.album.title}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(track.duration)}</span>
              </div>
            </div>
          </div>

          {/* 가사 섹션 */}
          {track.lyric && (
            <div className="space-y-4 bg-white/5 p-6 rounded-2xl backdrop-blur-sm">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <span className="bg-primary/20 p-2 rounded-lg">
                  <Mic2 className="w-4 h-4 text-primary" />
                </span>
                가사
              </h4>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {track.lyric}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 