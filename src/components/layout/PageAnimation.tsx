"use client";

import { motion } from "framer-motion";

interface PageAnimationProps {
  children: React.ReactNode;
}

export function PageAnimation({ children }: PageAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        type: "spring",
        stiffness: 380,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
} 