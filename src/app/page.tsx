import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 pl-32">
      <div
        className={cn(
          "rounded-xl",
          "bg-white/20 dark:bg-black/20",
          "backdrop-blur-md",
          "border border-white/20 dark:border-white/10",
          "shadow-lg"
        )}
      >
        {/* 콘텐츠는 나중에 추가 */}
      </div>
    </div>
  );
}
