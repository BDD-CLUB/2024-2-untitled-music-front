"use client";

import { MoreVertical, Edit2, Trash2, Plus, Trash, PlayCircle, ListPlus, Forward, Info } from "lucide-react";
import { useState } from "react";
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
import { EditTrackModal } from "./EditTrackModal";
import { AddToPlaylistModal } from "../tracks/AddToPlaylistModal";
import { useRouter } from "next/navigation";
import { useAudio } from "@/contexts/audio/AudioContext";
import { TrackInfo } from "../tracks/TrackInfo";

interface Track {
  uuid: string;
  title: string;
  lyric: string;
  artUrl: string;
  trackUrl: string;
  duration: number;
  artist: {
    uuid: string;
    name: string;
  };
  album: {
    uuid: string;
    title: string;
  };
}

interface TrackActionsProps {
  place: "main" | "album" | "playlist" | "profile";
  track: Track;
  isOwner?: boolean;
  playlistId?: string;
  playlistItemId?: string;
  onUpdate?: (track: Track) => void;
  onDelete?: (trackId: string) => void;
}

export function TrackActions({
  place,
  track,
  isOwner,
  playlistId,
  playlistItemId,
  onUpdate,
  onDelete,
}: TrackActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showDeleteFromPlaylistDialog, setShowDeleteFromPlaylistDialog] =
    useState(false);
  const [isDeletingFromPlaylist, setIsDeletingFromPlaylist] = useState(false);

  const { addToQueue, queue, queueIndex, updateQueue } = useAudio();

  const [showTrackInfo, setShowTrackInfo] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const { accessToken } = await checkAuth();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tracks/${track.uuid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("트랙 삭제에 실패했습니다.");

      onDelete?.(track.uuid);
      toast({
        title: "트랙 삭제 완료",
        variant: "default",
        description: "트랙이 삭제되었습니다.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "트랙 삭제 실패",
        description:
          error instanceof Error ? error.message : "트랙 삭제에 실패했습니다.",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDeleteFromPlaylist = async () => {
    try {
      setIsDeletingFromPlaylist(true);
      const { accessToken } = await checkAuth();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/playlists/${playlistId}/tracks`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            removedItemUuids: [playlistItemId],
            newTrackUuids: [],
          }),
        }
      );

      if (!response.ok) throw new Error("플레이리스트 삭제에 실패했습니다.");

      onDelete?.(track.uuid);
      router.refresh();

      toast({
        title: "플레이리스트에서 트랙 삭제 완료",
        variant: "default",
        description: "플레이리스트에서 트랙이 삭제되었습니다.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "플레이리스트에서 트랙 삭제 실패",
        description:
          error instanceof Error
            ? error.message
            : "플레이리스트에서 트랙 삭제에 실패했습니다.",
      });
    } finally {
      setIsDeletingFromPlaylist(false);
      setShowDeleteFromPlaylistDialog(false);
    }
  };

  const handlePlay = () => {
    const queueTrack = {
      uuid: track.uuid,
      title: track.title,
      artUrl: track.artUrl,
      trackUrl: track.trackUrl,
      duration: track.duration,
      artist: track.artist,
      album: track.album,
    };
    addToQueue(queueTrack);
  };

  const handlePlayNext = () => {
    const queueTrack = {
      uuid: track.uuid,
      title: track.title,
      artUrl: track.artUrl,
      trackUrl: track.trackUrl,
      duration: track.duration,
      artist: track.artist,
      album: track.album,
    };

    const newQueue = [...queue];
    if (queue.length === 0) {
      addToQueue(queueTrack);
    } else {
      newQueue.splice(queueIndex + 1, 0, queueTrack);
      updateQueue(newQueue);
    }
  };

  const handleAddToLast = () => {
    const queueTrack = {
      uuid: track.uuid,
      title: track.title,
      artUrl: track.artUrl,
      trackUrl: track.trackUrl,
      duration: track.duration,
      artist: track.artist,
      album: track.album,
    };
    
    const newQueue = [...queue, queueTrack];
    updateQueue(newQueue);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="p-2 hover:bg-white/5 rounded-full">
            <MoreVertical className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={handlePlay}>
            <PlayCircle className="w-4 h-4 mr-2" />
            재생
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePlayNext}>
            <Forward className="w-4 h-4 mr-2" />
            다음에 재생
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleAddToLast}>
            <ListPlus className="w-4 h-4 mr-2" />
            마지막에 추가
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setShowAddToPlaylistModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            플레이리스트에 추가
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setShowTrackInfo(true)}>
            <Info className="w-4 h-4 mr-2" />
            트랙 정보
          </DropdownMenuItem>

          {place === "playlist" && isOwner && playlistId && (
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onClick={() => setShowDeleteFromPlaylistDialog(true)}
            >
              <Trash className="w-4 h-4 mr-2" />
              플레이리스트에서 삭제
            </DropdownMenuItem>
          )}

          {place === "album" || place === "profile" && isOwner && (
            <>
              <DropdownMenuItem onClick={() => setShowEditModal(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                수정
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-red-500 focus:text-red-500"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>트랙을 삭제하시겠습니까?</AlertDialogTitle>
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

      <AlertDialog
        open={showDeleteFromPlaylistDialog}
        onOpenChange={setShowDeleteFromPlaylistDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              트랙을 플레이리스트에서 삭제하시겠습니까?
            </AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFromPlaylist}
              disabled={isDeletingFromPlaylist}
              className="bg-destructive hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditTrackModal
        track={track}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={(track) => {
          onUpdate?.(track as Track);
        }}
      />

      <AddToPlaylistModal
        trackId={track.uuid}
        isOpen={showAddToPlaylistModal}
        onClose={() => setShowAddToPlaylistModal(false)}
      />

      <TrackInfo
        track={track}
        isOpen={showTrackInfo}
        onClose={() => setShowTrackInfo(false)}
      />
    </>
  );
}
