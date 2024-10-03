import React from "react";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from "../ui/dialog";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

import useSearchInput from "@/hooks/modal/use-search-input";

export const SearchInput = () => {
  const placeholders = [
    "🎹 오늘 하루를 노래로 나타낸다면?",
    "🎧 당신의 최애곡은 무엇인가요?",
    "🩵 당신이 가장 좋아하는 아티스트는 누구인가요?",
    "🦋 취향에 맞는 플레이리스트를 찾아보세요",
  ];

  const searchinput = useSearchInput();

  const onChange = (open: boolean) => {
    if (!open) {
      searchinput.onClose();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

  return (
    <Dialog open={searchinput.isOpen} onOpenChange={onChange}>
      <DialogOverlay className="bg-black bg-opacity-10 fixed inset-0" />
      <DialogContent className="fixed top-[30%] left-[50%] translate-x-[-50%] translate-y-[-30%] border-none bg-transparent shadow-none w-full p-0">
        <div className="flex flex-col items-center justify-center">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onChange={handleChange}
            onSubmit={onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
