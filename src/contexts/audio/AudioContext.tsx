"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { arrayMove } from "@dnd-kit/sortable";

export interface Track {
  uuid: string;
  title: string;
  trackUrl: string;
  duration: number;
  artUrl: string;
  lyrics: string;
  artist: {
    uuid: string;
    name: string;
  };
  album: {
    uuid: string;
    title: string;
  };
}

interface AudioState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  repeat: "none" | "one" | "all";
  shuffle: boolean;
}

interface AudioContextType extends AudioState {
  play: (trackId: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  toggleRepeat: () => void;
  toggleShuffle: () => void;
  addTrack: (track: Track) => void;
  removeTrack: (trackId: string) => void;
  clearQueue: () => void;
  reorder: (oldIndex: number, newIndex: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [savedState, setSavedState] = useLocalStorage<AudioState>("audio-state", {
    currentTrack: null,
    queue: [],
    isPlaying: false,
    volume: 1,
    progress: 0,
    duration: 0,
    repeat: "none",
    shuffle: false,
  });

  const [state, setState] = useState<AudioState>(savedState);
  const audioRef = useRef<HTMLAudioElement | null>(new Audio());

  // 로컬 스토리지에 상태 저장
  useEffect(() => {
    setSavedState(state);
  }, [state, setSavedState]);

  // 트랙 재생
  const play = useCallback(
    async (trackId: string) => {
      const track = state.queue.find((t) => t.uuid === trackId);
      if (!track) {
        console.error("Track not found in the queue:", trackId);
        return;
      }

      try {
        if (audioRef.current) {
          audioRef.current.src = track.trackUrl;
          await audioRef.current.play();

          setState((prev) => ({
            ...prev,
            currentTrack: track,
            isPlaying: true,
            progress: 0,
            duration: track.duration,
          }));
        }
      } catch (error) {
        console.error("Error playing track:", error);
      }
    },
    [state.queue]
  );

  // 재생 일시정지
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  }, []);

  // 재생 재개
  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setState((prev) => ({ ...prev, isPlaying: true }));
      });
    }
  }, []);

  // 다음 트랙 재생
  const next = useCallback(() => {
    const currentIndex = state.queue.findIndex(
      (t) => t.uuid === state.currentTrack?.uuid
    );
    const nextIndex = (currentIndex + 1) % state.queue.length;
    const nextTrack = state.queue[nextIndex];

    if (nextTrack) {
      play(nextTrack.uuid);
    }
  }, [state.queue, state.currentTrack, play]);

  // 이전 트랙 재생
  const previous = useCallback(() => {
    const currentIndex = state.queue.findIndex(
      (t) => t.uuid === state.currentTrack?.uuid
    );
    const previousIndex = (currentIndex - 1 + state.queue.length) % state.queue.length;
    const previousTrack = state.queue[previousIndex];
    if (previousTrack) {
      play(previousTrack.uuid);
    }
  }, [state.queue, state.currentTrack, play]);

  // 볼륨 변경
  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    setState((prev) => ({ ...prev, volume }));
  };

  // 재생 위치 이동
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
    setState((prev) => ({ ...prev, progress: time }));
  };

  // 반복 모드 토글
  const toggleRepeat = () => {
    const modes: ("none" | "one" | "all")[] = ["none", "one", "all"];
    const nextMode = modes[(modes.indexOf(state.repeat) + 1) % modes.length];
    setState((prev) => ({ ...prev, repeat: nextMode }));
  };

  // 셔플 토글
  const toggleShuffle = () => {
    setState((prev) => ({ ...prev, shuffle: !prev.shuffle }));
  };

  // 트랙 추가
  const addTrack = (track: Track) => {
    setState((prev) => ({ ...prev, queue: [...prev.queue, track] }));
  };

  // 트랙 제거
  const removeTrack = (trackId: string) => {
    setState((prev) => ({
      ...prev,
      queue: prev.queue.filter((track) => track.uuid !== trackId),
    }));
  };

  // 큐 초기화
  const clearQueue = () => {
    setState((prev) => ({ ...prev, queue: [] }));
  };

  const reorder = (oldIndex: number, newIndex: number) => {
    setState((prev) => {
      const newQueue = arrayMove(prev.queue, oldIndex, newIndex);
      return { ...prev, queue: newQueue };
    });
  };

  return (
    <AudioContext.Provider
      value={{
        ...state,
        play,
        pause,
        resume,
        previous,
        next,
        setVolume,
        seek,
        toggleRepeat,
        toggleShuffle,
        addTrack,
        removeTrack,
        clearQueue,
        reorder,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};