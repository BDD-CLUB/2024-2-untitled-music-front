"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import { useAuth } from "@/contexts/auth/AuthContext";

interface PlaylistForm {
  title: string;
  description: string;
}

export function PlaylistUpload() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<PlaylistForm>({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "로그인이 필요한 서비스입니다.",
        variant: "destructive",
        description: "로그인이 필요한 서비스입니다.",
      });
      router.push("/");
    }
  }, [isAuthenticated, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast({
        title: "플레이리스트 제목 입력 실패",
        variant: "destructive",
        description: "플레이리스트 제목을 입력해주세요.",
      });
      return;
    }
    
    try {
      setIsLoading(true);

      const { accessToken } = await checkAuth();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "credentials": "include",
        },
        body: JSON.stringify({
          ...form,
          title: form.title.trim(),
          description: form.description.trim(),
          trackUuids: [],
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('로그인이 필요합니다.');
        }
        throw new Error('플레이리스트 생성에 실패했습니다.');
      }

      toast({
        title: "플레이리스트 생성 완료",
        variant: "default",
        description: "플레이리스트가 생성되었습니다.",
      });

      router.push('/');
    } catch (error) {
      toast({
        variant: "destructive",
        description: error instanceof Error ? error.message : "플레이리스트 생성에 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div
          className={cn(
            "p-6",
            "rounded-3xl",
            "bg-white/5",
            "border border-white/10",
            "backdrop-blur-sm",
            "transition-all duration-300",
            isLoading && "opacity-50"
          )}
        >
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">
                플레이리스트 제목
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="플레이리스트 제목을 입력하세요"
                className="bg-white/5 border-white/10 transition-colors focus:bg-white/10"
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
                placeholder="플레이리스트에 대한 설명을 입력하세요"
                className="bg-white/5 border-white/10 min-h-[100px] resize-none transition-colors focus:bg-white/10"
                maxLength={500}
                disabled={isLoading}
              />
              <p className="text-sm text-muted-foreground mt-2">
                {form.description.length}/500
              </p>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          size="lg"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "생성 중..." : "플레이리스트 만들기"}
        </Button>
      </form>
    </div>
  );
}