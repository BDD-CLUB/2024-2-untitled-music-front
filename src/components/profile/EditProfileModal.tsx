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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload } from "lucide-react";
import { checkAuth } from "@/lib/auth";
import { useUser } from "@/contexts/auth/UserContext";
import { convertToWebP } from "@/lib/image";
import { useRouter } from "next/navigation";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { toast } = useToast();
  const { user, updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();

  const validateFile = (file: File) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error("JPG, PNG, WEBP, JPG 형식의 이미지만 업로드 가능합니다.");
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("파일 크기는 5MB를 초과할 수 없습니다.");
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsLoading(true);
      validateFile(file);

      // WebP로 변환
      const optimizedFile = await convertToWebP(file);
      
      const { accessToken } = await checkAuth();

      // 1. S3에 이미지 업로드
      const formData = new FormData();
      formData.append('file', optimizedFile);  // 변환된 파일 사용

      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/images`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!uploadResponse.ok) throw new Error('이미지 업로드에 실패했습니다.');
      const imageUrl = await uploadResponse.text();

      // 2. 프로필 이미지 업데이트
      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/artists/profile-image`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "imageUrl": imageUrl,
        }),
        credentials: 'include',
      });

      if (!updateResponse.ok) throw new Error('프로필 업데이트에 실패했습니다.');
      const updatedUser = await updateResponse.json();

      // 3. Context 업데이트
      updateUser(updatedUser);

      toast({
        title: "프로필 이미지 변경 완료",
        description: "프로필 이미지가 변경되었습니다.",
        variant: "default",
      });

      onClose();
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "프로필 이미지 변경 실패",
        description: error instanceof Error ? error.message : "프로필 이미지 변경에 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    handleImageUpload(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>프로필 이미지 변경</DialogTitle>
          <DialogDescription className="hidden">프로필 이미지를 변경해주세요.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* 현재/미리보기 이미지 */}
          <Avatar className="w-32 h-32 border-2 border-white/10">
            <AvatarImage src={previewImage || user?.artistImage} />
            <AvatarFallback>
              <User className="w-16 h-16" />
            </AvatarFallback>
          </Avatar>

          {/* 파일 업로드 버튼 */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={() => document.getElementById('profile-image')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              이미지 선택
            </Button>
            <input
              id="profile-image"
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