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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkAuth } from "@/lib/auth";

interface Track {
  uuid: string;
  title: string;
  lyric: string;
}

interface EditTrackModalProps {
  track: Track;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (track: Track) => void;
}

export function EditTrackModal({ track, isOpen, onClose, onUpdate }: EditTrackModalProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: track.title,
    lyric: track.lyric,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const { accessToken } = await checkAuth();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tracks/${track.uuid}`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: form.title.trim(),
            lyric: form.lyric.trim(),
          }),
        }
      );

      if (!response.ok) throw new Error("트랙 수정에 실패했습니다.");

      const updatedTrack = { ...track, ...form };
      onUpdate(updatedTrack);
      
      toast({
        title: "트랙 수정 완료",
        description: "트랙이 수정되었습니다.",
        variant: "default",
      });
      
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "트랙 수정 실패",
        description: error instanceof Error ? error.message : "트랙 수정에 실패했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>트랙 수정</DialogTitle>
          <DialogDescription className="hidden">트랙 정보를 수정해주세요.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">트랙 제목</label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="bg-white/5 border-white/10"
              maxLength={50}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">가사</label>
            <Textarea
              value={form.lyric}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, lyric: e.target.value }))
              }
              className="bg-white/5 border-white/10 min-h-[120px] resize-none"
              maxLength={1000}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              수정하기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 