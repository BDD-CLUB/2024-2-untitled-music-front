import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "../ui/button";

export const Topbar = () => {
  return (
    <nav className="bg-black flex items-center justify-between h-14 py-4 px-8 md:px-16">
      <div className="hidden md:flex min-w-[200px] max-w-[450px] shrink grow-[2]">
        <Button
          size="sm"
          className="bg-black border border-purple-300 w-full flex justify-start items-center h-10 px-2"
        >
          <Search className="size-5 text-accent/50 mr-3" />
          <span className="text-accent/50 text-sm">Search something...</span>
        </Button>
      </div>

      <div className="flex md:hidden text-2xl pt-4">
        🦋
      </div>
      
      <div className="ml-auto flex-1 flex items-center justify-end">
        <Button className="text-white" variant="transparent">
          <Link href={"/auth"} className="text-base">
            Sign In
          </Link>
        </Button>
      </div>
    </nav>
  );
};
