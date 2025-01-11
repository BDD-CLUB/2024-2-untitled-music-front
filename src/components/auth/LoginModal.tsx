"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { useAuth } from "@/contexts/auth/AuthContext";
import { cn } from "@/lib/utils";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogHeader>
        <DialogTitle className="hidden">로그인</DialogTitle>
        <DialogDescription className="hidden">
          계속하려면 로그인해주세요
        </DialogDescription>
      </DialogHeader>
      <DialogContent className="max-w-[500px] p-0 overflow-hidden border-none bg-transparent">
        <div className="relative w-full aspect-[1.42/1]">
          {/* 배경 이미지 */}
          <Image
            src="/images/auth-background.svg"
            alt=""
            fill
            priority
            className="object-cover opacity-75"
          />

          {/* 글래스모피즘 오버레이 - 블러 효과 강화 */}
          <div className="absolute inset-0 backdrop-blur-2xl bg-white/20" />

          {/* 추가 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

          {/* 컨텐츠 */}
          <div className="absolute inset-0 flex flex-col">
            {/* 로고와 텍스트 */}
            <div className="flex-1 flex flex-col items-center justify-center px-8">
              <div className="relative mb-6">
                <div className="absolute -inset-4 bg-white/10 rounded-full blur-lg" />
                <Image
                  src="/images/logo.svg"
                  alt="SOFO Logo"
                  width={56}
                  height={56}
                  className="relative drop-shadow-xl animate-pulse-slow"
                />
              </div>
              <h2 className="text-2xl font-medium mb-2 text-white/90 drop-shadow-lg">
                Untitled
              </h2>
              <p className="text-sm text-white/80 text-center drop-shadow mb-8">
                로그인하고 모든 서비스를 이용해보세요!
              </p>

              {/* 로그인 버튼 */}
              <Button
                variant="outline"
                onClick={login}
                className={cn(
                  "w-full max-w-[280px] h-12 rounded-full",
                  "bg-white/5 hover:bg-white/10 border-white/10",
                  "text-white/90 font-medium",
                  "flex items-center justify-center gap-3",
                  "backdrop-blur-sm transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-lg"
                )}
              >
                <FcGoogle className="w-5 h-5 drop-shadow opacity-90" />
                <span className="drop-shadow-sm">Continue with Google</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
