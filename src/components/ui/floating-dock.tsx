'use client'

import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
}: {
  items: { title: string; icon: React.ReactNode; onClick: () => void }[];
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; onClick: () => void }[];
  className?: string;
}) => {
  const mouseY = useMotionValue(Infinity); 
  return (
    <motion.div
      className={cn(
        "mx-auto md:hidden flex h-16 gap-4 items-end rounded-2xl bg-transparent px-4 pb-3",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseY={mouseY} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; onClick: () => void }[];
  className?: string;
}) => {
  const mouseY = useMotionValue(Infinity); 
  return (
    <motion.div
      onMouseMove={(e) => mouseY.set(e.pageY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      className={cn(
        "my-auto hidden md:flex flex-col w-auto gap-4 items-center rounded-2xl px-4 py-3",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseY={mouseY} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseY,
  title,
  icon,
  onClick,
}: {
  mouseY: MotionValue;
  title?: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null); 

  const distance = useTransform(mouseY, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 }; 

    return val - bounds.y - bounds.height / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]); 

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]); 
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]); 

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  }); 
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  }); 
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  }); 

  const [hovered, setHovered] = useState(false);

  return (
    <button onClick={onClick}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="aspect-square rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center relative"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 40, y: -20 }}
              animate={{ opacity: 1, x: 80, y: -50 }}
              exit={{ opacity: 0, x: 40, y: -20 }}
              className="px-0.5 py-0.5 hidden md:flex items-center justify-center whitespace-pre text-sm font-bold bg-transparent text-neutral-700 dark:text-white absolute right-[calc(100%+35px)] top-1/2 -translate-y-1/2"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </button>
  );
}