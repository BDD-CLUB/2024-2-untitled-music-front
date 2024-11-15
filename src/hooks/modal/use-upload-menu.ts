import { create } from "zustand";

interface UploadMenuStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useUploadMenu = create<UploadMenuStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useUploadMenu;