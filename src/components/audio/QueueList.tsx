"use client";

import { useAudio } from "@/contexts/audio/AudioContext";
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
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Play } from "lucide-react";

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
  const { playFromQueue } = useAudio();

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl",
        "transition-colors duration-200",
        "hover:bg-white/5",
        isActive && "bg-white/5",
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

      <div className="relative w-10 h-10 rounded-lg overflow-hidden">
        <Image
          src={track.artUrl}
          alt={track.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => playFromQueue(Number(id))}
            className={cn(
              "text-sm font-medium truncate hover:underline",
              isActive && "text-primary"
            )}
          >
            {track.title}
          </button>
          {isActive && <Play className="w-3 h-3 fill-current" />}
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {track.artist.name}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {formatDuration(track.duration)}
      </div>
    </div>
  );
};

export function QueueList() {
  const { queue, queueIndex, updateQueue } = useAudio();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = Number(active.id);
      const newIndex = Number(over.id);

      const newQueue = arrayMove(queue, oldIndex, newIndex);
      updateQueue(newQueue);
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
  );
} 