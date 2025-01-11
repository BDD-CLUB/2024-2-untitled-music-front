import { PlaylistUpload } from "@/components/upload/PlaylistUpload";
import { cn } from "@/lib/utils";

export default function PlaylistUploadPage() {
  return (
    <div className="container mx-auto px-4 py-8 pl-32">
      <div
        className={cn(
          "rounded-3xl",
          "bg-white/10 dark:bg-black/10",
          "backdrop-blur-2xl",
          "border border-white/20 dark:border-white/10",
          "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
          "overflow-hidden"
        )}
      >
        <PlaylistUpload />
      </div>
    </div>
  );
}