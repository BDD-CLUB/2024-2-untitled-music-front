"use client";

import useConfirmModal from "@/hooks/modal/use-confirm-modal";
import { useRouter } from "next/navigation";
import { CustomModal } from "./custom-modal";
import ModalTitle from "./modal-title";
import { IconAlertSquareRounded } from "@tabler/icons-react";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { deleteProfile } from "@/services/profileService";
import { toast } from "sonner";
import axios from "axios";

const ConfirmModal = () => {
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const router = useRouter();
  const confirmModal = useConfirmModal();

  const onChange = (open: boolean) => {
    if (!open) {
      confirmModal.onClose();
    }
  };

  const handleDelete = async () => {
    if (!confirmModal.uuid) {
      toast.error("프로필을 찾을 수 없습니다.");
      return;
    }

    try {
      setLoading(true);
      const uuid = confirmModal.uuid;
      const response = await deleteProfile(uuid);

      console.log(response);

      if (!response) {
        throw new Error("프로필 삭제에 실패했습니다.");
      }

      toast.success("프로필이 삭제되었습니다.");
      confirmModal.onClose();
      router.refresh();
    } catch (error) {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      title={
        <ModalTitle
          icon={<IconAlertSquareRounded className="size-10 p-1" />}
          title="경고"
        />
      }
      description="이 작업은 되돌릴 수 없습니다. 계속하시겠습니까?"
      isOpen={confirmModal.isOpen}
      onChange={onChange}
      className="p-4 flex flex-col items-center justify-center h-[50%]"
    >
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex w-full items-center justify-center space-x-3">
          <Checkbox
            id="check"
            checked={checked}
            onCheckedChange={() => setChecked(!checked)}
            disabled={loading}
          />
          <label
            htmlFor="check"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            주의사항을 확인하였으며, 삭제에 동의합니다.
          </label>
        </div>

        <div className="flex items-center justify-around w-full pt-20">
          <button
            className="p-[3px] relative"
            onClick={confirmModal.onClose}
            disabled={loading}
          >
            <div className="px-8 py-2 bg-white rounded-xl relative group text-black hover:bg-neutral-100 text-sm dark:bg-black/95 dark:text-white dark:hover:bg-neutral-800">
              이전
            </div>
          </button>
          <button
            className="p-[3px] relative"
            onClick={handleDelete}
            disabled={!checked || loading}
          >
            <div className="px-8 py-2  bg-[#FF3F8F] rounded-xl relative group transition duration-200 text-white hover:bg-opacity-75 text-sm disabled:cursor-not-allowed disabled:opacity-50">
              삭제
            </div>
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ConfirmModal;
