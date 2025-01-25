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
import { useUser } from "@/contexts/auth/UserContext";
import { useRouter } from "next/navigation";

interface EditProfileInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileForm {
  name: string;
  description: string;
  link1: string;
  link2: string;
}

export function EditProfileInfoModal({ isOpen, onClose }: EditProfileInfoModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, updateUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    description: "",
    link1: "",
    link2: "",
  });

  // 초기 데이터 로드
  useEffect(() => {
    if (isOpen && user) {
      const fetchProfileData = async () => {
        try {
          const { accessToken } = await checkAuth();
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/artists/${user.uuid}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
              credentials: "include",
            }
          );

          if (!response.ok) throw new Error("프로필 정보를 불러오는데 실패했습니다.");

          const data = await response.json();
          setForm({
            name: data.name || "",
            description: data.description || "",
            link1: data.link1 || "",
            link2: data.link2 || "",
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "프로필 정보 로딩 실패",
            description: error instanceof Error ? error.message : "프로필 정보를 불러오는데 실패했습니다.",
          });
          onClose();
        }
      };

      fetchProfileData();
    }
  }, [isOpen, user, toast, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim()) {
      toast({
        variant: "destructive",
        title: "이름 입력 실패",
        description: "이름을 입력해주세요.",
      });
      return;
    }

    try {
      setIsLoading(true);
      const { accessToken } = await checkAuth();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/artists`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            name: form.name.trim(),
            description: form.description.trim(),
            link1: form.link1.trim(),
            link2: form.link2.trim(),
          }),
        }
      );

      if (!response.ok) throw new Error("프로필 수정에 실패했습니다.");

      // 204 응답은 성공이지만 응답 본문이 없음
      if (response.status !== 204) {
        const updatedUser = await response.json();
        updateUser(updatedUser);
      }
      
      toast({
        title: "프로필 수정 완료",
        description: "프로필이 성공적으로 수정되었습니다.",
      });
      
      router.refresh();
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "프로필 수정 실패",
        description: error instanceof Error ? error.message : "프로필 수정에 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>프로필 수정</DialogTitle>
          <DialogDescription className="hidden">프로필 정보를 수정해주세요.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">이름</label>
            <Input
              value={form.name}
              onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
              className="bg-white/5 border-white/10"
              maxLength={50}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">소개</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="bg-white/5 border-white/10 min-h-[100px] resize-none"
              maxLength={500}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">링크 1</label>
            <Input
              value={form.link1}
              onChange={(e) => setForm(prev => ({ ...prev, link1: e.target.value }))}
              className="bg-white/5 border-white/10"
              type="url"
              placeholder="https://"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">링크 2</label>
            <Input
              value={form.link2}
              onChange={(e) => setForm(prev => ({ ...prev, link2: e.target.value }))}
              className="bg-white/5 border-white/10"
              type="url"
              placeholder="https://"
              disabled={isLoading}
            />
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