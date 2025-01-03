"use client";

import { z } from "zod";
import axios, { AxiosResponse } from "axios";
import { toast } from "sonner";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { IconUserCircle } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import useProfileEditModal from "@/hooks/modal/use-profileEdit-modal";

import { Input } from "../ui/input";
import ModalTitle from "./modal-title";
import { Textarea } from "../ui/textarea";
import { CustomModal } from "./custom-modal";
import { api } from "@/lib/axios";
import { useProfile } from "@/provider/profileProvider";
import { useRouter } from "next/navigation";

const ProfileEditModal = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsloading] = useState(false);
  const profileEditModal = useProfileEditModal();
  const router = useRouter();

  const { uuid } = useProfile();

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      profileEditModal.onClose();
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
    name: z
      .string()
      .min(1, "이름은 필수 항목입니다")
      .max(20, "20자 이하로 입력하세요")
      .nullable()
      .transform((val) => val ?? ""),
    description: z
      .string()
      .max(100, "소개는 100자 이내로 작성하세요")
      .nullable()
      .transform((val) => val ?? ""),
    link1: z
      .string()
      .regex(
        /^(https?:\/\/.*)?$/,
        "http:// 또는 https:// 형식의 URL을 입력하세요"
      )
      .nullable()
      .transform((val) => val ?? ""),
    link2: z
      .string()
      .regex(
        /^(https?:\/\/.*)?$/,
        "http:// 또는 https:// 형식의 URL을 입력하세요"
      )
      .nullable()
      .transform((val) => val ?? ""),
    profileImage: z.string().nullable().optional(),
    isMain: z.boolean().default(true),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      link1: "",
      link2: "",
      profileImage: null,
      isMain: true,
    },
  });

  const link1Value = watch("link1");
  const link2Value = watch("link2");

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    if (!uuid) {
      toast.error("프로필 정보를 찾을 수 없습니다.");
      return;
    }

    setIsloading(true);

    try {
      await updateProfile(values);
      handleSuccess();
    } catch (error) {
      handleError(error);
    } finally {
      setIsloading(false);
    }
  };

  const updateProfile = async (values: FieldValues) => {
    const uploadedImageUrl = file ? await uploadToS3(file) : "";

    await updateProfileInfo(values);

    if (uploadedImageUrl) {
      await updateProfileImage(uploadedImageUrl);
    }
  };

  const updateProfileInfo = async (values: FieldValues) => {
    const response = await api.patch(
      `/profile/${uuid}`,
      {
        ...values,
        profileImage: "",
      },
      { withCredentials: true }
    );

    if (!isSuccessResponse(response)) {
      throw new Error(
        `프로필 수정에 실패했습니다. 상태 코드: ${response.status}`
      );
    }

    return response;
  };

  const updateProfileImage = async (uploadedImageUrl: string) => {
    const response = await api.patch(`/profile/${uuid}/image`, null, {
      params: { profileImageLink: uploadedImageUrl },
      withCredentials: true,
    });

    if (!isSuccessResponse(response)) {
      throw new Error(
        `이미지 수정에 실패했습니다. 상태 코드: ${response.status}`
      );
    }

    return response;
  };

  const handleSuccess = () => {
    toast.success("프로필이 수정되었습니다.");
    reset();
    profileEditModal.onClose();
    router.refresh();
  };

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      console.error("서버 응답:", error.response);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          "프로필 수정 중 오류가 발생했습니다."
      );
    } else {
      console.error("에러 상세:", error);
      toast.error("프로필 수정 과정에서 오류가 발생했습니다.");
    }
  };

  const isSuccessResponse = (response: AxiosResponse) => {
    return response.status >= 200 && response.status < 300;
  };

  return (
    <CustomModal
      title={
        <ModalTitle
          icon={<IconUserCircle className="size-10 p-1" />}
          title="프로필 편집"
        />
      }
      description="당신을 소개해주세요"
      isOpen={profileEditModal.isOpen}
      onChange={onChange}
      className="p-4 flex flex-col items-center justify-center"
    >
      <form
        className="flex flex-col h-full w-full items-center justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-y-4 items-center justify-center h-full w-full rounded-md overflow-y-auto">
          <Input
            id="profileImage"
            type="file"
            {...register("profileImage", { required: false })}
            disabled={isLoading}
            className="hidden"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="profileImage"
            className="p-[1px] w-full flex bg-gradient-to-br from-[#FF00B1] to-[#875BFF] h-auto cursor-pointer rounded-lg"
          >
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-lg transition duration-200 text-black dark:text-white hover:bg-opacity-75 text-sm items-center flex justify-between p-4">
              <span className="text-gray-400 truncate max-w-[70%]">
                {file ? file.name : "📷 프로필 사진"}
              </span>
              <span className="bg-black text-white dark:bg-white dark:text-black px-4 py-1 rounded-lg text-sm">
                사진 변경
              </span>
            </div>
          </label>
          <Input
            id="name"
            disabled={isLoading}
            {...register("name", { required: true })}
            placeholder="🚨 이름"
            className="w-full h-14"
          />
          <p className={errors.name ? "text-red-500 text-xs" : "hidden"}>
            {errors.name ? String(errors.name.message) : null}
          </p>
          <Textarea
            id="description"
            disabled={isLoading}
            {...register("description", { required: false })}
            placeholder="👋 소개"
            className="w-full h-full resize-none"
          />
          <p className={errors.description ? "text-red-500 text-xs" : "hidden"}>
            {errors.description ? String(errors.description.message) : null}
          </p>
          <Input
            id="link1"
            disabled={isLoading}
            {...register("link1", { required: false })}
            placeholder="🔗 메인 링크"
            className="w-full h-14"
          />
          {link1Value && errors.link1 && (
            <p className="text-red-500 text-xs">
              {String(errors.link1.message)}
            </p>
          )}
          <Input
            id="link2"
            disabled={isLoading}
            {...register("link2", { required: false })}
            placeholder="🔗 서브 링크"
            className="w-full h-14"
          />
          {link2Value && errors.link2 && (
            <p className="text-red-500 text-xs">
              {String(errors.link2.message)}
            </p>
          )}
        </div>
        <div className="flex items-center justify-around w-full pt-10">
          <button
            className="p-[3px] relative"
            onClick={() => profileEditModal.onClose()}
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

export default ProfileEditModal;
