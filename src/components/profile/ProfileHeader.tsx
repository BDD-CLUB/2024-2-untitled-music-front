"use client";

import { useAuth } from "@/contexts/auth/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, MoreVertical, Edit2 } from "lucide-react";
import { LoginModal } from "@/components/auth/LoginModal";
import { EditProfileModal } from "./EditProfileModal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

interface ProfileHeaderProps {
  userId: string;
}

export function ProfileHeader({ userId }: ProfileHeaderProps) {
  const { user } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
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
              <AvatarImage src={user?.artistImage} />
              <AvatarFallback>
                <User className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* 유저 정보 */}
          <div className="pt-20 pl-4 flex items-center gap-4">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            
            {/* 더보기 메뉴 */}
            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-white/10"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    프로필 편집
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </div>
  );
} 