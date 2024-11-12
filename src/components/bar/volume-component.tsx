"use client";

import { IconVolume, IconVolume2, IconVolumeOff } from "@tabler/icons-react";
import { Slider } from "../ui/slider";
import { useState } from "react";

interface VolumeComponentProps {
  onClick?: (e: React.MouseEvent) => void;
}

const VolumeComponent: React.FC<VolumeComponentProps> = ({ onClick }) => {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(50);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <IconVolumeOff className="size-6" />;
    } else if (volume > 50) {
      return <IconVolume className="size-6" />;
    } else {
      return <IconVolume2 className="size-6" />;
    }
  };

  return (
    <div className="flex items-center space-x-2 flex-1 justify-end">
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMute();
          if (onClick) {
            onClick(e);
          }
        }}
      >
        {getVolumeIcon()}
      </button>
      <Slider
        defaultValue={[50]}
        value={[volume]}
        onValueChange={handleVolumeChange}
        max={100}
        step={1}
        className="w-1/6 py-2"
        onClick={onClick}
      />
    </div>
  );
};

export default VolumeComponent;
