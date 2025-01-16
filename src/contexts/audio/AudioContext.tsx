"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AudioContextType, AudioState, Track } from "./types";

const initialState: AudioState = {
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  progress: 0,
  duration: 0,
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AudioState>(initialState);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = state.volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const play = async (track: Track) => {
    if (!audioRef.current) return;

    try {
      if (
        state.currentTrack?.trackResponseDto.uuid !==
        track.trackResponseDto.uuid
      ) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/tracks/${track.trackResponseDto.uuid}/audio`,
          { credentials: "include" }
        );

        if (!response.ok) throw new Error("Failed to fetch audio source");

        const audioUrl = await response.text();
        audioRef.current.src = audioUrl;
        setState((prev) => ({ ...prev, currentTrack: track }));
      }

      await audioRef.current.play();
      setState((prev) => ({ ...prev, isPlaying: true }));
    } catch (error) {
      console.error("Failed to play track:", error);
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setState((prev) => ({ ...prev, isPlaying: false }));
  };

  const setVolume = (volume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    setState((prev) => ({ ...prev, volume }));
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setState((prev) => ({ ...prev, progress: time }));
  };

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setState((prev) => ({
        ...prev,
        progress: audio.currentTime,
        duration: audio.duration,
      }));
    };

    const handleEnded = () => {
      setState((prev) => ({ ...prev, isPlaying: false, progress: 0 }));
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <AudioContext.Provider
      value={{
        ...state,
        play,
        pause,
        setVolume,
        seek,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
