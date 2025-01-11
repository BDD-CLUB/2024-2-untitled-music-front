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
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

interface EditAlbumModalProps {
  album: {
    uuid: string;
    title: string;
    description: string;
    artImage: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function EditAlbumModal({
  album,
  isOpen,
  onClose,
}: EditAlbumModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: album.title,
    description: album.description,
    albumArt: album.artImage,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await api.patch(`/albums/${album.uuid}`, {
        title: form.title,
        description: form.description,
        albumArt: form.albumArt,
      });

      if (response.status !== 200) throw new Error("앨범 수정에 실패했습니다.");

      toast({
        variant: "default",
        title: "앨범 수정 완료",
        description: "앨범이 수정되었습니다.",
      });

      router.refresh();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "앨범 수정 실패",
        description:
          error instanceof Error ? error.message : "앨범 수정에 실패했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>앨범 수정</DialogTitle>
          <DialogDescription className="hidden">앨범 정보를 수정해주세요.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">앨범 제목</label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
              className="bg-white/5 border-white/10"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">앨범 설명</label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, description: e.target.value }))
              }
              className="bg-white/5 border-white/10 min-h-[120px] resize-none"
              maxLength={500}
              required
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
