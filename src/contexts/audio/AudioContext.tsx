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
  audioRef: React.RefObject<HTMLAudioElement>;
  setAudioRef: (element: HTMLAudioElement) => void;
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
      console.log('Play called for track:', trackId);
      try {
        console.log('Setting isPlaying to false');
        setState(prev => ({ ...prev, isPlaying: false }));
        
        console.log('Fetching track data...');
        const track = await fetchTrack(trackId);
        console.log('Track data received:', track.title);

        if (audioRef.current) {
          console.log('Setting audio source:', track.trackUrl);
          audioRef.current.src = track.trackUrl;
          audioRef.current.volume = state.volume;
          
          console.log('Updating track state');
          setState(prev => ({
            ...prev,
            currentTrack: track,
            duration: track.duration,
          }));

          console.log('Starting playback...');
          try {
            await audioRef.current.play();
            console.log('Playback started successfully');
          } catch (playError) {
            console.error('Playback failed:', playError);
            throw playError;
          }
          
          console.log('Setting isPlaying to true');
          setState(prev => ({ ...prev, isPlaying: true }));
        }
      } catch (error) {
        console.error('Play function failed:', error);
        setState(prev => ({ 
          ...prev, 
          isPlaying: false,
          currentTrack: null 
        }));
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
  const setVolume = useCallback((volume: number) => {
    console.log('=== Volume Change Debug ===');
    console.log('setVolume called:', volume);
    console.log('Current audio state:', {
      isPlaying: audioRef.current?.paused ? 'paused' : 'playing',
      currentTime: audioRef.current?.currentTime,
      src: audioRef.current?.src,
    });

    if (audioRef.current) {
      const wasPlaying = !audioRef.current.paused;
      console.log('Audio was playing:', wasPlaying);
      
      try {
        audioRef.current.volume = volume;
        console.log('Volume set successfully');
        
        // 재생 상태 확인 및 복구
        if (wasPlaying && audioRef.current.paused) {
          console.log('Attempting to resume playback...');
          audioRef.current.play()
            .then(() => console.log('Playback resumed successfully'))
            .catch(err => console.error('Failed to resume playback:', err));
        }
      } catch (error) {
        console.error('Error setting volume:', error);
      }

      setState(prev => {
        console.log('Updating volume state from', prev.volume, 'to', volume);
        return { ...prev, volume };
      });
    }
    console.log('=== End Volume Change Debug ===');
  }, []);

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

  // 큐 관리 함수들
  const addToQueue = useCallback(
    (track: QueueTrack) => {
      setQueue(prev => [...prev, track]);
      
      if (queue.length === 0) {
        play(track.uuid);
      }
    },
    [queue.length, play]
  );

  const removeFromQueue = useCallback(
    (index: number) => {
      setQueue(prev => {
        const newQueue = [...prev];
        newQueue.splice(index, 1);
        return newQueue;
      });

      if (index === queueIndex) {
        const nextTrack = queue[index + 1] || queue[0];
        if (nextTrack) {
          play(nextTrack.uuid);
        }
      } else if (index < queueIndex) {
        setQueueIndex(prev => prev - 1);
      }
    },
    [queue, queueIndex, play]
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
    setState((prev) => ({
      ...prev,
      currentTrack: null,
      isPlaying: false,
    }));
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
      setQueue(newQueue);
      setQueueIndex(newIndex);
    },
    []
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

  // 상태 변경 추적을 위한 useEffect
  useEffect(() => {
    console.log('=== State Update ===', {
      isPlaying: state.isPlaying,
      currentTrack: state.currentTrack?.title,
      volume: state.volume,
      queueIndex,
      queueLength: queue.length,
      audioElement: {
        exists: !!audioRef.current,
        src: audioRef.current?.src,
        paused: audioRef.current?.paused,
      }
    });
  }, [state, queueIndex, queue.length]);

  // audioRef 설정 함수 추가
  const setAudioRef = useCallback((element: HTMLAudioElement) => {
    audioRef.current = element;
  }, []);

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
    audioRef,
    setAudioRef,
  };

  return (
    <AudioContext.Provider value={value}>
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
