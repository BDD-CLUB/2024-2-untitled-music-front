"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface EditPlaylistModalProps {
  playlistId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EditPlaylistModal({ playlistId, isOpen, onClose }: EditPlaylistModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const fetchPlaylist = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${playlistId}`,
            {
              credentials: 'include',
            }
          );
          
          if (!response.ok) throw new Error("플레이리스트 정보를 불러오는데 실패했습니다.");
          
          const data = await response.json();
          setTitle(data.playlistBasicResponseDto.title);
          setDescription(data.playlistBasicResponseDto.description);
        } catch (error) {
          console.error("Failed to fetch playlist:", error);
          toast({
            variant: "destructive",
            description: "플레이리스트 정보를 불러오는데 실패했습니다.",
          });
          onClose();
        }
      };

      fetchPlaylist();
    }
  }, [isOpen, playlistId, toast, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const { accessToken } = await checkAuth();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${playlistId}`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim(),
            trackUuids: [],
          }),
        }
      );

      if (!response.ok) throw new Error("플레이리스트 수정에 실패했습니다.");

      toast({
        title: "플레이리스트 수정 완료",
        description: "플레이리스트가 수정되었습니다.",
      });

      router.refresh();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "플레이리스트 수정에 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>플레이리스트 수정</DialogTitle>
          <DialogDescription className="hidden">플레이리스트 정보를 수정해주세요.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              플레이리스트 제목
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              설명
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              className="resize-none"
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground mt-2">
              {description.length}/500
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              수정하기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 