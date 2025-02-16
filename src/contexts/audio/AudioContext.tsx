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
  repeat: 'none' | 'all' | 'one';
  shuffle: boolean;
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
  toggleRepeat: () => void;
  toggleShuffle: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AudioState>({
    currentTrack: null,
    isPlaying: false,
    volume: 1,
    progress: 0,
    duration: 0,
    repeat: 'none',
    shuffle: false,
  });

  const [queue, setQueue] = useState<QueueTrack[]>([]);
  const [queueIndex, setQueueIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // 셔플된 큐 인덱스 배열 저장
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

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

  // 트랙 종료 시 다음 트랙 재생 로직
  useEffect(() => {
    audioRef.current = new Audio();

    const handleTrackEnd = () => {
      if (state.repeat === 'one') {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play();
          setState(prev => ({ ...prev, isPlaying: true }));
        }
      } else {
        const hasNextTrack = state.shuffle 
          ? shuffledIndices.indexOf(queueIndex) < shuffledIndices.length - 1
          : queueIndex < queue.length - 1;
        
        if (hasNextTrack) {
          const nextIndex = state.shuffle
            ? shuffledIndices[shuffledIndices.indexOf(queueIndex) + 1]
            : queueIndex + 1;
          setQueueIndex(nextIndex);
          play(queue[nextIndex].uuid);
        } else if (state.repeat === 'all') {
          const newIndex = state.shuffle ? shuffledIndices[0] : 0;
          setQueueIndex(newIndex);
          play(queue[newIndex].uuid);
        } else {
          setState(prev => ({ ...prev, isPlaying: false }));
        }
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleTrackEnd);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleTrackEnd);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [state.repeat, state.shuffle, queue, queueIndex, shuffledIndices, play]);

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

  // playNext 함수도 수정
  const playNext = useCallback(() => {
    if (state.shuffle) {
      const currentShuffleIndex = shuffledIndices.indexOf(queueIndex);
      if (currentShuffleIndex < shuffledIndices.length - 1) {
        const nextIndex = shuffledIndices[currentShuffleIndex + 1];
        setQueueIndex(nextIndex);
        play(queue[nextIndex].uuid);
      } else if (state.repeat === 'all') {
        setQueueIndex(shuffledIndices[0]);
        play(queue[shuffledIndices[0]].uuid);
      }
    } else {
      if (queueIndex < queue.length - 1) {
        const nextTrack = queue[queueIndex + 1];
        setQueueIndex(prev => prev + 1);
        play(nextTrack.uuid);
      } else if (state.repeat === 'all') {
        setQueueIndex(0);
        play(queue[0].uuid);
      }
    }
  }, [queue, queueIndex, play, state.shuffle, state.repeat, shuffledIndices]);

  const playPrevious = useCallback(() => {
    if (audioRef.current) {
      // 현재 재생 시간이 3초 이상이면 처음으로 되돌림
      if (audioRef.current.currentTime >= 3) {
        audioRef.current.currentTime = 0;
        setState(prev => ({
          ...prev,
          progress: 0
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
        setState(prev => ({
          ...prev,
          progress: 0
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

  const updateQueueAndIndex = useCallback((newQueue: QueueTrack[], newIndex: number) => {
    setQueue(newQueue);
    setQueueIndex(newIndex);
    if (state.isPlaying && audioRef.current) {
      audioRef.current.play();
    }
  }, [state.isPlaying]);

  // 반복 모드 토글
  const toggleRepeat = useCallback(() => {
    setState(prev => {
      if (state.isPlaying && audioRef.current) {
        audioRef.current.play();
      }
      return {
        ...prev,
        repeat: prev.repeat === 'none' ? 'all' : prev.repeat === 'all' ? 'one' : 'none'
      };
    });
  }, [state.isPlaying]);

  // 셔플 모드 토글
  const toggleShuffle = useCallback(() => {
    setState(prev => {
      const newShuffle = !prev.shuffle;
      if (newShuffle) {
        const indices = Array.from({ length: queue.length }, (_, i) => i);
        const currentIndex = indices.splice(queueIndex, 1)[0];
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        indices.unshift(currentIndex);
        setShuffledIndices(indices);
      }
      if (state.isPlaying && audioRef.current) {
        audioRef.current.play();
      }
      return { ...prev, shuffle: newShuffle };
    });
  }, [queue.length, queueIndex, state.isPlaying]);

  const value = {
    ...state,
    play,
    pause,
    resume,
    setVolume,
    seek,
    queue,
    queueIndex,
    setQueue,
    addToQueue,
    removeFromQueue,
    clearQueue,
    playNext,
    playPrevious,
    updateQueueAndPlay,
    updateQueueAndIndex,
    toggleRepeat,
    toggleShuffle,
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
