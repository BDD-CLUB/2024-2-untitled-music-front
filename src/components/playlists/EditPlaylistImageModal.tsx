"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { ListMusic, Upload } from "lucide-react";
import { convertToWebP } from "@/lib/image";
import Image from "next/image";

interface EditPlaylistImageModalProps {
  playlistId: string;
  playlistImage: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => Promise<void>;
}

export function EditPlaylistImageModal({
  playlistId,
  playlistImage,
  isOpen,
  onClose,
  onSuccess,
}: EditPlaylistImageModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    try {
      setIsLoading(true);
      const { accessToken } = await checkAuth();

      // 이미지 WebP 변환
      const webpFile = await convertToWebP(e.target.files[0]);

      // S3 업로드
      const formData = new FormData();
      formData.append("file", webpFile);

      const uploadResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/images`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      if (!uploadResponse.ok) throw new Error("이미지 업로드에 실패했습니다.");

      const imageUrl = await uploadResponse.text();

      // 플레이리스트 이미지 업데이트
      const updateResponse = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/playlists/${playlistId}/cover-image?coverImageLink=${encodeURIComponent(
          imageUrl
        )}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!updateResponse.ok)
        throw new Error("플레이리스트 이미지 변경에 실패했습니다.");

      await onSuccess?.();

      toast({
        title: "이미지 변경 완료",
        description: "플레이리스트 이미지가 변경되었습니다.",
      });

      router.refresh();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        description:
          error instanceof Error
            ? error.message
            : "이미지 변경에 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>플레이리스트 이미지 변경</DialogTitle>
          <DialogDescription className="hidden">
            플레이리스트 이미지를 변경해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex flex-col items-center">
          {playlistImage ? (
            <Image
              src={playlistImage}
              alt="플레이리스트 이미지"
              fill
              className="object-cover"
            />
          ) : (
            <ListMusic className="w-32 h-32 text-white/20" />
          )}
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => document.getElementById("playlist-image")?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              {isLoading ? "업로드 중..." : "이미지 선택"}
            </Button>
            <input
              id="playlist-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
