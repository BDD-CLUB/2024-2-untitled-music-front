"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, MoreVertical, Edit, UserPen } from "lucide-react";
import { useState, useEffect } from "react";
import { EditProfileModal } from "./EditProfileModal";
import { useAuth } from "@/contexts/auth/AuthContext";
import { useUser } from "@/contexts/auth/UserContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditProfileInfoModal } from "./EditProfileInfoModal";

interface ProfileHeaderProps {
  userId: string;
}

interface ProfileData {
  uuid: string;
  name: string;
  role: "ROLE_USER";
  email: string;
  artistImage: string;
}

export function ProfileHeader({ userId }: ProfileHeaderProps) {
  const { isAuthenticated } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditInfoModal, setShowEditInfoModal] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isOwner = isAuthenticated && user?.uuid === userId;

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/artists/${userId}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("프로필 정보를 불러오는데 실패했습니다.");
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "프로필 정보 로딩 실패",
          description:
            error instanceof Error
              ? error.message
              : "프로필 정보를 불러오는데 실패했습니다.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, toast]);

  if (isLoading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
        <div className="relative px-8 py-16">
          <div className="flex flex-col items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-white/5 animate-pulse" />
            <div className="w-48 h-6 bg-white/5 rounded animate-pulse" />
            <div className="w-64 h-4 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) return null;

  return (
    <div className="relative">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />

      {/* 프로필 정보 */}
      <div className="relative px-8 py-16">
        <div className="flex flex-col items-center gap-6">
          {/* 프로필 이미지 */}
          <div className="relative group">
            <div className="absolute -inset-4 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm" />
            <Avatar className="w-40 h-40 border-2 border-white/10 relative transition-transform group-hover:scale-[1.02] duration-500">
              <AvatarImage src={profileData.artistImage} />
              <AvatarFallback>
                <User className="w-16 h-16" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* 이름과 이메일 */}
          <div className="text-center">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{profileData.name}</h1>
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
                  <DropdownMenuContent align="start" className="w-40">
                    <DropdownMenuItem onClick={() => setShowEditModal(true)} className="text-sm">
                      <Edit className="w-4 h-4 mr-2" />
                      이미지 변경
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowEditInfoModal(true)} className="text-sm">
                      <UserPen className="w-4 h-4 mr-2" />
                      프로필 수정
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>

      {isOwner && (
        <>
          <EditProfileModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
          />
          <EditProfileInfoModal
            isOpen={showEditInfoModal}
            onClose={() => setShowEditInfoModal(false)}
          />
        </>
      )}
    </div>
  );
}
