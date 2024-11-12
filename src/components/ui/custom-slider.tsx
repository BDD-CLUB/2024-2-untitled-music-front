"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

const CustomSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [sliderValue, setSliderValue] = React.useState(70);

  const getGradientColor = (value: number) => {
    const startColor = [255, 0, 166]; // #FF00A6
    const midColor = [72, 85, 255];   // #4855FF
    const endColor = [45, 63, 179];   // #2D3FB3

    let r, g, b;

    if (value <= 50) {
      r = Math.round(startColor[0] + ((midColor[0] - startColor[0]) * value) / 50);
      g = Math.round(startColor[1] + ((midColor[1] - startColor[1]) * value) / 50);
      b = Math.round(startColor[2] + ((midColor[2] - startColor[2]) * value) / 50);
    } else {
      r = Math.round(midColor[0] + ((endColor[0] - midColor[0]) * (value - 50)) / 50);
      g = Math.round(midColor[1] + ((endColor[1] - midColor[1]) * (value - 50)) / 50);
      b = Math.round(midColor[2] + ((endColor[2] - midColor[2]) * (value - 50)) / 50);
    }

    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const track = event.currentTarget;
    const trackRect = track.getBoundingClientRect();
    const clickPosition = event.clientX - trackRect.left;
    const clickValue = (clickPosition / trackRect.width) * 100;
    setSliderValue(Math.min(Math.max(clickValue, 0), 100));
  };

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full pb-2 touch-none select-none items-center",
        className
      )}
      value={[sliderValue]}
      onValueChange={(value) => setSliderValue(value[0])}
      {...props}
    >
      <SliderPrimitive.Track
        className="relative h-0.5 w-full grow overflow-hidden rounded-full bg-gradient-to-r from-[#FF00A6] via-[#4855FF] to-[#2D3FB3]"
        onClick={handleTrackClick}
      >
        <div
          className="absolute h-full bg-white"
          style={{
            width: `${100 - sliderValue}%`,
            opacity: 0.5, 
            right: 0,
          }}
        />
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb
        className="flex h-3 w-3 rounded-full shadow transition-colors focus-visible:outline-none"
        style={{
          backgroundColor: getGradientColor(sliderValue),
        }}
      />
    </SliderPrimitive.Root>
  );
});
CustomSlider.displayName = SliderPrimitive.Root.displayName;

export { CustomSlider };