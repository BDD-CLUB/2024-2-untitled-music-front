"use client";

import useInformationModal from "@/hooks/modal/use-information-modal";
import { CustomModal } from "../custom-modal";
import ModalTitle from "../modal-title";
import { IconDisc } from "@tabler/icons-react";

const InformationModal = () => {
  const informationModal = useInformationModal();

  const onChange = (open: boolean) => {
    if (!open) {
      informationModal.onClose();
    }
  };

  const data = informationModal.data;

  return (
    <CustomModal
      title={
        <ModalTitle
          icon={<IconDisc className="size-10 p-1" />}
          title="소개"
        />
      }
      description=""
      isOpen={informationModal.isOpen}
      onChange={onChange}
      className="p-4 flex flex-col items-center justify-center h-[50%]"
    >
      <div className="px-4">
        {data ? (
          <div className="flex flex-col items-center gap-y-4">
            <p className="test-sm truncate overflow-y-auto">
              {data.description}
            </p>
          </div>
        ) : (
          <p className="text-sm">정보를 불러오는 중...</p>
        )}
      </div>
    </CustomModal>
  );
};

export default InformationModal;
