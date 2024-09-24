import { create } from "zustand";

interface AlbumModalStore {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

const useAlbumModal = create<AlbumModalStore>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

export default useAlbumModal;