"use client";

import { z } from "zod";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { IconDisc } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomModal } from "@/components/modal/custom-modal";
import { api } from "@/lib/axios";
import { usePathname, useRouter } from "next/navigation";
import useAlbumEditModal from "@/hooks/modal/use-albumEdit-modal";
import ModalTitle from "../modal-title";

const AlbumEditModal = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsloading] = useState(false);
  const albumEditModal = useAlbumEditModal();
  const router = useRouter();

  const pathname = usePathname();
  const uuid = String(pathname.split("/").pop());

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      albumEditModal.onClose();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("이미지 파일만 업로드 가능합니다.");
        return;
      }

      setFile(file);
    }
  };

  const uploadToS3 = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/upload/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("이미지 업로드에 실패했습니다.");
    }
  };

  const FormSchema = z.object({
    title: z
      .string()
      .min(1, "1자 이상 입력하세요")
      .max(20, "20자 이하로 입력하세요"),
    description: z
      .string()
      .max(500, "소개는 500자 이내로 작성하세요")
      .nullable()
      .transform((val) => val ?? ""),
    albumArt: z.string().nullable().optional(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      albumArt: null,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    if (!uuid) {
      toast.error("앨범 정보를 찾을 수 없습니다.");
      return;
    }

    setIsloading(true);

    try {
      const albumArtUrl = file ? await uploadToS3(file) : "";

      const response = await api.patch(`/album/${uuid}`, {
        title: values.title,
        description: values.description,
        albumArt: albumArtUrl,
      });

      if (isSuccessResponse(response)) {
        handleSuccess();
      } else {
        throw new Error("앨범 수정에 실패했습니다.");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsloading(false);
    }
  };

  const handleSuccess = () => {
    toast.success("앨범이 수정되었습니다.");
    reset();
    albumEditModal.onClose();
    router.refresh();
  };

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      console.error("서버 응답:", error.response);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "앨범 수정 중 오류가 발생했습니다."
      );
    } else {
      console.error("에러 상세:", error);
      toast.error("앨범 수정 과정에서 오류가 발생했습니다.");
    }
  };

  const isSuccessResponse = (response: AxiosResponse) => {
    return response.status >= 200 && response.status < 300;
  };

  return (
    <CustomModal
      title={
        <ModalTitle
          icon={<IconDisc className="size-10 p-1" />}
          title="앨범 편집"
        />
      }
      description="앨범 정보를 입력해주세요"
      isOpen={albumEditModal.isOpen}
      onChange={onChange}
      className="p-4 flex flex-col items-center justify-center"
    >
      <form
        className="flex flex-col h-full w-full items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-y-4 items-center justify-center h-full w-full rounded-md overflow-y-auto">
          <Input
            id="albumArt"
            type="file"
            {...register("albumArt", { required: false })}
            disabled={isLoading}
            className="hidden"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="albumArt"
            className="p-[1px] w-full flex bg-gradient-to-br from-[#FF00B1] to-[#875BFF] h-auto cursor-pointer rounded-lg"
          >
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-lg transition duration-200 text-black dark:text-white hover:bg-opacity-75 text-sm items-center flex justify-between p-4">
              <span className="text-gray-400 truncate max-w-[70%]">
                {file ? file.name : "🖼️ 앨범 커버"}
              </span>
              <span className="bg-black text-white dark:bg-white dark:text-black px-4 py-1 rounded-lg text-sm">
                커버 변경
              </span>
            </div>
          </label>
          <Input
            id="title"
            disabled={isLoading}
            {...register("title", { required: true })}
            placeholder="🚨 앨범 제목"
            className="w-full h-14"
          />
          <p className={errors.title ? "text-red-500 text-xs" : "hidden"}>
            {errors.title ? String(errors.title.message) : null}
          </p>
          <Textarea
            id="description"
            disabled={isLoading}
            {...register("description", { required: false })}
            placeholder="📝 소개"
            className="w-full h-full resize-none"
          />
          <p className={errors.description ? "text-red-500 text-xs" : "hidden"}>
            {errors.description ? String(errors.description.message) : null}
          </p>
        </div>
        <div className="flex items-center justify-around w-full pt-10">
          <button
            className="p-[3px] relative"
            onClick={() => albumEditModal.onClose()}
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

export default AlbumEditModal;
