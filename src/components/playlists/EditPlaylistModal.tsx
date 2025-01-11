"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/auth";

interface EditPlaylistModalProps {
  playlistId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function EditPlaylistModal({ playlistId, isOpen, onClose }: EditPlaylistModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    const fetchPlaylist = async () => {
      const { accessToken } = await checkAuth();

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${playlistId}`, {
          credentials: 'include',
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) throw new Error('플레이리스트 정보를 불러오는데 실패했습니다.');

        const data = await response.json();
        setForm({
          title: data.title,
          description: data.description,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "플레이리스트 정보 불러오기 실패",
          description: error instanceof Error ? error.message : "플레이리스트 정보를 불러오는데 실패했습니다.",
        });
        onClose();
      }
    };

    if (isOpen) {
      fetchPlaylist();
    }
  }, [playlistId, isOpen, toast, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title.trim()) {
      toast({
        variant: "destructive",
        title: "플레이리스트 제목 입력 실패",
        description: "플레이리스트 제목을 입력해주세요.",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { accessToken } = await checkAuth();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${playlistId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim(),
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('권한이 없습니다.');
        }
        throw new Error('플레이리스트 수정에 실패했습니다.');
      }

      toast({
        title: "플레이리스트 수정 완료",
        variant: "default",
        description: "플레이리스트가 수정되었습니다.",
      });

      router.refresh();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "플레이리스트 수정 실패",
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              플레이리스트 제목
            </label>
            <Input
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="bg-white/5 border-white/10"
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
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="bg-white/5 border-white/10 min-h-[100px] resize-none"
              maxLength={500}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground mt-2">
              {form.description.length}/500
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
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "수정 중..." : "수정하기"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 