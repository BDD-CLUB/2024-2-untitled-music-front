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
  // 초기 상태를 가져오는 함수를 컴포넌트 외부로 이동
  const getInitialState = () => {
    try {
      const savedStateStr = localStorage.getItem('audioPlayerState');
      if (!savedStateStr) return null;

      const savedState = JSON.parse(savedStateStr);
      if (!savedState || typeof savedState !== 'object') return null;

      return {
        state: {
          currentTrack: savedState.currentTrack || null,
          volume: Number(savedState.volume) || 1,
          progress: Number(savedState.progress) || 0,
          isPlaying: false,
          duration: savedState.currentTrack?.duration || 0,
        },
        queue: Array.isArray(savedState.queue) ? savedState.queue : [],
        queueIndex: Number(savedState.queueIndex) || 0,
      };
    } catch {
      return null;
    }
  };

  // 초기 상태를 한 번에 설정
  const initialState = getInitialState() || {
    state: {
      currentTrack: null,
      isPlaying: false,
      volume: 1,
      progress: 0,
      duration: 0,
    },
    queue: [],
    queueIndex: 0,
  };

  // useState 호출을 한 번에 처리
  const [state, setState] = useState(initialState.state);
  const [queue, setQueue] = useState(initialState.queue);
  const [queueIndex, setQueueIndex] = useState(initialState.queueIndex);

  // ref 초기화도 한 번에 처리
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef(initialState.state.volume);
  const queueRef = useRef(initialState.queue);
  const queueIndexRef = useRef(initialState.queueIndex);

  // 오디오 엘리먼트 초기화를 useEffect로 이동
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      if (state.currentTrack) {
        audioRef.current.src = state.currentTrack.trackUrl;
        audioRef.current.volume = volumeRef.current;
        audioRef.current.currentTime = state.progress;
      }
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

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
        setState(prev => ({ ...prev, isPlaying: false }));
        const track = await fetchTrack(trackId);

        if (audioRef.current) {
          audioRef.current.src = track.trackUrl;
          audioRef.current.volume = volumeRef.current;
          
          setState(prev => ({
            ...prev,
            currentTrack: track,
            duration: track.duration,
          }));

          try {
            await audioRef.current.play();
          } catch (playError) {
            throw playError;
          }
          
          setState(prev => ({ ...prev, isPlaying: true }));
        }
      } catch {
        setState(prev => ({ 
          ...prev, 
          isPlaying: false,
          currentTrack: null 
        }));
      }
    },
    [fetchTrack]
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
    if (audioRef.current) {
      try {
        volumeRef.current = volume;
        audioRef.current.volume = volume;
        setState(prev => ({ ...prev, volume }));
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
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

  // 오디오 엘리먼트 생성과 초기화를 분리
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    const handleTrackEnd = () => {
      const currentQueue = queueRef.current;
      const currentIndex = queueIndexRef.current;

      if (currentQueue.length > currentIndex + 1) {
        const nextTrack = currentQueue[currentIndex + 1];
        queueIndexRef.current = currentIndex + 1;
        setQueueIndex(currentIndex + 1);
        play(nextTrack.uuid);
      } else {
        setState(prev => ({
          ...prev,
          isPlaying: false,
        }));
      }
    };

    audio.addEventListener("ended", handleTrackEnd);
    audio.volume = volumeRef.current;

    return () => {
      audio.removeEventListener("ended", handleTrackEnd);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [play]); // 오디오 엘리먼트 생성은 play 함수에만 의존

  // 오디오 상태 동기화를 위한 별도의 useEffect
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;

    // 현재 재생 중인 트랙이 변경된 경우에만 src 업데이트
    if (audio.src !== state.currentTrack.trackUrl) {
      audio.src = state.currentTrack.trackUrl;
    }
  }, [state.currentTrack?.trackUrl]); // 트랙 URL이 변경될 때만 실행

  // 큐 관리 함수들
  const addToQueue = useCallback(
    (track: QueueTrack) => {
      const newQueue = [...queueRef.current, track];
      queueRef.current = newQueue;
      setQueue(newQueue); // UI 업데이트용

      if (queueRef.current.length === 1) {
        play(track.uuid);
      }
    },
    [play]
  );

  const removeFromQueue = useCallback(
    (index: number) => {
      const newQueue = [...queueRef.current];
      newQueue.splice(index, 1);
      queueRef.current = newQueue;
      setQueue(newQueue); // UI 업데이트용

      if (index === queueIndexRef.current) {
        const nextTrack = newQueue[index] || newQueue[0];
        if (nextTrack) {
          queueIndexRef.current = index >= newQueue.length ? newQueue.length - 1 : index;
          setQueueIndex(queueIndexRef.current); // UI 업데이트용
          play(nextTrack.uuid);
        }
      } else if (index < queueIndexRef.current) {
        queueIndexRef.current--;
        setQueueIndex(queueIndexRef.current); // UI 업데이트용
      }
    },
    [play]
  );

  const clearQueue = useCallback(() => {
    // 1. 먼저 오디오 재생 중지
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
    }

    // 2. localStorage에서 상태 제거
    localStorage.removeItem('audioPlayerState');

    // 3. 모든 상태 초기화
    setState({
      currentTrack: null,
      isPlaying: false,
      volume: 1,
      progress: 0,
      duration: 0
    });

    // 4. 큐 상태 초기화
    setQueue([]);
    setQueueIndex(0);
    queueRef.current = [];
    queueIndexRef.current = 0;

    // 5. 볼륨 초기화
    volumeRef.current = 1;
    if (audioRef.current) {
      audioRef.current.volume = 1;
    }
  }, []);

  const playNext = useCallback(() => {
    if (queue.length > queueIndex + 1) {
      const nextTrack = queue[queueIndex + 1];
      setQueueIndex((prev: number) => prev + 1);
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
        setQueueIndex((prev: number) => prev - 1);
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
      queueRef.current = newQueue;
      queueIndexRef.current = newIndex;
      
      // UI 업데이트용
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

  // 상태 저장 함수 수정
  const saveState = useCallback(() => {
    const stateToSave = {
      currentTrack: state.currentTrack,
      volume: state.volume,
      progress: audioRef.current?.currentTime || state.progress,
      queue: queue,  // 현재 큐 상태 저장
      queueIndex: queueIndex  // 현재 큐 인덱스 저장
    };

    try {
      localStorage.setItem('audioPlayerState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save audio state:', error);
    }
  }, [state.currentTrack, state.volume, state.progress, queue, queueIndex]);

  // 상태 저장 useEffect
  useEffect(() => {
    const timeoutId = setTimeout(saveState, 1000);
    return () => clearTimeout(timeoutId);
  }, [state.currentTrack, state.volume, state.progress, queue, queueIndex, saveState]);

  // 페이지 언로드 시 상태 저장
  useEffect(() => {
    window.addEventListener('beforeunload', saveState);
    return () => window.removeEventListener('beforeunload', saveState);
  }, [saveState]);

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
