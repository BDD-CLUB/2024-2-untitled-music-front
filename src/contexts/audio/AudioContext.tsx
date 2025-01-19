"use client";

import { createContext, useContext, useRef, useState } from "react";

interface Track {
  uuid: string;
  title: string;
  duration: number;
  lyric: string;
  artUrl: string;
  album: Album;
  artistName: string;
}

interface Album {
  uuid: string;
  title: string;
  artImage: string;
  description: string;
  releaseDate: string;
}

interface AudioState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
}

interface AudioContextType extends AudioState {
  play: (track: Track) => Promise<void>;
  pause: () => void;
  resume: () => void;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AudioState>({
    currentTrack: null,
    isPlaying: false,
    volume: 1,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = async (track: Track) => {
    if (!audioRef.current) return;

    try {
      if (state.currentTrack?.uuid !== track.uuid) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/tracks/${track.uuid}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to load track");

        const audioUrl = track.artUrl;
        audioRef.current.src = audioUrl;
        setState(prev => ({ ...prev, currentTrack: track }));
      }

      await audioRef.current.play();
      setState(prev => ({ ...prev, isPlaying: true }));
    } catch (error) {
      console.error("Failed to play track:", error);
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setState(prev => ({ ...prev, isPlaying: false }));
  };

  const resume = () => {
    if (!audioRef.current) return;
    audioRef.current.play();
    setState(prev => ({ ...prev, isPlaying: true }));
  };

  const setVolume = (volume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    setState(prev => ({ ...prev, volume }));
  };

  return (
    <AudioContext.Provider value={{ ...state, play, pause, resume, setVolume }}>
      <audio ref={audioRef} />
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