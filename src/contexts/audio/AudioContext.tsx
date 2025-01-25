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
  queueHistory: Track[];
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
  add: (track: Track) => void;
  remove: (trackId: string) => void;
  clear: () => void;
  reorder: (fromIndex: number, toIndex: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  // 로컬 스토리지에서 상태 복원
  const [savedState, setSavedState] = useLocalStorage<Partial<AudioState>>(
    "audio-state",
    {
      currentTrack: null,
      queue: [],
      queueHistory: [],
      progress: 0,
      repeat: "none",
      shuffle: false,
    }
  );

  const [savedVolume, setSavedVolume] = useLocalStorage("audio-volume", 1);

  const [state, setState] = useState<AudioState>({
    currentTrack: savedState.currentTrack || null,
    queue: savedState.queue || [],
    queueHistory: savedState.queueHistory || [],
    isPlaying: false, // 새로고침 시 일시정지 상태로 시작
    volume: savedVolume,
    progress: savedState.progress || 0,
    duration: savedState.currentTrack?.duration || 0,
    repeat: savedState.repeat || "none",
    shuffle: savedState.shuffle || false,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timer>();

  // 셔플된 재생 목록을 저장
  const shuffledQueueRef = useRef<Track[]>([]);

  // 셔플 큐 생성
  const generateShuffledQueue = useCallback(() => {
    const queue = [...state.queue];
    for (let i = queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [queue[i], queue[j]] = [queue[j], queue[i]];
    }
    shuffledQueueRef.current = queue;
  }, [state.queue]);

  // 셔플 상태가 변경될 때 큐 재생성
  useEffect(() => {
    if (state.shuffle) {
      generateShuffledQueue();
    }
  }, [state.shuffle, generateShuffledQueue]);

  // 다음 트랙 가져오기 로직 개선
  const getNextTrack = useCallback(() => {
    if (state.repeat === "one") return state.currentTrack;

    const currentQueue = state.shuffle ? shuffledQueueRef.current : state.queue;
    const currentIndex = currentQueue.findIndex(
      (t) => t.uuid === state.currentTrack?.uuid
    );

    if (currentIndex === -1) return currentQueue[0];
    if (currentIndex < currentQueue.length - 1)
      return currentQueue[currentIndex + 1];
    if (state.repeat === "all") return currentQueue[0];
    return null;
  }, [state.currentTrack, state.queue, state.repeat, state.shuffle]);

  // 큐 관리 함수들 추가
  const queueActions = {
    add: (track: Track) => {
      setState((prev) => {
        const newQueue = [...prev.queue, track];
        if (prev.shuffle) {
          const randomIndex = Math.floor(
            Math.random() * (shuffledQueueRef.current.length + 1)
          );
          shuffledQueueRef.current.splice(randomIndex, 0, track);
        } else {
          shuffledQueueRef.current = [...shuffledQueueRef.current, track];
        }
        return { ...prev, queue: newQueue };
      });
    },
    remove: (trackId: string) => {
      setState((prev) => {
        const newQueue = prev.queue.filter((t) => t.uuid !== trackId);
        if (prev.shuffle) {
          shuffledQueueRef.current = shuffledQueueRef.current.filter(
            (t) => t.uuid !== trackId
          );
        }
        return { ...prev, queue: newQueue };
      });
    },
    clear: () => {
      setState((prev) => ({ ...prev, queue: [], queueHistory: [] }));
      shuffledQueueRef.current = [];
    },
    reorder: (fromIndex: number, toIndex: number) => {
      setState((prev) => {
        const newQueue = [...prev.queue];
        const [moved] = newQueue.splice(fromIndex, 1);
        newQueue.splice(toIndex, 0, moved);
        return { ...prev, queue: newQueue };
      });
    },
  };

  // 상태 저장 로직 개선
  useEffect(() => {
    setSavedState({
      currentTrack: state.currentTrack,
      queue: state.queue,
      queueHistory: state.queueHistory,
      progress: state.progress,
      repeat: state.repeat,
      shuffle: state.shuffle,
    });
  }, [
    state.currentTrack,
    state.queue,
    state.queueHistory,
    state.progress,
    state.repeat,
    state.shuffle,
    setSavedState,
  ]);

  // 초기 재생 위치 설정
  useEffect(() => {
    if (audioRef.current && state.currentTrack) {
      audioRef.current.src = state.currentTrack.trackUrl;
      audioRef.current.currentTime = state.progress;
    }
  }, [state.currentTrack, state.progress]);

  // 페이지 언로드 시 현재 재생 위치 저장
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (audioRef.current) {
        setState((prev) => ({
          ...prev,
          progress: audioRef.current?.currentTime || prev.progress,
        }));
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // 재생 관련 함수들
  const play = useCallback(async (trackId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tracks/${trackId}`
      );
      if (!response.ok) throw new Error("Failed to fetch track");
      const track = await response.json();

      // 오디오 로드 실패 시 처리
      if (audioRef.current) {
        audioRef.current.onerror = () => {
          setState((prev) => ({ ...prev, isPlaying: false }));
          console.error("Failed to load audio");
        };
      }

      // 트랙을 재생 큐에 추가 (이미 있는 경우 제외)
      if (!state.queue.find((t) => t.uuid === track.uuid)) {
        setState((prev) => ({
          ...prev,
          queue: [
            ...prev.queue,
            {
              uuid: track.uuid,
              title: track.title,
              trackUrl: track.trackUrl,
              duration: track.duration,
              artUrl: track.artUrl,
              lyrics: track.lyrics,
              artist: {
                uuid: track.artist.uuid,
                name: track.artist.name,
              },
              album: {
                uuid: track.album.uuid,
                title: track.album.title,
              },
            },
          ],
        }));
      }

      setState((prev) => ({ ...prev, currentTrack: track, isPlaying: true }));

      if (audioRef.current) {
        audioRef.current.src = track.trackUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Failed to play track:", error);
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  }, [state.queue]);

  // handleTrackEnd를 useCallback으로 감싸기
  const handleTrackEnd = useCallback(() => {
    const nextTrack = getNextTrack();
    if (nextTrack) {
      play(nextTrack.uuid);
    } else {
      setState((prev) => ({ ...prev, isPlaying: false, progress: 0 }));
    }
  }, [getNextTrack, play]);

  const next = () => {
    const nextTrack = getNextTrack();
    if (nextTrack) play(nextTrack.uuid);
  };

  const previous = () => {
    const currentIndex = state.queue.findIndex(
      (t) => t.uuid === state.currentTrack?.uuid
    );
    if (currentIndex > 0) {
      play(state.queue[currentIndex - 1].uuid);
    }
  };

  const toggleRepeat = () => {
    setState((prev) => {
      const modes: ("none" | "one" | "all")[] = ["none", "one", "all"];
      const currentIndex = modes.indexOf(prev.repeat);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      return { ...prev, repeat: nextMode };
    });
  };

  const toggleShuffle = () => {
    setState((prev) => {
      const newShuffle = !prev.shuffle;
      if (newShuffle) {
        const currentTrackIndex = prev.queue.findIndex(
          (t) => t.uuid === prev.currentTrack?.uuid
        );
        const remainingTracks = [...prev.queue];
        if (currentTrackIndex !== -1) {
          remainingTracks.splice(currentTrackIndex, 1);
        }
        // 현재 트랙을 제외한 나머지 트랙들만 섞기
        for (let i = remainingTracks.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [remainingTracks[i], remainingTracks[j]] = [
            remainingTracks[j],
            remainingTracks[i],
          ];
        }
        // 현재 트랙을 맨 앞에 추가
        if (prev.currentTrack) {
          remainingTracks.unshift(prev.currentTrack);
        }
        shuffledQueueRef.current = remainingTracks;
      }
      return { ...prev, shuffle: newShuffle };
    });
  };

  // 볼륨 변경 시 로컬 스토리지에 저장
  const setVolume = (volume: number) => {
    setState((prev) => ({ ...prev, volume }));
    setSavedVolume(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  // 재생 일시 정지
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  };

  // 재생 재개
  const resume = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setState((prev) => ({ ...prev, isPlaying: true }));
    }
  };

  // 재생 위치 이동
  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState((prev) => ({ ...prev, progress: time }));
    }
  };

  // 진행 상태 업데이트
  useEffect(() => {
    if (state.isPlaying) {
      const updateProgress = () => {
        if (audioRef.current) {
          setState((prev) => {
            const newProgress = audioRef.current?.currentTime || 0;
            // 이전 progress와 같으면 업데이트 하지 않음
            return newProgress !== prev.progress
              ? { ...prev, progress: newProgress }
              : prev;
          });
        }
      };

      progressInterval.current = setInterval(updateProgress, 1000);
      return () => clearInterval(progressInterval.current as NodeJS.Timeout);
    }
  }, [state.isPlaying]);

  // 오디오 엘리먼트 생성 및 이벤트 리스너 설정
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = savedVolume;

    const handleMetadataLoad = () => {
      setState((prev) => ({
        ...prev,
        duration: audioRef.current?.duration || 0,
      }));
    };

    const handleError = () => {
      console.error("Audio playback error");
      setState((prev) => ({ ...prev, isPlaying: false }));
    };

    audioRef.current.addEventListener("loadedmetadata", handleMetadataLoad);
    audioRef.current.addEventListener("error", handleError);
    audioRef.current.addEventListener("ended", handleTrackEnd);

    // 이전 재생 상태 복원
    if (state.currentTrack) {
      audioRef.current.src = state.currentTrack.trackUrl;
      audioRef.current.currentTime = state.progress;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleMetadataLoad
        );
        audioRef.current.removeEventListener("error", handleError);
        audioRef.current.removeEventListener("ended", handleTrackEnd);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [savedVolume, state.currentTrack, state.progress, handleTrackEnd]);

  return (
    <AudioContext.Provider
      value={{
        ...state,
        ...queueActions,
        play,
        pause,
        resume,
        next,
        previous,
        setVolume,
        seek,
        toggleRepeat,
        toggleShuffle,
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
