import { IoMdClose } from "react-icons/io";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onChange,
  title,
  children,
  className,
}) => {
  return (
    <Dialog open={isOpen} defaultOpen={isOpen} onOpenChange={onChange}>
      <DialogPortal>
        <DialogOverlay className="bg-white opacity-10 backdrop-blur-md fixed inset-0" />
        <DialogContent className={cn(("fixed drop-shadow-md border-none top-[50%] left-[50%] max-h-full h-full md:h-auto md:max-h-[90vh] w-full md:w-[90vw] md:max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-neutral-800 p-0 focus:outline-none"), className)}>
          <DialogTitle className="my-4 text-lg text-center font-bold text-white">
            {title}
          </DialogTitle>
          <Separator className="bg-accent/20 hidden md:flex" />
          <div className="text-white">{children}</div>
          <DialogClose asChild>
            <button className="text-neutral-400 hover:text-white absolute top-[1px] right-[10px] inline-flex h-[55px] w-[55px] appearance-none items-center justify-center rounded-full focus:outline-none">
              <IoMdClose />
            </button>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default Modal;
