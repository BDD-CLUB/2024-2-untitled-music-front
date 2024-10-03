"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, MutableRefObject } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  let w: number, h: number, nt: number, i: number, x: number;
  let ctx: CanvasRenderingContext2D | null = null;
  let canvas: HTMLCanvasElement | null = null;

  const canvasRef: MutableRefObject<HTMLCanvasElement | null> = useRef(null);

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = () => {
    canvas = canvasRef.current;
    if (canvas) {
      ctx = canvas.getContext("2d");
      if (ctx) {
        w = ctx.canvas.width = window.innerWidth;
        h = ctx.canvas.height = window.innerHeight;
        ctx.filter = `blur(${blur}px)`;
        nt = 0;
        window.onresize = function () {
          w = ctx!.canvas.width = window.innerWidth;
          h = ctx!.canvas.height = window.innerHeight;
          ctx!.filter = `blur(${blur}px)`;
        };
        render();
      }
    }
  };

  const waveColors = colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ];

  const drawWave = (n: number) => {
    if (ctx) {
      nt += getSpeed();
      for (let i = 0; i < n; i++) {
        ctx.beginPath();
        ctx.lineWidth = waveWidth || 50;
        ctx.strokeStyle = waveColors[i % waveColors.length];
        for (let x = 0; x < w; x += 5) {
          const y = noise(x / 800, 0.3 * i, nt) * 100;
          ctx.lineTo(x, y + h * 0.5); // 현재 높이의 50%에서 조정
        }
        ctx.stroke();
        ctx.closePath();
      }
    }
  };

  // animationId 기본값을 null로 설정
  let animationId: number | null = null;

  const render = () => {
    if (ctx) {
      ctx.fillStyle = backgroundFill || "black";
      ctx.globalAlpha = waveOpacity || 0.5;
      ctx.fillRect(0, 0, w, h);
      drawWave(5);
      animationId = requestAnimationFrame(render);
    }
  };

  useEffect(() => {
    init();
    return () => {
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [animationId]); // `animationId` 의존성 추가

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // Safari 지원을 위한 코드
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "h-full w-full flex flex-col items-center justify-center z-50",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-50"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative h-full w-full z-50", className)} {...props}>
        {children}
      </div>
    </div>
  );
};