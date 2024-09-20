import { CirclePlus, DiscAlbum, ListMusic, Music } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export const UploadButton = () => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className="flex items-center justify-center group outline-none relative"
        asChild
      >
        <Button variant="transparent" className="p-2 group-hover:animate-spinOnce group-hover:bg-black">
          <CirclePlus className="size-7 text-purple-300 group-hover:scale-110 transition-all" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="right"
        className="w-40 ml-2.5"
      >
        <DropdownMenuItem className="h-10">
          <Music className="size-4 mr-2" />
          트랙
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10">
          <DiscAlbum className="size-4 mr-2" />
          앨범
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10">
          <ListMusic className="size-4 mr-2" />
          플레이리스트
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
