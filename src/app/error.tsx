'use client';

import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-8 md:pl-32">
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
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            문제가 발생했습니다
          </h2>
          <p className="text-muted-foreground mb-8">
            {error.message || "알 수 없는 오류가 발생했습니다."}
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => window.location.href = "/"}
            >
              홈으로 가기
            </Button>
            <Button onClick={reset}>
              다시 시도
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 