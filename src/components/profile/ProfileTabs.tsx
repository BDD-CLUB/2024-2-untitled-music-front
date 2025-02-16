"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Disc3, ListMusic, Music, Loader2 } from "lucide-react";
import { AlbumList } from "./AlbumList";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PlaylistList } from "./PlaylistList";
import { TrackList } from "./TrackList";

interface ProfileTabsProps {
  userId: string;
}

export function ProfileTabs({ userId }: ProfileTabsProps) {
  const { toast } = useToast();
  const [albums, setAlbums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/artists/${userId}/albums`,
          {
            credentials: 'include',
          }
        );

        if (!response.ok) {
          throw new Error('앨범 목록을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setAlbums(data);
      } catch (error) {
        toast({
          variant: "destructive",
          description: error instanceof Error ? error.message : "앨범 목록을 불러오는데 실패했습니다.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, [userId, toast]);

  return (
    <Tabs defaultValue="albums" className="px-8 pb-8">
      <TabsList
        className={cn(
          "h-10 p-1",
          "bg-white/5",
          "border border-white/10",
          "rounded-2xl"
        )}
      >
        <TabsTrigger
          value="albums"
          className={cn(
            "h-8 px-6",
            "data-[state=active]:bg-white/10",
            "data-[state=active]:backdrop-blur-xl",
            "rounded-xl",
            "transition-all duration-300",
            "gap-2"
          )}
        >
          <Disc3 className="w-4 h-4" />
          <span>앨범</span>
        </TabsTrigger>
        <TabsTrigger
          value="tracks"
          className={cn(
            "h-8 px-6",
            "data-[state=active]:bg-white/10",
            "data-[state=active]:backdrop-blur-xl",
            "rounded-xl",
            "transition-all duration-300",
            "gap-2"
          )}
        >
          <Music className="w-4 h-4" />
          <span>트랙</span>
        </TabsTrigger>
        <TabsTrigger
          value="playlists"
          className={cn(
            "h-8 px-6",
            "data-[state=active]:bg-white/10",
            "data-[state=active]:backdrop-blur-xl",
            "rounded-xl",
            "transition-all duration-300",
            "gap-2"
          )}
        >
          <ListMusic className="w-4 h-4" />
          <span>플레이리스트</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="albums" className="mt-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin"><Loader2 className="w-4 h-4" /></div>
          </div>
        ) : (
          <AlbumList albums={albums} />
        )}
      </TabsContent>

      <TabsContent value="tracks" className="mt-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin"><Loader2 className="w-4 h-4" /></div>
          </div>
        ) : (
          <TrackList artistId={userId} />
        )}
      </TabsContent>

      <TabsContent value="playlists" className="mt-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin"><Loader2 className="w-4 h-4" /></div>
          </div>
        ) : (
          <PlaylistList artistId={userId} />
        )}
      </TabsContent>
    </Tabs>
  );
} 