"use client";

import StreamingBar from "@/components/bar/streaming-bar";

import { cn } from "@/lib/utils";
import { useAuth } from "@/provider/authProvider";
import useSigninModal from "@/hooks/modal/use-signin-modal";
import useStreamingBar from "@/hooks/modal/use-streaming-bar";

export default function Topbar() {
  const signinModal = useSigninModal();
  const streamingBar = useStreamingBar();

  const { isLoggedIn } = useAuth();

  return (
    <div className="h-20 bg-transparent hidden md:flex items-center justify-end md:justify-between">
      {streamingBar.isOpen ? <StreamingBar /> : <div className="flex-1" />}
      <button
        onClick={() => signinModal.onOpen()}
        className={cn(
          "bg-transparent dark:text-neutral-300 text-neutral-700 justify-center rounded-full border border-[#FD6997] dark:border-none dark:bg-white/10 ml-8 md:mr-4 py-1 px-4",
          {
            hidden: isLoggedIn,
            flex: !isLoggedIn,
          }
        )}
      >
        <span className="text-center text-base font-bold tracking-wide">
          START!
        </span>
      </button>
    </div>
  );
}
