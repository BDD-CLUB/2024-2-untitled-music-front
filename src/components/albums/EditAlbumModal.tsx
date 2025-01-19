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
import { checkAuth } from "@/lib/auth";
import Image from "next/image";
import { Upload } from "lucide-react";
import { convertToWebP } from "@/lib/image";

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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export function EditAlbumModal({
  album,
  isOpen,
  onClose,
}: EditAlbumModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    title: album.title,
    description: album.description,
    albumArt: album.artImage,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const validateFile = (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error("JPG, PNG, WEBP 형식의 이미지만 업로드 가능합니다.");
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("파일 크기는 5MB를 초과할 수 없습니다.");
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      validateFile(file);

      // WebP로 변환
      const optimizedFile = await convertToWebP(file);
      
      // 미리보기 생성
      const previewUrl = URL.createObjectURL(optimizedFile);
      setPreviewImage(previewUrl);

      const formData = new FormData();
      formData.append('file', optimizedFile);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/images`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        }
      );

      if (!response.ok) throw new Error('이미지 업로드에 실패했습니다.');
      
      const imageUrl = await response.text();
      setForm(prev => ({ ...prev, albumArt: imageUrl }));

      toast({
        title: "이미지 업로드 완료",
        description: "앨범 아트가 업로드되었습니다.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "이미지 업로드 실패",
        description: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.",
      });
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const { accessToken } = await checkAuth();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/albums/${album.uuid}`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            title: form.title.trim(),
            description: form.description.trim(),
            albumArt: form.albumArt,  // 변경된 이미지 URL 또는 기존 URL
          }),
        }
      );

      if (!response.ok) throw new Error("앨범 수정에 실패했습니다.");

      toast({
        title: "앨범 수정 완료",
        description: "앨범이 수정되었습니다.",
      });

      router.refresh();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "앨범 수정 실패",
        description: error instanceof Error ? error.message : "앨범 수정에 실패했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleImageUpload(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>앨범 수정</DialogTitle>
          <DialogDescription className="hidden">앨범 정보를 수정해주세요.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* 앨범 아트 업로드 */}
          <div>
            <label className="text-sm font-medium mb-2 block">앨범 커버</label>
            <div className="flex flex-col items-center gap-4">
              <div className="relative aspect-square w-48 rounded-xl overflow-hidden">
                <Image
                  src={previewImage || form.albumArt}
                  alt="앨범 아트"
                  fill
                  className="object-cover"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('album-art')?.click()}
                disabled={isUploading || isSubmitting}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "업로드 중..." : "이미지 변경"}
              </Button>
              <input
                id="album-art"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading || isSubmitting}
              />
            </div>
          </div>

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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting || isUploading}
            >
              취소
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting ? "수정 중..." : "수정하기"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
