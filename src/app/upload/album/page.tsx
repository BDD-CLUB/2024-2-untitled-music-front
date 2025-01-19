import { AlbumUpload } from "@/components/upload/AlbumUpload";
import { cn } from "@/lib/utils";

export default function AlbumUploadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
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
        <AlbumUpload />
      </div>
    </div>
  );
} 