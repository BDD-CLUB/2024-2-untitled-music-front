"use client";

import Image from "next/image";
import { useTheme } from "@/contexts/theme/ThemeContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function BackgroundImage() {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 w-full h-full">
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          isLoading ? "opacity-0" : "opacity-100"
        )}
      >
        <Image
          src={theme === 'dark' 
            ? "/images/background-color-dark.webp" 
            : "/images/background-color.webp"
          }
          alt=""
          fill
          quality={40}
          sizes="100vw"
          className={cn(
            "object-cover",
            "transition-transform duration-[2s]",
            "scale-[1.02]",
            isLoading ? "blur-xl" : "blur-0"
          )}
          onLoad={handleImageLoad}
        />
      </div>

      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-background to-background/80",
          "transition-opacity duration-1000",
          isLoading ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
} 