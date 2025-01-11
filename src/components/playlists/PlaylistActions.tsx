"use client";

import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
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
import { api } from "@/lib/axios";

interface PlaylistActionsProps {
  playlistId: string;
}

export function PlaylistActions({ playlistId }: PlaylistActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await api.delete(`/playlists/${playlistId}`);

      if (response.status !== 200) {
        if (response.status === 401) {
          throw new Error('권한이 없습니다.');
        }
        throw new Error('플레이리스트 삭제에 실패했습니다.');
      }

      toast({
        variant: "default",
        title: "플레이리스트 삭제 완료",
        description: "플레이리스트가 삭제되었습니다.",
      });

      router.push('/');
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "플레이리스트 삭제 실패",
        description: error instanceof Error ? error.message : "플레이리스트 삭제에 실패했습니다.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/10"
          onClick={() => setShowEditModal(true)}
        >
          <Edit2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-white/10"
          onClick={() => setShowDeleteDialog(true)}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>플레이리스트를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
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
      />
    </>
  );
} 