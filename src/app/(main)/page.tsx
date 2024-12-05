'use client';

import MainContents from "@/features/main/main-contents";
import useStreamingBar from "@/hooks/modal/use-streaming-bar";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "react-responsive";

export default function Home() {
  const streamingBar = useStreamingBar();
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <main className={cn("bg-transparent h-full mb-20 md:mb-10 pl-4 md:pl-0 md:ml-48 mt-8 md:mt-20 pt-2 pr-4 md:pr-0 md:mr-28 overflow-y-auto hide-scrollbar", isMobile && streamingBar.isOpen && "mb-36")}>
      <MainContents />
    </main>
  );
}