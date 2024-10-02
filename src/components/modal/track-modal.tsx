"use client";

import { z } from "zod";
import Image from "next/image";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { CustomModal } from "./custom-modal";

import { zodResolver } from "@hookform/resolvers/zod";
import useTrackModal from "../../hooks/modal/use-track-modal";
import { toast } from "sonner";

const TrackModal = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<string>();
  const [selectedAlbumName, setSelectedAlbumName] = useState<string>();

  const [isLoading, setIsloading] = useState(false);

  const trackModal = useTrackModal();

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      setSelectedAlbum("");
      trackModal.onClose();
    }
  };

  const FormSchema = z.object({
    trackName: z
      .string()
      .min(1, { message: "트랙 이름은 필수입니다." })
      .max(20, { message: "트랙 이름은 20자 이하로 입력해야 합니다." }),
    trackDescription: z.string().optional(),
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
      trackName: "",
      trackDescription: "",
      trackFile: null,
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

      trackModal.onClose();
      toast.success("트랙이 추가되었습니다!");
    }
  };

  const example = [
    {
      src: "/images/music1.png",
      name: "최정원 1집",
      key: 1,
    },
    {
      src: "/images/music2.jpg",
      name: "최정원 2집",
      key: 2,
    },
    {
      src: "/images/music3.jpg",
      name: "최정원 3집",
      key: 3,
    },
    {
      src: "/images/music4.jpg",
      name: "최정원 4집",
      key: 4,
    },
  ];

  return (
    <>
      {!selectedAlbum ? (
        <CustomModal
          title="트랙 업로드"
          description="트랙을 업로드 할 앨범을 선택해주세요"
          isOpen={trackModal.isOpen}
          onChange={onChange}
          className="flex flex-col p-4 items-center justify-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 w-full h-full">
            {example.map((item) => (
              <div
                key={item.key}
                className="flex flex-col items-center justify-center h-full w-full aspect-square"
                onClick={() => {
                  setSelectedAlbum(item.src);
                  setSelectedAlbumName(item.name);
                }}
              >
                <div className="flex flex-col items-center justify-center h-full w-full relative drop-shadow-md">
                  <Image
                    src={item.src}
                    alt="file"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                </div>
                <span className="text-sm w-full tracking-wide text-center py-2">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </CustomModal>
      ) : (
        <CustomModal
          title="트랙 업로드"
          description="트랙에 대한 정보를 입력해주세요"
          isOpen={trackModal.isOpen}
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
                  src={selectedAlbum}
                  alt="file"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-y-4 items-center justify-center h-full w-full rounded-md overflow-y-auto">
                <span className="text-base w-full text-center tracking font-bold">
                  {selectedAlbumName}
                </span>
                <Input
                  id="trackName"
                  disabled={isLoading}
                  {...register("trackName", { required: true })}
                  placeholder="트랙 이름 (필수)"
                  className="w-full h-14"
                />
                <p
                  className={
                    errors.trackName ? "text-red-500 text-xs" : "hidden"
                  }
                >
                  {errors.trackName ? String(errors.trackName.message) : null}
                </p>
                <Textarea
                  id="trackDescription"
                  disabled={isLoading}
                  {...register("trackDescription", { required: false })}
                  placeholder="트랙 정보 (선택)"
                  className="w-full h-full resize-none"
                />
                <Input
                  id="trackFile"
                  type="file"
                  disabled={isLoading}
                  {...register("trackFile", { required: true })}
                  className="w-full h-14 border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center justify-around w-full pt-8">
              <button
                className="p-[3px] relative"
                onClick={() => setSelectedAlbum("")}
              >
                <div className="px-8 py-2  bg-white rounded-xl relative group  text-black hover:bg-gray-100 text-sm border-gray-300 border-2">
                  이전
                </div>
              </button>
              <button className="p-[3px] relative" type="submit">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-xl" />
                <div className="px-8 py-2  bg-white rounded-xl relative group transition duration-200 text-black hover:bg-transparent hover:text-white text-sm">
                  확인
                </div>
              </button>
            </div>
          </form>
        </CustomModal>
      )}
    </>
  );
};

export default TrackModal;
