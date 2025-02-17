"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

export interface Track {
  uuid: string;
  title: string;
  trackUrl: string;
  lyric: string;
  duration: number;
  artUrl: string;
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
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
}

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

interface AudioContextType extends AudioState {
  play: (trackId: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  queue: QueueTrack[];
  queueIndex: number;
  setQueue: (newQueue: QueueTrack[]) => void;
  addToQueue: (track: QueueTrack) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
  updateQueueAndPlay: (newQueue: QueueTrack[], index: number) => Promise<void>;
  updateQueueAndIndex: (newQueue: QueueTrack[], newIndex: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AudioState>({
    currentTrack: null,
    isPlaying: false,
    volume: 1,
    progress: 0,
    duration: 0,
  });

  const [queue, setQueue] = useState<QueueTrack[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // 트랙 정보 가져오기
  const fetchTrack = useCallback(async (trackId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tracks/${trackId}`
      );

      if (!response.ok) throw new Error("트랙을 불러오는데 실패했습니다.");

      const data = await response.json();
      return {
        uuid: data.trackResponseDto.uuid,
        title: data.trackResponseDto.title,
        trackUrl: data.trackResponseDto.trackUrl,
        lyric: data.trackResponseDto.lyric,
        duration: data.trackResponseDto.duration,
        artUrl: data.trackResponseDto.artUrl,
        artist: {
          uuid: data.artistResponseDto.uuid,
          name: data.artistResponseDto.name,
        },
        album: {
          uuid: data.albumResponseDto.uuid,
          title: data.albumResponseDto.title,
        },
      };
    } catch (error) {
      console.error("Failed to fetch track:", error);
      throw error;
    }
  }, []);

  // 재생 시작
  const play = useCallback(
    async (trackId: string) => {
      try {
        const track = await fetchTrack(trackId);

        if (audioRef.current) {
          audioRef.current.src = track.trackUrl;
          audioRef.current.volume = state.volume;
          await audioRef.current.play();

          setState((prev) => ({
            ...prev,
            currentTrack: track,
            isPlaying: true,
            duration: track.duration,
          }));
        }
      } catch (error) {
        console.error("Failed to play track:", error);
      }
    },
    [fetchTrack, state.volume]
  );

  // 일시 정지
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false }));
    }
  }, []);

  // 재생 재개
  const resume = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      setState((prev) => ({ ...prev, isPlaying: true }));
    }
  }, []);

  // 볼륨 조절
  const setVolume = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setState((prev) => ({ ...prev, volume }));
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
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setState((prev) => ({
            ...prev,
            progress: audioRef.current?.currentTime || 0,
          }));
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isPlaying]);

  // 오디오 엘리먼트 생성
  useEffect(() => {
    audioRef.current = new Audio();

    // 트랙 종료 시 다음 트랙 재생
    const handleTrackEnd = () => {
      if (queue.length > queueIndex + 1) {
        // 다음 트랙이 있으면 재생
        const nextTrack = queue[queueIndex + 1];
        setQueueIndex((prev) => prev + 1);
        play(nextTrack.uuid);
      } else {
        // 마지막 트랙이면 재생 중지
        setState((prev) => ({
          ...prev,
          isPlaying: false,
        }));
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleTrackEnd);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleTrackEnd);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [queue, queueIndex, play]);

  // 큐 관리 함수들
  const addToQueue = useCallback(
    (track: QueueTrack) => {
      setQueue((prev) => {
        if (prev.length === 0) {
          play(track.uuid);
        }
        return [...prev, track];
      });
    },
    [play]
  );

  const removeFromQueue = useCallback(
    (index: number) => {
      setQueue((prev) => {
        const newQueue = [...prev];
        newQueue.splice(index, 1);

        if (index === queueIndex && newQueue.length > 0) {
          const nextTrack = newQueue[index] || newQueue[0];
          play(nextTrack.uuid);
        }

        return newQueue;
      });
    },
    [queueIndex, play]
  );

  const clearQueue = useCallback(() => {
    setQueue([]);
    setQueueIndex(0);
    setState((prev) => ({
      ...prev,
      currentTrack: null,
      isPlaying: false,
    }));
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, []);

  const playNext = useCallback(() => {
    if (queue.length > queueIndex + 1) {
      const nextTrack = queue[queueIndex + 1];
      setQueueIndex((prev) => prev + 1);
      play(nextTrack.uuid);
    }
  }, [queue, queueIndex, play]);

  const playPrevious = useCallback(() => {
    if (audioRef.current) {
      // 현재 재생 시간이 3초 이상이면 처음으로 되돌림
      if (audioRef.current.currentTime >= 3) {
        audioRef.current.currentTime = 0;
        setState((prev) => ({
          ...prev,
          progress: 0,
        }));
      }
      // 3초 미만이고 이전 트랙이 있으면 이전 트랙 재생
      else if (queueIndex > 0) {
        const prevTrack = queue[queueIndex - 1];
        setQueueIndex((prev) => prev - 1);
        play(prevTrack.uuid);
      }
      // 3초 미만이지만 이전 트랙이 없으면 현재 트랙을 처음으로
      else {
        audioRef.current.currentTime = 0;
        setState((prev) => ({
          ...prev,
          progress: 0,
        }));
      }
    }
  }, [queueIndex, queue, play]);

  const updateQueueAndPlay = useCallback(
    async (newQueue: QueueTrack[], index: number) => {
      if (index >= 0 && index < newQueue.length) {
        setQueue(newQueue);
        setQueueIndex(index);
        await play(newQueue[index].uuid);
      }
    },
    [play]
  );

  const updateQueueAndIndex = useCallback(
    (newQueue: QueueTrack[], newIndex: number) => {
      // 현재 재생 중인 트랙 정보 저장
      const currentTrackUuid = state.currentTrack?.uuid;
      const wasPlaying = state.isPlaying;
      const currentTime = audioRef.current?.currentTime || 0;

      setQueue(newQueue);
      setQueueIndex(newIndex);

      // 현재 트랙이 있고 재생 중이었다면, 같은 상태를 유지
      if (currentTrackUuid && wasPlaying) {
        const newTrack = newQueue[newIndex];
        
        // 같은 트랙이면 재생 상태와 시간을 유지
        if (newTrack.uuid === currentTrackUuid && audioRef.current) {
          audioRef.current.currentTime = currentTime;
          if (wasPlaying) {
            audioRef.current.play();
          }
        } 
        // 다른 트랙이면 새로운 트랙 재생
        else {
          play(newTrack.uuid);
        }
      }
    },
    [state.currentTrack?.uuid, state.isPlaying, play]
  );

  // setQueue 함수도 수정
  const setQueueWrapper = useCallback((newQueue: QueueTrack[]) => {
    // 현재 재생 중인 트랙이 있다면
    if (state.currentTrack) {
      const currentTrackUuid = state.currentTrack.uuid;
      const newIndex = newQueue.findIndex(track => track.uuid === currentTrackUuid);
      
      // 새 큐에서 현재 트랙을 찾을 수 있다면
      if (newIndex !== -1) {
        updateQueueAndIndex(newQueue, newIndex);
      } else {
        // 현재 트랙이 새 큐에 없다면 그냥 큐만 업데이트
        setQueue(newQueue);
      }
    } else {
      // 재생 중인 트랙이 없다면 그냥 큐만 업데이트
      setQueue(newQueue);
    }
  }, [state.currentTrack, updateQueueAndIndex]);

  const value = {
    ...state,
    play,
    pause,
    resume,
    setVolume,
    seek,
    queue,
    queueIndex,
    setQueue: setQueueWrapper,
    addToQueue,
    removeFromQueue,
    clearQueue,
    playNext,
    playPrevious,
    updateQueueAndPlay,
    updateQueueAndIndex,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
