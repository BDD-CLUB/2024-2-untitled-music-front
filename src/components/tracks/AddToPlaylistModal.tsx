"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkAuth } from "@/lib/auth";
import { ListMusic, Plus } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useUser } from "@/contexts/auth/UserContext";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import Link from "next/link";

interface Playlist {
  playlistBasicResponseDto: {
    uuid: string;
    title: string;
    description: string;
    coverImageUrl: string;
  };
}

interface AddToPlaylistModalProps {
  trackId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function AddToPlaylistModal({ trackId, isOpen, onClose }: AddToPlaylistModalProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { user } = useUser();

  const fetchPlaylists = useCallback(async () => {
    if (!user?.uuid) return;
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/artists/${user.uuid}/playlists`,
        {
          credentials: 'include',
        }
      );
      
      if (!response.ok) throw new Error('플레이리스트 목록을 불러오는데 실패했습니다.');
      
      const data = await response.json();
      setPlaylists(data);
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
      toast({
        variant: "destructive",
        description: "플레이리스트 목록을 불러오는데 실패했습니다.",
      });
    }
  }, [user?.uuid, toast]);

  const handleAddToPlaylist = async (playlistId: string) => {
    try {
      setIsLoading(true);
      const { accessToken } = await checkAuth();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${playlistId}/tracks`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            removedItemUuids: [],
            newTrackUuids: [trackId],
          }),
        }
      );

      if (!response.ok) throw new Error("트랙 추가에 실패했습니다.");

      toast({
        title: "트랙 추가 완료",
        description: "플레이리스트에 트랙이 추가되었습니다.",
      });

      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "트랙 추가에 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchPlaylists();
    }
  }, [isOpen, isAuthenticated, fetchPlaylists]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">플레이리스트에 추가</DialogTitle>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-lg flex items-center justify-center mb-4">
              <ListMusic className="w-8 h-8 text-white/40" />
            </div>
            <p className="text-muted-foreground text-center text-sm">
              플레이리스트에 트랙을 추가하려면 로그인이 필요합니다.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {playlists.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <div className="w-16 h-16 rounded-2xl bg-white/5 backdrop-blur-lg flex items-center justify-center mb-4">
                  <ListMusic className="w-8 h-8 text-white/40" />
                </div>
                <p className="text-muted-foreground text-center text-sm">
                  플레이리스트가 없습니다
                </p>
                <Button className="w-full mt-4">
                  <Link href="/upload/playlist" className="w-full h-full flex items-center justify-center">
                    <Plus className="w-4 h-4 mr-2" />
                    플레이리스트 생성
                  </Link>
                </Button>
              </div>
            ) : (
              playlists.map((playlist) => (
                <button
                  key={playlist.playlistBasicResponseDto.uuid}
                  onClick={() => handleAddToPlaylist(playlist.playlistBasicResponseDto.uuid)}
                  disabled={isLoading}
                  className={cn(
                    "w-full group",
                    "p-3",
                    "flex items-center gap-4",
                    "rounded-xl",
                    "transition-all duration-300",
                    "hover:bg-white/5",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "relative overflow-hidden"
                  )}
                >

                  {/* 플레이리스트 커버 */}
                  <div className="relative shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-white/5">
                    {playlist.playlistBasicResponseDto.coverImageUrl ? (
                      <Image
                        src={playlist.playlistBasicResponseDto.coverImageUrl}
                        alt={playlist.playlistBasicResponseDto.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ListMusic className="w-6 h-6 text-white/20" />
                      </div>
                    )}
                  </div>

                  {/* 플레이리스트 정보 */}
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="font-medium text-sm truncate pr-4">
                      {playlist.playlistBasicResponseDto.title}
                    </h3>
                  </div>

                  {/* 추가 아이콘 */}
                  <div className="shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                </button>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 