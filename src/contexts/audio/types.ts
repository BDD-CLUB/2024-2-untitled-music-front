export interface Track {
  trackResponseDto: {
    uuid: string;
    title: string;
    duration: number;
    artUrl: string;
    lyric: string;
  };
  albumResponseDto: {
    uuid: string;
    title: string;
    artImage: string;
  };
  artistResponseDto: {
    uuid: string;
    name: string;
    artistImage: string;
  };
}

export interface AudioState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
}

export interface AudioActions {
  play: (track: Track) => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
}

export interface AudioContextType extends AudioState, AudioActions {} 