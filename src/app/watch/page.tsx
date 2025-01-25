import { WatchContent } from "@/components/watch/WatchContent";
import { cn } from "@/lib/utils";

export default function WatchPage() {
  return (
    <div className={cn(
      "container mx-auto",
      "min-h-[calc(100vh-4rem)]",
      "py-6 px-4 md:px-8",
      "relative"
    )}>
      <div className={cn(
        "absolute inset-0 -z-10",
        "bg-gradient-to-br from-background via-background to-background/50"
      )} />
      <WatchContent />
    </div>
  );
} 