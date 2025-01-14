"use client";

import { Album } from "@/types/album";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatDate } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

export function AlbumSection() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const { toast } = useToast();

  const fetchAlbums = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/albums?page=0&pageSize=6`,
        {
          credentials: 'include',
        }
      );
      if (!response.ok) throw new Error('앨범 목록을 불러오는데 실패했습니다.');
      const data = await response.json();
      setAlbums(data);
    } catch (error) {
      console.error('Failed to fetch albums:', error);
      toast({
        variant: "destructive",
        title: "앨범 목록을 불러오는데 실패했습니다.",
        description: error instanceof Error ? error.message : "앨범 목록을 불러오는데 실패했습니다.",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return (
    <section className="p-6">
      <h2 className="text-xl font-bold mb-4">최신 앨범</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {albums.map((album) => (
          <Link
            key={album.albumResponseDto.uuid}
            href={`/albums/${album.albumResponseDto.uuid}`}
            className={cn(
              "group relative",
              "rounded-xl overflow-hidden",
              "transition-all duration-300",
              "hover:scale-[1.02] hover:shadow-xl"
            )}
          >
            {/* 앨범 커버 */}
            <div className="relative aspect-square">
              <Image
                src={album.albumResponseDto.artImage}
                alt={album.albumResponseDto.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              {/* 호버 오버레이 */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* 앨범 정보 */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="font-medium text-white text-sm mb-1 truncate">
                {album.albumResponseDto.title}
              </h3>
              <p className="text-xs text-white/70">
                {album.artistResponseDto.name} • {formatDate(album.albumResponseDto.releaseDate)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
} 