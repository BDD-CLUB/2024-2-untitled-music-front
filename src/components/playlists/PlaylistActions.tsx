"use client";

import { MoreVertical, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { checkAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditPlaylistModal } from "./EditPlaylistModal";
import { EditPlaylistImageModal } from "./EditPlaylistImageModal";
import { useRouter, usePathname } from "next/navigation";

interface PlaylistActionsProps {
  playlistId: string;
  playlistImage: string;
}

export function PlaylistActions({ playlistId, playlistImage }: PlaylistActionsProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const revalidateData = useCallback(async () => {
    try {
      await fetch(`/api/revalidate?path=${pathname}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Failed to revalidate:', error);
    }
  }, [pathname]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { accessToken } = await checkAuth();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${playlistId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("플레이리스트 삭제에 실패했습니다.");

      await revalidateData();

      toast({
        title: "플레이리스트 삭제 완료",
        description: "플레이리스트가 삭제되었습니다.",
      });

      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "플레이리스트 삭제 실패",
        description: error instanceof Error ? error.message : "플레이리스트 삭제에 실패했습니다.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={
              "p-2 rounded-full hover:bg-white/5 transition-colors"
            }
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => setShowImageModal(true)}>
            <ImageIcon className="w-4 h-4 mr-2" />
            이미지 변경
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditModal(true)}>
            <Edit2 className="w-4 h-4 mr-2" />
            편집
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDeleteAlert(true)}
            className="text-red-500 focus:text-red-500"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>플레이리스트를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 플레이리스트가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditPlaylistModal
        playlistId={playlistId}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={revalidateData}
      />

      <EditPlaylistImageModal
        playlistId={playlistId}
        playlistImage={playlistImage}
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onSuccess={revalidateData}
      />
    </>
  );
} 