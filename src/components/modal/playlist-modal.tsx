"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Input } from "../ui/input";
import ModalTitle from "./modal-title";
import { Textarea } from "../ui/textarea";
import { CustomModal } from "./custom-modal";

import { IconPlaylist } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import usePlaylistModal from "@/hooks/modal/use-playlist-modal";

const PlaylistModal = () => {
  const [isLoading, setIsloading] = useState(false);

  const playlistModal = usePlaylistModal();

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      playlistModal.onClose();
    }
  };

  const FormSchema = z.object({
    playlistName: z
      .string()
      .min(1, { message: "플레이리스트 이름은 필수입니다." })
      .max(20, { message: "플레이리스트 이름은 20자 이하로 입력해야 합니다." }),
    playlistDescription: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // 이후 수정
      playlistName: "",
      playlistDescription: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async () => {
    // 이후 수정
    try {
      setIsloading(true);
    } catch (error) {
      toast.error(`문제가 발생하였습니다 ${error}`);
    } finally {
      setIsloading(false);

      playlistModal.onClose();
      toast.success("플레이리스트가 생성되었습니다!");
    }
  };

  return (
    <CustomModal
    title={
      <ModalTitle
        icon={<IconPlaylist className="size-10 p-1" />}
        title="플레이리스트 생성"
      />
    }
      description="플레이리스트에 대한 정보를 입력해주세요"
      isOpen={playlistModal.isOpen}
      onChange={onChange}
      className="p-4 flex flex-col items-center justify-center h-[50%]"
    >
      <form
        className="flex flex-col h-full w-full items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-y-4 items-center justify-center h-full w-full rounded-md overflow-y-auto mt-2">
          <Input
            id="playlistName"
            disabled={isLoading}
            {...register("playlistName", { required: true })}
            placeholder="플레이리스트 이름 (필수)"
            className="w-full h-14"
          />
          <p
            className={errors.playlistName ? "text-red-500 text-xs" : "hidden"}
          >
            {errors.playlistName ? String(errors.playlistName.message) : null}
          </p>
          <Textarea
            id="playlistDescription"
            disabled={isLoading}
            {...register("playlistDescription", { required: false })}
            placeholder="플레이리스트 설명 (선택)"
            className="w-full h-full resize-none"
          />
        </div>
        <button className="p-[3px] relative mt-10" type="submit">
          <div className="px-8 py-2  bg-[#FF3F8F] rounded-xl relative group transition duration-200 text-white hover:bg-opacity-75 text-sm">
            확인
          </div>
        </button>
      </form>
    </CustomModal>
  );
};

export default PlaylistModal;
