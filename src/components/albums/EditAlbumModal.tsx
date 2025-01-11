"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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

export function EditAlbumModal({ album, isOpen, onClose }: EditAlbumModalProps) {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/albums/${album.uuid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          albumArt: form.albumArt,
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('앨범 수정에 실패했습니다.');

      toast({
        description: "앨범이 수정되었습니다.",
      });

      router.refresh();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "앨범 수정에 실패했습니다.",
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
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              앨범 제목
            </label>
            <Input
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="bg-white/5 border-white/10"
              maxLength={50}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              앨범 설명
            </label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="bg-white/5 border-white/10 min-h-[120px]"
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
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              수정하기
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 