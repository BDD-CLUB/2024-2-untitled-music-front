import { create } from "zustand";

interface ConfirmModalState {
  isOpen: boolean;
  uuid: string | null;
  onOpen: (uuid: string) => void;
  onClose: () => void;
}

const useConfirmModal = create<ConfirmModalState>((set) => ({
  isOpen: false,
  uuid: null,
  onOpen: (uuid: string) => set({ isOpen: true, uuid }),
  onClose: () => set({ isOpen: false, uuid: null }),
}));

export default useConfirmModal;