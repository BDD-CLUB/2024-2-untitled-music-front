import { create } from "zustand";

interface ConfirmModalState {
  isOpen: boolean;
  uuid: string | null;
  data: string | null;
  onOpen: (uuid: string, data: string) => void;
  onClose: () => void;
}

const useConfirmModal = create<ConfirmModalState>((set) => ({
  isOpen: false,
  uuid: null,
  data: null,
  onOpen: (uuid, data) => set({ isOpen: true, uuid, data }),
  onClose: () => set({ isOpen: false, uuid: null, data: null }),
}));

export default useConfirmModal;
