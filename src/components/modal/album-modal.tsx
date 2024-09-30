"use client";

import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Modal from "./modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import useAlbumModal from "@/hooks/modal/use-album-modal";

const AlbumModal = () => {
  const [file, setFile] = useState<string>();
  const [fileEnter, setFileEnter] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const albumModal = useAlbumModal();

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      setFile("");
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
      // 이후 수정
      albumName: "",
      albumDescription: "",
      albumCover: null,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async () => {
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
    <>
      {!file ? (
        <Modal
          title="앨범 업로드"
          isOpen={albumModal.isOpen}
          onChange={onChange}
        >
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setFileEnter(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setFileEnter(false);
            }}
            onDragEnd={(e) => {
              e.preventDefault();
              setFileEnter(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setFileEnter(false);
              if (e.dataTransfer.items) {
                const item = e.dataTransfer.items[0];
                if (item && item.kind === "file") {
                  const file = item.getAsFile();
                  if (file && file.type.startsWith("image/")) {
                    const blobUrl = URL.createObjectURL(file);
                    setFile(blobUrl);
                  } else {
                    alert("이미지 파일만 업로드할 수 있습니다.");
                  }
                }
              } else if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith("image/")) {
                  const blobUrl = URL.createObjectURL(file);
                  setFile(blobUrl);
                } else {
                  alert("이미지 파일만 업로드할 수 있습니다.");
                }
              }
            }}
            className={cn(
              "flex flex-col w-full h-[600px] items-center justify-center gap-y-4",
              fileEnter && "border border-dashed border-white bg-neutral-700"
            )}
          >
            <Image
              src="/images/image.svg"
              alt="image"
              width={100}
              height={100}
            />
            <label htmlFor="file" className="font-bold">
              앨범 커버 사진을 여기에 끌어다 놓으세요
            </label>
            <Button
              variant="file"
              className="rounded-xl font-bold"
              onClick={() => document.getElementById("file")?.click()}
            >
              파일 선택
            </Button>
            <input
              id="file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                console.log(e.target.files);
                const file = e.target.files;
                if (file) {
                  const blobUrl = URL.createObjectURL(file[0]);
                  setFile(blobUrl);
                }
              }}
            />
          </div>
        </Modal>
      ) : (
        <Modal
          title="앨범 업로드"
          isOpen={albumModal.isOpen}
          onChange={onChange}
          className="md:max-w-[1000px]"
        >
          <div className="flex flex-col md:grid md:grid-cols-[3fr_2fr] justify-center items-center h-[600px] gap-y-6">
            <div className="flex flex-col items-center justify-center h-full w-full relative">
              <Image
                src={file}
                alt="file"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            <div className="flex flex-col items-center justify-center h-full w-full rounded-md md:bg-neutral-900">
              <h2 className="py-6 font-bold text-base">앨범 정보</h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="h-full w-full px-12 md:px-6 flex flex-col gap-y-4"
              >
                <Input
                  id="albumName"
                  disabled={isLoading}
                  {...register("albumName", { required: true })}
                  placeholder="앨범 이름 (필수)"
                  className="w-full h-14 border-neutral-300"
                />
                <p className={errors.albumName ? "text-red-500 text-xs" : "hidden"}>
                {errors.albumName ? String(errors.albumName.message) : null}
                </p>
                <Textarea
                  id="albumDescription"
                  disabled={isLoading}
                  {...register("albumDescription", { required: false })}
                  placeholder="앨범 정보 (선택)"
                  className="w-full h-full border-neutral-300 resize-none"
                />
                <Button
                  variant="secondary"
                  type="submit"
                  className="mt-5 mb-8 font-bold rounded-full"
                >
                  업로드
                </Button>
              </form>
            </div>
          </div>
          <button
            className="text-white absolute top-[1px] left-[10px] inline-flex h-[55px] w-[55px] appearance-none items-center justify-center rounded-full focus:outline-none"
            onClick={() => setFile("")}
          >
            <FaArrowLeft />
          </button>
        </Modal>
      )}
    </>
  );
};

export default AlbumModal;
