"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Modal from "./modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

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

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    // 이후 수정
    try {
      setIsloading(true);
    } catch (error) {
      toast.error("문제가 발생하였습니다");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <Modal
      title="플레이리스트 생성"
      isOpen={playlistModal.isOpen}
      onChange={onChange}
    >
      <div className="flex flex-col items-center justify-center w-full rounded-md h-[600px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-full w-full py-6 px-12 md:px-12 flex flex-col gap-y-8"
        >
          <Input
            id="playlistName"
            disabled={isLoading}
            {...register("playlistName", { required: true })}
            placeholder="플레이리스트 이름 (필수)"
            className="w-full h-14 border-neutral-300"
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
            className="w-full h-full border-neutral-300 resize-none"
          />
          <Button
            variant="secondary"
            type="submit"
            className="mt-5 mb-8 font-bold rounded-full"
          >
            생성
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default PlaylistModal;
