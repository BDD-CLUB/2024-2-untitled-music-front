import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ModalTitleProps {
  icon: ReactNode;
  title: string;
  className?: string;
}

const ModalTitle = ({ icon: Icon, title, className }: ModalTitleProps) => {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-y-4">
      <div
        className={cn(
          "rounded-full h-full text-white dark:text-black bg-gradient-to-b from-[#FFA897] to-[#FF3F8F]",
          className
        )}
      >
        {Icon}
      </div>
      <div>{title}</div>
    </div>
  );
};

export default ModalTitle;
