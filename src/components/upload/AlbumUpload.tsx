"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth/AuthContext";

interface AlbumForm {
  title: string;
  description: string;
  albumArt: string;
}

interface FormError {
  title?: string;
  description?: string;
  albumArt?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export function AlbumUpload() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<FormError>({});
  const [form, setForm] = useState<AlbumForm>({
    title: "",
    description: "",
    albumArt: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // 인증 체크
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        variant: "destructive",
        description: "로그인이 필요한 서비스입니다.",
      });
      router.push("/");
    }
  }, [isAuthenticated, router, toast]);

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
      validateFile(file);
      setIsUploading(true);
      setErrors(prev => ({ ...prev, albumArt: undefined }));
      
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/images`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error("이미지 업로드에 실패했습니다.");

      const imageUrl = await response.text();
      setForm(prev => ({ ...prev, albumArt: imageUrl }));
      setPreviewImage(URL.createObjectURL(file));
      
      toast({
        description: "이미지가 성공적으로 업로드되었습니다.",
      });
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        albumArt: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다."
      }));
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    const newErrors: FormError = {};

    if (!form.title.trim()) {
      newErrors.title = "앨범 제목을 입력해주세요.";
    } else if (form.title.length < 1) {
      newErrors.title = "앨범 제목은 최소 1자 이상이어야 합니다.";
    }

    if (!form.description.trim()) {
      newErrors.description = "앨범 설명을 입력해주세요.";
    } 

    if (!form.albumArt) {
      newErrors.albumArt = "앨범 커버 이미지를 업로드해주세요.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      throw new Error("입력 정보를 확인해주세요.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      validateForm();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/albums`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
        credentials: "include",
      });

      if (!response.ok) throw new Error("앨범 생성에 실패했습니다.");

      toast({
        description: "앨범이 성공적으로 생성되었습니다.",
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "앨범 생성에 실패했습니다.",
      });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-8">
      {/* 앨범 커버 업로드 */}
      <div className="mb-8">
        <div
          className={cn(
            "relative aspect-square w-full max-w-[320px] mx-auto",
            "rounded-2xl overflow-hidden",
            "bg-white/5",
            "border-2 border-dashed border-white/10",
            "transition-all duration-300",
            "hover:border-white/20",
            "group",
            isUploading && "opacity-50 pointer-events-none",
            errors.albumArt && "border-red-500/50"
          )}
        >
          {previewImage ? (
            <Image
              src={previewImage}
              alt="Album Cover"
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <ImagePlus className="w-8 h-8 group-hover:text-black/50 transition-colors" />
              <p className="text-sm group-hover:text-black/50 transition-colors">
                앨범 커버 이미지 업로드
              </p>
            </div>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            disabled={isUploading}
          />
        </div>
        {errors.albumArt && (
          <p className="mt-2 text-sm text-red-500">{errors.albumArt}</p>
        )}
      </div>

      {/* 앨범 정보 입력 */}
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">
            앨범 제목
          </label>
          <Input
            value={form.title}
            onChange={(e) => {
              setForm(prev => ({ ...prev, title: e.target.value }));
              setErrors(prev => ({ ...prev, title: undefined }));
            }}
            placeholder="앨범 제목을 입력하세요"
            className={cn(
              "bg-white/5 border-white/10 focus:outline-none",
              errors.title && "border-red-500/50"
            )}
            maxLength={50}
            required
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">
            앨범 설명
          </label>
          <Textarea
            value={form.description}
            onChange={(e) => {
              setForm(prev => ({ ...prev, description: e.target.value }));
              setErrors(prev => ({ ...prev, description: undefined }));
            }}
            placeholder="앨범에 대한 설명을 입력하세요"
            className={cn(
              "bg-white/5 border-white/10 min-h-[120px] focus:outline-none resize-none",
              errors.description && "border-red-500/50"
            )}
            maxLength={500}
            required
          />
          {errors.description && (
            <p className="mt-2 text-sm text-red-500">{errors.description}</p>
          )}
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isUploading || !form.albumArt}
          >
            앨범 생성하기
          </Button>
        </div>
      </div>
    </form>
  );
}