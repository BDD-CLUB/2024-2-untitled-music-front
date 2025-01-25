"use client";

import { Track, useAudio } from "@/contexts/audio/AudioContext";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/format";
import Image from "next/image";
import { Play, Pause, GripVertical } from "lucide-react";
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface QueueItemProps {
  track: Track;
}

function QueueItem({ track }: QueueItemProps) {
  const { currentTrack, isPlaying, play, pause, resume } = useAudio();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track.uuid });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "touch-none",
        isDragging ? "opacity-50" : "",
        transform ? `transform-gpu ${CSS.Transform.toString(transform)}` : "",
        transition ? `transition-transform duration-200` : ""
      )}
    >
      <button
        onClick={() => {
          if (currentTrack?.uuid === track.uuid) {
            isPlaying ? pause() : resume();
          } else {
            play(track.uuid);
          }
        }}
        className={cn(
          "w-full p-3",
          "flex items-center gap-4",
          "rounded-xl",
          "transition-all duration-300",
          "hover:bg-white/5",
          "text-left",
          "group",
          currentTrack?.uuid === track.uuid && "bg-white/5"
        )}
      >
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        <div
          className={cn(
            "relative w-12 h-12",
            "rounded-lg overflow-hidden",
            "bg-white/5",
            "ring-1 ring-white/10",
            "transition-transform duration-300",
            "group-hover:scale-105"
          )}
        >
          <Image
            src={track.artUrl}
            alt={track.title}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div
            className={cn(
              "font-medium truncate",
              currentTrack?.uuid === track.uuid
                ? "text-foreground"
                : "text-muted-foreground",
              "group-hover:text-foreground",
              "transition-colors"
            )}
          >
            {track.title}
          </div>
          <div className="text-sm text-muted-foreground truncate">
            {track.artist.name}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {formatDuration(track.duration)}
          </span>
          {currentTrack?.uuid === track.uuid && (
            <div className="w-8 h-8 flex items-center justify-center">
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

export function QueueList() {
  const { queue, reorder } = useAudio();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = queue.findIndex((track) => track.uuid === active.id);
      const newIndex = queue.findIndex((track) => track.uuid === over.id);
      reorder(oldIndex, newIndex);
    }
  };

  return (
    <div
      className={cn(
        "p-6",
        "bg-background/30 dark:bg-black/20",
        "backdrop-blur-2xl",
        "border border-white/20",
        "rounded-3xl",
        "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
        "h-fit",
        "sticky top-24"
      )}
    >
      <h2 className="text-xl font-semibold mb-6">재생목록</h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={queue.map((track) => track.uuid)}
          strategy={verticalListSortingStrategy}
        >
          <div
            className={cn(
              "space-y-2",
              "max-h-[calc(100vh-16rem)]",
              "overflow-y-auto",
              "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10",
              "pr-2"
            )}
          >
            {queue.map((track) => (
              <QueueItem key={track.uuid} track={track} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
