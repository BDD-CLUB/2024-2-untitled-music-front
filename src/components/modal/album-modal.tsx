"use client";

import { z } from "zod";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Input } from "../ui/input";
import ModalTitle from "./modal-title";
import { Textarea } from "../ui/textarea";
import { CustomModal } from "./custom-modal";
import { FileUpload } from "../ui/file-upload";

import { IconDisc } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import useAlbumModal from "@/hooks/modal/use-album-modal";

const AlbumModal = () => {
  const [stage, setStage] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsloading] = useState(false);

  const albumModal = useAlbumModal();

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);

    if (files.length > 0 && files[0].type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(files[0]);
      setPreviewImage(imageUrl);
    }
  };

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      albumModal.onClose();
    }
  };

  const FormSchema = z.object({
    albumName: z
      .string()
      .min(1, { message: "앨범 이름은 필수입니다." })
      .max(20, { message: "앨범 이름은 20자 이하로 입력해야 합니다." }),
    albumDescription: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      albumName: "",
      albumDescription: "",
      albumCover: null,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsloading(true);

      const albumCover = files[0];

      if (!albumCover) {
        toast.error("앨범 커버가 필요합니다.");
        return;
      }

      const formData = new FormData();
      formData.append("albumArt", albumCover);
      formData.append("title", values.albumName);
      formData.append("description", values.albumDescription || "");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/album`,
        formData
      );

      if (response.status !== 201) {
        throw new Error("앨범 생성에 실패했습니다.");
      }

      toast.success("앨범이 생성되었습니다!");
      reset(); 
      albumModal.onClose();
    } catch (error) {
      toast.error(`문제가 발생하였습니다: ${error}`);
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div>
      {stage === 1 && (
        <CustomModal
          title={
            <ModalTitle
              icon={<IconDisc className="size-10 p-1" />}
              title="앨범 업로드"
            />
          }
          description="앨범 커버를 업로드하세요"
          isOpen={albumModal.isOpen}
          onChange={onChange}
          className="flex flex-col p-4 items-center justify-center"
        >
          <div className="w-full max-w-4xl mx-auto min-h-96 mt-8 border border-dashed bg-white dark:bg-neutral-800 border-[#FF3F8F] rounded-lg">
            <FileUpload onChange={handleFileUpload} />
          </div>
          <div className="flex items-center justify-center pt-16">
            {files.length > 0 && (
              <button className="p-[3px] relative" onClick={() => setStage(2)}>
                <div className="px-8 py-2  bg-neutral-400 dark:bg-neutral-600 rounded-xl relative group transition duration-200 text-white hover:bg-neutral-500 dark:hover:bg-neutral-700 text-sm">
                  확인
                </div>
              </button>
            )}
          </div>
        </CustomModal>
      )}
      {stage === 2 && previewImage && (
        <CustomModal
          title={
            <ModalTitle
              icon={<IconDisc className="size-10 p-1" />}
              title="앨범 업로드"
            />
          }
          description="앨범에 대한 정보를 입력해주세요"
          isOpen={albumModal.isOpen}
          onChange={onChange}
          className="md:max-w-[1000px] p-4 flex flex-col items-center justify-center"
        >
          <form
            className="flex flex-col h-full w-full items-center justify-center"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-x-8 w-full h-full mt-4">
              <div className="hidden md:flex flex-col items-center justify-center h-full w-full relative">
                <Image
                  src={previewImage}
                  alt="file"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-y-4 items-center justify-center h-full w-full rounded-md overflow-y-auto">
                <Input
                  id="albumName"
                  disabled={isLoading}
                  {...register("albumName", { required: true })}
                  placeholder="앨범 이름 (필수)"
                  className="w-full h-14"
                />
                <p
                  className={
                    errors.albumName ? "text-red-500 text-xs" : "hidden"
                  }
                >
                  {errors.albumName ? String(errors.albumName.message) : null}
                </p>
                <Textarea
                  id="albumDescription"
                  disabled={isLoading}
                  {...register("albumDescription", { required: false })}
                  placeholder="앨범 정보 (선택)"
                  className="w-full h-full resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-around w-full pt-10">
              <button className="p-[3px] relative" onClick={() => setStage(1)}>
                <div className="px-8 py-2 bg-white rounded-xl relative group text-black hover:bg-neutral-100 text-sm dark:bg-black/95 dark:text-white dark:hover:bg-neutral-800">
                  이전
                </div>
              </button>
              <button className="p-[3px] relative" type="submit">
                <div className="px-8 py-2  bg-[#FF3F8F] rounded-xl relative group transition duration-200 text-white hover:bg-opacity-75 text-sm">
                  확인
                </div>
              </button>
            </div>
          </form>
        </CustomModal>
      )}
    </div>
  );
};

export default AlbumModal;