"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Modal from "./modal";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import useTrackModal from "@/hooks/modal/use-track-modal";

const TrackModal = () => {
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const [isLoading, setIsloading] = useState(false);

  const trackModal = useTrackModal();

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      setSelectedAlbum(null);
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
      toast.error("문제가 발생하였습니다");
    } finally {
      setIsloading(false);
    }
  };

  return (
    <>
      {!selectedAlbum ? (
        <Modal
          title="트랙 업로드"
          isOpen={trackModal.isOpen}
          onChange={onChange}
        >
          <p className="text-neutral-300 text-sm text-center py-4">
            트랙을 업로드 할 앨범을 선택해 주세요.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 w-full h-[600px]">
            {[1, 2, 3, 4].map((num: number) => (
              <div
                key={num}
                className="h-full w-full flex flex-col items-center justify-center"
                onClick={() => setSelectedAlbum(num)}
              >
                <div className="bg-lime-300 h-full w-full text-2xl text-black items-center justify-center flex hover:opacity-70">
                  {num}
                </div>
                <span className="text-sm w-full text-center py-2">
                  name {num}
                </span>
              </div>
            ))}
          </div>
        </Modal>
      ) : (
        <Modal
          title="트랙 업로드"
          isOpen={trackModal.isOpen}
          onChange={onChange}
          className="md:max-w-[1000px]"
        >
          <div className="flex flex-col md:grid md:grid-cols-2 justify-center items-center h-[600px] gap-y-6">
            <div className="flex flex-col items-center justify-center h-full w-full relative gap-y-4">
              <div className="bg-lime-300 h-full w-full text-2xl text-black items-center justify-center flex hover:opacity-70">
                {selectedAlbum}
              </div>
              <span className="text-lg w-full text-center pt-2 pb-8 font-bold">
                name {selectedAlbum}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center h-full w-full rounded-md md:bg-neutral-900">
              <h2 className="py-6 font-bold text-base">트랙 정보</h2>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="h-full w-full px-12 md:px-6 flex flex-col gap-y-4"
              >
                <Input
                  id="trackName"
                  disabled={isLoading}
                  {...register("trackName", { required: true })}
                  placeholder="트랙 이름 (필수)"
                  className="w-full h-14 border-neutral-300"
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
                  className="w-full h-full border-neutral-300 resize-none"
                />
                <Input
                  id="trackFile"
                  type="file"
                  disabled={isLoading}
                  {...register("trackFile", { required: true })}
                  className="w-full h-14 border-none "
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
            onClick={() => setSelectedAlbum(null)}
          >
            <FaArrowLeft />
          </button>
        </Modal>
      )}
    </>
  );
};

export default TrackModal;
