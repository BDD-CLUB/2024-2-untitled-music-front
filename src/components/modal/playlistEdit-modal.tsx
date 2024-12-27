"use client";

import usePlaylistEditModal from "@/hooks/modal/use-playlistEdit-modal";
import { api } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosResponse } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CustomModal } from "./custom-modal";
import ModalTitle from "./modal-title";
import { IconPlaylist } from "@tabler/icons-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const PlaylistEditModal = () => {
  const [isLoading, setIsloading] = useState(false);
  const playlistEditModal = usePlaylistEditModal();
  const router = useRouter();

  const pathname = usePathname();
  const uuid = String(pathname.split("/").pop());

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      playlistEditModal.onClose();
    }
  };

  const FormSchema = z.object({
    title: z
      .string()
      .min(1, { message: "플레이리스트 이름은 필수입니다." })
      .max(20, { message: "플레이리스트 이름은 20자 이하로 입력해야 합니다." }),
    description: z.string().optional(),
    trackUuids: z.array(z.string()).optional(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      trackUuids: [],
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    if (!uuid) {
      toast.error("플레이리스트 정보를 찾을 수 없습니다.");
      return;
    }

    setIsloading(true);

    try {
      const response = await api.patch(`/playlist/${uuid}`, {
        title: values.title,
        description: values.description,
        trackUuids: [],
      });

      if (isSuccessResponse(response)) {
        handleSuccess();
      } else {
        throw new Error("플레이리스트 수정에 실패했습니다.");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsloading(false);
    }
  }

  const handleSuccess = () => {
    toast.success("플레이리스트가 수정되었습니다.");
    reset();
    router.refresh();
    playlistEditModal.onClose();
  };

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      console.error("서버 응답:", error.response);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "플레이리스트 수정 중 오류가 발생했습니다."
      );
    } else {
      console.error("에러 상세:", error);
      toast.error("플레이리스트 수정 과정에서 오류가 발생했습니다.");
    }
  };

  const isSuccessResponse = (response: AxiosResponse) => {
    return response.status >= 200 && response.status < 300;
  };

  return (
    <CustomModal
      title={
        <ModalTitle
          icon={<IconPlaylist className="size-10 p-1" />}
          title="플레이리스트 편집"
        />
      }
      description="플레이리스트 정보를 입력해주세요"
      isOpen={playlistEditModal.isOpen}
      onChange={onChange}
      className="p-4 flex flex-col items-center justify-center h-[50%]"
    >
      <form
        className="flex flex-col h-full w-full items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-y-4 items-center justify-center h-full w-full rounded-md overflow-y-auto">
          <Input
            id="title"
            disabled={isLoading}
            {...register("title", { required: true })}
            placeholder="🚨 이름"
            className="w-full h-14 placeholder:text-muted-foreground dark:placeholder:text-muted-foreground-dark"
          />
          <p className={errors.title ? "text-red-500 text-xs" : "hidden"}>
            {errors.title ? String(errors.title.message) : null}
          </p>
          <Textarea
            id="description"
            disabled={isLoading}
            {...register("description", { required: false })}
            placeholder="📝 소개"
            className="w-full h-full resize-none placeholder:text-muted-foreground dark:placeholder:text-muted-foreground-dark"
          />
          <p className={errors.description ? "text-red-500 text-xs" : "hidden"}>
            {errors.description ? String(errors.description.message) : null}
          </p>
        </div>
        <div className="flex items-center justify-around w-full pt-10">
          <button
            className="p-[3px] relative"
            onClick={() => playlistEditModal.onClose()}
            disabled={isLoading}
          >
            <div className="px-8 py-2 bg-white rounded-xl relative group text-black hover:bg-neutral-100 text-sm dark:bg-black/95 dark:text-white dark:hover:bg-neutral-800">
              취소
            </div>
          </button>
          <button
            className="p-[3px] relative"
            type="submit"
            disabled={isLoading}
          >
            <div className="px-8 py-2  bg-[#FF3F8F] rounded-xl relative group transition duration-200 text-white hover:bg-opacity-75 text-sm">
              확인
            </div>
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default PlaylistEditModal;