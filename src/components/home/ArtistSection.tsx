"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/contexts/auth/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";

export function ArtistSection() {
  const [artists, setArtists] = useState<User[]>([]);
  const { toast } = useToast();

  const fetchArtists = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/artists?page=0&pageSize=6`,
        {
          credentials: 'include',
        }
      );
      
      if (!response.ok) throw new Error('아티스트 목록을 불러오는데 실패했습니다.');
      
      const data = await response.json();
      setArtists(data);
    } catch (error) {
      console.error('Failed to fetch artists:', error);
      toast({
        variant: "destructive",
        title: "아티스트 목록을 불러오는데 실패했습니다.",
        description: error instanceof Error ? error.message : "아티스트 목록을 불러오는데 실패했습니다.",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  return (
    <section className="p-6">
      <h2 className="text-xl font-bold mb-4">인기 아티스트</h2>
      <div className="space-y-4">
        {artists.map((artist) => (
          <Link
            key={artist.uuid}
            href={`/profile/${artist.uuid}`}
            className={cn(
              "group flex items-center gap-4",
              "p-3 w-full",
              "rounded-xl",
              "transition-all duration-300",
              "hover:bg-white/5",
              "backdrop-blur-sm"
            )}
          >
            <Avatar className="w-12 h-12 border-2 border-white/10 transition-transform group-hover:scale-[1.02] duration-500">
              <AvatarImage src={artist.artistImage} />
              <AvatarFallback>
                <UserIcon className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">
                {artist.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
} 