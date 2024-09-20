import { LogOut, Menu, Moon, Settings } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export const SettingButton = () => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        className="flex items-center justify-center group outline-none relative"
        asChild
      >
        <Button variant="transparent" className="p-2 group-hover:bg-accent/20">
          <Menu className="size-7 text-white group-hover:scale-110 transition-all" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="top"
        className="w-56 ml-6 mb-4 space-y-2"
      >
        <DropdownMenuItem className="h-10">
          <Settings className="size-4 mr-2" />
          설정
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10">
          <Moon className="size-4 mr-2" />
          모드전환
        </DropdownMenuItem>
        <DropdownMenuItem className="h-10">
          <LogOut className="size-4 mr-2" />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
