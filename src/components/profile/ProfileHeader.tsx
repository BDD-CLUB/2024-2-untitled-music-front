"use client";

import { useAuth } from "@/contexts/auth/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
import { useState, useEffect } from "react";

interface ProfileHeaderProps {
  userId: string;
}

export function ProfileHeader({ userId }: ProfileHeaderProps) {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const isOwner = user?.uuid === userId;

  useEffect(() => {
    if (!user && isOwner) {
      setShowLoginModal(true);
    }
  }, [user, isOwner]);

  if (!user) {
    return (
      <>
        <div className="relative">
          {/* 배경 이미지 */}
          <div className="h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />

          {/* 프로필 정보 */}
          <div className="px-8 pb-8">
            <div className="relative flex gap-6 items-end">
              {/* 프로필 이미지 */}
              <div className="absolute -top-16">
                <Avatar className="w-32 h-32 border-4 border-white/10 shadow-xl">
                  <AvatarFallback>
                    <User className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* 유저 정보 */}
              <div className="pt-20">
                <h1 className="text-2xl font-bold">로그인이 필요합니다</h1>
              </div>
            </div>
          </div>
        </div>

        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </>
    );
  }

  return (
    <div className="relative">
      {/* 배경 이미지 */}
      <div className="h-48 bg-gradient-to-r from-purple-500/20 to-pink-500/20" />

      {/* 프로필 정보 */}
      <div className="px-8 pb-8">
        <div className="relative flex gap-6 items-end">
          {/* 프로필 이미지 */}
          <div className="absolute -top-16">
            <Avatar className="w-32 h-32 border-4 border-white/10 shadow-xl">
              <AvatarImage src={user.artistImage} />
              <AvatarFallback>
                <User className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* 유저 정보 */}
          <div className="pt-20">
            <h1 className="text-2xl font-bold">{user.name}</h1>
          </div>
        </div>
      </div>
    </div>
  );
} 