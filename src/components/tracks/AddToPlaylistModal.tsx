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
import { ListMusic } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useUser } from "@/contexts/auth/UserContext";

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

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>로그인이 필요합니다</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            플레이리스트에 트랙을 추가하려면 로그인이 필요합니다.
          </p>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>플레이리스트에 추가</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {playlists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <ListMusic className="w-12 h-12 mb-4" />
              <p>플레이리스트가 없습니다.</p>
            </div>
          ) : (
            playlists.map((playlist) => (
              <button
                key={playlist.playlistBasicResponseDto.uuid}
                onClick={() => handleAddToPlaylist(playlist.playlistBasicResponseDto.uuid)}
                disabled={isLoading}
                className="w-full p-4 flex items-center gap-4 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white/5">
                  {playlist.playlistBasicResponseDto.coverImageUrl ? (
                    <Image
                      src={playlist.playlistBasicResponseDto.coverImageUrl}
                      alt={playlist.playlistBasicResponseDto.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ListMusic className="w-8 h-8 text-white/20" />
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-medium truncate">
                    {playlist.playlistBasicResponseDto.title}
                  </h3>
                </div>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 