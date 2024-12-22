'use client'

import useStreamingBar from "@/hooks/modal/use-streaming-bar";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import Image from "next/image";

interface SquareContainerProps {
  src: string;
  name: string;
  description?: string;
  design: string;
  onClickName?: () => void;
  onClickDescription?: () => void;
}

const SquareContainer = ({
  src,
  name,
  description,
  design,
  onClickName,
  onClickDescription,
}: SquareContainerProps) => {
  const streamingBar = useStreamingBar();

  return (
    <div className="flex flex-col h-60 w-52 bg-transparent items-center justify-center hover:bg-[#7E47631F] dark:hover:bg-gradient-to-b dark:from-[#D8C2DC4D] dark:to-[#2D1E274D] rounded-lg transition hover:cursor-pointer group">
      <div className="relative flex items-center justify-center h-40 w-40 overflow-hidden">
        <Image
          src={src}
          alt="profile"
          width={150}
          height={150}
          className={`group-hover:opacity-75 ${design}`}
        />
        <div 
          onClick={() => streamingBar.onOpen()}
          className="absolute mt-1 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-full bg-[#FF00B1] w-10 h-10 transform hover:scale-125 transition-transform duration-300"
        >
          <IconPlayerPlayFilled className="w-8 h-8 text-black" />
        </div>
      </div>
      <div
        onClick={onClickName}
        className="mt-2 font-bold text-lg text-black dark:text-white text-center tracking-wide hover:underline w-full px-8 truncate"
      >
        {name}
      </div>
      <span
        onClick={onClickDescription}
        className="font-medium text-sm text-neutral-600 dark:text-neutral-400 text-center hover:underline w-full px-2 truncate"
      >
        {description}
      </span>
    </div>
  );
};

export default SquareContainer;
