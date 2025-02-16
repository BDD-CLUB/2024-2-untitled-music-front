"use client";

import { Track, useAudio } from "@/contexts/audio/AudioContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatDuration } from "@/lib/format";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Play, X, XCircle } from "lucide-react";
import { TrackActions } from "@/components/albums/TrackActions";

interface QueueTrack {
  uuid: string;
  title: string;
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

interface QueueItemProps {
  id: string;
  track: QueueTrack;
  isActive: boolean;
  index: number;
}

const QueueItem = ({ track, isActive, id }: QueueItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const { removeFromQueue, updateQueueAndPlay, queue } = useAudio();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handlePlay = () => {
    const index = queue.findIndex(t => t.uuid === track.uuid);
    if (index !== -1) {
      updateQueueAndPlay(queue, index);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl",
        "transition-colors duration-200",
        {
          "bg-primary/20": isActive,
          "hover:bg-white/5": !isActive,
        },
        isDragging && "opacity-50"
      )}
    >
      <button
        {...listeners}
        {...attributes}
        className="text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="w-5 h-5" />
      </button>

      <div className="relative w-10 h-10 rounded-lg overflow-hidden group">
        <Image
          src={track.artUrl}
          alt={track.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={handlePlay}
            className="text-white hover:scale-110 transition-transform"
          >
            <Play className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-sm font-medium truncate",
              isActive && "text-primary"
            )}
          >
            {track.title}
          </span>
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {track.artist.name}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          {formatDuration(track.duration)}
        </div>
        <button
          onClick={() => removeFromQueue(Number(id))}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        <TrackActions
          place="main"
          track={track as Track}
        />
      </div>
    </div>
  );
};

export function QueueList() {
  const { queue, queueIndex, setQueue, updateQueueAndIndex } = useAudio();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = Number(active.id);
    const newIndex = Number(over.id);

    const newQueue = arrayMove(queue, oldIndex, newIndex);
    
    if (oldIndex === queueIndex) {
      updateQueueAndIndex(newQueue, newIndex);
    } else {
      setQueue(newQueue);
    }
  };

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p>재생 목록이 비어있습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">재생 목록</h2>
        <button
          onClick={() => setQueue([])}
          className="text-muted-foreground hover:text-destructive transition-colors"
          title="재생 목록 비우기"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={queue.map((_, index) => index.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {queue.map((track, index) => (
              <QueueItem
                key={`${track.uuid}-${index}`}
                id={index.toString()}
                track={track}
                isActive={index === queueIndex}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
} 