import { create } from "zustand";

interface NotiModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useNotiModal = create<NotiModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useNotiModal;