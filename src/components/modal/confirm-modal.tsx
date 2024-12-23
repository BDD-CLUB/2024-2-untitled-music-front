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

      if (!response?.data) {
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
            "프로필 삭제 중 오류가 발생했습니다."
        );
      } else {
        console.error("에러 상세:", error);
        toast.error("프로필 삭제 과정에서 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal
      title={
        <ModalTitle
          icon={<IconAlertSquareRounded className="size-10 text-red-500" />}
          title="프로필 삭제"
        />
      }
      description="이 작업은 되돌릴 수 없습니다. 삭제된 프로필은 복구할 수 없습니다."
      isOpen={confirmModal.isOpen}
      onChange={onChange}
      className="p-6 flex flex-col items-center justify-center max-w-md mx-auto"
    >
      <div className="flex flex-col items-center justify-center w-full space-y-6">
        <div className="flex w-full items-start space-x-3">
          <Checkbox
            id="check"
            checked={checked}
            onCheckedChange={() => setChecked(!checked)}
            disabled={loading}
            className="mt-1"
          />
          <label
            htmlFor="check"
            className="text-sm leading-relaxed cursor-pointer select-none"
          >
            주의사항을 확인하였으며, 프로필 삭제에 동의합니다. 이 작업은 취소할
            수 없습니다.
          </label>
        </div>

        <div className="flex items-center justify-end w-full space-x-4">
          <button
            className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-gray-800"
            onClick={confirmModal.onClose}
            disabled={loading}
          >
            취소
          </button>
          <button
            className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-white"
            onClick={handleDelete}
            disabled={!checked || loading}
          >
            {loading ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ConfirmModal;
