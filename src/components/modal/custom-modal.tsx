import React from "react";

import { cn } from "../../lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const CustomModal: React.FC<ModalProps> = ({
  isOpen,
  onChange,
  title,
  description,
  children,
  className,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black dark:bg-opacity-75 bg-opacity-50 fixed inset-0" />
        <DialogContent
          className={cn(
            "fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] border border-transparent h-full md:max-h-[90%] md:min-h-[50%] md:rounded-2xl bg-white dark:bg-neutral-800 p-0 w-full md:w-[90vw] md:max-w-[600px]",
            className
          )}
        >
          <DialogTitle className="mt-4 mb-2 text-lg text-center tracking-wide font-bold">
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
          <div className="w-full h-full overflow-y-auto">
            {children}
          </div>
          <DialogClose asChild>
            <CloseIcon />
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

const CloseIcon = () => {
  return (
    <button className="absolute top-4 right-4 group">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-black dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
};
