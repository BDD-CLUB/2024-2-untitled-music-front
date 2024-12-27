"use client";

import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { Input } from "../ui/input";
import ModalTitle from "./modal-title";
import { Textarea } from "../ui/textarea";
import { CustomModal } from "./custom-modal";
import useTrackModal from "../../hooks/modal/use-track-modal";

import { IconMusic } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import axios from "axios";
import { Album, getAlbumByProfileUUID } from "@/services/albumService";
import { useProfile } from "@/provider/profileProvider";

const TrackModal = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | undefined>(
    undefined
  );
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [isLoading, setIsloading] = useState(false);

  const { uuid } = useProfile();
  const router = useRouter();
  const trackModal = useTrackModal();

  useEffect(() => {
    const getAlbums = async () => {
      try {
        const data = await getAlbumByProfileUUID(uuid || "");
        setAlbums(data);
      } catch (error) {
        console.error("프로필 앨범 로딩 실패:", error);
      }
    };

    getAlbums();
  }, [uuid]);

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      setSelectedAlbum(undefined);
      trackModal.onClose();
    }
  };

  const FormSchema = z.object({
    title: z
      .string()
      .min(1, { message: "트랙 이름은 필수입니다." })
      .max(20, { message: "트랙 이름은 20자 이하로 입력해야 합니다." }),
    lyric: z.string().optional(),
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
      lyric: "",
      duration: 3600,
      trackFile: null,
    },
  });

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("audio/")) {
      toast.error("오디오 파일만 업로드 가능합니다.");
      return;
    }

    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      toast.error("파일 크기는 10MB 이하만 가능합니다.");
      return;
    }

    const audio = new Audio(URL.createObjectURL(file));
    audio.onloadedmetadata = () => {
      setDuration(Math.ceil(audio.duration));
    };
    audio.onerror = () => {
      toast.error("오디오 파일을 읽는 데 실패했습니다.");
    };

    setFile(file);
  };

  const uploadToS3 = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`/upload/musics`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("오디오 업로드에 실패했습니다.");
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsloading(true);

      if (!selectedAlbum) {
        toast.error("앨범을 먼저 선택해주세요.");
        return;
      }

      const trackFile = file;
      if (!trackFile) {
        toast.error("트랙 파일이 필요합니다.");
        return;
      }

      const trackUrl = await uploadToS3(trackFile);

      const requestData = {
        title: values.title,
        lyric: values.lyric,
        duration: duration,
        trackFile: trackUrl,
      };

      const response = await api.post(
        `/album/${selectedAlbum?.uuid}/track`,
        requestData,
        {
          withCredentials: true,
        }
      );

      if (response.status !== 201) {
        throw new Error("트랙 추가에 실패했습니다.");
      }

      toast.success("트랙이 추가되었습니다!");
      reset();
      router.refresh();
      trackModal.onClose();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const errorData = error.response.data;
        toast.error(errorData.detail || "앨범 생성에 실패했습니다.");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsloading(false);
    }
  };

  return (
    <>
      {!selectedAlbum ? (
        <CustomModal
          title={
            <ModalTitle
              icon={<IconMusic className="size-10 p-1" />}
              title="트랙 업로드"
            />
          }
          description="트랙을 업로드 할 앨범을 선택해주세요"
          isOpen={trackModal.isOpen}
          onChange={onChange}
          className="flex flex-col p-4 items-center justify-center"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-4 gap-y-4 w-full">
            {albums.map((album) => (
              <div
                key={album.uuid}
                className="flex flex-col items-center justify-center h-full w-full aspect-square"
                onClick={() => {
                  setSelectedAlbum(album);
                }}
              >
                <div className="flex flex-col items-center justify-center h-full w-full relative drop-shadow-md">
                  <Image
                    src={album.artImage}
                    alt="file"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                </div>
                <span className="text-sm font-medium w-full tracking-wide text-center pt-2">
                  {album.title}
                </span>
              </div>
            ))}
          </div>
        </CustomModal>
      ) : (
        <CustomModal
          title={
            <ModalTitle
              icon={<IconMusic className="size-10 p-1" />}
              title="트랙 업로드"
            />
          }
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
                  src={selectedAlbum.artImage}
                  alt="file"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-xl"
                />
              </div>
              <div className="flex flex-col gap-y-4 items-center justify-center h-full w-full rounded-md overflow-y-auto">
                <Input
                  id="title"
                  disabled={isLoading}
                  {...register("title", { required: true })}
                  placeholder="트랙 이름 (필수)"
                  className="w-full h-14"
                />
                <p className={errors.title ? "text-red-500 text-xs" : "hidden"}>
                  {errors.title ? String(errors.title.message) : null}
                </p>
                <Textarea
                  id="lyric"
                  disabled={isLoading}
                  {...register("lyric", { required: false })}
                  placeholder="가사 및 추가 정보"
                  className="w-full h-full resize-none"
                />
                <Input
                  id="trackFile"
                  type="file"
                  accept="audio/*"
                  disabled={isLoading}
                  className="w-full h-14 border-transparent"
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files && target.files[0]) {
                      handleFileUpload(target.files[0]);
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-around w-full pt-10">
              <button
                className="p-[3px] relative"
                onClick={() => setSelectedAlbum(undefined)}
                disabled={isLoading}
              >
                <div className="px-8 py-2 bg-white rounded-xl relative group text-black hover:bg-neutral-100 text-sm dark:bg-black/95 dark:text-white dark:hover:bg-neutral-800 disabled:bg-opacity-50">
                  이전
                </div>
              </button>
              <button
                className="p-[3px] relative"
                type="submit"
                disabled={isLoading}
              >
                <div className="px-8 py-2  bg-[#FF3F8F] rounded-xl relative group transition duration-200 text-white hover:bg-opacity-75 text-sm disabled:bg-opacity-50">
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
